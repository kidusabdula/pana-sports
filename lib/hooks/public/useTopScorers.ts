// lib/hooks/public/useTopScorers.ts
import { useQuery } from '@tanstack/react-query'
import { TopScorer } from '@/lib/schemas/topScorer'

// API helper function to fetch top scorers for a league
async function fetchLeagueTopScorers(leagueSlug: string) {
  const res = await fetch(`/api/top-scorers?league=${leagueSlug}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch top scorers')
  }
  return res.json() as Promise<TopScorer[]>
}

// React Query hook for league top scorers
export function useLeagueTopScorers(leagueSlug: string) {
  return useQuery({
    queryKey: ['topScorers', 'league', leagueSlug],
    queryFn: () => fetchLeagueTopScorers(leagueSlug),
    gcTime: 1000 * 60 * 60,        // 1hr garbage collection
    staleTime: 1000 * 60 * 10,      // 10min stale cache
    refetchOnWindowFocus: false, 
    retry: 1,
    enabled: !!leagueSlug,
  })
}

// API helper function to fetch top scorers
async function fetchTopScorers() {
  const res = await fetch('/api/top-scorers')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch top scorers')
  }
  return res.json() as Promise<TopScorer[]>
}

// React Query hook for top scorers
export function useTopScorers() {
  return useQuery({
    queryKey: ['topScorers'],
    queryFn: fetchTopScorers,
    gcTime: 1000 * 60 * 60,        // 1hr garbage collection
    staleTime: 1000 * 60 * 10,      // 10min stale cache
    refetchOnWindowFocus: false, 
    retry: 1,
  })
}