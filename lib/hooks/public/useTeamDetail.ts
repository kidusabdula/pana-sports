// lib/hooks/public/useTeamDetail.ts
import { useQuery } from "@tanstack/react-query";

// Define types
export type Player = {
  id: string;
  slug: string;
  team_id: string;
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
};

export type TeamDetail = {
  id: string;
  slug: string;
  league_id: string;
  name_en: string;
  name_am: string;
  short_name_en: string;
  short_name_am: string;
  logo_url: string;
  description_en: string;
  description_am: string;
  stadium_en: string;
  stadium_am: string;
  founded: number;
  website_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  league: {
    id: string;
    name_en: string;
    name_am: string;
    slug: string;
    category: string;
  };
  players: Player[];
  home_matches: {
    id: string;
    date: string;
    status: string;
    score_home: number;
    score_away: number;
    minute: number;
    away_team: {
      id: string;
      name_en: string;
      name_am: string;
      slug: string;
      logo_url: string;
    };
    venue?: {
      id: string;
      name_en: string;
      name_am: string;
      city: string;
      capacity: number;
    };
  }[];
  away_matches: {
    id: string;
    date: string;
    status: string;
    score_home: number;
    score_away: number;
    minute: number;
    home_team: {
      id: string;
      name_en: string;
      name_am: string;
      slug: string;
      logo_url: string;
    };
    venue?: {
      id: string;
      name_en: string;
      name_am: string;
      city: string;
      capacity: number;
    };
  }[];
  standing: {
    id: string;
    league_id: string;
    team_id: string;
    season: string;
    played: number;
    won: number;
    draw: number;
    lost: number;
    goals_for: number;
    goals_against: number;
    gd: number;
    points: number;
    rank: number;
  };
};

export type TeamDetailResponse = TeamDetail;

// API helper function
async function fetchTeamDetail(id: string, params?: { season_id?: string }) {
  const queryString = new URLSearchParams(
    Object.entries(params || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const res = await fetch(
    `/api/public/teams/${id}${queryString ? "?" + queryString : ""}`
  );
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch team details");
  }
  return res.json() as Promise<TeamDetailResponse>;
}

// React Query hook
export function useTeamDetail(id: string, params?: { season_id?: string }) {
  return useQuery({
    queryKey: ["team-detail", id, params],
    queryFn: () => fetchTeamDetail(id, params),
    enabled: !!id,
  });
}
