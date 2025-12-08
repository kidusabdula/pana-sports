// lib/hooks/cms/useMatchControl.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Match } from '@/lib/schemas/match'

// API helper function
async function updateMatchControl(matchId: string, controlData: Partial<Match>) {
  const res = await fetch(`/api/matches/${matchId}/control`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(controlData),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update match control')
  }
  
  return res.json() as Promise<Match>
}

// React Query hooks
export function useMatchControl(matchId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (controlData: Partial<Match>) => updateMatchControl(matchId, controlData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches', matchId] })
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    },
  })
}