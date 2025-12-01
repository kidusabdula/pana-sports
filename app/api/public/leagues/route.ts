import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const active = searchParams.get("active") === "true";
    const limit = searchParams.get("limit");

    const supabase = await createClient();

    let query = supabase
      .from("leagues")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (active) {
      query = query.eq("is_active", true);
    }

    // Apply limit
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error fetching leagues:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch leagues",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error fetching leagues:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch leagues",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
