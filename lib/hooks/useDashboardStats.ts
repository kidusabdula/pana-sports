// lib/hooks/useDashboardStats.ts
import { useQuery } from "@tanstack/react-query";

export type DashboardStats = {
  leagues: number;
  teams: number;
  matches: number;
  news: number;
  comments: number;
  users: number;
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
