"use client";

import { usePathname } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FloatingWhatsAppButton from "../../components/FloatingWhatsAppButton";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.includes("/admin") || false;

  return (
    <>
      {!isAdminRoute && <Header />}
      {children}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingWhatsAppButton />}
    </>
  );
}
