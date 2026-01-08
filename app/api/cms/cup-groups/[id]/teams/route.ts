import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("cup_group_teams")
      .insert({ cup_group_id: id, team_id: body.team_id })
      .select(
        `
        *,
        team:teams(id, name_en, name_am, logo_url, slug)
      `
      )
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error adding team to group:", error);
    return NextResponse.json(
      { error: "Failed to add team to group" },
      { status: 500 }
    );
  }
}
