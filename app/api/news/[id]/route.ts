// app/api/news/[id]/route.ts
import { createClient } from "@/lib/supabase/server";
import { updateNewsInputSchema } from "@/lib/schemas/news";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: "News ID is required" },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("news")
      .select(`
        *,
        category:news_categories(id, name, name_en, name_am, slug, color, icon),
        author:authors(id, name, email, avatar_url),
        league:leagues(id, name_en, name_am, slug, category),
        match:matches(id, home_team_id, away_team_id, date, status, score_home, score_away)
      `)
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Supabase error fetching news:", error);
      return NextResponse.json(
        { 
          error: "Failed to fetch news", 
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error fetching news:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch news", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: "News ID is required" },
        { status: 400 }
      );
    }
    
    // Verify admin authentication
    let user;
    try {
      user = await requireAdmin();
    } catch (authError) {
      console.error("Authentication error:", authError);
      return NextResponse.json(
        { 
          error: "Authentication failed", 
          details: authError instanceof Error ? authError.message : "Unknown auth error" 
        },
        { status: 401 }
      );
    }
    
    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return NextResponse.json(
        { 
          error: "Invalid JSON in request body", 
          details: parseError instanceof Error ? parseError.message : "Unknown parsing error" 
        },
        { status: 400 }
      );
    }
    
    let validatedData;
    try {
      validatedData = updateNewsInputSchema.parse(body);
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return NextResponse.json(
        { 
          error: "Invalid input data", 
          details: validationError instanceof Error ? validationError.message : "Unknown validation error" 
        },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    // Generate slug from title if title is being updated and slug is not provided
    if (validatedData.title_en && !validatedData.slug) {
      const slug = validatedData.title_en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      
      // Check if slug already exists (excluding current article)
      const { data: existingNews } = await supabase
        .from("news")
        .select("id")
        .eq("slug", slug)
        .neq("id", id)
        .single();
      
      if (existingNews) {
        // Add random suffix if slug already exists
        validatedData.slug = `${slug}-${Date.now()}`;
      } else {
        validatedData.slug = slug;
      }
    }
    
    const { data, error } = await supabase
      .from("news")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(`
        *,
        category:news_categories(id, name, name_en, name_am, slug, color, icon),
        author:authors(id, name, email, avatar_url),
        league:leagues(id, name_en, name_am, slug, category),
        match:matches(id, home_team_id, away_team_id, date, status, score_home, score_away)
      `)
      .single();
    
    if (error) {
      console.error("Supabase error updating news:", error);
      
      // Handle specific error codes
      if (error.code === "23505") {
        return NextResponse.json(
          { 
            error: "News with this slug already exists", 
            details: "The slug must be unique across all news articles" 
          },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { 
          error: "Failed to update news", 
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error updating news:", error);
    return NextResponse.json(
      { 
        error: "Failed to update news", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: "News ID is required" },
        { status: 400 }
      );
    }
    
    // Verify admin authentication
    let user;
    try {
      user = await requireAdmin();
    } catch (authError) {
      console.error("Authentication error:", authError);
      return NextResponse.json(
        { 
          error: "Authentication failed", 
          details: authError instanceof Error ? authError.message : "Unknown auth error" 
        },
        { status: 401 }
      );
    }
    
    const supabase = await createClient();
    
    // Check if news exists
    const { data: news, error: newsError } = await supabase
      .from("news")
      .select("id")
      .eq("id", id)
      .single();
    
    if (newsError) {
      console.error("Supabase error checking news existence:", newsError);
      return NextResponse.json(
        { 
          error: "Failed to check news existence", 
          details: newsError.message 
        },
        { status: 500 }
      );
    }
    
    if (!news) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }
    
    // Delete the news
    const { error: deleteError } = await supabase
      .from("news")
      .delete()
      .eq("id", id);
    
    if (deleteError) {
      console.error("Supabase error deleting news:", deleteError);
      return NextResponse.json(
        { 
          error: "Failed to delete news", 
          details: deleteError.message 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error deleting news:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete news", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}