// app/api/public/leagues/[id]/matches/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const matchday = searchParams.get("matchday");
    
    if (!id) {
      return NextResponse.json(
        { error: "League ID is required" },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    let query = supabase
      .from("matches")
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, name_en, name_am, slug, logo_url),
        away_team:teams!matches_away_team_id_fkey(id, name_en, name_am, slug, logo_url),
        venue:venues(id, name_en, name_am, city, capacity)
      `)
      .eq("league_id", id)
      .order("date", { ascending: false });
    
    if (matchday && matchday !== "undefined") {
      query = query.eq("match_day", parseInt(matchday));
    }
    
    const { data, error } = await query.limit(limit);
    
    if (error) {
      console.error("Supabase error fetching league matches:", error);
      return NextResponse.json(
        { 
          error: "Failed to fetch league matches", 
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Unexpected error fetching league matches:", error);
    return NextResponse.json(
      { 
          error: "Failed to fetch league matches", 
          details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
      );
  }
}