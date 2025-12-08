// lib/hooks/public/useMatchDetail.ts
import { useQuery } from "@tanstack/react-query";

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

// React Query hook
export function useMatchDetail(id: string) {
  return useQuery({
    queryKey: ["match-detail", id],
    queryFn: () => fetchMatchDetail(id),
    enabled: !!id,
  });
}
