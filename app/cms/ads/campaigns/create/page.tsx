"use client";

import { CampaignForm } from "@/components/cms/ads/CampaignForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateCampaignPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-2">
        <Link
          href="/cms/ads"
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Campaigns
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Create New Campaign
        </h1>
        <p className="text-muted-foreground">
          Define a new advertising campaign to group your banner placements.
        </p>
      </div>

      <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-sm">
        <CampaignForm />
      </div>
    </div>
  );
}
