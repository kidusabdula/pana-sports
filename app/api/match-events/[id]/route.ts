import { createClient } from "@/lib/supabase/server";
import { updateMatchEventInputSchema } from "@/lib/schemas/matchEvent";
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
        { error: "Match Event ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("match_events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error fetching match event:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch match event",
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Match Event not found" },
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Match Event ID is required" },
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

    const { data, error } = await supabase
      .from("match_events")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error updating match event:", error);

      return NextResponse.json(
        {
          error: "Failed to update match event",
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Match Event not found" },
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Match Event ID is required" },
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

    // Check if match event exists
    const { data: matchEvent, error: matchEventError } = await supabase
      .from("match_events")
      .select("id")
      .eq("id", id)
      .single();

    if (matchEventError) {
      console.error(
        "Supabase error checking match event existence:",
        matchEventError
      );
      return NextResponse.json(
        {
          error: "Failed to check match event existence",
          details: matchEventError.message,
        },
        { status: 500 }
      );
    }

    if (!matchEvent) {
      return NextResponse.json(
        { error: "Match Event not found" },
        { status: 404 }
      );
    }

    // Delete match event
    const { error: deleteError } = await supabase
      .from("match_events")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Supabase error deleting match event:", deleteError);
      return NextResponse.json(
        {
          error: "Failed to delete match event",
          details: deleteError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
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
