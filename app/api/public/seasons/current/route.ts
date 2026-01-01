import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("seasons")
      .select("*")
      .eq("is_current", true)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: "No current season found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching current season:", error);
    return NextResponse.json(
      { error: "Failed to fetch current season" },
      { status: 500 }
    );
  }
}
