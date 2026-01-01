// app/api/matches/[id]/control/route.ts
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Match ID is required" },
        { status: 400 }
      );
    }

    // Verify admin authentication
    try {
      await requireAdmin();
    } catch (authError) {
      console.error("Authentication error:", authError);
      return NextResponse.json(
        {
          error: "Authentication failed",
          details:
            authError instanceof Error
              ? authError.message
              : "Unknown auth error",
        },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          details:
            parseError instanceof Error
              ? parseError.message
              : "Unknown parsing error",
        },
        { status: 400 }
      );
    }

    // Extract all valid match control fields
    const {
      status,
      score_home,
      score_away,
      minute,
      // v2.0: Time persistence fields
      match_started_at,
      second_half_started_at,
      extra_time_started_at,
      paused_at,
      total_paused_seconds,
      // v2.0: Penalty shootout scores
      penalty_score_home,
      penalty_score_away,
    } = body;

    // Build the update object with only defined fields
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (status !== undefined) updateData.status = status;
    if (score_home !== undefined) updateData.score_home = score_home;
    if (score_away !== undefined) updateData.score_away = score_away;
    if (minute !== undefined) updateData.minute = minute;

    // v2.0: Time persistence fields
    if (match_started_at !== undefined)
      updateData.match_started_at = match_started_at;
    if (second_half_started_at !== undefined)
      updateData.second_half_started_at = second_half_started_at;
    if (extra_time_started_at !== undefined)
      updateData.extra_time_started_at = extra_time_started_at;
    if (paused_at !== undefined) updateData.paused_at = paused_at;
    if (total_paused_seconds !== undefined)
      updateData.total_paused_seconds = total_paused_seconds;

    // v2.0: Penalty shootout scores
    if (penalty_score_home !== undefined)
      updateData.penalty_score_home = penalty_score_home;
    if (penalty_score_away !== undefined)
      updateData.penalty_score_away = penalty_score_away;

    const supabase = await createClient();

    // Update match with new control data
    const { data, error } = await supabase
      .from("matches")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        *,
        home_team:teams!matches_home_team_id_fkey(id, name_en, name_am, slug, logo_url),
        away_team:teams!matches_away_team_id_fkey(id, name_en, name_am, slug, logo_url),
        league:leagues(id, name_en, name_am, slug, category),
        venue:venues(id, name_en, name_am, city, capacity)
      `
      )
      .single();

    if (error) {
      console.error("Supabase error updating match control:", error);
      return NextResponse.json(
        {
          error: "Failed to update match control",
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error updating match control:", error);
    return NextResponse.json(
      {
        error: "Failed to update match control",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
