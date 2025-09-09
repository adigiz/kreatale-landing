"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  const pathname = usePathname();

  // Simple translations object (default to English for root 404)
  const t = {
    "404.title": "Page Not Found",
    "404.description":
      "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or doesn't exist.",
    "404.goHome": "Go Home",
    "404.help": "If you think this is an error, please contact us.",
  };

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            {/* 404 Number */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-9xl sm:text-[12rem] font-bold text-blue-600 leading-none">
                404
              </h1>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {t["404.title"]}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t["404.description"]}
              </p>
            </motion.div>

            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-8"
            >
              <div className="w-64 h-64 mx-auto relative">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-4 left-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <Search className="w-8 h-8 text-blue-600" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute top-16 right-8 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center"
                >
                  <Home className="w-6 h-6 text-purple-600" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute bottom-8 left-8 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <Search className="w-10 h-10 text-gray-600" />
                </motion.div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/en/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200"
                >
                  <Home className="w-5 h-5" />
                  {t["404.goHome"]}
                </motion.button>
              </Link>
            </motion.div>

            {/* Additional Help */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-12 text-sm text-gray-500"
            >
              <p>{t["404.help"]}</p>
            </motion.div>
          </motion.div>
        </div>
      </body>
    </html>
  );
}
