// app/api/cms/seasons/[id]/players/route.ts
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const addPlayerSchema = z.object({
  player_id: z.string().uuid(),
  team_id: z.string().uuid(),
  jersey_number: z.number().int().optional(),
  is_captain: z.boolean().optional().default(false),
  joined_date: z.string().optional(),
});

const removePlayerSchema = z.object({
  player_id: z.string().uuid(),
  team_id: z.string().uuid(),
});

// GET players for a season
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id: seasonId } = await params;
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");

    const supabase = await createClient();

    let query = supabase
      .from("season_players")
      .select(
        `
        id,
        player_id,
        team_id,
        jersey_number,
        is_captain,
        joined_date,
        left_date,
        created_at,
        player:players(id, name_en, name_am, slug, photo_url, position_en),
        team:teams(id, name_en, name_am, slug)
      `
      )
      .eq("season_id", seasonId);

    if (teamId) {
      query = query.eq("team_id", teamId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: true,
    });

    if (error) {
      console.error("Error fetching season players:", error);
      return NextResponse.json(
        { error: "Failed to fetch season players", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in season players GET:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch season players",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST add player to season
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id: seasonId } = await params;
    const supabase = await createClient();

    const body = await request.json();
    const validatedData = addPlayerSchema.parse(body);

    const { data, error } = await supabase
      .from("season_players")
      .insert({
        season_id: seasonId,
        ...validatedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(
        `
        id,
        player_id,
        team_id,
        jersey_number,
        is_captain,
        joined_date,
        left_date,
        player:players(id, name_en, name_am, slug, photo_url, position_en),
        team:teams(id, name_en, name_am, slug)
      `
      )
      .single();

    if (error) {
      // Handle unique constraint (season_id, player_id, team_id)
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: "Player is already registered to this team for this season",
          },
          { status: 409 }
        );
      }
      console.error("Error adding player to season:", error);
      return NextResponse.json(
        { error: "Failed to add player to season", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error in season players POST:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to add player to season",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE remove player from season
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id: seasonId } = await params;
    const supabase = await createClient();

    const body = await request.json();
    const { player_id, team_id } = removePlayerSchema.parse(body);

    // Check if player has match events in this season for this team?
    // This is more complex because events are linked to matches which are linked to seasons.
    // For now, let's just delete the registration.

    const { error } = await supabase
      .from("season_players")
      .delete()
      .eq("season_id", seasonId)
      .eq("player_id", player_id)
      .eq("team_id", team_id);

    if (error) {
      console.error("Error removing player from season:", error);
      return NextResponse.json(
        {
          error: "Failed to remove player from season",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, removed_player_id: player_id });
  } catch (error) {
    console.error("Error in season players DELETE:", error);
    return NextResponse.json(
      {
        error: "Failed to remove player from season",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
