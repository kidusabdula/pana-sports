// app/api/public/matches/[id]/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Match ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch the match with related data including new fields
    const { data: match, error: matchError } = await supabase
      .from("matches")
      .select(
        `
        *,
        home_team:teams!matches_home_team_id_fkey(id, name_en, name_am, slug, logo_url),
        away_team:teams!matches_away_team_id_fkey(id, name_en, name_am, slug, logo_url),
        league:leagues(id, name_en, name_am, slug, category, logo_url),
        venue:venues(id, name_en, name_am, city, capacity, latitude, longitude, surface)
      `
      )
      .eq("id", id)
      .single();

    if (matchError) {
      console.error("Supabase error fetching match:", matchError);
      return NextResponse.json(
        {
          error: "Failed to fetch match",
          details: matchError.message,
        },
        { status: 500 }
      );
    }

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Fetch match events - specify the exact foreign key relationship
    const { data: events, error: eventsError } = await supabase
      .from("match_events")
      .select(
        `
        *,
        player:players!match_events_player_id_fkey(id, name_en, name_am, slug, jersey_number, photo_url),
        team:teams(id, name_en, name_am, slug, logo_url)
      `
      )
      .eq("match_id", id)
      .order("minute", { ascending: true });

    if (eventsError) {
      console.error("Supabase error fetching match events:", eventsError);
      return NextResponse.json(
        {
          error: "Failed to fetch match events",
          details: eventsError.message,
        },
        { status: 500 }
      );
    }

    // Fetch match lineups with player and team details
    const { data: lineups, error: lineupsError } = await supabase
      .from("match_lineups")
      .select(
        `
        *,
        player:players(id, name_en, name_am, slug, jersey_number, position_en, position_am, photo_url),
        team:teams(id, name_en, name_am, slug, logo_url)
      `
      )
      .eq("match_id", id)
      .order("is_starting", { ascending: false })
      .order("jersey_number", { ascending: true });

    if (lineupsError) {
      console.error("Supabase error fetching match lineups:", lineupsError);
      // Don't fail the whole request if lineups are not available
    }

    // Fetch match stats if available
    const { data: stats, error: statsError } = await supabase
      .from("match_stats")
      .select("*")
      .eq("match_id", id);

    if (statsError) {
      console.error("Supabase error fetching match stats:", statsError);
      // Don't fail the whole request if stats are not available
    }

    return NextResponse.json({
      match,
      events,
      lineups: lineups || [],
      stats: stats || [],
    });
  } catch (error) {
    console.error("Unexpected error fetching match details:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch match details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
