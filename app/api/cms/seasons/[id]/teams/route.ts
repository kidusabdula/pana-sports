// app/api/cms/seasons/[id]/teams/route.ts
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const addTeamSchema = z.object({
  team_id: z.string().uuid(),
  league_id: z.string().uuid(),
  is_promoted: z.boolean().optional().default(false),
  is_relegated: z.boolean().optional().default(false),
  notes_en: z.string().optional(),
  notes_am: z.string().optional(),
});

const removeTeamSchema = z.object({
  team_id: z.string().uuid(),
  league_id: z.string().uuid(),
});

// GET teams for a season
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("season_teams")
      .select(
        `
        id,
        team_id,
        league_id,
        is_promoted,
        is_relegated,
        notes_en,
        notes_am,
        created_at,
        team:teams(id, name_en, name_am, slug, logo_url),
        league:leagues!season_teams_league_id_fkey(id, name_en, name_am, slug)
      `
      )
      .eq("season_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching season teams:", error);
      return NextResponse.json(
        { error: "Failed to fetch season teams", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in season teams GET:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch season teams",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST add team to season
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = await createClient();

    const body = await request.json();
    const validatedData = addTeamSchema.parse(body);

    const { data, error } = await supabase
      .from("season_teams")
      .insert({
        season_id: id,
        ...validatedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(
        `
        id,
        team_id,
        league_id,
        is_promoted,
        is_relegated,
        notes_en,
        notes_am,
        team:teams(id, name_en, name_am, slug, logo_url),
        league:leagues!season_teams_league_id_fkey(id, name_en, name_am, slug)
      `
      )
      .single();

    if (error) {
      // Handle unique constraint
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Team is already added to this season in this league" },
          { status: 409 }
        );
      }
      console.error("Error adding team to season:", error);
      return NextResponse.json(
        { error: "Failed to add team to season", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error in season teams POST:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to add team to season",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE remove team from season
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = await createClient();

    const body = await request.json();
    const { team_id, league_id } = removeTeamSchema.parse(body);

    // Check if team has matches in this season
    const { count: matchCount } = await supabase
      .from("matches")
      .select("*", { count: "exact", head: true })
      .eq("season_id", id)
      .or(`home_team_id.eq.${team_id},away_team_id.eq.${team_id}`);

    if (matchCount && matchCount > 0) {
      return NextResponse.json(
        {
          error: "Cannot remove team with matches",
          details: `This team has ${matchCount} matches in this season.`,
        },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("season_teams")
      .delete()
      .eq("season_id", id)
      .eq("team_id", team_id)
      .eq("league_id", league_id);

    if (error) {
      console.error("Error removing team from season:", error);
      return NextResponse.json(
        { error: "Failed to remove team from season", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, removed_team_id: team_id });
  } catch (error) {
    console.error("Error in season teams DELETE:", error);
    return NextResponse.json(
      {
        error: "Failed to remove team from season",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
