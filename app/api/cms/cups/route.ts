import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cupCreateSchema } from "@/lib/schemas/cup";

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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const validated = cupCreateSchema.parse(body);

    const { data, error } = await supabase
      .from("cups")
      .insert(validated)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating cup:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create cup" },
      { status: 500 }
    );
  }
}
