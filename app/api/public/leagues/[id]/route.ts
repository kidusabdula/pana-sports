// app/api/public/leagues/[id]/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: "League ID is required" },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    // Fetch league with related data
    const { data: league, error } = await supabase
      .from("leagues")
      .select(`
        *,
        teams:teams(id, name_en, name_am, slug, logo_url),
        standings:standings(id, team_id, season, played, won, draw, lost, goals_for, goals_against, gd, points, rank),
        matches:matches(id, home_team_id, away_team_id, date, status, score_home, score_away, venue_id)
      `)
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Supabase error fetching league:", error);
      return NextResponse.json(
        { 
          error: "Failed to fetch league", 
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    if (!league) {
      return NextResponse.json(
        { error: "League not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(league);
  } catch (error) {
    console.error("Unexpected error fetching league:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch league", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
      );
  }
}