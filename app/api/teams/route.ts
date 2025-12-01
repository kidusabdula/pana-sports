import { createClient } from "@/lib/supabase/server";
import { createTeamInputSchema } from "@/lib/schemas/team";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching teams:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch teams",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error fetching teams:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch teams",
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
      validatedData = createTeamInputSchema.parse(body);
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

    // Create the team with the current user as creator
    const { data, error } = await supabase
      .from("teams")
      .insert({
        ...validatedData,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating team:", error);

      // Handle specific error codes
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: "Team with this slug already exists",
            details: "The slug must be unique across all teams",
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
          error: "Failed to create team",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Unexpected error creating team:", error);
    return NextResponse.json(
      {
        error: "Failed to create team",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
