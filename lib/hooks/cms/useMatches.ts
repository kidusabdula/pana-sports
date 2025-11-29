import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Match, CreateMatch, UpdateMatch } from '@/lib/schemas/match'

// API helper functions
async function fetchMatches() {
  const res = await fetch('/api/matches')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch matches')
  }
  return res.json() as Promise<Match[]>
}

async function fetchMatch(id: string) {
  const res = await fetch(`/api/matches/${id}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch match')
  }
  return res.json() as Promise<Match>
}

async function createMatch(newMatch: CreateMatch) {
  const res = await fetch('/api/matches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newMatch),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create match')
  }
  
  return res.json() as Promise<Match>
}

async function updateMatch({ id, updates }: { id: string, updates: UpdateMatch }) {
  const res = await fetch(`/api/matches/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update match')
  }
  
  return res.json() as Promise<Match>
}

async function deleteMatch(id: string) {
  const res = await fetch(`/api/matches/${id}`, {
    method: 'DELETE',
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to delete match')
  }
  
  return id
}

// React Query hooks
export function useMatches() {
  return useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
  })
}

export function useMatch(id: string) {
  return useQuery({
    queryKey: ['matches', id],
    queryFn: () => fetchMatch(id),
    enabled: !!id,
  })
}

export function useCreateMatch() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    },
  })
}

export function useUpdateMatch() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateMatch,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
      queryClient.invalidateQueries({ queryKey: ['matches', id] })
    },
  })
}

export function useDeleteMatch() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    },
  })
}
