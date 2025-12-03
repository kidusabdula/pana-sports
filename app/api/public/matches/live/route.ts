// app/api/public/matches/live/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("matches")
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, name_en, name_am, slug, logo_url),
        away_team:teams!matches_away_team_id_fkey(id, name_en, name_am, slug, logo_url),
        league:leagues(id, name_en, name_am, slug, category),
        venue:venues(id, name_en, name_am, city, capacity)
      `)
      .eq("status", "live")
      .order("date", { ascending: false });

    if (error) {
      console.error("Supabase error fetching live matches:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch live matches",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error fetching live matches:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch live matches",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}