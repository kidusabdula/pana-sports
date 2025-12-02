// app/api/news/route.ts
import { createClient } from "@/lib/supabase/server";
import { createNewsInputSchema } from "@/lib/schemas/news";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const league = searchParams.get("league");
    const featured = searchParams.get("featured");
    const published = searchParams.get("published");

    const supabase = await createClient();

    let query = supabase
      .from("news")
      .select(`
        *,
        category:news_categories(id, name, name_en, name_am, slug, color, icon),
        author:authors(id, name, email, avatar_url),
        league:leagues(id, name_en, name_am, slug, category),
        match:matches(id, home_team_id, away_team_id, date, status, score_home, score_away)
      `)
      .order("published_at", { ascending: false });

    // Apply filters if provided
    if (category && category !== "undefined") {
      query = query.eq("category_id", category);
    }
    if (league && league !== "undefined") {
      query = query.eq("league_id", league);
    }
    if (featured && featured !== "undefined") {
      query = query.eq("is_featured", featured === "true");
    }
    if (published && published !== "undefined") {
      query = query.eq("is_published", published === "true");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error fetching news:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch news",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error fetching news:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch news",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    let user;
    try {
      user = await requireAdmin();
    } catch (authError) {
      console.error("Authentication error:", authError);
      return NextResponse.json(
        {
          error: "Authentication failed",
          details:
            authError instanceof Error
              ? authError.message
              : "Unknown auth error",
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
          details:
            parseError instanceof Error
              ? parseError.message
              : "Unknown parsing error",
        },
        { status: 400 }
      );
    }

    let validatedData;
    try {
      validatedData = createNewsInputSchema.parse(body);
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return NextResponse.json(
        {
          error: "Invalid input data",
          details:
            validationError instanceof Error
              ? validationError.message
              : "Unknown validation error",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Generate slug from title if not provided
    if (!validatedData.slug) {
      const slug = validatedData.title_en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      
      // Check if slug already exists
      const { data: existingNews } = await supabase
        .from("news")
        .select("id")
        .eq("slug", slug)
        .single();
      
      if (existingNews) {
        // Add random suffix if slug already exists
        validatedData.slug = `${slug}-${Date.now()}`;
      } else {
        validatedData.slug = slug;
      }
    }

    // Create the news with the current user as creator
    const { data, error } = await supabase
      .from("news")
      .insert({
        ...validatedData,
        created_by: user.id,
      })
      .select(`
        *,
        category:news_categories(id, name, name_en, name_am, slug, color, icon),
        author:authors(id, name, email, avatar_url),
        league:leagues(id, name_en, name_am, slug, category),
        match:matches(id, home_team_id, away_team_id, date, status, score_home, score_away)
      `)
      .single();

    if (error) {
      console.error("Supabase error creating news:", error);

      // Handle specific error codes
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: "News with this slug already exists",
            details: "The slug must be unique across all news articles",
          },
          { status: 409 }
        );
      }

      if (error.code === "23502") {
        return NextResponse.json(
          {
            error: "Required field is missing",
            details: error.details || "Please check all required fields",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: "Failed to create news",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Unexpected error creating news:", error);
    return NextResponse.json(
      {
        error: "Failed to create news",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}