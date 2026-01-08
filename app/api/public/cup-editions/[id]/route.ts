import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch edition with full details
    const { data: edition, error: editionError } = await supabase
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

    if (editionError) {
      if (editionError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Edition not found" },
          { status: 404 }
        );
      }
      throw editionError;
    }

    // Fetch groups with teams if edition has group stage
    let groups = null;
    if (edition.has_group_stage) {
      const { data: groupsData } = await supabase
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

      // Sort teams by points/gd within each group
      groups = groupsData?.map((group) => ({
        ...group,
        teams: group.teams?.sort(
          (a: any, b: any) => b.points - a.points || b.gd - a.gd
        ),
      }));
    }

    return NextResponse.json({
      ...edition,
      groups: groups || [],
    });
  } catch (error) {
    console.error("Error fetching cup edition:", error);
    return NextResponse.json(
      { error: "Failed to fetch cup edition" },
      { status: 500 }
    );
  }
}
