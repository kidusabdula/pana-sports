// lib/utils/transformers.ts

import { News } from "@/lib/schemas/news";

// Transform news data from API to UI format
export function transformNewsToUINews(news: News) {
  return {
    id: news.id,
    title: news.title_en,
    title_am: news.title_am,
    category: news.category?.name || "General",
    category_id: news.category?.id,
    category_slug: news.category?.slug,
    image: news.thumbnail_url || "/placeholder.svg",
    date: formatDate(news.published_at || ""), // Handle null date
    author: news.author?.name || "Pana Sports",
    author_avatar: news.author?.avatar_url || undefined,
    excerpt: generateExcerpt(stripHtml(news.content_en || "")),
    content: news.content_en || "",
    content_am: news.content_am || "",
    views: news.views || 0,
    comments_count: news.comments_count || 0,
    league: news.league?.name_en,
    league_slug: news.league?.slug,
  };
}

// Format date function
function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
}

// Strip HTML tags from content
function stripHtml(html: string) {
  if (!html) return "";

  // Create a temporary div element
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Return the text content
  return tempDiv.textContent || tempDiv.innerText || "";
}

// Generate excerpt from content
function generateExcerpt(content: string, maxLength = 150) {
  if (!content) return "";

  // Strip HTML tags
  const plainText = stripHtml(content);

  if (plainText.length <= maxLength) return plainText;

  return plainText.substring(0, maxLength).trim() + "...";
}

// Transform an array of news items
export function transformNewsList(newsList: News[]) {
  return newsList.map(transformNewsToUINews);
}

// lib/utils/transformers.ts (add these functions to the existing file)

// Transform match data from API to UI format
export function transformMatchToUIMatch(match: any) {
  return {
    id: match.id,
    home: match.home_team?.name_en || "Unknown Team",
    away: match.away_team?.name_en || "Unknown Team",
    homeScore: match.score_home,
    awayScore: match.score_away,
    minute: match.minute,
    status: match.status,
    league: match.league?.name_en || "Unknown League",
    time: formatMatchTime(match.date),
    homeLogo: match.home_team?.logo_url || "/team-logos/placeholder.svg",
    awayLogo: match.away_team?.logo_url || "/team-logos/placeholder.svg",
  };
}

// Format match time
function formatMatchTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Transform an array of matches

// Transform standing data from API to UI format
// lib/utils/transformers.ts

// Transform matches data from API to UI format

// Transform an array of matches
export function transformMatchesList(matchesList: any[]) {
  return matchesList.map(transformMatchToUIMatch);
}

// Transform standings data from API to UI format
export function transformStandingToUIStanding(standing: any) {
  return {
    id: standing.id,
    team: {
      id: standing.team?.id || "",
      name: standing.team?.name_en || "Unknown",
      logo: standing.team?.logo_url || "/placeholder.svg",
      slug: standing.team_slug,
    },
    played: standing.played || 0,
    won: standing.won || 0,
    drawn: standing.draw || 0,
    lost: standing.lost || 0,
    gf: standing.goals_for || 0,
    ga: standing.goals_against || 0,
    gd: standing.gd || 0,
    points: standing.points || 0,
    rank: standing.rank || 0,
    status: standing.team?.status || "active", // Use team status or default to "active"
  };
}

// Transform an array of standings
export function transformStandingsList(standingsList: any[]) {
  return standingsList.map(transformStandingToUIStanding);
}
// Transform top scorer data from API to UI format
export function transformTopScorerToUITopScorer(topScorer: any) {
  return {
    id: topScorer.id,
    name: topScorer.player?.name_en || "Unknown Player",
    team: topScorer.team?.name_en || "Unknown Team",
    goals: topScorer.goals,
    avatar: topScorer.player?.photo_url || "/players/placeholder.svg",
    teamLogo: topScorer.team?.logo_url || "/team-logos/placeholder.svg",
  };
}

// Transform an array of top scorers
export function transformTopScorersList(topScorersList: any[]) {
  return topScorersList.map(transformTopScorerToUITopScorer);
}
