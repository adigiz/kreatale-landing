"use client";

import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";
import { WHATSAPP_NUMBER, WHATSAPP_BASE_URL } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function Footer() {
  const t = useTranslations();
  const pathname = usePathname();

  // Extract current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  // Helper function to create locale-aware paths
  const createLocalizedPath = (path: string) => {
    return `/${currentLocale}${path}`;
  };

  const whatsappMessage = encodeURIComponent(
    "Hi! I'm interested in your services. Let's discuss my project!"
  );
  const whatsappUrl = `${WHATSAPP_BASE_URL}/${WHATSAPP_NUMBER.replace(
    "+",
    ""
  )}?text=${whatsappMessage}`;

  return (
    <section className="bg-black text-white rounded-t-[2rem] px-6 sm:px-12 lg:px-20 py-16 mt-24">
      <div className="text-center mb-16 flex flex-col">
        <p className="uppercase text-sm text-gray-400 mb-2">
          {t("footer.contactUs")}
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          {t("footer.readyToStart")}
        </h2>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex self-center items-center justify-center gap-2 bg-[#0061FF] text-white px-5 py-3 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors duration-200 w-fit shadow-lg"
        >
          <MessageCircle size={16} />
          {t("footer.whatsappUs")}
        </a>
      </div>

      <div className="border-t border-gray-800 pt-10 flex flex-col lg:flex-row justify-between items-center gap-8 text-sm">
        <div className="flex-shrink-0">
          <Link href={createLocalizedPath("/")}>
            <Image
              src="/kreatale-logo-secondary.svg"
              alt="Kreatale Logo"
              width={120}
              height={40}
              className="h-12 w-20"
              priority
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap gap-6 text-gray-400">
          <Link
            href={createLocalizedPath("/services")}
            className="hover:text-white transition-colors duration-200"
          >
            {t("footer.navigation.services")}
          </Link>
          <Link
            href={createLocalizedPath("/about")}
            className="hover:text-white transition-colors duration-200"
          >
            {t("footer.navigation.about")}
          </Link>
          <Link
            href={createLocalizedPath("/projects")}
            className="hover:text-white transition-colors duration-200"
          >
            {t("footer.navigation.projects")}
          </Link>
          <Link
            href={createLocalizedPath("/faq")}
            className="hover:text-white transition-colors duration-200"
          >
            {t("footer.navigation.faq")}
          </Link>
        </div>

        <div className="flex gap-4 text-gray-400">
          <Link
            href="https://www.instagram.com/kreatale"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Instagram profile"
          >
            <FaInstagram className="hover:text-white cursor-pointer" aria-hidden="true" />
          </Link>
          <Link
            href="https://www.tiktok.com/@kreatale"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our TikTok profile"
          >
            <FaTiktok className="hover:text-white cursor-pointer" aria-hidden="true" />
          </Link>
          <Link
            href="https://www.linkedin.com/company/kreatale"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our LinkedIn company page"
          >
            <FaLinkedin className="hover:text-white cursor-pointer" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
        <p>Copyright © 2025 Kreatale. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="hover:text-white cursor-pointer">
            Privacy Policy
          </span>
          <Link
            href={createLocalizedPath("/faq")}
            className="hover:text-white transition-colors duration-200"
          >
            FAQ
          </Link>
          <span className="hover:text-white cursor-pointer">
            Terms of service
          </span>
        </div>
      </div>
    </section>
  );
}
