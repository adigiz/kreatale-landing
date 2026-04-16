"use client";

import Link from "next/link";

export type CarDemoBreadcrumbItem = {
  label: string;
  href?: string;
};

export function CarDemoBreadcrumbs({
  items,
  primaryColor,
  ariaLabel,
  variant = "default",
  className = "",
}: {
  items: CarDemoBreadcrumbItem[];
  primaryColor: string;
  ariaLabel: string;
  variant?: "default" | "onDark";
  className?: string;
}) {
  if (items.length === 0) return null;

  const isOnDark = variant === "onDark";

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ol
        className={`flex flex-wrap items-center gap-x-1 gap-y-1 text-sm ${
          isOnDark ? "text-white/70" : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {i > 0 ? (
                <span
                  className={`material-icons text-base select-none ${
                    isOnDark ? "text-white/35" : "text-gray-400 dark:text-gray-500"
                  }`}
                  aria-hidden
                >
                  chevron_right
                </span>
              ) : null}
              {isLast ? (
                <span
                  className={
                    isOnDark
                      ? "font-semibold text-white"
                      : "font-medium text-gray-900 dark:text-white"
                  }
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className={`transition-colors hover:underline ${
                    isOnDark ? "text-white/85 hover:text-white" : ""
                  }`}
                  style={isOnDark ? undefined : { color: primaryColor }}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isOnDark ? "text-white/90" : "text-gray-700 dark:text-gray-300"
                  }
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
