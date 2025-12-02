import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TopScorer, CreateTopScorer, UpdateTopScorer } from '@/lib/schemas/topScorer'

// API helper functions
async function fetchTopScorers(params?: { league_id?: string; season?: string }) {
  const queryString = new URLSearchParams(params).toString()
  const res = await fetch(`/api/top-scorers${queryString ? '?' + queryString : ''}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch top scorers')
  }
  return res.json() as Promise<TopScorer[]>
}

async function fetchTopScorer(id: string) {
  const res = await fetch(`/api/top-scorers/${id}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch top scorer')
  }
  return res.json() as Promise<TopScorer>
}

async function createTopScorer(newTopScorer: CreateTopScorer) {
  const res = await fetch('/api/top-scorers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTopScorer),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create top scorer')
  }
  
  return res.json() as Promise<TopScorer>
}

async function updateTopScorer({ id, updates }: { id: string, updates: UpdateTopScorer }) {
  const res = await fetch(`/api/top-scorers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update top scorer')
  }
  
  return res.json() as Promise<TopScorer>
}

async function deleteTopScorer(id: string) {
  const res = await fetch(`/api/top-scorers/${id}`, {
    method: 'DELETE',
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to delete top scorer')
  }
  
  return id
}

// React Query hooks
export function useTopScorers(params?: { league_id?: string; season?: string }) {
  return useQuery({
    queryKey: ['top-scorers', params],
    queryFn: () => fetchTopScorers(params),
  })
}

export function useTopScorer(id: string) {
  return useQuery({
    queryKey: ['top-scorers', id],
    queryFn: () => fetchTopScorer(id),
    enabled: !!id,
  })
}

export function useCreateTopScorer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createTopScorer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['top-scorers'] })
    },
  })
}

export function useUpdateTopScorer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateTopScorer,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['top-scorers'] })
      queryClient.invalidateQueries({ queryKey: ['top-scorers', id] })
    },
  })
}

export function useDeleteTopScorer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteTopScorer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['top-scorers'] })
    },
  })
}