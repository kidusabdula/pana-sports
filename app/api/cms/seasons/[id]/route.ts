// app/api/cms/seasons/[id]/route.ts
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { seasonUpdateSchema } from "@/lib/schemas/season";

// GET single season with relations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = await createClient();

    const { data: season, error } = await supabase
      .from("seasons")
      .select(
        `
        *,
        season_teams(
          id,
          team_id,
          league_id,
          is_promoted,
          is_relegated,
          notes_en,
          notes_am,
          team:teams(id, name_en, name_am, slug, logo_url),
          league:leagues!season_teams_league_id_fkey(id, name_en, name_am, slug)
        ),
        season_players(
          id,
          player_id,
          team_id,
          jersey_number,
          is_captain,
          joined_date,
          left_date,
          player:players(id, name_en, name_am, slug, photo_url, position_en),
          team:teams(id, name_en, name_am, slug)
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Season not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching season:", error);
      return NextResponse.json(
        { error: "Failed to fetch season", details: error.message },
        { status: 500 }
      );
    }

    // Get match count for this season
    const { count: matchCount } = await supabase
      .from("matches")
      .select("*", { count: "exact", head: true })
      .eq("season_id", id);

    return NextResponse.json({
      ...season,
      match_count: matchCount ?? 0,
    });
  } catch (error) {
    console.error("Error in season GET:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch season",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PATCH update season
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = await createClient();

    const body = await request.json();
    const validatedData = seasonUpdateSchema.parse(body);

    // If setting as current, first unset any existing current season
    if (validatedData.is_current === true) {
      await supabase
        .from("seasons")
        .update({ is_current: false })
        .eq("is_current", true)
        .neq("id", id);
    }

    const { data, error } = await supabase
      .from("seasons")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Season not found" },
          { status: 404 }
        );
      }
      console.error("Error updating season:", error);
      return NextResponse.json(
        { error: "Failed to update season", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in season PATCH:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update season",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE season
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = await createClient();

    // Check if season has matches
    const { count: matchCount } = await supabase
      .from("matches")
      .select("*", { count: "exact", head: true })
      .eq("season_id", id);

    if (matchCount && matchCount > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete season with matches",
          details: `This season has ${matchCount} matches. Remove all matches first.`,
        },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("seasons").delete().eq("id", id);

    if (error) {
      console.error("Error deleting season:", error);
      return NextResponse.json(
        { error: "Failed to delete season", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, deleted_id: id });
  } catch (error) {
    console.error("Error in season DELETE:", error);
    return NextResponse.json(
      {
        error: "Failed to delete season",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
