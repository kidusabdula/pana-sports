// app/cups/[slug]/page.tsx

import { notFound } from "next/navigation";
import CupDetailPage from "@/components/cups/CupDetailPage";
import { Suspense } from "react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface CupPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CupPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Capitalize and format the slug for title
  const formattedName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${formattedName} | Pana Sports`,
    description: `Follow the ${formattedName} on Pana Sports. View brackets, group standings, matches, and results.`,
  };
}

export default async function CupPage({ params }: CupPageProps) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <CupDetailPage slug={slug} />
    </Suspense>
  );
}
