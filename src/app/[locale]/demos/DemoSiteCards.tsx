"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LayoutTemplate } from "lucide-react";
import { useTranslations } from "next-intl";

export type DemoCardItem = {
  slug: string;
  templateId: string;
  title: string;
  subtitle: string;
  imageSrc: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const hoverVariants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

interface DemoSiteCardsProps {
  items: DemoCardItem[];
  locale: string;
}

export default function DemoSiteCards({ items, locale }: DemoSiteCardsProps) {
  const t = useTranslations("demos");

  const path = (p: string) => `/${locale}${p}`;

  const templateLabel = (id: string) => {
    if (id === "tour") return t("template.tour");
    if (id === "car") return t("template.car");
    if (id === "zodiac") return t("template.zodiac");
    if (id === "bakery") return t("template.bakery");
    if (id === "bedding") return t("template.bedding");
    if (id === "fortes") return t("template.fortes");
    return id;
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20 max-w-2xl text-center">
        <p className="text-lg text-gray-600">{t("empty")}</p>
      </div>
    );
  }

  return (
    <motion.section
      className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {items.map((item) => (
          <motion.div
            key={item.slug}
            variants={cardVariants}
            className="group h-full"
          >
            <Link
              href={path(`/demos/${item.slug}`)}
              className="block h-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div
                variants={hoverVariants}
                initial="rest"
                whileHover="hover"
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-shadow duration-300 group-hover:shadow-xl h-full flex flex-col"
              >
                <div className="relative h-56 overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-50 to-gray-100">
                  <Image
                    src={item.imageSrc}
                    alt={item.title}
                    fill
                    unoptimized={/^https?:\/\//i.test(item.imageSrc)}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={70}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs bg-violet-50 text-violet-700 px-3 py-1 rounded-full font-medium">
                      <LayoutTemplate size={12} aria-hidden />
                      {templateLabel(item.templateId)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                    {item.subtitle}
                  </p>

                  <div className="flex items-center gap-1.5 text-sm font-medium text-blue-600">
                    <span>{t("openDemo")}</span>
                    <ExternalLink size={14} className="opacity-70" />
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
