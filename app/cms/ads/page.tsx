"use client";

import { useAdCampaigns } from "@/lib/hooks/cms/useAds";
import { Button } from "@/components/ui/button";
import { CampaignCard } from "@/components/cms/ads/CampaignCard";
import { Plus, Loader2, Megaphone, Search, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function AdsPage() {
  const { data: campaigns, isLoading, error } = useAdCampaigns();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = campaigns?.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.advertiser?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Ad Management
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your advertisement campaigns and banner placements.
          </p>
        </div>

        <Button
          asChild
          className="shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
        >
          <Link href="/cms/ads/campaigns/create">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Link>
        </Button>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          placeholder="Search campaigns by name or advertiser..."
          className="pl-10 h-11 border-border/50 focus:border-primary/50 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
          <p className="text-sm font-medium">Loading campaigns...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-destructive bg-destructive/5 rounded-2xl border border-destructive/10 p-8">
          <AlertCircle className="h-10 w-10 mb-4" />
          <p className="font-semibold text-lg text-center">
            Failed to load ad campaigns
          </p>
          <p className="text-sm text-center max-w-xs">
            {error instanceof Error
              ? error.message
              : "Please check your connection."}
          </p>
        </div>
      ) : filteredCampaigns?.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center border-2 border-dashed rounded-2xl bg-muted/20 p-12">
          <div className="p-6 rounded-3xl bg-primary/5 mb-6">
            <Megaphone className="h-12 w-12 text-primary opacity-40" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            No campaigns found
          </h3>
          <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
            {searchQuery
              ? `We couldn't find any campaigns matching "${searchQuery}".`
              : "Launch your first advertising campaign to display banners across your site."}
          </p>
          {!searchQuery && (
            <Button asChild className="mt-8 px-8" size="lg">
              <Link href="/cms/ads/campaigns/create">
                <Plus className="h-4 w-4 mr-2" />
                Launch First Campaign
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCampaigns?.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
}
