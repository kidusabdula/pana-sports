"use client";

import { useAdImages, useDeleteAdImage } from "@/lib/hooks/cms/useAds";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Loader2,
  Image as ImageIcon,
  Pencil,
  Trash2,
  Eye,
  Layout,
  Target,
  ExternalLink,
  Monitor,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DbAdImage } from "@/lib/schemas/ad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdImageListProps {
  campaignId: string;
}

export function AdImageList({ campaignId }: AdImageListProps) {
  const { data: ads, isLoading } = useAdImages(campaignId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading banners...</p>
      </div>
    );
  }

  if (!ads || ads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-xl bg-muted/20 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <ImageIcon className="h-6 w-6 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-lg font-bold text-foreground">
          No banners added yet
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Add your first advertisement banner to this campaign.
        </p>
        <Button asChild>
          <Link href={`/cms/ads/create?campaignId=${campaignId}`}>
            <Plus className="h-4 w-4 mr-2" /> Add Banner
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {ads.map((ad: DbAdImage) => (
        <AdImageCard key={ad.id} ad={ad} campaignId={campaignId} />
      ))}
    </div>
  );
}

interface AdImageCardProps {
  ad: DbAdImage;
  campaignId: string;
}

function AdImageCard({ ad, campaignId }: AdImageCardProps) {
  const deleteMutation = useDeleteAdImage(ad.id);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this ad?")) {
      deleteMutation.mutate(campaignId);
    }
  };

  // Determine which image to show - prefer new fields, fallback to legacy
  const largeImage = ad.image_url_large || ad.image_url;
  const smallImage = ad.image_url_small || ad.image_url;

  return (
    <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
      {/* Image Preview with Tabs for Large/Small */}
      <Tabs defaultValue="large" className="w-full">
        <div className="relative">
          <TabsContent value="large" className="m-0">
            <div className="aspect-3/1 relative bg-muted flex items-center justify-center overflow-hidden group">
              {largeImage ? (
                <Image
                  src={largeImage}
                  alt={ad.alt_text_en || "Large banner"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Monitor className="h-8 w-8" />
                  <span className="text-xs">No large image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                {largeImage && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-2"
                    asChild
                  >
                    <Link href={largeImage} target="_blank">
                      <Eye className="h-4 w-4" /> View Full
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="small" className="m-0">
            <div className="aspect-3/1 relative bg-muted flex items-center justify-center overflow-hidden group">
              {smallImage ? (
                <div className="h-full aspect-square relative">
                  <Image
                    src={smallImage}
                    alt={ad.alt_text_en || "Small banner"}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Smartphone className="h-8 w-8" />
                  <span className="text-xs">No small image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                {smallImage && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-2"
                    asChild
                  >
                    <Link href={smallImage} target="_blank">
                      <Eye className="h-4 w-4" /> View Full
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Status Badge */}
          <Badge
            className={cn(
              "absolute top-3 left-3 z-10",
              ad.is_active
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {ad.is_active ? "Live" : "Inactive"}
          </Badge>

          {/* Tabs Toggle */}
          <TabsList className="absolute bottom-3 right-3 z-10 h-8 bg-background/80 backdrop-blur-sm">
            <TabsTrigger value="large" className="h-6 px-2 text-xs gap-1">
              <Monitor className="h-3 w-3" />
              Large
            </TabsTrigger>
            <TabsTrigger value="small" className="h-6 px-2 text-xs gap-1">
              <Smartphone className="h-3 w-3" />
              Small
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-[10px] uppercase font-bold tracking-tighter border-border text-foreground"
              >
                {ad.size_type}
              </Badge>
              <span className="text-xs font-medium text-muted-foreground">
                Order: {ad.display_order}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/cms/ads/${ad.id}/edit`}>
                <Pencil className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <Target className="h-3 w-3" /> Target Pages
            </div>
            <div className="flex flex-wrap gap-1">
              {(ad.target_pages as string[])?.slice(0, 2).map((page) => (
                <Badge
                  key={page}
                  variant="secondary"
                  className="text-[9px] h-4 py-0"
                >
                  {page}
                </Badge>
              ))}
              {(ad.target_pages as string[])?.length > 2 && (
                <Badge variant="secondary" className="text-[9px] h-4 py-0">
                  +{(ad.target_pages as string[]).length - 2}
                </Badge>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <Layout className="h-3 w-3" /> Size Type
            </div>
            <span className="text-xs font-semibold capitalize text-foreground">
              {ad.size_type}
            </span>
          </div>
        </div>

        {ad.link_url && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-[10px] text-primary truncate font-medium">
              <ExternalLink className="h-3 w-3 shrink-0" />
              <span className="truncate">{ad.link_url}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
