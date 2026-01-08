"use client";

import { AdImageForm } from "@/components/cms/ads/AdImageForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CreateAdPage() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaignId");

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-2">
        <Link
          href={campaignId ? `/cms/ads/campaigns/${campaignId}` : "/cms/ads"}
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Campaign
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Add New Banner
        </h1>
        <p className="text-muted-foreground">
          Upload and configure a new advertisement banner asset.
        </p>
      </div>

      <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-sm">
        <AdImageForm campaignId={campaignId || undefined} />
      </div>
    </div>
  );
}
