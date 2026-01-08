import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; teamId: string }> }
) {
  try {
    const { id, teamId } = await params;
    const supabase = await createClient();

    const { error } = await supabase
      .from("cup_group_teams")
      .delete()
      .eq("cup_group_id", id)
      .eq("team_id", teamId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing team from group:", error);
    return NextResponse.json(
      { error: "Failed to remove team from group" },
      { status: 500 }
    );
  }
}
