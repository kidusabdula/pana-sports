"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Layers,
  ExternalLink,
  MoreVertical,
  Pencil,
  Trash2,
  BarChart3,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteAdCampaign } from "@/lib/hooks/cms/useAds";
import { DbAdCampaign } from "@/lib/schemas/ad";
import { cn } from "@/lib/utils";

interface CampaignCardProps {
  campaign: DbAdCampaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const deleteMutation = useDeleteAdCampaign();

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this campaign? All associated ads will be removed."
      )
    ) {
      deleteMutation.mutate(campaign.id);
    }
  };

  const isActive = campaign.is_active;
  const startDate = campaign.start_date ? new Date(campaign.start_date) : null;
  const endDate = campaign.end_date ? new Date(campaign.end_date) : null;
  const isExpired = endDate && endDate < new Date();
  const isUpcoming = startDate && startDate > new Date();

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="p-5 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-bold text-lg leading-tight truncate text-foreground">
              {campaign.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {campaign.advertiser || "Direct Placement"}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Badge
              variant={isActive ? "default" : "secondary"}
              className={cn(
                isActive
                  ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/cms/ads/campaigns/${campaign.id}/edit`}>
                    <Pencil className="h-4 w-4 mr-2" /> Edit Campaign
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 pb-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Ads
            </p>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">
                {campaign.image_count ?? campaign.ad_images?.length ?? 0}{" "}
                banners
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Performance
            </p>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">
                {campaign.clicks_count || 0} clicks
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {startDate ? format(startDate, "MMM d, yyyy") : "No start"} -{" "}
              {endDate ? format(endDate, "MMM d, yyyy") : "No end"}
            </span>
            {isExpired && (
              <Badge
                variant="outline"
                className="text-[10px] h-4 bg-destructive/5 text-destructive border-destructive/20"
              >
                Expired
              </Badge>
            )}
            {isUpcoming && (
              <Badge
                variant="outline"
                className="text-[10px] h-4 bg-primary/5 text-primary border-primary/20"
              >
                Upcoming
              </Badge>
            )}
          </div>
          {campaign.click_url && (
            <div className="flex items-center gap-2 text-xs text-primary truncate">
              <Globe className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{campaign.click_url}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-2 pt-0 bg-muted/30">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-full text-xs gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link href={`/cms/ads/campaigns/${campaign.id}`}>
            Manage Ads <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
