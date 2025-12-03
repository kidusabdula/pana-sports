// lib/hooks/public/useStandings.ts
import { useQuery } from '@tanstack/react-query'

// Define types
export type Standing = {
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
async function fetchStandings(params?: { league_id?: string; season?: string; limit?: number }) {
  const queryString = new URLSearchParams(
    Object.entries(params || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();
  
  const res = await fetch(`/api/public/standings${queryString ? '?' + queryString : ''}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch standings')
  }
  return res.json() as Promise<Standing[]>
}

// React Query hooks
export function useStandings(params?: { league_id?: string; season?: string; limit?: number }) {
  return useQuery({
    queryKey: ['standings', params],
    queryFn: () => fetchStandings(params),
  })
}