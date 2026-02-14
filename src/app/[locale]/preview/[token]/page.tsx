import { redirect } from "next/navigation";
import {
  db,
  previewTokens,
  posts,
  projects,
  type Post,
  type Project,
} from "@/lib/cms/db";
import { eq, and, gt } from "drizzle-orm";
import Image from "next/image";
import type { DemoSite } from "@/app/[locale]/admin/demos/types";

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; token: string }>;
  searchParams: Promise<{ device?: string }>;
}) {
  const { locale, token } = await params;
  const { device } = await searchParams;

  // Device size configurations
  const deviceConfigs = {
    mobile: { maxWidth: "375px", name: "Mobile" },
    tablet: { maxWidth: "768px", name: "Tablet" },
    desktop: { maxWidth: "100%", name: "Desktop" },
  };

  const deviceConfig =
    device && device in deviceConfigs
      ? deviceConfigs[device as keyof typeof deviceConfigs]
      : deviceConfigs.desktop;

  // Validate preview token
  const [previewToken] = await db
    .select()
    .from(previewTokens)
    .where(
      and(
        eq(previewTokens.token, token),
        gt(previewTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!previewToken) {
    redirect(`/${locale}`);
  }

  // Fetch content based on type
  let content: Post | Project | null = null;
  if (previewToken.contentType === "post") {
    if (previewToken.contentId) {
      const [post] = await db
        .select()
        .from(posts)
        .where(eq(posts.id, previewToken.contentId))
        .limit(1);
      content = post;
    }
  } else if (previewToken.contentType === "project") {
    if (previewToken.contentId) {
      const [project] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, previewToken.contentId))
        .limit(1);
      content = project;
    }
  }

  if (!content && !previewToken.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Preview Not Available
          </h1>
          <p className="text-gray-600">Content not found or not yet saved.</p>
        </div>
      </div>
    );
  }

  // Render preview based on content type
  if (previewToken.contentType === "post") {
    const post = content as Post;
    return (
      <div className="min-h-screen bg-white">
        {device && device !== "desktop" && (
          <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200 px-4 py-2 text-sm text-gray-600 text-center">
            {deviceConfig.name} Preview ({deviceConfig.maxWidth})
          </div>
        )}
        <div
          className="mx-auto"
          style={{
            maxWidth: deviceConfig.maxWidth,
            margin: device && device !== "desktop" ? "0 auto" : undefined,
          }}
        >
          <article className="px-4 py-12">
            {post.featuredImage && (
              <div className="mb-8">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={1200}
                  height={600}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-8">{post.excerpt}</p>
            )}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </div>
      </div>
    );
  }

  // Demo Site preview
  if (previewToken.contentType === "demo-site") {
    // We prefer the 'data' from the token (unsaved changes)
    const data = previewToken.data as unknown as DemoSite;
    const config = data?.config || {};
    const templateId = data?.templateId || "tour";

    // If no data in token but contentId exists (saved demo)
    // We would need to handle this case if we fetched 'content' earlier for demo-site
    // But currently we don't fetch content for demo-site in the block above
    // So we rely on passed data.
    // TODO: If we want to support saved demo preview without data passed, we need to add demo-site to the fetch logic above.

    // Dynamic import based on template type
    let TemplateComponent;
    if (templateId === "car") {
      const { CarTemplate } = await import("@/components/demo/car/CarTemplate");
      TemplateComponent = CarTemplate;
    } else {
      const TourTemplate = (await import("@/components/demo/tour/TourTemplate"))
        .default;
      TemplateComponent = TourTemplate;
    }

    return (
      <div className="min-h-screen bg-white">
        {device && device !== "desktop" && (
          <div className="sticky top-0 z-50 bg-gray-100 border-b border-gray-200 px-4 py-2 text-sm text-gray-600 text-center">
            {deviceConfig.name} Preview ({deviceConfig.maxWidth})
          </div>
        )}
        <div
          className="mx-auto bg-white min-h-screen shadow-2xl overflow-hidden origin-top"
          style={{
            maxWidth: deviceConfig.maxWidth,
            margin: device && device !== "desktop" ? "0 auto" : undefined,
            // Scale for better mobile view if needed, but iframe handles it
          }}
        >
          <TemplateComponent config={config} />
        </div>
      </div>
    );
  }

  // Project preview
  const project = content as Project;
  return (
    <div className="min-h-screen bg-white">
      {device && device !== "desktop" && (
        <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200 px-4 py-2 text-sm text-gray-600 text-center">
          {deviceConfig.name} Preview ({deviceConfig.maxWidth})
        </div>
      )}
      <div
        className="mx-auto"
        style={{
          maxWidth: deviceConfig.maxWidth,
          margin: device && device !== "desktop" ? "0 auto" : undefined,
        }}
      >
        <article className="px-4 py-12">
          {project.heroImage && (
            <div className="mb-8">
              <Image
                src={project.heroImage}
                alt={project.title}
                width={1200}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {project.title}
          </h1>
          {project.subtitle && (
            <p className="text-2xl text-gray-600 mb-8">{project.subtitle}</p>
          )}
          {/* Add more project preview content here */}
        </article>
      </div>
    </div>
  );
}
