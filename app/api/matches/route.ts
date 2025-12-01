import { createClient } from "@/lib/supabase/server";
import { createMatchInputSchema } from "@/lib/schemas/match";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("matches")
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, name_en, name_am, slug, logo_url),
        away_team:teams!matches_away_team_id_fkey(id, name_en, name_am, slug, logo_url),
        league:leagues(id, name_en, name_am, slug, category),
        venue:venues(id, name_en, name_am, city, capacity)
      `)
      .order("date", { ascending: false });

    if (error) {
      console.error("Supabase error fetching matches:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch matches",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error fetching matches:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch matches",
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
      validatedData = createMatchInputSchema.parse(body);
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

    // Create the match with the current user as creator
    const { data, error } = await supabase
      .from("matches")
      .insert({
        ...validatedData,
        created_by: user.id,
      })
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, name_en, name_am, slug, logo_url),
        away_team:teams!matches_away_team_id_fkey(id, name_en, name_am, slug, logo_url),
        league:leagues(id, name_en, name_am, slug, category),
        venue:venues(id, name_en, name_am, city, capacity)
      `)
      .single();

    if (error) {
      console.error("Supabase error creating match:", error);

      // Handle specific error codes
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: "Match with these teams already exists at this time",
            details: "This match may already be scheduled",
          },
          { status: 409 }
        );
      }

      if (error.code === "23514") {
        return NextResponse.json(
          {
            error: "Invalid match configuration",
            details: "Home and away teams must be different",
          },
          { status: 400 }
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
          error: "Failed to create match",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Unexpected error creating match:", error);
    return NextResponse.json(
      {
        error: "Failed to create match",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}