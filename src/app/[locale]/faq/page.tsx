"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import {
  WHATSAPP_NUMBER,
  WHATSAPP_BASE_URL,
  WHATSAPP_MESSAGES,
} from "@/lib/constants";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const t = useTranslations();
  const pathname = usePathname();

  // Extract current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  // Helper function to create locale-aware paths
  const createLocalizedPath = (path: string) => {
    return `/${currentLocale}${path}`;
  };

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Get FAQ data from translations
  const faqData: FAQItem[] = t.raw("faq.questions") as FAQItem[];
  const categories = Object.values(
    t.raw("faq.categories") as Record<string, string>
  );

  const filteredFAQs =
    selectedCategory === "All"
      ? faqData
      : faqData.filter((faq) => faq.category === selectedCategory);

  // Add FAQPage structured data
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqData.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };

    // Remove existing script if any
    const existingScript = document.getElementById("faq-schema");
    if (existingScript) {
      existingScript.remove();
    }

    // Add new script
    const script = document.createElement("script");
    script.id = "faq-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById("faq-schema");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [faqData]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#0061FF] text-white py-16 px-4 sm:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            {t("faq.title")}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t("faq.description")}
          </p>
        </motion.div>
      </div>

      {/* Category Filter */}
      <div className="px-4 sm:px-8 lg:px-16 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="px-4 sm:px-8 lg:px-16 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl transition-colors duration-200"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-xl"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>

                {openItems.includes(index) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t("faq.cta")}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Can&apos;t find what you&apos;re looking for? Get in touch with
              our team and we&apos;ll be happy to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`${WHATSAPP_BASE_URL}/${WHATSAPP_NUMBER.replace(
                  "+",
                  ""
                )}?text=${encodeURIComponent(
                  WHATSAPP_MESSAGES.GENERAL_INQUIRY
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200">
                  {t("faq.contactUs")}
                </button>
              </a>
              <Link href={createLocalizedPath("/")}>
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-200">
                  {t("common.contactUs")}
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
