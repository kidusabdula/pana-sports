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

    // Fetch the match with related data
    const { data: match, error: matchError } = await supabase
      .from("matches")
      .select(
        `
        *,
        home_team:teams!matches_home_team_id_fkey(id, name_en, name_am, slug, logo_url),
        away_team:teams!matches_away_team_id_fkey(id, name_en, name_am, slug, logo_url),
        league:leagues(id, name_en, name_am, slug, category),
        venue:venues(id, name_en, name_am, city, capacity)
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

    return NextResponse.json({ match, events });
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
