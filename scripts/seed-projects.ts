import { db, projects } from "../src/lib/cms/db";
import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import * as path from "path";
import projectsData from "../src/lib/projectsData.json";

// --- Cloudinary Config ---
function getCloudinaryConfig() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (cloudinaryUrl) {
    const match = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
    if (match) {
      return { cloud_name: match[3], api_key: match[1], api_secret: match[2] };
    }
  }
  return {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  };
}

cloudinary.config(getCloudinaryConfig());

// --- Helpers ---

// Cache to avoid re-uploading the same local path
const uploadCache = new Map<string, string>();

/**
 * Upload a single image from /public to Cloudinary.
 * Returns the Cloudinary URL with f_auto,q_auto transformations.
 */
async function uploadImage(
  localPath: string,
  slug: string
): Promise<string> {
  // Return cached URL if we already uploaded this file
  if (uploadCache.has(localPath)) {
    return uploadCache.get(localPath)!;
  }

  const absolutePath = path.join(process.cwd(), "public", localPath);

  if (!fs.existsSync(absolutePath)) {
    console.warn(`  ⚠ File not found: ${absolutePath}, keeping original path`);
    return localPath;
  }

  const ext = path.extname(localPath).replace(".", "");
  const basename = path.basename(localPath, path.extname(localPath));
  const folder = `kreatale-cms/projects/${slug}`;

  try {
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            public_id: basename,
            resource_type: "image",
            format: ext,
            overwrite: false,
            unique_filename: false,
          },
          (error, result) => {
            if (error) reject(error);
            else if (result)
              resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
              });
            else reject(new Error("Upload failed: no result"));
          }
        );

        const fileBuffer = fs.readFileSync(absolutePath);
        uploadStream.end(fileBuffer);
      }
    );

    // Insert f_auto,q_auto delivery transformation into the URL
    // Cloudinary URLs: https://res.cloudinary.com/<cloud>/image/upload/<path>
    // Becomes:         https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto/<path>
    const optimizedUrl = result.secure_url.replace(
      "/image/upload/",
      "/image/upload/f_auto,q_auto/"
    );

    uploadCache.set(localPath, optimizedUrl);
    console.log(`  ✓ Uploaded: ${localPath} → Cloudinary`);
    return optimizedUrl;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  ✗ Failed to upload ${localPath}: ${message}`);
    return localPath; // Fallback to original path
  }
}

// --- Main Seed Function ---
async function seed() {
  const entries = Object.entries(projectsData) as [
    string,
    {
      title: string;
      subtitle: string;
      country: string;
      client: string;
      duration: string;
      timeline: string;
      heroImage: string;
      portfolioImage?: string;
      projectType?: string;
      demoUrl?: string;
      techStacks: string[];
      images: string[];
      sections: Record<string, { title: string; content: string[] }>;
    }
  ][];

  console.log(`\nFound ${entries.length} projects to seed.\n`);

  for (const [slug, data] of entries) {
    console.log(`\n📦 Processing: ${data.title} (${slug})`);

    // Upload all images for this project
    console.log("  Uploading images...");

    const heroImage = await uploadImage(data.heroImage, slug);
    const portfolioImage = data.portfolioImage
      ? await uploadImage(data.portfolioImage, slug)
      : null;

    const images: string[] = [];
    for (const img of data.images) {
      const uploaded = await uploadImage(img, slug);
      images.push(uploaded);
    }

    // Insert into database
    console.log("  Inserting into database...");

    await db
      .insert(projects)
      .values({
        slug,
        title: data.title,
        subtitle: data.subtitle || null,
        country: data.country || null,
        client: data.client || null,
        duration: data.duration || null,
        timeline: data.timeline || null,
        heroImage,
        portfolioImage,
        projectType: data.projectType || null,
        demoUrl: data.demoUrl || null,
        techStacks: data.techStacks,
        images,
        sections: data.sections,
        locale: "en",
        status: "published",
        publishedAt: new Date(),
      })
      .onConflictDoNothing();

    console.log(`  ✓ Done: ${data.title}`);
  }

  console.log(`\n✅ Successfully seeded ${entries.length} projects!\n`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
