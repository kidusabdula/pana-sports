// app/api/public/leagues/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("leagues")
      .select("*")
      .eq("is_active", true)
      .order("name_en");

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