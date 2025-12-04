"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function TermsOfServicePage() {
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
            {t("terms.title")}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t("terms.lastUpdated")}
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
                {t("terms.sections.acceptance.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.acceptance.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("terms.sections.services.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.services.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("terms.sections.obligations.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t("terms.sections.obligations.content")}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>{t("terms.sections.obligations.items.accurate")}</li>
                <li>{t("terms.sections.obligations.items.authorized")}</li>
                <li>{t("terms.sections.obligations.items.comply")}</li>
                <li>{t("terms.sections.obligations.items.responsible")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("terms.sections.intellectual.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.intellectual.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("terms.sections.payment.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.payment.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("terms.sections.delivery.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.delivery.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("terms.sections.revisions.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.revisions.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("terms.sections.warranty.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.warranty.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("terms.sections.liability.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.liability.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("terms.sections.termination.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.termination.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("terms.sections.changes.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.changes.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("terms.sections.contact.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.contact.content")}
              </p>
            </section>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

