// app/api/public/matches/upcoming/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const leagueId = searchParams.get("league_id");

    const supabase = await createClient();

    let query = supabase
      .from("matches")
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, name_en, name_am, slug, logo_url),
        away_team:teams!matches_away_team_id_fkey(id, name_en, name_am, slug, logo_url),
        league:leagues(id, name_en, name_am, slug, category),
        venue:venues(id, name_en, name_am, city, capacity)
      `)
      .in("status", ["scheduled", "postponed"])
      .order("date", { ascending: true });

    if (leagueId && leagueId !== "undefined") {
      query = query.eq("league_id", leagueId);
    }

    const { data, error } = await query.limit(limit);

    if (error) {
      console.error("Supabase error fetching upcoming matches:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch upcoming matches",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error fetching upcoming matches:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch upcoming matches",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}