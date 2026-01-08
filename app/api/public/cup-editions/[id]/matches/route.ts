import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const round = searchParams.get("round");
    const status = searchParams.get("status");

    const supabase = await createClient();

    // Build query for cup matches
    let query = supabase
      .from("matches")
      .select(
        `
        *,
        home_team:teams!matches_home_team_id_fkey(id, name_en, name_am, logo_url, slug),
        away_team:teams!matches_away_team_id_fkey(id, name_en, name_am, logo_url, slug),
        league:leagues(id, name_en, name_am, slug),
        venue:venues(id, name, city)
      `
      )
      .eq("cup_edition_id", id)
      .eq("is_cup_match", true);

    // Apply filters
    if (round) {
      query = query.eq("round", round);
    }
    if (status) {
      query = query.eq("status", status);
    }

    // Order by date
    query = query.order("match_date", { ascending: true });

    const { data: matches, error } = await query;

    if (error) throw error;

    // Group matches by round for easier display
    const matchesByRound: Record<string, any[]> = {};
    matches?.forEach((match) => {
      const roundName = match.round || "Unassigned";
      if (!matchesByRound[roundName]) {
        matchesByRound[roundName] = [];
      }
      matchesByRound[roundName].push(match);
    });

    return NextResponse.json({
      matches: matches || [],
      by_round: matchesByRound,
    });
  } catch (error) {
    console.error("Error fetching cup matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch cup matches" },
      { status: 500 }
    );
  }
}
