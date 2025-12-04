"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function PrivacyPolicyContent({ locale }: { locale: string }) {
  const t = useTranslations();

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
            {t("privacy.title")}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t("privacy.lastUpdated")}
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-8 lg:px-16 py-16">
        <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8 text-gray-700"
          >
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("privacy.sections.introduction.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("privacy.sections.introduction.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("privacy.sections.information.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t("privacy.sections.information.content")}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>{t("privacy.sections.information.items.name")}</li>
                <li>{t("privacy.sections.information.items.email")}</li>
                <li>{t("privacy.sections.information.items.phone")}</li>
                <li>{t("privacy.sections.information.items.company")}</li>
                <li>{t("privacy.sections.information.items.message")}</li>
                <li>{t("privacy.sections.information.items.usage")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("privacy.sections.use.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t("privacy.sections.use.content")}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>{t("privacy.sections.use.items.process")}</li>
                <li>{t("privacy.sections.use.items.communicate")}</li>
                <li>{t("privacy.sections.use.items.improve")}</li>
                <li>{t("privacy.sections.use.items.comply")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("privacy.sections.cookies.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("privacy.sections.cookies.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("privacy.sections.security.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("privacy.sections.security.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("privacy.sections.sharing.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("privacy.sections.sharing.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("privacy.sections.rights.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t("privacy.sections.rights.content")}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>{t("privacy.sections.rights.items.access")}</li>
                <li>{t("privacy.sections.rights.items.correct")}</li>
                <li>{t("privacy.sections.rights.items.delete")}</li>
                <li>{t("privacy.sections.rights.items.object")}</li>
                <li>{t("privacy.sections.rights.items.portability")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("privacy.sections.changes.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("privacy.sections.changes.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("privacy.sections.contact.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("privacy.sections.contact.content")}
              </p>
            </section>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
