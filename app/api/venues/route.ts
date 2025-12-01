import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("venues")
      .select("*")
      .order("name_en", { ascending: true });

    if (error) {
      console.error("Supabase error fetching venues:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch venues",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error fetching venues:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch venues",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}