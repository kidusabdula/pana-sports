import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { adCampaignSchema } from "@/lib/schemas/ad";

// GET all ad campaigns
export async function GET() {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("ad_campaigns")
      .select(
        `
        *,
        ad_images:ad_images(count)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const transformedData = data?.map((campaign) => ({
      ...campaign,
      image_count: campaign.ad_images?.[0]?.count ?? 0,
      ad_images: undefined,
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// POST create new ad campaign
export async function POST(request: Request) {
  try {
    await requireAdmin();
    const supabase = await createClient();
    const body = await request.json();

    const validatedData = adCampaignSchema.parse(body);

    const { data, error } = await supabase
      .from("ad_campaigns")
      .insert({
        ...validatedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
