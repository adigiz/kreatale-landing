"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Send, Loader2, ChevronDown } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Image from "next/image";

export default function ContactForm() {
  const t = useTranslations();
  const captchaRef = useRef<HCaptcha>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    inquiry: "",
    message: "",
  });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Reset status when user starts typing again
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
    }
  };

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          captchaToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        inquiry: "",
        message: "",
      });
      setCaptchaToken(null);
      captchaRef.current?.resetCaptcha();
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      setCaptchaToken(null);
      captchaRef.current?.resetCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="flex flex-col py-6 sm:py-8 lg:py-10 px-6 lg:px-16 bg-gray-50 min-h-screen overflow-hidden"
    >
      {/* Heading */}
      <motion.div
        className="lg:px-20 mb-4 sm:mb-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="font-bold text-gray-400 uppercase text-xs sm:text-sm mb-1">
          {t("contact.subtitle")}
        </p>
        <h2 className="text-black text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
          {t("contact.title")}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl">
          {t("contact.description")}
        </p>
      </motion.div>

      {/* Form and Image Container */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch lg:px-20">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="w-full lg:w-1/2 bg-white rounded-xl p-4 sm:p-6 lg:p-8 flex flex-col"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  {t("contact.form.name")}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0061FF] focus:border-transparent outline-none transition-all"
                  placeholder={t("contact.form.namePlaceholder")}
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  {t("contact.form.email")}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0061FF] focus:border-transparent outline-none transition-all"
                  placeholder={t("contact.form.emailPlaceholder")}
                />
              </div>
            </div>

            {/* Company and Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Company Field */}
              <div>
                <label
                  htmlFor="company"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  {t("contact.form.company")}
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0061FF] focus:border-transparent outline-none transition-all"
                  placeholder={t("contact.form.companyPlaceholder")}
                />
              </div>

              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  {t("contact.form.phone")}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0061FF] focus:border-transparent outline-none transition-all"
                  placeholder={t("contact.form.phonePlaceholder")}
                />
              </div>
            </div>

            {/* Inquiry Type Dropdown */}
            <div>
              <label
                htmlFor="inquiry"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                {t("contact.form.inquiry")}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  id="inquiry"
                  name="inquiry"
                  value={formData.inquiry}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0061FF] focus:border-transparent outline-none transition-all bg-white appearance-none"
                >
                  <option value="">
                    {t("contact.form.inquiryPlaceholder")}
                  </option>
                  <option value="website">
                    {t("contact.form.inquiryOptions.website")}
                  </option>
                  <option value="webapp">
                    {t("contact.form.inquiryOptions.webapp")}
                  </option>
                  <option value="mobile">
                    {t("contact.form.inquiryOptions.mobile")}
                  </option>
                  <option value="training">
                    {t("contact.form.inquiryOptions.training")}
                  </option>
                  <option value="other">
                    {t("contact.form.inquiryOptions.other")}
                  </option>
                </select>
                <ChevronDown
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                {t("contact.form.message")}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0061FF] focus:border-transparent outline-none transition-all resize-none"
                placeholder={t("contact.form.messagePlaceholder")}
              />
            </div>

            {/* hCaptcha */}
            <div className="scale-90 origin-left">
              <HCaptcha
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ""}
                onVerify={handleCaptchaVerify}
                onExpire={handleCaptchaExpire}
                ref={captchaRef}
              />
              {!captchaToken && submitStatus === "error" && (
                <p className="mt-1 text-xs text-red-600">
                  {t("contact.form.captchaRequired")}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#0061FF] text-white px-6 py-2.5 text-sm rounded-full font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t("contact.form.sending")}</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{t("contact.form.submit")}</span>
                </>
              )}
            </motion.button>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm"
              >
                <p>{t("contact.form.success")}</p>
              </motion.div>
            )}

            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm"
              >
                <p>{t("contact.form.error")}</p>
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="w-full lg:w-1/2 flex items-stretch"
        >
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <Image
              src="/contact.webp"
              alt="Contact us"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority={false}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

