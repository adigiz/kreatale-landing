"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";

// Importing logos from public folder
const MARQUEE_LOGOS = [
  { src: "/logos/gala-esport-logo.png", alt: "Gala Esports" },
  { src: "/logos/activenet-logo.png", alt: "ActiveNet" },
  { src: "/logos/noproblem-logo.png", alt: "No Problem" },
  { src: "/logos/grace-logo.png", alt: "Grace" },
  { src: "/logos/land-sale-expert-logo.png", alt: "Land Sale Expert" },
  { src: "/logos/rizzsolutions-logo.png", alt: "Rizz Solutions" },
  { src: "/logos/loui-logo.png", alt: "Loui" },
  { src: "/logos/free-state-logo.png", alt: "Free State" },
  { src: "/logos/jdm-vs-euro-logo.png", alt: "JDM vs Euro" },
  { src: "/logos/sell-your-super-logo.png", alt: "Sell Your Super" },
  { src: "/logos/pescheck-logo.png", alt: "Pescheck" },
  { src: "/logos/zushino-logo.png", alt: "Zushino" },
  { src: "/logos/galaclub-logo.png", alt: "Gala Club" },
];

export default function Hero() {
  const t = useTranslations();

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden bg-white text-black pt-20"
    >
      {/* Background Ambience with Lottie */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-20 -right-20 hidden md:block md:w-[800px] md:h-[800px] opacity-20">
          <DotLottieReact
            src="https://lottie.host/2f2c0365-9333-4ab6-a9b9-717c0e60cd01/3kNv3myJiJ.lottie"
            loop
            autoplay
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-5xl mx-auto gap-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <h1 className="text-[50px] sm:text-[60px] md:text-[80px] leading-[1.1] font-bold tracking-tight text-gray-900">
            {t.rich("hero.title", {
              cursive: (chunks) => (
                <span className="font-cursive text-primary italic">
                  {chunks}
                </span>
              ),
            })}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl font-light leading-relaxed">
            {t("hero.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="#contact"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white transition-all duration-300 bg-primary rounded-full hover:brightness-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <span>Book a call</span>
            <svg
              className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Marquee Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative w-full py-8 mt-auto border-t border-gray-100/50 bg-white/30 backdrop-blur-sm"
      >
        <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-8">
          Trusted by innovative companies
        </p>

        <div className="w-full overflow-hidden mask-gradient">
          <div className="flex w-max animate-marquee-seamless items-center gap-16">
            {[...MARQUEE_LOGOS, ...MARQUEE_LOGOS].map((logo, index) => (
              <div
                key={index}
                className="relative flex items-center justify-center min-w-[150px] h-12"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={150}
                  height={50}
                  className="object-contain w-auto h-full max-w-[150px]"
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
