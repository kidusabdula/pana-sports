// app/api/match-events/[eventId]/route.ts
import { createClient } from "@/lib/supabase/server";
import { updateMatchEventInputSchema } from "@/lib/schemas/matchEvent";
import { requireAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// GET single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("match_events")
      .select(
        `
        *,
        player:players!match_events_player_id_fkey(id, name_en, name_am, slug, jersey_number),
        team:teams(id, name_en, name_am, slug, logo_url),
        subbed_in_player:players!match_events_subbed_in_player_id_fkey(id, name_en, name_am, slug, jersey_number),
        subbed_out_player:players!match_events_subbed_out_player_id_fkey(id, name_en, name_am, slug, jersey_number)
      `
      )
      .eq("id", eventId)
      .single();

    if (error) {
      console.error("Supabase error fetching match event:", error);
      return NextResponse.json(
        { error: "Failed to fetch match event", details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Match event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error fetching match event:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch match event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// UPDATE event
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
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

    // Validate the update data
    let validatedData;
    try {
      validatedData = updateMatchEventInputSchema.parse(body);
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return NextResponse.json(
        {
          error: "Invalid input data",
          details:
            validationError instanceof Error
              ? validationError.message
              : "Unknown validation error",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Build update object with only defined values and add updated_at
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // Only add fields that are explicitly provided
    if (validatedData.player_id !== undefined)
      updateData.player_id = validatedData.player_id;
    if (validatedData.team_id !== undefined)
      updateData.team_id = validatedData.team_id;
    if (validatedData.minute !== undefined)
      updateData.minute = validatedData.minute;
    if (validatedData.type !== undefined) updateData.type = validatedData.type;
    if (validatedData.description_en !== undefined)
      updateData.description_en = validatedData.description_en;
    if (validatedData.description_am !== undefined)
      updateData.description_am = validatedData.description_am;
    if (validatedData.subbed_in_player_id !== undefined)
      updateData.subbed_in_player_id = validatedData.subbed_in_player_id;
    if (validatedData.subbed_out_player_id !== undefined)
      updateData.subbed_out_player_id = validatedData.subbed_out_player_id;
    if (validatedData.is_assist !== undefined)
      updateData.is_assist = validatedData.is_assist;
    if (validatedData.confirmed !== undefined)
      updateData.confirmed = validatedData.confirmed;

    const { data, error } = await supabase
      .from("match_events")
      .update(updateData)
      .eq("id", eventId)
      .select(
        `
        *,
        player:players!match_events_player_id_fkey(id, name_en, name_am, slug, jersey_number),
        team:teams(id, name_en, name_am, slug, logo_url),
        subbed_in_player:players!match_events_subbed_in_player_id_fkey(id, name_en, name_am, slug, jersey_number),
        subbed_out_player:players!match_events_subbed_out_player_id_fkey(id, name_en, name_am, slug, jersey_number)
      `
      )
      .single();

    if (error) {
      console.error("Supabase error updating match event:", error);
      return NextResponse.json(
        { error: "Failed to update match event", details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Match event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error updating match event:", error);
    return NextResponse.json(
      {
        error: "Failed to update match event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
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

    const supabase = await createClient();

    // First get the event to return its match_id for cache invalidation
    const { data: event, error: fetchError } = await supabase
      .from("match_events")
      .select("id, match_id, type")
      .eq("id", eventId)
      .single();

    if (fetchError || !event) {
      console.error("Error fetching event before delete:", fetchError);
      return NextResponse.json(
        { error: "Match event not found" },
        { status: 404 }
      );
    }

    // Delete the event
    const { error } = await supabase
      .from("match_events")
      .delete()
      .eq("id", eventId);

    if (error) {
      console.error("Supabase error deleting match event:", error);
      return NextResponse.json(
        { error: "Failed to delete match event", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      deleted_event_id: eventId,
      match_id: event.match_id,
      event_type: event.type,
    });
  } catch (error) {
    console.error("Unexpected error deleting match event:", error);
    return NextResponse.json(
      {
        error: "Failed to delete match event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
