// app/cups/page.tsx

import { Metadata } from "next";
import CupsListPage from "@/components/cups/CupsListPage";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Ethiopian Cups | Pana Sports",
  description:
    "Explore Ethiopian football cup competitions including the Ethiopian Cup, Super Cup, and more.",
};

export const dynamic = "force-dynamic";

export default function CupsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <CupsListPage />
    </Suspense>
  );
}
