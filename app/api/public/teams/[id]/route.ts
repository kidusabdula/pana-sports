// app/api/public/teams/[id]/route.ts
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
        { error: "Team ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch team with related data
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id
      );

    const query = supabase.from("teams").select(
      `
        *,
        league:leagues(id, name_en, name_am, slug, category),
        players:players(*),
        standing:standings(*),
        home_matches:matches!matches_home_team_id_fkey(
          id, date, status, score_home, score_away, minute,
          away_team:teams!matches_away_team_id_fkey(id, name_en, name_am, slug, logo_url),
          venue:venues(id, name_en, name_am, city, capacity)
        ),
        away_matches:matches!matches_away_team_id_fkey(
          id, date, status, score_home, score_away, minute,
          home_team:teams!matches_home_team_id_fkey(id, name_en, name_am, slug, logo_url),
          venue:venues(id, name_en, name_am, city, capacity)
        )
      `
    );

    const { data: team, error } = await (isUUID
      ? query.eq("id", id)
      : query.eq("slug", id)
    ).single();

    if (error) {
      console.error("Supabase error fetching team:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch team",
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Process matches to sort by date (descending)
    if (team.home_matches) {
      team.home_matches.sort(
        (a: unknown, b: unknown) =>
          new Date((b as { date: string }).date).getTime() -
          new Date((a as { date: string }).date).getTime()
      );
    }

    if (team.away_matches) {
      team.away_matches.sort(
        (a: unknown, b: unknown) =>
          new Date((b as { date: string }).date).getTime() -
          new Date((a as { date: string }).date).getTime()
      );
    }

    // For standing, if it's an array (one-to-many potentially), take the first one or filter by current season if possible
    // But here we assume one active standing or we might get an array if not careful.
    // The select('standing:standings(*)') might return an array if there are multiple standings (different seasons).
    // Ideally we should filter by current season, but we don't have that info easily here.
    // Let's assume the client handles it or we just return it as is.
    // Actually, 'standing' in the response type is a single object, but Supabase might return an array.
    // Let's check if standing is an array and take the latest one if so.

    if (Array.isArray(team.standing)) {
      // Sort by season descending (assuming season is a string like "2023/24")
      team.standing.sort((a: unknown, b: unknown) => {
        if (a && b && typeof a === "object" && typeof b === "object") {
          const seasonA = (a as { season: string }).season;
          const seasonB = (b as { season: string }).season;
          return seasonB.localeCompare(seasonA);
        }
        return 0;
      });
      team.standing = team.standing[0];
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error("Unexpected error fetching team:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch team",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
