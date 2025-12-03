// app/api/public/leagues/[id]/teams/route.ts
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
    
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("league_id", id)
      .order("name_en", { ascending: true });
    
    if (error) {
      console.error("Supabase error fetching league teams:", error);
      return NextResponse.json(
        { 
          error: "Failed to fetch league teams", 
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Unexpected error fetching league teams:", error);
    return NextResponse.json(
      { 
          error: "Failed to fetch league teams", 
          details: error instanceof Error ? error.message : "Unknown error" 
      },
        { status: 500 }
      );
  }
}