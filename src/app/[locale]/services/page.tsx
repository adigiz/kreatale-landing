"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Zap,
  Users,
  CheckCircle,
  ArrowRight,
  Code,
  Globe,
} from "lucide-react";
import {
  WHATSAPP_NUMBER,
  WHATSAPP_BASE_URL,
  WHATSAPP_MESSAGES,
} from "@/lib/constants";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function ServicesPage() {
  const t = useTranslations();
  const pathname = usePathname();

  // Extract current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  // Helper function to create locale-aware paths
  const createLocalizedPath = (path: string) => {
    return `/${currentLocale}${path}`;
  };

  const serviceKeys = useMemo(
    () => ["website", "webapp", "mobile", "training"],
    []
  );

  // Add Service schema
  useEffect(() => {
    const baseUrl = "https://kreatale.com";
    const services = serviceKeys.map((key) => ({
      "@type": "Service",
      serviceType: t(`services.${key}.title`),
      description: t(`services.${key}.description`),
      provider: {
        "@type": "Organization",
        name: "Kreatale",
      },
      areaServed: "Worldwide",
    }));

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Kreatale",
      url: baseUrl,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: t("services.title"),
        itemListElement: services.map((service, index) => ({
          "@type": "Offer",
          itemOffered: service,
          priceRange: "Contact for pricing",
          availability: "https://schema.org/InStock",
          position: index + 1,
        })),
      },
    };

    // Remove existing script if any
    const existingScript = document.getElementById("service-schema");
    if (existingScript) {
      existingScript.remove();
    }

    // Add new script
    const script = document.createElement("script");
    script.id = "service-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(serviceSchema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById("service-schema");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [serviceKeys, t]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-[#0061FF] text-white py-20 px-4 sm:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="font-bold text-blue-100 uppercase text-xs sm:text-sm mb-4">
            {t("services.subtitle")}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            {t("services.hero.title")}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t("services.hero.description")}
          </p>
        </motion.div>
      </section>

      {/* Services Overview */}
      <section className="py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">
              {t("services.overview.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("services.overview.description")}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {serviceKeys.map((serviceKey, index) => {
              const images = [
                "/web-dev.png",
                "/web-app-dev.png",
                "/mobile-dev.png",
                "/training.png",
              ];

              return (
                <motion.div
                  key={serviceKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300"
                >
                  <div className="p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-black">
                        {t(`services.${serviceKey}.title`)}
                      </h3>
                    </div>

                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                      <Image
                        src={images[index]}
                        alt={t(`services.${serviceKey}.title`)}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={70}
                        loading="lazy"
                        className="object-cover"
                      />
                    </div>

                    <p className="text-gray-600 mb-6">
                      {t(`services.${serviceKey}.description`)}
                    </p>

                    <div className="space-y-3 mb-6">
                      {(
                        t.raw(`services.${serviceKey}.features`) as string[]
                      ).map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <a
                      href={`${WHATSAPP_BASE_URL}/${WHATSAPP_NUMBER.replace(
                        "+",
                        ""
                      )}?text=${encodeURIComponent(
                        WHATSAPP_MESSAGES.SERVICES_INTEREST
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <button className="flex items-center gap-2 text-[#0061FF] font-semibold hover:gap-3 transition-all duration-200">
                        {t("common.learnMore")}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">
              {t("services.whyChoose.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("services.whyChoose.description")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                key: "expertTeam",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                key: "qualityAssurance",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                key: "fastDelivery",
              },
              {
                icon: <Code className="w-8 h-8" />,
                key: "modernTechnology",
              },
              {
                icon: <Globe className="w-8 h-8" />,
                key: "globalReach",
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                key: "ongoingSupport",
              },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl transition-colors duration-200"
              >
                <div className="text-[#0061FF] mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-black mb-3">
                  {t(`services.whyChoose.${benefit.key}.title`)}
                </h3>
                <p className="text-gray-600">
                  {t(`services.whyChoose.${benefit.key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t("services.cta.title")}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t("services.cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`${WHATSAPP_BASE_URL}/${WHATSAPP_NUMBER.replace(
                  "+",
                  ""
                )}?text=${encodeURIComponent(
                  WHATSAPP_MESSAGES.PROJECT_DISCUSSION
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#0061FF] text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors duration-200"
              >
                {t("services.cta.startProject")}
              </a>
              <Link href={createLocalizedPath("/about")}>
                <button className="border-2 border-[#0061FF] text-[#0061FF] px-8 py-3 rounded-full font-semibold hover:bg-[#0061FF] hover:text-white transition-colors duration-200">
                  {t("services.cta.learnAbout")}
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
