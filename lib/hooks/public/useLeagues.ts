// lib/hooks/public/useLeagues.ts
import { useQuery } from '@tanstack/react-query'
import { Match } from './useMatches';

// Define types
export type League = {
  id: string;
  slug: string;
  name_en: string;
  name_am: string;
  category: string;
  logo_url: string;
  description_en: string;
  description_am: string;
  founded_year: number;
  website_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  teams?: Team[];
  standings?: Standing[];
};

export type Team = {
  id: string;
  name_en: string;
  name_am: string;
  slug: string;
  logo_url: string;
  founded: number;
  stadium: string;
  city: string;
  capacity: number;
};

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
  team: Team;
};

// API helper functions
async function fetchLeagues() {
  const res = await fetch('/api/public/leagues')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch leagues')
  }
  return res.json() as Promise<League[]>
}

// React Query hooks
export function useLeagues() {
  return useQuery({
    queryKey: ['leagues'],
    queryFn: fetchLeagues,
  })
}

async function fetchLeague(id: string) {
  const res = await fetch(`/api/public/leagues/${id}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch league')
  }
  return res.json() as Promise<League>
}

async function fetchLeagueMatches(id: string, params?: { matchday?: string; limit?: number }) {
  const queryString = new URLSearchParams(
    Object.entries(params || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();
  
  const res = await fetch(`/api/public/leagues/${id}/matches${queryString ? '?' + queryString : ''}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch league matches')
  }
  return res.json() as Promise<Match[]>
}

async function fetchLeagueStandings(id: string, params?: { season?: string }) {
  const queryString = new URLSearchParams(
    Object.entries(params || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();
  
  const res = await fetch(`/api/public/leagues/${id}/standings${queryString ? '?' + queryString : ''}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch league standings')
  }
  return res.json() as Promise<Standing[]>
}

async function fetchLeagueTeams(id: string) {
  const res = await fetch(`/api/public/leagues/${id}/teams`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch league teams')
  }
  return res.json() as Promise<Team[]>
}

// React Query hooks
export function useLeague(id: string) {
  return useQuery({
    queryKey: ['league', id],
    queryFn: () => fetchLeague(id),
    enabled: !!id,
  })
}

export function useLeagueMatches(id: string, params?: { matchday?: string; limit?: number }) {
  return useQuery({
    queryKey: ['league-matches', id, params],
    queryFn: () => fetchLeagueMatches(id, params),
    enabled: !!id,
  })
}

export function useLeagueStandings(id: string, params?: { season?: string, limit?: number }) {
  return useQuery({
    queryKey: ['league-standings', id, params],
    queryFn: () => fetchLeagueStandings(id, params),
    enabled: !!id,
  })
}

export function useLeagueTeams(id: string) {
  return useQuery({
    queryKey: ['league-teams', id],
    queryFn: () => fetchLeagueTeams(id),
    enabled: !!id,
  })
}