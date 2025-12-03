// app/api/public/leagues/[id]/standings/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const season = searchParams.get("season");
    
    if (!id) {
      return NextResponse.json(
        { error: "League ID is required" },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    let query = supabase
      .from("standings")
      .select(`
        *,
        team:teams(id, name_en, name_am, slug, logo_url)
      `)
      .eq("league_id", id)
      .order("rank", { ascending: true });
    
    if (season && season !== "undefined") {
      query = query.eq("season", season);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Supabase error fetching league standings:", error);
      return NextResponse.json(
        { 
          error: "Failed to fetch league standings", 
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Unexpected error fetching league standings:", error);
    return NextResponse.json(
      { 
          error: "Failed to fetch league standings", 
          details: error instanceof Error ? error.message : "Unknown error" 
      },
        { status: 500 }
      );
  }
}