// lib/hooks/public/useMatches.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// Define types
export type Match = {
  id: string;
  date: string;
  status: string;
  score_home: number;
  score_away: number;
  minute: number;
  // Time persistence fields
  match_started_at?: string | null;
  second_half_started_at?: string | null;
  extra_time_started_at?: string | null;
  // Server-calculated minute (available from API)
  calculated_minute?: number;
  home_team: {
    id: string;
    name_en: string;
    name_am: string;
    slug: string;
    logo_url: string;
  };
  away_team: {
    id: string;
    name_en: string;
    name_am: string;
    slug: string;
    logo_url: string;
  };
  league: {
    id: string;
    name_en: string;
    name_am: string;
    slug: string;
    category: string;
    logo_url?: string;
  };
  venue?: {
    id: string;
    name_en: string;
    name_am: string;
    city: string;
    capacity: number;
  };
};

// API helper functions
async function fetchLiveMatches() {
  const res = await fetch("/api/public/matches/live");
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch live matches");
  }
  return res.json() as Promise<Match[]>;
}

async function fetchUpcomingMatches(params?: {
  league_id?: string;
  limit?: number;
}) {
  const queryString = new URLSearchParams(
    Object.entries(params || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const res = await fetch(
    `/api/public/matches/upcoming${queryString ? "?" + queryString : ""}`
  );
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch upcoming matches");
  }
  return res.json() as Promise<Match[]>;
}

async function fetchRecentMatches(params?: {
  league_id?: string;
  limit?: number;
}) {
  const queryString = new URLSearchParams(
    Object.entries(params || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const res = await fetch(
    `/api/public/matches/recent${queryString ? "?" + queryString : ""}`
  );
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch recent matches");
  }
  return res.json() as Promise<Match[]>;
}

// React Query hooks with Real-time subscriptions

/**
 * Hook for fetching and subscribing to live matches in real-time.
 * Automatically updates when match status, score, or minute changes.
 */
export function useLiveMatches() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Set up real-time subscription for matches table
  useEffect(() => {
    const channel = supabase
      .channel("public-live-matches")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "matches",
        },
        () => {
          // Invalidate and refetch live matches when any match changes
          // This catches status changes to/from 'live', score updates, minute updates
          queryClient.invalidateQueries({ queryKey: ["live-matches"] });

          // Also invalidate upcoming and recent matches as status might have changed
          queryClient.invalidateQueries({ queryKey: ["upcoming-matches"] });
          queryClient.invalidateQueries({ queryKey: ["recent-matches"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, supabase]);

  return useQuery({
    queryKey: ["live-matches"],
    queryFn: fetchLiveMatches,
    refetchInterval: 30000, // Fallback polling every 30 seconds
    staleTime: 5000, // Consider data stale after 5 seconds
  });
}

/**
 * Hook for fetching upcoming matches with optional real-time updates
 */
export function useUpcomingMatches(params?: {
  league_id?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["upcoming-matches", params],
    queryFn: () => fetchUpcomingMatches(params),
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook for fetching recent/completed matches
 */
export function useRecentMatches(params?: {
  league_id?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["recent-matches", params],
    queryFn: () => fetchRecentMatches(params),
    staleTime: 60000, // 1 minute
  });
}
