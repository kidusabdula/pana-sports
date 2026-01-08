import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cupEditionUpdateSchema } from "@/lib/schemas/cup";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("cup_editions")
      .select(
        `
        *,
        cup:cups(*),
        season:seasons(id, name, slug),
        winner:teams!cup_editions_winner_fkey(id, name_en, name_am, logo_url, slug),
        runner_up:teams!cup_editions_runner_up_fkey(id, name_en, name_am, logo_url, slug)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { error: "Cup edition not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching cup edition:", error);
    return NextResponse.json(
      { error: "Failed to fetch cup edition" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    const validated = cupEditionUpdateSchema.parse(body);

    const { data, error } = await supabase
      .from("cup_editions")
      .update({ ...validated, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating cup edition:", error);
    return NextResponse.json(
      { error: "Failed to update cup edition" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { error } = await supabase.from("cup_editions").delete().eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting cup edition:", error);
    return NextResponse.json(
      { error: "Failed to delete cup edition" },
      { status: 500 }
    );
  }
}
