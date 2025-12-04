"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { WHATSAPP_NUMBER, WHATSAPP_BASE_URL } from "@/lib/constants";

export default function FloatingWhatsAppButton() {
  const t = useTranslations();

  const whatsappMessage = encodeURIComponent(
    "Hi! I'm interested in your services. Let's discuss my project!"
  );
  const whatsappUrl = `${WHATSAPP_BASE_URL}/${WHATSAPP_NUMBER.replace(
    "+",
    ""
  )}?text=${whatsappMessage}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#0061FF] text-white shadow-2xl hover:shadow-3xl transition-all duration-300"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={t("footer.whatsappUs")}
    >
      <MessageCircle className="w-6 h-6 md:w-7 md:h-7" aria-hidden="true" />
      {/* Pulse animation ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#0061FF]"
        animate={{
          scale: [1, 1.5, 1.5],
          opacity: [0.5, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </motion.a>
  );
}
