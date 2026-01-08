"use client";

import { useAdCampaign } from "@/lib/hooks/cms/useAds";
import { CampaignForm } from "@/components/cms/ads/CampaignForm";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EditCampaignPage() {
  const { id } = useParams();
  const { data: campaign, isLoading, error } = useAdCampaign(id as string);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-destructive mb-4">Failed to load campaign.</p>
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
          href={`/cms/ads/campaigns/${id}`}
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Campaign
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Edit Campaign
        </h1>
        <p className="text-muted-foreground">
          Update the details for &quot;{campaign.name}&quot;
        </p>
      </div>

      <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-sm">
        <CampaignForm
          initialData={{
            id: campaign.id,
            name: campaign.name,
            description: campaign.description,
            advertiser: campaign.advertiser,
            start_date: campaign.start_date?.split("T")[0] || "",
            end_date: campaign.end_date?.split("T")[0] || "",
            is_active: campaign.is_active,
            priority: campaign.priority,
            click_url: campaign.click_url,
          }}
          isEdit
        />
      </div>
    </div>
  );
}
