"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const serviceKeys = ["website", "webapp", "mobile", "training"];

export default function Service() {
  const t = useTranslations();
  const pathname = usePathname();

  // Extract current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  // Helper function to create locale-aware paths
  const createLocalizedPath = (path: string) => {
    return `/${currentLocale}${path}`;
  };

  return (
    <section
      id="services"
      className="bg-white text-white py-20 px-4 sm:px-6 md:px-16"
    >
      <div className="bg-black rounded-3xl px-6 md:px-16 py-16 w-full mx-auto flex flex-col items-center gap-16">
        <div className="text-center max-w-3xl mx-auto">
          <p className="font-bold text-gray-400 uppercase text-sm mb-2">
            {t("services.subtitle")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            {t("services.title")}
          </h2>
        </div>

        <div className="flex flex-col gap-16 w-full max-w-5xl mx-auto">
          {serviceKeys.map((serviceKey, idx) => {
            const images = [
              "/web-dev.png",
              "/web-app-dev.png",
              "/mobile-dev.png",
              "/training.png",
            ];
            return (
              <motion.div
                key={serviceKey}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.2,
                  ease: "easeOut",
                }}
                className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-16"
              >
                <div className="relative w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src={images[idx]}
                    alt={t(`services.${serviceKey}.title`)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="lg:w-1/2 flex flex-col gap-4 text-center lg:text-left">
                  <h3 className="text-2xl font-bold">
                    {t(`services.${serviceKey}.title`)}
                  </h3>
                  <p className="text-gray-400 max-w-xl mx-auto lg:mx-0">
                    {t(`services.${serviceKey}.description`)}
                  </p>
                  <Link href={createLocalizedPath("/services")}>
                    <button className="w-40 mx-auto lg:mx-0 bg-gray-800 text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-blue-600 transition-colors duration-200">
                      {t("common.learnMore")}
                    </button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
