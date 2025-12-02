import { createClient } from "@/lib/supabase/server";
import { createTopScorerInputSchema } from "@/lib/schemas/topScorer";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get("league_id");
    const season = searchParams.get("season");

    const supabase = await createClient();

    let query = supabase
      .from("top_scorers")
      .select(`
        *,
        player:players(id, name_en, name_am, slug, jersey_number, photo_url),
        team:teams(id, name_en, name_am, slug, logo_url),
        league:leagues(id, name_en, name_am, slug, category)
      `)
      .order("goals", { ascending: false })
      .order("assists", { ascending: false });

    // Apply filters if provided and not undefined
    if (leagueId && leagueId !== "undefined") {
      query = query.eq("league_id", leagueId);
    }
    if (season && season !== "undefined") {
      query = query.eq("season", season);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error fetching top scorers:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch top scorers",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error fetching top scorers:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch top scorers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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

    let validatedData;
    try {
      validatedData = createTopScorerInputSchema.parse(body);
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

    // Create top scorer with current user as creator
    const { data, error } = await supabase
      .from("top_scorers")
      .insert({
        ...validatedData,
        created_by: user.id,
      })
      .select(`
        *,
        player:players(id, name_en, name_am, slug, jersey_number, photo_url),
        team:teams(id, name_en, name_am, slug, logo_url),
        league:leagues(id, name_en, name_am, slug, category)
      `)
      .single();

    if (error) {
      console.error("Supabase error creating top scorer:", error);

      // Handle specific error codes
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: "Top scorer already exists for this player in this league and season",
            details: "Each player can only have one top scorer entry per league per season",
          },
          { status: 409 }
        );
      }

      if (error.code === "23502") {
        return NextResponse.json(
          {
            error: "Required field is missing",
            details: error.details || "Please check all required fields",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: "Failed to create top scorer",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Unexpected error creating top scorer:", error);
    return NextResponse.json(
      {
        error: "Failed to create top scorer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}