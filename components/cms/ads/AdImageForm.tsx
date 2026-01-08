"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adImageSchema, AdImage } from "@/lib/schemas/ad";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import {
  useCreateAdImage,
  useUpdateAdImage,
  useAdCampaigns,
} from "@/lib/hooks/cms/useAds";
import { Loader2 } from "lucide-react";
import { AdImageUploader } from "./AdImageUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AdImageFormProps {
  initialData?: {
    id?: string;
    campaign_id?: string;
    image_url_large?: string;
    image_url_small?: string;
    alt_text_en?: string;
    alt_text_am?: string;
    display_order?: number;
    is_active?: boolean;
    target_pages?: string[];
    size_type?: "full" | "sidebar" | "inline" | "popup";
    link_url?: string;
  };
  campaignId?: string;
  isEdit?: boolean;
}

const PAGE_OPTIONS = [
  { id: "home", label: "Home Page" },
  { id: "matches", label: "Matches List" },
  { id: "leagues", label: "League Details" },
  { id: "standings", label: "Standings" },
  { id: "news", label: "News Feed" },
  { id: "news-detail", label: "News Article Detail" },
  { id: "team-detail", label: "Team Detail" },
  { id: "all", label: "All Pages" },
];

export function AdImageForm({
  initialData,
  campaignId,
  isEdit,
}: AdImageFormProps) {
  const router = useRouter();
  const { data: campaigns } = useAdCampaigns();

  const createMutation = useCreateAdImage();
  const updateMutation = useUpdateAdImage(initialData?.id || "");

  const form = useForm<AdImage>({
    resolver: zodResolver(adImageSchema) as any,
    defaultValues: {
      campaign_id: initialData?.campaign_id || campaignId || "",
      image_url_large: initialData?.image_url_large || "",
      image_url_small: initialData?.image_url_small || "",
      alt_text_en: initialData?.alt_text_en || "",
      alt_text_am: initialData?.alt_text_am || "",
      display_order: initialData?.display_order ?? 0,
      is_active: initialData?.is_active ?? true,
      target_pages: initialData?.target_pages || ["home"],
      size_type: initialData?.size_type || "full",
      link_url: initialData?.link_url || "",
    },
  });

  const onSubmit = async (values: AdImage) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync(values);
      } else {
        await createMutation.mutateAsync(values);
      }
      router.push(`/cms/ads/campaigns/${values.campaign_id}`);
    } catch (error) {
      console.error("Failed to save ad image:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save ad image"
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Campaign & Settings Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground">
              Ad Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="campaign_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Campaign</FormLabel>
                    <Select
                      disabled={!!campaignId}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background border-input text-foreground">
                          <SelectValue placeholder="Select a campaign" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {campaigns?.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The campaign this banner belongs to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Size / Position
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background border-input text-foreground">
                          <SelectValue placeholder="Select size type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full">
                          Full Width Banner (Home/Main)
                        </SelectItem>
                        <SelectItem value="sidebar">
                          Sidebar Square (News/Right Column)
                        </SelectItem>
                        <SelectItem value="inline">
                          Inline Content Ad
                        </SelectItem>
                        <SelectItem value="popup">Overlay Popup</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Where this ad will be placed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="link_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Destination URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://..."
                        className="bg-background border-input text-foreground"
                      />
                    </FormControl>
                    <FormDescription>
                      Leave empty to use campaign global link.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Display Order
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        className="bg-background border-input text-foreground"
                      />
                    </FormControl>
                    <FormDescription>
                      Lower numbers show first in carousel.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Banner Images Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground">
              Banner Images
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Both image sizes are required for proper display.
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

            <Separator className="bg-border/50" />

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
                        className="bg-background border-input text-foreground"
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
                        className="bg-background border-input text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Target Pages Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground">
              Target Pages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="target_pages"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg border border-border bg-muted/20">
                    {PAGE_OPTIONS.map((page) => (
                      <FormField
                        key={page.id}
                        control={form.control}
                        name="target_pages"
                        render={({ field }) => {
                          const currentValues = field.value || [];
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={currentValues.includes(page.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...currentValues,
                                          page.id,
                                        ])
                                      : field.onChange(
                                          currentValues.filter(
                                            (val: string) => val !== page.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer text-foreground">
                                {page.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormDescription>
                    Select where you want this specific banner to appear.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem
                  className={cn(
                    "flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border p-4 bg-muted/20",
                    field.value ? "border-primary/50" : ""
                  )}
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-bold text-foreground cursor-pointer">
                      Active Status
                    </FormLabel>
                    <FormDescription>
                      Determine if this banner is currently visible on the site.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
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
            className="px-8 shadow-lg shadow-primary/20"
          >
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEdit ? "Update Banner" : "Upload Banner"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
