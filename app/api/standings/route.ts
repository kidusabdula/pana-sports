// app/api/standings/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get("league");
    const limit = searchParams.get("limit");

    const supabase = await createClient();

    // First, fetch standings data
    let standingsQuery = supabase.from("standings").select("*");

    // Apply league filter if provided
    if (league) {
      standingsQuery = standingsQuery.eq("league_slug", league);
    }

    // Apply limit if provided
    if (limit) {
      standingsQuery = standingsQuery.limit(parseInt(limit));
    }

    const { data: standingsData, error: standingsError } = await standingsQuery.order(
      "rank",
      { ascending: true }
    );

    if (standingsError) {
      console.error("Supabase error fetching standings:", standingsError);
      return NextResponse.json(
        {
          error: "Failed to fetch standings",
          details: standingsError.message,
        },
        { status: 500 }
      );
    }

    // Now fetch related data separately
    const teamSlugs = [
      ...new Set(standingsData.map((item) => item.team_slug).filter(Boolean)),
    ];
    const leagueSlugs = [
      ...new Set(standingsData.map((item) => item.league_slug).filter(Boolean)),
    ];

    // Fetch teams using slugs
    const { data: teams } = await supabase
      .from("teams")
      .select("*")
      .in("slug", teamSlugs);

    // Fetch leagues using slugs
    const { data: leagues } = await supabase
      .from("leagues")
      .select("id, name_en, name_am, slug")
      .in("slug", leagueSlugs);

    // Combine data with null safety checks
    const combinedData = standingsData.map((standing) => ({
      ...standing,
      team: teams?.find((t) => t.slug === standing.team_slug) ?? null,
      league: leagues?.find((l) => l.slug === standing.league_slug) ?? null,
    }));

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error("Unexpected error fetching standings:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch standings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}