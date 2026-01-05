// app/api/cms/seasons/[id]/set-current/route.ts
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id: seasonId } = await params;
    const supabase = await createClient();

    // 1. Unset existing current season
    const { error: unsetError } = await supabase
      .from("seasons")
      .update({ is_current: false })
      .eq("is_current", true);

    if (unsetError) {
      console.error("Error unsetting current season:", unsetError);
      return NextResponse.json(
        {
          error: "Failed to update existing current season",
          details: unsetError.message,
        },
        { status: 500 }
      );
    }

    // 2. Set new current season
    const { data: updatedSeason, error: setError } = await supabase
      .from("seasons")
      .update({
        is_current: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", seasonId)
      .select()
      .single();

    if (setError) {
      console.error("Error setting current season:", setError);
      return NextResponse.json(
        {
          error: "Failed to set new current season",
          details: setError.message,
        },
        { status: 500 }
      );
    }

    // 3. Optional: Update leagues current_season_id?
    // The migration added `current_season_id` to leagues.
    // It might be useful to update it too, but maybe that's a separate action or it should follow the global current season.
    // For now, let's keep it simple and just update the season itself.

    return NextResponse.json({
      success: true,
      season: updatedSeason,
    });
  } catch (error) {
    console.error("Error in set-current POST:", error);
    return NextResponse.json(
      {
        error: "Failed to set current season",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
