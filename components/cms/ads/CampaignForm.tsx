"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  adCampaignSchema,
  adCampaignWithImagesSchema,
  AdCampaign,
  AdCampaignWithImages,
} from "@/lib/schemas/ad";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import {
  useCreateAdCampaign,
  useUpdateAdCampaign,
  useCreateAdImage,
} from "@/lib/hooks/cms/useAds";
import { Loader2, Calendar, ImagePlus, Info } from "lucide-react";
import { AdImageUploader } from "./AdImageUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CampaignFormProps {
  initialData?: {
    id?: string;
    name?: string;
    description?: string;
    advertiser?: string;
    start_date?: string;
    end_date?: string;
    is_active?: boolean;
    priority?: number;
    click_url?: string;
  };
  isEdit?: boolean;
}

export function CampaignForm({ initialData, isEdit }: CampaignFormProps) {
  const router = useRouter();
  const createCampaignMutation = useCreateAdCampaign();
  const updateMutation = useUpdateAdCampaign(initialData?.id || "");
  const createImageMutation = useCreateAdImage();

  // Use the schema with images for new campaigns, simple schema for edits
  const schema = isEdit ? adCampaignSchema : adCampaignWithImagesSchema;

  const form = useForm<AdCampaignWithImages>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      advertiser: initialData?.advertiser || "",
      start_date: initialData?.start_date || "",
      end_date: initialData?.end_date || "",
      is_active: initialData?.is_active ?? true,
      priority: initialData?.priority ?? 0,
      click_url: initialData?.click_url || "",
      // Image fields only for new campaigns
      image_url_large: "",
      image_url_small: "",
      alt_text_en: "",
      alt_text_am: "",
    },
  });

  const onSubmit = async (values: AdCampaignWithImages) => {
    try {
      if (isEdit) {
        // For edit, only update campaign details
        const campaignData: AdCampaign = {
          name: values.name,
          description: values.description,
          advertiser: values.advertiser,
          start_date: values.start_date,
          end_date: values.end_date,
          is_active: values.is_active,
          priority: values.priority,
          click_url: values.click_url,
        };
        await updateMutation.mutateAsync(campaignData);
      } else {
        // For create, first create campaign then add the initial ad image
        const campaignData: AdCampaign = {
          name: values.name,
          description: values.description,
          advertiser: values.advertiser,
          start_date: values.start_date,
          end_date: values.end_date,
          is_active: values.is_active,
          priority: values.priority,
          click_url: values.click_url,
        };

        const campaign = await createCampaignMutation.mutateAsync(campaignData);

        // Now create the initial ad image with both sizes
        if (campaign?.id) {
          await createImageMutation.mutateAsync({
            campaign_id: campaign.id,
            image_url_large: values.image_url_large,
            image_url_small: values.image_url_small,
            alt_text_en: values.alt_text_en,
            alt_text_am: values.alt_text_am,
            display_order: 0,
            is_active: true,
            target_pages: ["home"],
            size_type: "full",
            link_url: "",
          });
        }
      }
      router.push("/cms/ads");
    } catch (error) {
      console.error("Failed to save campaign:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save campaign"
      );
    }
  };

  const isPending =
    createCampaignMutation.isPending ||
    updateMutation.isPending ||
    createImageMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Campaign Details Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Campaign Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Campaign Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Summer Sale 2024"
                        className="bg-background border-input"
                      />
                    </FormControl>
                    <FormDescription>
                      Internal name for this campaign.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="advertiser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Advertiser Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Adidas"
                        className="bg-background border-input"
                      />
                    </FormControl>
                    <FormDescription>
                      Company paying for the ads.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Campaign Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Notes about this campaign..."
                      rows={3}
                      className="bg-background border-input resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="click_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Global Click URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://..."
                        className="bg-background border-input"
                      />
                    </FormControl>
                    <FormDescription>
                      Default link for all banners in this campaign.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Campaign Priority
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        className="bg-background border-input"
                      />
                    </FormControl>
                    <FormDescription>
                      Higher priority campaigns show more often.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Start Date
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                          className="pl-10 bg-background border-input"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">End Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                          className="pl-10 bg-background border-input"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border p-4 bg-muted/20">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-bold text-base text-foreground">
                      Campaign Active
                    </FormLabel>
                    <FormDescription>
                      Uncheck to pause all advertisements within this campaign
                      globally.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Image Upload Section - Only for new campaigns */}
        {!isEdit && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <ImagePlus className="h-5 w-5 text-primary" />
                Banner Images
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload both banner sizes for optimal display across different
                screen sizes.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-8 lg:grid-cols-2">
                <FormField
                  control={form.control}
                  name="image_url_large"
                  render={({ field }) => (
                    <FormItem>
                      <AdImageUploader
                        label="Large Banner"
                        description="Full-width banner for desktop view"
                        aspectHint="1200×400px (3:1)"
                        value={field.value}
                        onChange={field.onChange}
                        previewAspect="aspect-3/1"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image_url_small"
                  render={({ field }) => (
                    <FormItem>
                      <AdImageUploader
                        label="Small Banner"
                        description="Sidebar or mobile banner"
                        aspectHint="400×400px (1:1)"
                        value={field.value}
                        onChange={field.onChange}
                        previewAspect="aspect-square"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="alt_text_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Alt Text (English)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Description for screen readers"
                          className="bg-background border-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alt_text_am"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Alt Text (Amharic)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="መግለጫ"
                          className="bg-background border-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="px-10 shadow-lg shadow-primary/20"
          >
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEdit ? "Save Changes" : "Launch Campaign"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
