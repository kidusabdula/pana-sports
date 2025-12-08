// lib/hooks/public/useMatchDetail.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// Define types
export type MatchEvent = {
  id: string;
  match_id: string;
  player_id: string | null;
  team_id: string;
  minute: number;
  type: string;
  description_en: string;
  description_am: string;
  subbed_in_player_id?: string | null;
  subbed_out_player_id?: string | null;
  is_assist?: boolean;
  confirmed?: boolean;
  player: {
    id: string;
    name_en: string;
    name_am: string;
    slug: string;
    jersey_number: number;
    photo_url: string;
  } | null;
  team: {
    id: string;
    name_en: string;
    name_am: string;
    slug: string;
    logo_url: string;
  };
};

export type MatchDetail = {
  id: string;
  date: string;
  status: string;
  score_home: number;
  score_away: number;
  minute: number;
  attendance: number;
  referee: string;
  match_day: number;
  season: string;
  is_featured: boolean;
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
    logo_url: string;
    name_en: string;
    name_am: string;
    slug: string;
    category: string;
  };
  venue?: {
    id: string;
    name_en: string;
    name_am: string;
    city: string;
    capacity: number;
  };
};

export type MatchDetailResponse = {
  match: MatchDetail;
  events: MatchEvent[];
};

// API helper function
async function fetchMatchDetail(id: string) {
  const res = await fetch(`/api/public/matches/${id}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch match details");
  }
  return res.json() as Promise<MatchDetailResponse>;
}

/**
 * Hook for fetching match details with real-time subscriptions.
 * Automatically updates when match status, score, minute, or events change.
 */
export function useMatchDetail(id: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Set up real-time subscriptions
  useEffect(() => {
    if (!id) return;

    // Subscribe to match updates (score, status, minute changes)
    const matchChannel = supabase
      .channel(`public-match-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "matches",
          filter: `id=eq.${id}`,
        },
        () => {
          // Invalidate and refetch match detail when match is updated
          queryClient.invalidateQueries({ queryKey: ["match-detail", id] });
        }
      )
      .subscribe();

    // Subscribe to match events (goals, cards, substitutions, etc.)
    const eventsChannel = supabase
      .channel(`public-match-events-${id}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to INSERT, UPDATE, DELETE
          schema: "public",
          table: "match_events",
          filter: `match_id=eq.${id}`,
        },
        () => {
          // Invalidate and refetch match detail when events change
          queryClient.invalidateQueries({ queryKey: ["match-detail", id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(matchChannel);
      supabase.removeChannel(eventsChannel);
    };
  }, [id, queryClient, supabase]);

  return useQuery({
    queryKey: ["match-detail", id],
    queryFn: () => fetchMatchDetail(id),
    enabled: !!id,
    staleTime: 5000, // Consider data stale after 5 seconds
    refetchInterval: 30000, // Fallback polling every 30 seconds for live matches
  });
}
