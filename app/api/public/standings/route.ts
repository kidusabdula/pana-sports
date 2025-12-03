// app/api/public/standings/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const leagueId = searchParams.get("league_id");
    const season = searchParams.get("season");

    const supabase = await createClient();

    let query = supabase
      .from("standings")
      .select(
        `
        *,
        team:teams(id, name_en, name_am, slug, logo_url),
        league:leagues(id, name_en, name_am, slug, category)
      `
      )
      .order("rank", { ascending: true });

    if (leagueId && leagueId !== "undefined") {
      query = query.eq("league_id", leagueId);
    }

    if (season && season !== "undefined") {
      query = query.eq("season", season);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error fetching standings:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch standings",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
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
