// app/api/matches/[id]/events/route.ts
import { createClient } from "@/lib/supabase/server";
import { createMatchEventInputSchema } from "@/lib/schemas/matchEvent";
import { requireAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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
    
    const supabase = await createClient();
    
    // Fix: Explicitly specify which relationship to use for each player reference
    const { data, error } = await supabase
      .from("match_events")
      .select(`
        *,
        player:players!match_events_player_id_fkey(id, name_en, name_am, slug, jersey_number),
        team:teams(id, name_en, name_am, slug, logo_url),
        subbed_in_player:players!match_events_subbed_in_player_id_fkey(id, name_en, name_am, slug, jersey_number),
        subbed_out_player:players!match_events_subbed_out_player_id_fkey(id, name_en, name_am, slug, jersey_number)
      `)
      .eq("match_id", id)
      .order("minute", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Supabase error fetching match events:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch match events",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error fetching match events:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch match events",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(
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
    let user;
    try {
      user = await requireAdmin();
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

    // Add match_id to body
    body.match_id = id;

    let validatedData;
    try {
      validatedData = createMatchEventInputSchema.parse(body);
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

    // Fix: Remove created_by from insert as it doesn't exist in table
    const { data, error } = await supabase
      .from("match_events")
      .insert(validatedData)
      .select(`
        *,
        player:players!match_events_player_id_fkey(id, name_en, name_am, slug, jersey_number),
        team:teams(id, name_en, name_am, slug, logo_url),
        subbed_in_player:players!match_events_subbed_in_player_id_fkey(id, name_en, name_am, slug, jersey_number),
        subbed_out_player:players!match_events_subbed_out_player_id_fkey(id, name_en, name_am, slug, jersey_number)
      `)
      .single();

    if (error) {
      console.error("Supabase error creating match event:", error);
      return NextResponse.json(
        {
          error: "Failed to create match event",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Unexpected error creating match event:", error);
    return NextResponse.json(
      {
        error: "Failed to create match event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}