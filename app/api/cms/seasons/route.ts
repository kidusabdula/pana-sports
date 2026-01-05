// app/api/cms/seasons/route.ts
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { seasonCreateSchema } from "@/lib/schemas/season";

// GET all seasons with stats
export async function GET() {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const { data: seasons, error } = await supabase
      .from("seasons")
      .select(
        `
        *,
        season_teams:season_teams(count),
        matches:matches(count)
      `
      )
      .order("start_date", { ascending: false });

    if (error) {
      console.error("Error fetching seasons:", error);
      return NextResponse.json(
        { error: "Failed to fetch seasons", details: error.message },
        { status: 500 }
      );
    }

    // Transform the data to include counts
    const transformedSeasons = seasons?.map((season) => ({
      ...season,
      team_count:
        (season.season_teams as { count: number }[] | null)?.[0]?.count ?? 0,
      match_count:
        (season.matches as { count: number }[] | null)?.[0]?.count ?? 0,
      season_teams: undefined,
      matches: undefined,
    }));

    return NextResponse.json(transformedSeasons);
  } catch (error) {
    console.error("Error in seasons GET:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch seasons",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST create new season
export async function POST(request: Request) {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const body = await request.json();
    const validatedData = seasonCreateSchema.parse(body);

    // If setting as current, first unset any existing current season
    if (validatedData.is_current) {
      await supabase
        .from("seasons")
        .update({ is_current: false })
        .eq("is_current", true);
    }

    const { data, error } = await supabase
      .from("seasons")
      .insert({
        ...validatedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating season:", error);

      // Handle unique constraint violation
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A season with this slug already exists" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Failed to create season", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error in seasons POST:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create season",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
