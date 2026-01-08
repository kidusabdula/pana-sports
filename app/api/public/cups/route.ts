import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("cups")
      .select(
        `
        *,
        current_holder:teams!cups_current_holder_fkey(
          id, name_en, name_am, logo_url, slug
        )
      `
      )
      .eq("is_active", true)
      .order("name_en");

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching cups:", error);
    return NextResponse.json(
      { error: "Failed to fetch cups" },
      { status: 500 }
    );
  }
}
