// lib/hooks/cms/useMatchLineups.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MatchLineup, CreateMatchLineup } from '@/lib/schemas/matchLineup'

// API helper functions
async function fetchMatchLineups(matchId: string) {
  const res = await fetch(`/api/matches/${matchId}/lineups`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch match lineups')
  }
  return res.json() as Promise<MatchLineup[]>
}

async function createMatchLineups(matchId: string, lineups: CreateMatchLineup[]) {
  const res = await fetch(`/api/matches/${matchId}/lineups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lineups }),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create match lineups')
  }
  
  return res.json() as Promise<MatchLineup[]>
}

async function deleteMatchLineups(matchId: string) {
  const res = await fetch(`/api/matches/${matchId}/lineups`, {
    method: 'DELETE',
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to delete match lineups')
  }
  
  return matchId
}

// React Query hooks
export function useMatchLineups(matchId: string) {
  return useQuery({
    queryKey: ['matches', matchId, 'lineups'],
    queryFn: () => fetchMatchLineups(matchId),
    enabled: !!matchId,
  })
}

export function useCreateMatchLineups(matchId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (lineups: CreateMatchLineup[]) => createMatchLineups(matchId, lineups),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches', matchId, 'lineups'] })
    },
  })
}

export function useDeleteMatchLineups(matchId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => deleteMatchLineups(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches', matchId, 'lineups'] })
    },
  })
}