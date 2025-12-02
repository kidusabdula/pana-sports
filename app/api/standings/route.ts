// app/api/standings/route.ts
import { createClient } from "@/lib/supabase/server";
import { createStandingInputSchema } from "@/lib/schemas/standing";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get("league_id");
    const season = searchParams.get("season");

    const supabase = await createClient();

    let query = supabase
      .from("standings")
      .select(`
        *,
        team:teams(id, name_en, name_am, slug, logo_url),
        league:leagues(id, name_en, name_am, slug, category)
      `)
      .order("rank", { ascending: true });

    // Apply filters if provided and not undefined
    if (leagueId && leagueId !== "undefined") {
      query = query.eq("league_id", leagueId);
    }
    if (season && season !== "undefined") {
      query = query.eq("season", season);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error fetching standings:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch standings",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error fetching standings:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch standings",
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
      validatedData = createStandingInputSchema.parse(body);
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

    // Create the standing with the current user as creator
    const { data, error } = await supabase
      .from("standings")
      .insert({
        ...validatedData,
        created_by: user.id,
      })
      .select(`
        *,
        team:teams(id, name_en, name_am, slug, logo_url),
        league:leagues(id, name_en, name_am, slug, category)
      `)
      .single();

    if (error) {
      console.error("Supabase error creating standing:", error);

      // Handle specific error codes
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: "Standing already exists for this team in this league and season",
            details: "Each team can only have one standing per league per season",
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
          error: "Failed to create standing",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Unexpected error creating standing:", error);
    return NextResponse.json(
      {
        error: "Failed to create standing",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}