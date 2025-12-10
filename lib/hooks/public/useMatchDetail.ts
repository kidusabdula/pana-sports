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

export type MatchLineup = {
  id: string;
  match_id: string;
  team_id: string;
  player_id: string;
  is_starting: boolean;
  position: string | null;
  jersey_number: number | null;
  captain: boolean;
  is_injured: boolean;
  injury_type: string | null;
  injury_return_date: string | null;
  injury_status: string | null;
  position_x: number | null;
  position_y: number | null;
  player: {
    id: string;
    name_en: string;
    name_am: string;
    slug: string;
    jersey_number: number | null;
    position_en: string | null;
    position_am: string | null;
    photo_url: string | null;
  } | null;
  team: {
    id: string;
    name_en: string;
    name_am: string;
    slug: string;
    logo_url: string | null;
  } | null;
};

export type MatchStats = {
  id: string;
  match_id: string;
  team_id: string;
  possession: number;
  total_passes: number;
  pass_accuracy: number;
  total_shots: number;
  shots_on_target: number;
  shots_off_target: number;
  blocked_shots: number;
  corners: number;
  free_kicks: number;
  penalties_awarded: number;
  fouls_committed: number;
  offsides: number;
  tackles: number;
  interceptions: number;
  clearances: number;
  saves: number;
  yellow_cards: number;
  red_cards: number;
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
  // New fields
  round: string | null;
  home_formation: string;
  away_formation: string;
  coach_home: string | null;
  coach_away: string | null;
  assistant_referee_1: string | null;
  assistant_referee_2: string | null;
  assistant_referee_3: string | null;
  fourth_official: string | null;
  match_commissioner: string | null;
  weather: string | null;
  temperature: string | null;
  humidity: string | null;
  wind: string | null;
  surface: string;
  // Relations
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
    latitude: number | null;
    longitude: number | null;
    surface: string | null;
  };
};

export type MatchDetailResponse = {
  match: MatchDetail;
  events: MatchEvent[];
  lineups: MatchLineup[];
  stats: MatchStats[];
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

    // Subscribe to match lineups
    const lineupsChannel = supabase
      .channel(`public-match-lineups-${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "match_lineups",
          filter: `match_id=eq.${id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["match-detail", id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(matchChannel);
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(lineupsChannel);
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
