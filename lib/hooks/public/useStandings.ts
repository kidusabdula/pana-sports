// lib/hooks/public/useStandings.ts
import { useQuery } from '@tanstack/react-query'
import { Standing } from '@/lib/schemas/standing'

// API helper function to fetch standings for a league
async function fetchLeagueStandings(leagueSlug: string) {
  const res = await fetch(`/api/standings?league=${leagueSlug}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch standings')
  }
  return res.json() as Promise<Standing[]>
}

// React Query hook for league standings
export function useLeagueStandings(leagueSlug: string) {
  return useQuery({
    queryKey: ['standings', 'league', leagueSlug],
    queryFn: () => fetchLeagueStandings(leagueSlug),
    gcTime: 1000 * 60 * 60,        // 1hr garbage collection
    staleTime: 1000 * 60 * 10,      // 10min stale cache
    refetchOnWindowFocus: false, 
    retry: 1,
    enabled: !!leagueSlug,
  })
}

// API helper function to fetch top teams in a league
async function fetchTopTeams(leagueSlug: string, limit = 5) {
  const res = await fetch(`/api/standings?league=${leagueSlug}&limit=${limit}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch top teams')
  }
  return res.json() as Promise<Standing[]>
}

// React Query hook for top teams
export function useTopTeams(leagueSlug: string, limit = 5) {
  return useQuery({
    queryKey: ['standings', 'top', leagueSlug, limit],
    queryFn: () => fetchTopTeams(leagueSlug, limit),
    gcTime: 1000 * 60 * 60,        // 1hr garbage collection
    staleTime: 1000 * 60 * 10,      // 10min stale cache
    refetchOnWindowFocus: false, 
    retry: 1,
    enabled: !!leagueSlug,
  })
}