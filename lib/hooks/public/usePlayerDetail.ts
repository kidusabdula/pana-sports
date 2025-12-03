// lib/hooks/public/usePlayerDetail.ts
import { useQuery } from "@tanstack/react-query";

// Define types
export type PlayerStats = {
  id: string;
  league_id: string;
  player_id: string;
  team_id: string;
  season: string;
  goals: number;
  assists: number;
  league: {
    id: string;
    name_en: string;
    name_am: string;
    slug: string;
    category: string;
    logo_url?: string;
  };
  team?: {
    id: string;
    name_en: string;
    name_am: string;
    slug: string;
    logo_url: string;
  };
};

export type PlayerDetail = {
  id: string;
  slug: string;
  name_en: string;
  name_am: string;
  position_en: string;
  position_am: string;
  jersey_number: number;
  dob: string;
  nationality: string;
  height_cm: number;
  weight_kg: number;
  bio_en: string;
  bio_am: string;
  photo_url: string;
  contract_until: string;
  market_value: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  team: {
    id: string;
    name_en: string;
    name_am: string;
    slug: string;
    logo_url: string;
  };
};

export type PlayerDetailResponse = {
  player: PlayerDetail;
  topScorerStats: PlayerStats[];
};

// API helper function
async function fetchPlayerDetail(id: string) {
  const res = await fetch(`/api/public/players/${id}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch player details");
  }
  return res.json() as Promise<PlayerDetailResponse>;
}

// React Query hook
export function usePlayerDetail(id: string) {
  return useQuery({
    queryKey: ["player-detail", id],
    queryFn: () => fetchPlayerDetail(id),
    enabled: !!id,
  });
}
