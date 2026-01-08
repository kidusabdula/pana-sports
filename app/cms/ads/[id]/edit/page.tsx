"use client";

import { useQuery } from "@tanstack/react-query";
import { AdImageForm } from "@/components/cms/ads/AdImageForm";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DbAdImage } from "@/lib/schemas/ad";

export default function EditAdImagePage() {
  const { id } = useParams();

  const {
    data: adImage,
    isLoading,
    error,
  } = useQuery<DbAdImage>({
    queryKey: ["cms", "ad-images", id],
    queryFn: async () => {
      const res = await fetch(`/api/cms/ads/${id}`);
      if (!res.ok) throw new Error("Failed to fetch ad image");
      return res.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !adImage) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-destructive mb-4">Failed to load ad image.</p>
        <Link href="/cms/ads" className="text-primary hover:underline">
          Back to Campaigns
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-2">
        <Link
          href={`/cms/ads/campaigns/${adImage.campaign_id}`}
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Campaign
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Edit Banner
        </h1>
        <p className="text-muted-foreground">
          Update the banner images and settings
        </p>
      </div>

      <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-sm">
        <AdImageForm
          initialData={{
            id: adImage.id,
            campaign_id: adImage.campaign_id,
            image_url_large: adImage.image_url_large || adImage.image_url,
            image_url_small: adImage.image_url_small || "",
            alt_text_en: adImage.alt_text_en,
            alt_text_am: adImage.alt_text_am,
            display_order: adImage.display_order,
            is_active: adImage.is_active,
            target_pages: adImage.target_pages,
            size_type: adImage.size_type,
            link_url: adImage.link_url,
          }}
          isEdit
        />
      </div>
    </div>
  );
}
