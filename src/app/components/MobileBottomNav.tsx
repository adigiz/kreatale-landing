"use client";

import { Fragment } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderKanban, BookOpen, Briefcase, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface MobileBottomNavProps {
  pathname: string;
  createLocalizedPath: (path: string) => string;
  onProjectsClick: () => void;
}

export default function MobileBottomNav({
  pathname,
  createLocalizedPath,
  onProjectsClick,
}: MobileBottomNavProps) {
  const t = useTranslations();

  const navItems = [
    {
      id: "projects",
      icon: FolderKanban,
      label: "Projects",
      href: createLocalizedPath("/projects"),
      isActive:
        pathname === createLocalizedPath("/projects") ||
        pathname?.startsWith(createLocalizedPath("/projects/")),
      onClick: onProjectsClick,
      isButton: true,
    },
    {
      id: "blog",
      icon: BookOpen,
      label: "Blog",
      href: createLocalizedPath("/blog"),
      isActive: pathname?.startsWith(createLocalizedPath("/blog")),
      isButton: false,
    },
    {
      id: "services",
      icon: Briefcase,
      label: t("nav.services"),
      href: createLocalizedPath("/services"),
      isActive: pathname === createLocalizedPath("/services"),
      isButton: false,
    },
    {
      id: "faq",
      icon: HelpCircle,
      label: t("nav.faq"),
      href: createLocalizedPath("/faq"),
      isActive: pathname === createLocalizedPath("/faq"),
      isButton: false,
    },
  ];

  return (
    <motion.nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center justify-around px-1 py-1.5 safe-area-inset-bottom relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  item.isActive ? "bg-blue-50" : "hover:bg-gray-100"
                }`}
              >
                <Icon
                  size={18}
                  className={item.isActive ? "text-[#0061FF]" : ""}
                />
              </motion.div>
              <span className="text-[10px] font-medium leading-tight">
                {item.label}
              </span>
            </>
          );

          const className = `flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
            item.isActive ? "text-[#0061FF]" : "text-gray-600"
          }`;

          return (
            <Fragment key={item.id}>
              {item.isButton ? (
                <button onClick={item.onClick} className={className}>
                  {content}
                </button>
              ) : (
                <Link href={item.href} className={className}>
                  {content}
                </Link>
              )}
            </Fragment>
          );
        })}
      </div>
    </motion.nav>
  );
}
