import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: groups, error: groupsError } = await supabase
      .from("cup_groups")
      .select(
        `
        *,
        teams:cup_group_teams(
          *,
          team:teams(id, name_en, name_am, logo_url, slug)
        )
      `
      )
      .eq("cup_edition_id", id)
      .order("name");

    if (groupsError) throw groupsError;

    // Sort teams within each group by rank/points
    const sortedData = groups?.map((group) => ({
      ...group,
      teams: group.teams?.sort(
        (a: any, b: any) => b.points - a.points || b.gd - a.gd
      ),
    }));

    return NextResponse.json(sortedData);
  } catch (error) {
    console.error("Error fetching cup groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch cup groups" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("cup_groups")
      .insert({ cup_edition_id: id, name: body.name })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating cup group:", error);
    return NextResponse.json(
      { error: "Failed to create cup group" },
      { status: 500 }
    );
  }
}
