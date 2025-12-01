import { createClient } from "@/lib/supabase/server";
import { createMatchLineupInputSchema } from "@/lib/schemas/matchLineup";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
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
    
    const { data, error } = await supabase
      .from("match_lineups")
      .select(`
        *,
        player:players(id, name_en, name_am, slug, jersey_number, position_en, position_am),
        team:teams(id, name_en, name_am, slug, logo_url)
      `)
      .eq("match_id", id)
      .order("is_starting", { ascending: false })
      .order("team_id", { ascending: true })
      .order("jersey_number", { ascending: true });

    if (error) {
      console.error("Supabase error fetching match lineups:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch match lineups",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error fetching match lineups:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch match lineups",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
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

    // Handle bulk lineup creation
    const { lineups } = body;
    
    if (!Array.isArray(lineups)) {
      return NextResponse.json(
        { error: "Lineups must be an array" },
        { status: 400 }
      );
    }

    // Add match_id to each lineup item
    const processedLineups = lineups.map(lineup => ({
      ...lineup,
      match_id: id,
    }));

    const supabase = await createClient();

    // Create the lineups
    const { data, error } = await supabase
      .from("match_lineups")
      .insert(processedLineups)
      .select(`
        *,
        player:players(id, name_en, name_am, slug, jersey_number, position_en, position_am),
        team:teams(id, name_en, name_am, slug, logo_url)
      `);

    if (error) {
      console.error("Supabase error creating match lineups:", error);
      return NextResponse.json(
        {
          error: "Failed to create match lineups",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Unexpected error creating match lineups:", error);
    return NextResponse.json(
      {
        error: "Failed to create match lineups",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
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

    const supabase = await createClient();

    // Delete all lineups for this match
    const { error } = await supabase
      .from("match_lineups")
      .delete()
      .eq("match_id", id);

    if (error) {
      console.error("Supabase error deleting match lineups:", error);
      return NextResponse.json(
        {
          error: "Failed to delete match lineups",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error deleting match lineups:", error);
    return NextResponse.json(
      {
        error: "Failed to delete match lineups",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}