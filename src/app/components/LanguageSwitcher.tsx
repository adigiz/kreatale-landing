"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "id", name: "Indonesia", flag: "🇮🇩" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = pathname.split("/")[1] || "en";
  const currentLanguage =
    languages.find((lang) => lang.code === currentLocale) || languages[0];

  const handleLanguageChange = (locale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
        aria-label={`Change language. Current language: ${currentLanguage.name}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{currentLanguage.flag}</span>
        <span className="hidden md:inline">{currentLanguage.name}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-200 ${
                  currentLocale === language.code
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700"
                }`}
                aria-label={`Switch to ${language.name}`}
              >
                <span>{language.flag}</span>
                <span>{language.name}</span>
                {currentLocale === language.code && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
