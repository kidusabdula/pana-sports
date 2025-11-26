"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCmsRoute = pathname?.startsWith("/cms");

  return (
    <>
      {!isCmsRoute && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isCmsRoute && <Footer />}
    </>
  );
}
