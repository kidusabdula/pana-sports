import { createClient } from "@/lib/supabase/server";
import { createNewsInputSchema } from "@/lib/schemas/news";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const category = searchParams.get("category");

    const supabase = await createClient();

    // First, fetch the news data
    let newsQuery = supabase.from("news").select("*");

    // Apply category filter if provided
    if (category && category !== "All") {
      // Using category_slug instead of category_id
      newsQuery = newsQuery.eq("category_slug", category);
    }

    // Apply limit if provided
    if (limit) {
      newsQuery = newsQuery.limit(parseInt(limit));
    }

    const { data: newsData, error: newsError } = await newsQuery.order(
      "published_at",
      { ascending: false }
    );

    if (newsError) {
      console.error("Supabase error fetching news:", newsError);
      return NextResponse.json(
        {
          error: "Failed to fetch news",
          details: newsError.message,
        },
        { status: 500 }
      );
    }

    // Now fetch related data separately
    const categorySlugs = [
      ...new Set(newsData.map((item) => item.category_slug).filter(Boolean)),
    ];
    const leagueSlugs = [
      ...new Set(newsData.map((item) => item.league_slug).filter(Boolean)),
    ];
    const authorIds = [
      ...new Set(newsData.map((item) => item.author_id).filter(Boolean)),
    ];

    // Fetch categories using slugs
    const { data: categories } = await supabase
      .from("news_categories")
      .select("*")
      .in("slug", categorySlugs);

    // Fetch leagues using slugs
    const { data: leagues } = await supabase
      .from("leagues")
      .select("id, name_en, name_am, slug")
      .in("slug", leagueSlugs);

    // Fetch authors using IDs
    const { data: authors } = await supabase
      .from("authors")
      .select("*")
      .in("id", authorIds);

    // Combine the data with null safety checks
    const combinedData = newsData.map((news) => ({
      ...news,
      category: categories?.find((c) => c.slug === news.category_slug) ?? null,
      league: leagues?.find((l) => l.slug === news.league_slug) ?? null,
      author: authors?.find((a) => a.id === news.author_id) ?? null,
    }));

    return NextResponse.json(combinedData);
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

// app/api/news/route.ts

// app/api/news/route.ts

// app/api/news/route.ts

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate the request body
    const result = createNewsInputSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.issues },
        { status: 400 }
      );
    }

    // Insert the news item
    const { data: newsData, error: newsError } = await supabase
      .from("news")
      .insert(result.data)
      .select()
      .single();

    if (newsError) {
      console.error("Supabase error creating news:", newsError);
      return NextResponse.json(
        {
          error: "Failed to create news article",
          details: newsError.message,
        },
        { status: 500 }
      );
    }

    // Fetch related data separately
    const promises = [];
    let resultIndex = 0; // Track the index of results

    // Fetch category if category_slug exists
    if (newsData.category_slug) {
      promises.push(
        supabase
          .from("news_categories")
          .select("*")
          .eq("slug", newsData.category_slug)
          .single()
      );
      resultIndex++;
    }

    // Fetch league if league_slug exists
    if (newsData.league_slug) {
      promises.push(
        supabase
          .from("leagues")
          .select("id, name_en, name_am, slug")
          .eq("slug", newsData.league_slug)
          .single()
      );
      resultIndex++;
    }

    // Fetch author if author_id exists
    if (newsData.author_id) {
      promises.push(
        supabase
          .from("authors")
          .select("*")
          .eq("id", newsData.author_id)
          .single()
      );
      resultIndex++;
    }

    // Execute all promises in parallel
    const results = await Promise.allSettled(promises);

    // Initialize result objects
    let categoryResult = null;
    let leagueResult = null;
    let authorResult = null;

    // Extract the data from the results based on what was requested
    let currentIndex = 0;
    if (newsData.category_slug) {
      categoryResult = results[currentIndex++];
    }
    if (newsData.league_slug) {
      leagueResult = results[currentIndex++];
    }
    if (newsData.author_id) {
      authorResult = results[currentIndex++];
    }

    // Combine the data
    const combinedData = {
      ...newsData,
      category:
        categoryResult && categoryResult.status === "fulfilled" && categoryResult.value.data
          ? categoryResult.value.data
          : null,
      league:
        leagueResult && leagueResult.status === "fulfilled" && leagueResult.value.data
          ? leagueResult.value.data
          : null,
      author:
        authorResult && authorResult.status === "fulfilled" && authorResult.value.data
          ? authorResult.value.data
          : null,
    };

    return NextResponse.json(combinedData, { status: 201 });
  } catch (error) {
    console.error("Unexpected error creating news:", error);
    return NextResponse.json(
      {
        error: "Failed to create news article",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}