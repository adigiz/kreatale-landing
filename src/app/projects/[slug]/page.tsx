"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Loader2, Computer } from "lucide-react";

interface ProjectSection {
  title: string;
  content: string[];
}

interface ProjectData {
  title: string;
  subtitle: string;
  client: string;
  duration: string;
  timeline: string;
  heroImage: string;
  images: string[];
  techStacks: string[];
  sections: {
    [key: string]: ProjectSection;
  };
}

interface ProjectsDatabase {
  [key: string]: ProjectData;
}

const fetchProjectData = (slug: string): (ProjectData | null) => {
  const projectsData: ProjectsDatabase = {
    gemoedje: {
      title: "Gemoedje.nl",
      subtitle: "Crafting a distinctive brand presence for Kreatizie",
      client: "Kreatizie",
      duration: "18 May - 24 June 2025",
      timeline: "1.2 Months",
      heroImage: "/gemoedje-hero.png",
      techStacks: ["Next JS", "Strapi", "Postgres SQL", "MapBox"],
      images: [
        "/gemoedje-1.png",
        "/gemoedje-2.png",
        "/gemoedje-3.png",
        "/gemoedje-4.png",
        "/gemoedje-5.png",
        "/gemoedje-6.png",
      ],
      sections: {
        background: {
          title: "Background Project",
          content: [
            "Kreatizie is revolutionizing the digital landscape, providing innovative solutions tailored for small and medium enterprises. Our mission is to empower businesses across Indonesia, enabling them to thrive in a competitive market. With a focus on quality and customer satisfaction, we ensure that every project we undertake meets the highest standards of excellence.",
            "Our team of experts brings a wealth of experience in various fields, including web development, digital marketing, and e-commerce solutions. We understand the unique challenges faced by SMEs and are committed to delivering customized strategies that drive growth and enhance brand visibility. By leveraging cutting-edge technology, we help our clients stay ahead of the curve.",
            "At Kreatizie, we believe in fostering strong partnerships with our clients. We work closely with each business to understand their specific needs and goals, ensuring that our solutions align perfectly with their unique objectives. Our collaborative approach not only builds trust but also leads to successful outcomes that exceed expectations.",
          ],
        },
        problem: {
          title: "Problem and how to tackle it",
          content: [
            "Kreatizie is revolutionizing the digital landscape, providing innovative solutions tailored for small and medium enterprises. Our mission is to empower businesses across Indonesia, enabling them to thrive in a competitive market. With a focus on quality and customer satisfaction, we ensure that every project we undertake meets the highest standards of excellence.",
            "Our team of experts brings a wealth of experience in various fields, including web development, digital marketing, and e-commerce solutions. We understand the unique challenges faced by SMEs and are committed to delivering customized strategies that drive growth and enhance brand visibility. By leveraging cutting-edge technology, we help our clients stay ahead of the curve.",
            "At Kreatizie, we believe in fostering strong partnerships with our clients. We work closely with each business to understand their specific needs and goals, ensuring that our solutions align perfectly with their vision. Our collaborative approach not only builds trust but also leads to successful outcomes that exceed expectations.",
          ],
        },
        solution: {
          title: "Solution",
          content: [
            "Kreatizie is revolutionizing the digital landscape, providing innovative solutions tailored for small and medium enterprises. Our mission is to empower businesses across Indonesia, enabling them to thrive in a competitive market. With a focus on quality and customer satisfaction, we ensure that every project we undertake meets the highest standards of excellence.",
            "Our team of experts brings a wealth of experience in various fields, including web development, digital marketing, and e-commerce solutions. We understand the unique challenges faced by SMEs and are committed to delivering customized strategies that drive growth and enhance brand visibility. By leveraging cutting-edge technology, we help our clients stay ahead of the curve.",
            "At Kreatizie, we believe in fostering strong partnerships with our clients. We work closely with each business to understand their specific needs and goals, ensuring that our solutions align perfectly with their vision. Our collaborative approach not only builds trust but also leads to successful outcomes that exceed expectations.",
          ],
        },
        conclusion: {
          title: "Conclusion",
          content: [
            "Kreatizie is revolutionizing the digital landscape, providing innovative solutions tailored for small and medium enterprises. Our mission is to empower businesses across Indonesia, enabling them to thrive in a competitive market. With a focus on quality and customer satisfaction, we ensure that every project we undertake meets the highest standards of excellence.",
          ],
        },
      },
    },
  };

  return projectsData[slug] || null;
};

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        if (!params?.slug) {
          setError("Invalid project slug");
          return;
        }

        const projectData = await fetchProjectData(params.slug);

        if (!projectData) {
          setError("Project not found");
          return;
        }

        setProject(projectData);
      } catch (err) {
        setError("Failed to load project");
        console.error("Error loading project:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params?.slug) {
      loadProject();
    }
  }, [params?.slug]);

  const handleGoBack = (): void => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Project Not Found"}
          </h1>
          <p className="text-gray-600 mb-8">
            The project youre looking for doesnt exist or couldnt be loaded.
          </p>
          <button
            onClick={handleGoBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <motion.header
        className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            {...fadeInUp}
          >
            {project.title}
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 mb-8"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            {project.subtitle}
          </motion.p>

        </div>
      </motion.header>

      <motion.div
        className="container mb-20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="relative w-screen h-64 md:h-96 lg:h-[500px] rounded-xl">
          <Image
            src="/gemoedje-banner.png"
            alt={`${project.title} Hero`}
            fill
            className="object-cover"
            priority
            quality={100}
          />
        </div>
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl bg-slate-50">
        <motion.div
          className="flex justify-between gap-8 text-md text-gray-500 px-8 py-8"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="flex flex-col items-left gap-2"
            variants={fadeInUp}
          >
            <p>Client</p>
            <div className="flex gap-2 font-bold text-black items-center">
              <User size={16} />
              <span className="text-lg">{project.client}</span>
            </div>
          </motion.div>
          <motion.div
            className="flex flex-col items-left gap-2"
            variants={fadeInUp}
          >
            <p>Tech Stacks</p>
            <div className="flex gap-2 font-bold text-black items-center">
              <Computer size={16} />
              {project.techStacks.map((stack, id) => (
                <span
                  key={id}
                  className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                >
                  {stack}
                </span>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="flex flex-col items-left gap-2"
            variants={fadeInUp}
          >
            <p>Timeline</p>
            <div className="flex gap-2 font-bold text-black items-center">
              <Calendar size={16} />
              <span className="text-lg">{project.duration}</span>
            </div>
          </motion.div>
          <motion.div
            className="flex flex-col items-left gap-2"
            variants={fadeInUp}
          >
            <p>Duration</p>
            <div className="flex gap-2 font-bold text-black items-center">
              <Clock size={16} />
              <span className="text-lg">{project.timeline}</span>
            </div>
          </motion.div>
        </motion.div>
        <hr className="mb-8" />
        {Object.entries(project.sections).map(([key, section], index) => (
          <motion.section
            key={key}
            className="mb-16 px-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {section.title}
            </h2>
            <div className="prose prose-lg text-gray-600 space-y-4">
              {section.content.map((paragraph: string, pIndex: number) => (
                <p key={pIndex}>{paragraph}</p>
              ))}
            </div>
          </motion.section>
        ))}

        {project.images && project.images.length > 0 && (
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.images.map((image: string, index: number) => (
                <motion.div
                  key={index}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Image
                    src={image}
                    alt={`${project.title} Screenshot ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        <motion.section
          className="text-center pb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="border-t border-gray-200 pt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Ready to start your project?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Lets work together to create something amazing for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                type="button"
              >
                Start a Project
              </button>
              <button
                onClick={handleGoBack}
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                type="button"
              >
                View More Work
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
