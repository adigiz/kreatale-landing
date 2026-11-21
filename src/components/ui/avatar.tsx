"use client";

import { useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name?: string | null;
  email?: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Generate initials from name or email
function getInitials(name?: string | null, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  if (email) {
    return email.substring(0, 2).toUpperCase();
  }
  return "??";
}

// Generate a consistent color based on name/email
function getColorFromString(str: string): string {
  // the brand pair only: Kreatale Blue and black
  const colors = ["bg-[#0061FF]", "bg-[#0A0A0A]"];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-lg",
};

export default function Avatar({
  name,
  email,
  imageUrl,
  size = "md",
  className,
}: AvatarProps) {
  const initials = useMemo(() => getInitials(name, email), [name, email]);
  const bgColor = useMemo(
    () => getColorFromString(name || email || "default"),
    [name, email]
  );

  const sizeClass = sizeClasses[size];

  if (imageUrl) {
    return (
      <div
        className={cn(
          "relative rounded-full overflow-hidden flex-shrink-0",
          sizeClass,
          className
        )}
      >
        <Image
          src={imageUrl}
          alt={name || email || "Avatar"}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center text-white font-medium flex-shrink-0",
        bgColor,
        sizeClass,
        className
      )}
      title={name || email}
    >
      {initials}
    </div>
  );
}


