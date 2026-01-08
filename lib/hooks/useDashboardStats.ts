// lib/hooks/useDashboardStats.ts
import { useQuery } from "@tanstack/react-query";

export type DashboardStats = {
  leagues: number;
  teams: number;
  matches: number;
  news: number;
  comments: number;
  users: number;
  upcomingMatches: Array<{
    id: string;
    home_team: { name_en: string; logo_url: string | null };
    away_team: { name_en: string; logo_url: string | null };
    scheduled_at: string;
    status: string;
  }>;
  latestNews: Array<{
    id: string;
    title_en: string;
    published_at: string;
    author: string | null;
  }>;
  recentActivities: Array<{
    type: "league" | "match" | "news";
    message: string;
    timestamp: string;
  }>;
};

async function fetchDashboardStats() {
  const res = await fetch("/api/dashboard/stats");
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch dashboard stats");
  }
  return res.json() as Promise<DashboardStats>;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
}
