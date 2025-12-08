import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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

    // Fetch counts for all entities in parallel
    const [
      leaguesResult,
      teamsResult,
      matchesResult,
      newsResult,
      commentsResult,
      usersResult,
    ] = await Promise.all([
      supabase.from("leagues").select("*", { count: "exact", head: true }),
      supabase.from("teams").select("*", { count: "exact", head: true }),
      supabase.from("matches").select("*", { count: "exact", head: true }),
      supabase
        .from("news")
        .select("*", { count: "exact", head: true })
        .eq("is_published", true),
      supabase.from("comments").select("*", { count: "exact", head: true }),
      supabase.auth.admin.listUsers(),
    ]);

    // Check for errors
    if (leaguesResult.error) {
      console.error("Error fetching leagues count:", leaguesResult.error);
      return NextResponse.json(
        {
          error: "Failed to fetch leagues count",
          details: leaguesResult.error.message,
        },
        { status: 500 }
      );
    }

    if (teamsResult.error) {
      console.error("Error fetching teams count:", teamsResult.error);
      return NextResponse.json(
        {
          error: "Failed to fetch teams count",
          details: teamsResult.error.message,
        },
        { status: 500 }
      );
    }

    if (matchesResult.error) {
      console.error("Error fetching matches count:", matchesResult.error);
      return NextResponse.json(
        {
          error: "Failed to fetch matches count",
          details: matchesResult.error.message,
        },
        { status: 500 }
      );
    }

    if (newsResult.error) {
      console.error("Error fetching news count:", newsResult.error);
      return NextResponse.json(
        {
          error: "Failed to fetch news count",
          details: newsResult.error.message,
        },
        { status: 500 }
      );
    }

    if (commentsResult.error) {
      console.error("Error fetching comments count:", commentsResult.error);
      return NextResponse.json(
        {
          error: "Failed to fetch comments count",
          details: commentsResult.error.message,
        },
        { status: 500 }
      );
    }

    if (usersResult.error) {
      console.error("Error fetching users count:", usersResult.error);
      return NextResponse.json(
        {
          error: "Failed to fetch users count",
          details: usersResult.error.message,
        },
        { status: 500 }
      );
    }

    // Fetch recent activity (latest updates across different entities)
    const [recentLeagues, recentMatches, recentNews] = await Promise.all([
      supabase
        .from("leagues")
        .select("id, name_en, created_at")
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("matches")
        .select(
          `
          id,
          updated_at,
          home_team:teams!matches_home_team_id_fkey(name_en),
          away_team:teams!matches_away_team_id_fkey(name_en)
        `
        )
        .order("updated_at", { ascending: false })
        .limit(3),
      supabase
        .from("news")
        .select("id, title_en, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(3),
    ]);

    // Combine and sort recent activities
    const activities: Array<{
      type: "league" | "match" | "news";
      message: string;
      timestamp: string;
    }> = [];

    if (recentLeagues.data) {
      activities.push(
        ...recentLeagues.data.map((league) => ({
          type: "league" as const,
          message: `New league "${league.name_en}" created`,
          timestamp: league.created_at,
        }))
      );
    }

    if (recentMatches.data) {
      activities.push(
        ...recentMatches.data.map((match) => {
          const homeTeam = Array.isArray(match.home_team)
            ? match.home_team[0]
            : match.home_team;
          const awayTeam = Array.isArray(match.away_team)
            ? match.away_team[0]
            : match.away_team;

          return {
            type: "match" as const,
            message: `Match "${homeTeam?.name_en || "Unknown"} vs ${
              awayTeam?.name_en || "Unknown"
            }" updated`,
            timestamp: match.updated_at,
          };
        })
      );
    }

    if (recentNews.data) {
      activities.push(
        ...recentNews.data.map((news) => ({
          type: "news" as const,
          message: `News article "${news.title_en}" published`,
          timestamp: news.published_at,
        }))
      );
    }

    // Sort activities by timestamp and take the 5 most recent
    const sortedActivities = activities
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 5);

    const stats = {
      leagues: leaguesResult.count || 0,
      teams: teamsResult.count || 0,
      matches: matchesResult.count || 0,
      news: newsResult.count || 0,
      comments: commentsResult.count || 0,
      users: usersResult.data.users.length || 0,
      recentActivities: sortedActivities,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Unexpected error fetching dashboard stats:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard stats",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
