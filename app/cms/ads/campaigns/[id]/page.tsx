"use client";

import { useAdCampaign } from "@/lib/hooks/cms/useAds";
import { AdImageList } from "@/components/cms/ads/AdImageList";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Plus,
  Loader2,
  Pencil,
  BarChart3,
  Calendar,
  Zap,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

export default function CampaignDetailPage() {
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
      <div className="p-8 text-center text-destructive">
        Failed to load campaign.
        <Button asChild className="ml-4" variant="outline">
          <Link href="/cms/ads">Back to Campaigns</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link
            href="/cms/ads"
            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Campaigns
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              {campaign.name}
            </h1>
            <Badge
              variant={campaign.is_active ? "default" : "secondary"}
              className="h-6"
            >
              {campaign.is_active ? "Active" : "Paused"}
            </Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <Tag className="h-4 w-4" /> Advertiser:{" "}
            {campaign.advertiser || "Internal"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href={`/cms/ads/campaigns/${id}/edit`}>
              <Pencil className="h-4 w-4 mr-2" /> Edit Info
            </Link>
          </Button>
          <Button asChild className="shadow-lg shadow-primary/20">
            <Link href={`/cms/ads/create?campaignId=${id}`}>
              <Plus className="h-4 w-4 mr-2" /> New Banner
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/10 border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline" className="text-[10px]">
                Real-time
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Campaign Clicks
              </p>
              <h2 className="text-3xl font-black text-foreground">
                {campaign.clicks_count || 0}
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent/30 border-accent/50 border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-accent">
                <Zap className="h-5 w-5 text-accent-foreground" />
              </div>
              <Badge variant="outline" className="text-[10px]">
                High Impact
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Banner Assets
              </p>
              <h2 className="text-3xl font-black text-foreground">
                {campaign.ad_images?.length || 0}
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-border/50 border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-muted-foreground/10">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <Badge variant="outline" className="text-[10px]">
                Scheduled
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Duration
              </p>
              <h2 className="text-sm font-bold truncate text-foreground">
                {campaign.start_date
                  ? format(new Date(campaign.start_date), "MMM d")
                  : "Always"}
                {" - "}
                {campaign.end_date
                  ? format(new Date(campaign.end_date), "MMM d, yyyy")
                  : "Forever"}
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Ad Banners
            <Badge variant="secondary" className="font-mono">
              {campaign.ad_images?.length || 0}
            </Badge>
          </h2>
        </div>
        <AdImageList campaignId={id as string} />
      </div>
    </div>
  );
}
