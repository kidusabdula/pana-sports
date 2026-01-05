// app/api/public/players/[id]/route.ts
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
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch the player with related data
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id
      );

    const playerQuery = supabase.from("players").select(
      `
        *,
        team:teams(id, name_en, name_am, slug, logo_url)
      `
    );

    const { data: player, error: playerError } = await (isUUID
      ? playerQuery.eq("id", id)
      : playerQuery.eq("slug", id)
    ).single();

    if (playerError) {
      console.error("Supabase error fetching player:", playerError);
      return NextResponse.json(
        {
          error: "Failed to fetch player",
          details: playerError.message,
        },
        { status: 500 }
      );
    }

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Fetch player's top scorer stats
    const { data: topScorerStats, error: statsError } = await supabase
      .from("top_scorers")
      .select(
        `
        *,
        league:leagues(id, name_en, name_am, slug, category, logo_url),
        team:teams(id, name_en, name_am, slug, logo_url)
      `
      )
      .eq("player_id", player.id)
      .order("season", { ascending: false })
      .limit(5);

    if (statsError) {
      console.error("Supabase error fetching player stats:", statsError);
      return NextResponse.json(
        {
          error: "Failed to fetch player stats",
          details: statsError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      player,
      topScorerStats,
    });
  } catch (error) {
    console.error("Unexpected error fetching player details:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch player details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
