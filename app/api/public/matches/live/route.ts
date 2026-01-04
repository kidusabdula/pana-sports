// app/api/public/matches/live/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Calculate elapsed match minute based on timestamps (server-side version)
 */
function calculateMatchMinute(match: {
  status: string;
  minute: number | null;
  match_started_at: string | null;
  second_half_started_at: string | null;
  extra_time_started_at: string | null;
}): number {
  const now = new Date();

  // For non-running statuses, return stored minute
  if (!["live", "second_half", "extra_time"].includes(match.status)) {
    return match.minute ?? 0;
  }

  switch (match.status) {
    case "live": {
      if (!match.match_started_at) return match.minute ?? 0;
      const startTime = new Date(match.match_started_at);
      const elapsedSeconds = Math.floor(
        (now.getTime() - startTime.getTime()) / 1000
      );
      return Math.floor(elapsedSeconds / 60);
    }
    case "second_half": {
      if (!match.second_half_started_at) return match.minute ?? 46;
      const startTime = new Date(match.second_half_started_at);
      const elapsedSeconds = Math.floor(
        (now.getTime() - startTime.getTime()) / 1000
      );
      return 45 + Math.floor(elapsedSeconds / 60);
    }
    case "extra_time": {
      if (!match.extra_time_started_at) return match.minute ?? 91;
      const startTime = new Date(match.extra_time_started_at);
      const elapsedSeconds = Math.floor(
        (now.getTime() - startTime.getTime()) / 1000
      );
      return 90 + Math.floor(elapsedSeconds / 60);
    }
    default:
      return match.minute ?? 0;
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all actively running matches (not just "live")
    const { data, error } = await supabase
      .from("matches")
      .select(
        `
        *,
        home_team:teams!matches_home_team_id_fkey(id, name_en, name_am, slug, logo_url),
        away_team:teams!matches_away_team_id_fkey(id, name_en, name_am, slug, logo_url),
        league:leagues(id, name_en, name_am, slug, category, logo_url),
        venue:venues(id, name_en, name_am, city, capacity)
      `
      )
      .in("status", [
        "live",
        "second_half",
        "extra_time",
        "half_time",
        "penalties",
        "paused",
      ])
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

    // Add calculated_minute to each match for accurate time display
    const matchesWithCalculatedTime =
      data?.map((match) => ({
        ...match,
        calculated_minute: calculateMatchMinute(match),
      })) ?? [];

    return NextResponse.json(matchesWithCalculatedTime);
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
