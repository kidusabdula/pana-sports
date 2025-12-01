import { createClient } from "@/lib/supabase/server";
import { updateNewsInputSchema } from "@/lib/schemas/news";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

// app/api/news/[id]/route.ts (update the GET function)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeRelated = searchParams.get("includeRelated") === "true";

    const supabase = await createClient();

    const { data: news, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", id)
      .single();

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

    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    // Fetch related data
    const { data: league } = news.league_slug
      ? await supabase
          .from("leagues")
          .select("*")
          .eq("slug", news.league_slug)
          .single()
      : { data: null };

    const { data: category } = news.category_slug
      ? await supabase
          .from("news_categories")
          .select("*")
          .eq("slug", news.category_slug)
          .single()
      : { data: null };

    const { data: author } = news.author_id
      ? await supabase
          .from("authors")
          .select("*")
          .eq("id", news.author_id)
          .single()
      : { data: null };

    let relatedNews = [];

    // Fetch related news if requested
    if (includeRelated) {
      const { data: relatedData } = await supabase
        .from("news")
        .select("*")
        .neq("id", id)
        .or(`category_slug.eq.${news.category_slug},league_slug.eq.${news.league_slug}`)
        .order("published_at", { ascending: false })
        .limit(3);

      if (relatedData) {
        // Fetch categories, leagues, and authors for related news
        const { data: allLeagues } = await supabase.from("leagues").select("*");
        const { data: allCategories } = await supabase.from("news_categories").select("*");
        const { data: allAuthors } = await supabase.from("authors").select("*");

        relatedNews = relatedData.map((item) => ({
          ...item,
          league: item.league_slug
            ? allLeagues?.find((l) => l.slug === item.league_slug)
            : null,
          category: item.category_slug
            ? allCategories?.find((c) => c.slug === item.category_slug)
            : null,
          author: item.author_id
            ? allAuthors?.find((a) => a.id === item.author_id)
            : null,
        }));
      }
    }

    const enrichedNews = {
      ...news,
      league,
      category,
      author,
      relatedNews,
    };

    return NextResponse.json(enrichedNews);
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

// app/api/news/[id]/route.ts

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Verify admin authentication
    try {
      await requireAdmin();
    } catch (authError) {
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
      validatedData = updateNewsInputSchema.parse(body);
    } catch (validationError) {
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

    // No need to convert category_id to category_slug since we're already using category_slug
    const { data, error } = await supabase
      .from("news")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error updating news:", error);
      return NextResponse.json(
        {
          error: "Failed to update news",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error updating news:", error);
    return NextResponse.json(
      {
        error: "Failed to update news",
        details: error instanceof Error ? error.message : "Unknown error",
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
    // Verify admin authentication
    try {
      await requireAdmin();
    } catch (authError) {
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

    const supabase = await createClient();

    const { error } = await supabase.from("news").delete().eq("id", id);

    if (error) {
      console.error("Supabase error deleting news:", error);
      return NextResponse.json(
        {
          error: "Failed to delete news",
          details: error.message,
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
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}