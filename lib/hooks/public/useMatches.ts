// lib/hooks/public/useMatches.ts
import { useQuery } from '@tanstack/react-query'

// API helper function to fetch live matches
async function fetchLiveMatches() {
  const res = await fetch('/api/matches?status=live')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch live matches')
  }
  return res.json()
}

// React Query hook for live matches
export function useLiveMatches() {
  return useQuery({
    queryKey: ['matches', 'live'],
    queryFn: fetchLiveMatches,
    gcTime: 1000 * 60 * 5,      // 5min garbage collection
    staleTime: 1000 * 60,        // 1min stale cache
    refetchInterval: 1000 * 30,    // 30s refetch interval
    refetchOnWindowFocus: false, 
    retry: 1,
  })
}

// API helper function to fetch today's matches
async function fetchTodayMatches() {
  const res = await fetch('/api/matches?date=today')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch today matches')
  }
  return res.json()
}

// React Query hook for today matches
export function useTodayMatches() {
  return useQuery({
    queryKey: ['matches', 'today'],
    queryFn: fetchTodayMatches,
    gcTime: 1000 * 60 * 60,      // 1hr garbage collection
    staleTime: 1000 * 60 * 5,      // 5min stale cache
    refetchOnWindowFocus: false, 
    retry: 1,
  })
}