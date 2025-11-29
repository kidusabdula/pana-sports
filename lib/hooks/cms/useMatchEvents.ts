import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MatchEvent, CreateMatchEvent, UpdateMatchEvent } from '@/lib/schemas/matchEvent'

// API helper functions
async function fetchMatchEvents() {
  const res = await fetch('/api/match-events')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch match events')
  }
  return res.json() as Promise<MatchEvent[]>
}

async function fetchMatchEvent(id: string) {
  const res = await fetch(`/api/match-events/${id}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch match event')
  }
  return res.json() as Promise<MatchEvent>
}

async function createMatchEvent(newMatchEvent: CreateMatchEvent) {
  const res = await fetch('/api/match-events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newMatchEvent),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create match event')
  }
  
  return res.json() as Promise<MatchEvent>
}

async function updateMatchEvent({ id, updates }: { id: string, updates: UpdateMatchEvent }) {
  const res = await fetch(`/api/match-events/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update match event')
  }
  
  return res.json() as Promise<MatchEvent>
}

async function deleteMatchEvent(id: string) {
  const res = await fetch(`/api/match-events/${id}`, {
    method: 'DELETE',
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to delete match event')
  }
  
  return id
}

// React Query hooks
export function useMatchEvents() {
  return useQuery({
    queryKey: ['match-events'],
    queryFn: fetchMatchEvents,
  })
}

export function useMatchEvent(id: string) {
  return useQuery({
    queryKey: ['match-events', id],
    queryFn: () => fetchMatchEvent(id),
    enabled: !!id,
  })
}

export function useCreateMatchEvent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createMatchEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match-events'] })
    },
  })
}

export function useUpdateMatchEvent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateMatchEvent,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['match-events'] })
      queryClient.invalidateQueries({ queryKey: ['match-events', id] })
    },
  })
}

export function useDeleteMatchEvent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteMatchEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match-events'] })
    },
  })
}