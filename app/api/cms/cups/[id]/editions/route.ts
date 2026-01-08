import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("cup_editions")
      .select(
        `
        *,
        season:seasons(id, name, slug),
        winner:teams!cup_editions_winner_fkey(id, name_en, name_am, logo_url, slug),
        runner_up:teams!cup_editions_runner_up_fkey(id, name_en, name_am, logo_url, slug)
      `
      )
      .eq("cup_id", id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching cup editions:", error);
    return NextResponse.json(
      { error: "Failed to fetch cup editions" },
      { status: 500 }
    );
  }
}
