import * as z from "zod";

export const adCampaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  description: z.string().optional(),
  advertiser: z.string().optional(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  priority: z.number().int().default(0),
  click_url: z.string().url("Invalid click URL").optional().or(z.literal("")),
});

// Schema for creating a campaign with inline images
export const adCampaignWithImagesSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  description: z.string().optional(),
  advertiser: z.string().optional(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  priority: z.number().int().default(0),
  click_url: z.string().url("Invalid click URL").optional().or(z.literal("")),
  // Inline image fields for initial campaign creation
  image_url_large: z.string().min(1, "Large banner image is required"),
  image_url_small: z.string().min(1, "Small banner image is required"),
  alt_text_en: z.string().optional(),
  alt_text_am: z.string().optional(),
});

export const adImageSchema = z.object({
  campaign_id: z.string().uuid("Campaign ID is required"),
  image_url_large: z.string().min(1, "Large banner image is required"),
  image_url_small: z.string().min(1, "Small banner image is required"),
  alt_text_en: z.string().optional(),
  alt_text_am: z.string().optional(),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
  target_pages: z.array(z.string()).default(["home"]),
  size_type: z.enum(["full", "sidebar", "inline", "popup"]).default("full"),
  link_url: z.string().url("Invalid link URL").optional().or(z.literal("")),
});

export type AdCampaign = z.infer<typeof adCampaignSchema>;
export type AdCampaignWithImages = z.infer<typeof adCampaignWithImagesSchema>;
export type AdImage = z.infer<typeof adImageSchema>;

// Database types (what comes from the backend)
export interface DbAdCampaign {
  id: string;
  name: string;
  description?: string;
  advertiser?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  priority: number;
  click_url?: string;
  impressions_count: number;
  clicks_count: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  ad_images?: DbAdImage[];
  image_count?: number;
}

export interface DbAdImage {
  id: string;
  campaign_id: string;
  image_url?: string; // Legacy field
  image_url_large: string;
  image_url_small: string;
  alt_text_en?: string;
  alt_text_am?: string;
  display_order: number;
  is_active: boolean;
  target_pages: string[];
  size_type: "full" | "sidebar" | "inline" | "popup";
  link_url?: string;
  created_at: string;
  updated_at: string;
}
