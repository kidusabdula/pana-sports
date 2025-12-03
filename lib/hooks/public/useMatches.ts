// lib/hooks/public/useMatches.ts
import { useQuery } from '@tanstack/react-query'

// Define types
export type Match = {
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
  const res = await fetch('/api/public/matches/live')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch live matches')
  }
  return res.json() as Promise<Match[]>
}

async function fetchUpcomingMatches(params?: { league_id?: string; limit?: number }) {
  const queryString = new URLSearchParams(
    Object.entries(params || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();
  
  const res = await fetch(`/api/public/matches/upcoming${queryString ? '?' + queryString : ''}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch upcoming matches')
  }
  return res.json() as Promise<Match[]>
}

async function fetchRecentMatches(params?: { league_id?: string; limit?: number }) {
  const queryString = new URLSearchParams(
    Object.entries(params || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();
  
  const res = await fetch(`/api/public/matches/recent${queryString ? '?' + queryString : ''}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch recent matches')
  }
  return res.json() as Promise<Match[]>
}

// React Query hooks
export function useLiveMatches() {
  return useQuery({
    queryKey: ['live-matches'],
    queryFn: fetchLiveMatches,
    refetchInterval: 30000, // Refetch every 30 seconds for live data
  })
}

export function useUpcomingMatches(params?: { league_id?: string; limit?: number }) {
  return useQuery({
    queryKey: ['upcoming-matches', params],
    queryFn: () => fetchUpcomingMatches(params),
  })
}

export function useRecentMatches(params?: { league_id?: string; limit?: number }) {
  return useQuery({
    queryKey: ['recent-matches', params],
    queryFn: () => fetchRecentMatches(params),
  })
}