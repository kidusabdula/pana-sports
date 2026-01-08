import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch cup by slug
    const { data: cup, error: cupError } = await supabase
      .from("cups")
      .select(
        `
        *,
        current_holder:teams!cups_current_holder_fkey(
          id, name_en, name_am, logo_url, slug
        )
      `
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (cupError) {
      if (cupError.code === "PGRST116") {
        return NextResponse.json({ error: "Cup not found" }, { status: 404 });
      }
      throw cupError;
    }

    // Fetch all editions for this cup
    const { data: editions } = await supabase
      .from("cup_editions")
      .select(
        `
        *,
        season:seasons(id, name, slug),
        winner:teams!cup_editions_winner_fkey(id, name_en, name_am, logo_url, slug),
        runner_up:teams!cup_editions_runner_up_fkey(id, name_en, name_am, logo_url, slug)
      `
      )
      .eq("cup_id", cup.id)
      .order("created_at", { ascending: false });

    // Find current/ongoing edition or fallback to latest
    const currentEdition =
      editions?.find((e) => e.status === "ongoing") || editions?.[0] || null;

    return NextResponse.json({
      ...cup,
      editions: editions || [],
      current_edition: currentEdition,
    });
  } catch (error) {
    console.error("Error fetching cup:", error);
    return NextResponse.json({ error: "Failed to fetch cup" }, { status: 500 });
  }
}
