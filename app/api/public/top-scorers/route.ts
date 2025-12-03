// app/api/public/top-scorers/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "1");
    const leagueId = searchParams.get("league_id");

    const supabase = await createClient();

    let query = supabase
      .from("top_scorers")
      .select(`
        *,
        player:players(id, name_en, name_am, slug, jersey_number, photo_url, position_en),
        team:teams(id, name_en, name_am, slug, logo_url),
        league:leagues(id, name_en, name_am, slug, category)
      `)
      .order("goals", { ascending: false })
      .order("assists", { ascending: false });

    if (leagueId && leagueId !== "undefined") {
      query = query.eq("league_id", leagueId);
    }

    const { data, error } = await query.limit(limit);

    if (error) {
      console.error("Supabase error fetching top scorers:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch top scorers",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error fetching top scorers:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch top scorers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}