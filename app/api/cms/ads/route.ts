import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { adImageSchema } from "@/lib/schemas/ad";

// GET all ad images
export async function GET(request: Request) {
  try {
    await requireAdmin();
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId");

    let query = supabase
      .from("ad_images")
      .select(
        `
        *,
        campaign:ad_campaigns(name)
      `
      )
      .order("display_order", { ascending: true });

    if (campaignId) {
      query = query.eq("campaign_id", campaignId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// POST create new ad image
export async function POST(request: Request) {
  try {
    await requireAdmin();
    const supabase = await createClient();
    const body = await request.json();
    const result = adImageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("ad_images")
      .insert({
        ...result.data,
        image_url: result.data.image_url_large, // Fallback for legacy code/constraints
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase Ad Image Insert Error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        data: result.data,
      });
      return NextResponse.json(
        {
          error: `Database error: ${error.message}`,
          details: error.details,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Ad creation unexpected error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
