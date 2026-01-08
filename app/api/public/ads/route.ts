import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Type for the campaign relationship returned by Supabase
interface CampaignRelation {
  id: string;
  priority: number;
  click_url: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "home";
    const sizeType = searchParams.get("sizeType") || "full";

    // Fetch active ads that target this page and match the size type
    // We also join with campaign to get campaign-level priority and global settings
    const { data, error } = await supabase
      .from("ad_images")
      .select(
        `
        id,
        image_url,
        image_url_large,
        image_url_small,
        alt_text_en,
        alt_text_am,
        link_url,
        size_type,
        target_pages,
        display_order,
        campaign:ad_campaigns!inner(
          id,
          priority,
          click_url,
          start_date,
          end_date,
          is_active
        )
      `
      )
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter by target page, dates, size type, and active campaign
    const now = new Date();
    const filteredAds = data
      ?.filter((ad) => {
        // Handle campaign - Supabase returns object for !inner join
        const campaign = ad.campaign as unknown as CampaignRelation;

        // Skip if no campaign or campaign is inactive
        if (!campaign || !campaign.is_active) return false;

        // Filter by size_type if the ad has one specified
        if (ad.size_type && ad.size_type !== sizeType) {
          // Allow "full" ads to also appear in "inline" slots
          if (!(ad.size_type === "full" && sizeType === "inline")) {
            return false;
          }
        }

        // Check if current page is in target_pages
        const targets = ad.target_pages as string[];
        if (!targets.includes(page) && !targets.includes("all")) return false;

        // Check dates if present
        if (campaign.start_date && new Date(campaign.start_date) > now)
          return false;
        if (campaign.end_date && new Date(campaign.end_date) < now)
          return false;

        return true;
      })
      .sort((a, b) => {
        // Sort by campaign priority first, then display order
        const campaignA = a.campaign as unknown as CampaignRelation;
        const campaignB = b.campaign as unknown as CampaignRelation;
        const priorityA = campaignA?.priority || 0;
        const priorityB = campaignB?.priority || 0;
        if (priorityB !== priorityA) return priorityB - priorityA;
        return (a.display_order || 0) - (b.display_order || 0);
      });

    // Map to a consistent format for the frontend
    const results = filteredAds?.map((ad) => {
      const campaign = ad.campaign as unknown as CampaignRelation;
      return {
        id: ad.id,
        // Legacy field - use large image or fallback to old field
        image: ad.image_url_large || ad.image_url || "",
        // New fields
        imageLarge: ad.image_url_large || ad.image_url || "",
        imageSmall: ad.image_url_small || ad.image_url || "",
        alt: ad.alt_text_en || ad.alt_text_am || "Advertisement",
        link: ad.link_url || campaign?.click_url || "#",
        sizeType: ad.size_type,
      };
    });

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
