// app/api/public/matches/head-to-head/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const homeTeamId = searchParams.get("home_team_id");
    const awayTeamId = searchParams.get("away_team_id");
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    if (!homeTeamId || !awayTeamId) {
      return NextResponse.json(
        { error: "Both home_team_id and away_team_id are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch matches where these two teams played against each other
    const { data: matches, error } = await supabase
      .from("matches")
      .select(
        `
        id,
        date,
        status,
        score_home,
        score_away,
        home_team:teams!matches_home_team_id_fkey(id, name_en, logo_url),
        away_team:teams!matches_away_team_id_fkey(id, name_en, logo_url),
        league:leagues(id, name_en)
      `
      )
      .or(
        `and(home_team_id.eq.${homeTeamId},away_team_id.eq.${awayTeamId}),and(home_team_id.eq.${awayTeamId},away_team_id.eq.${homeTeamId})`
      )
      .eq("status", "completed")
      .order("date", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching head-to-head:", error);
      return NextResponse.json(
        { error: "Failed to fetch head-to-head data", details: error.message },
        { status: 500 }
      );
    }

    // Calculate statistics
    let homeWins = 0;
    let awayWins = 0;
    let draws = 0;
    let homeGoals = 0;
    let awayGoals = 0;

    matches?.forEach((match) => {
      // Supabase returns relation as object, but TypeScript thinks it's an array
      const homeTeam = match.home_team as unknown as {
        id: string;
        name_en: string;
        logo_url: string | null;
      } | null;
      const isHomeTeamActuallyHome = homeTeam?.id === homeTeamId;

      if (isHomeTeamActuallyHome) {
        homeGoals += match.score_home || 0;
        awayGoals += match.score_away || 0;

        if ((match.score_home || 0) > (match.score_away || 0)) {
          homeWins++;
        } else if ((match.score_home || 0) < (match.score_away || 0)) {
          awayWins++;
        } else {
          draws++;
        }
      } else {
        // Teams are swapped in this match
        homeGoals += match.score_away || 0;
        awayGoals += match.score_home || 0;

        if ((match.score_away || 0) > (match.score_home || 0)) {
          homeWins++;
        } else if ((match.score_away || 0) < (match.score_home || 0)) {
          awayWins++;
        } else {
          draws++;
        }
      }
    });

    return NextResponse.json({
      matches: matches || [],
      stats: {
        totalMatches: matches?.length || 0,
        homeWins,
        awayWins,
        draws,
        homeGoals,
        awayGoals,
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch head-to-head data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
