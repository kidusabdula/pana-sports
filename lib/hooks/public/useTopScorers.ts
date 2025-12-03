// lib/hooks/public/useTopScorers.ts
import { useQuery } from '@tanstack/react-query'

// Define types
export type TopScorer = {
  id: string;
  league_id: string;
  player_id: string;
  team_id: string;
  season: string;
  goals: number;
  assists: number;
  player: {
    id: string;
    name_en: string;
    name_am: string;
    slug: string;
    jersey_number: number;
    photo_url: string;
    position_en: string;
  };
  team: {
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
  };
};

// API helper functions
async function fetchTopScorers(params?: { league_id?: string; limit?: number }) {
  const queryString = new URLSearchParams(
    Object.entries(params || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();
  
  const res = await fetch(`/api/public/top-scorers${queryString ? '?' + queryString : ''}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch top scorers')
  }
  return res.json() as Promise<TopScorer[]>
}

// React Query hooks
export function useTopScorers(params?: { league_id?: string; limit?: number }) {
  return useQuery({
    queryKey: ['top-scorers', params],
    queryFn: () => fetchTopScorers(params),
  })
}