import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { League, CreateLeague, UpdateLeague } from '@/lib/schemas/league'

// API helper functions
async function fetchLeagues() {
  const res = await fetch('/api/leagues')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch leagues')
  }
  return res.json() as Promise<League[]>
}

async function fetchLeague(id: string) {
  const res = await fetch(`/api/leagues/${id}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch league')
  }
  return res.json() as Promise<League>
}

async function createLeague(newLeague: CreateLeague) {
  const res = await fetch('/api/leagues', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newLeague),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create league')
  }
  
  return res.json() as Promise<League>
}

async function updateLeague({ id, updates }: { id: string, updates: UpdateLeague }) {
  const res = await fetch(`/api/leagues/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update league')
  }
  
  return res.json() as Promise<League>
}

async function deleteLeague(id: string) {
  const res = await fetch(`/api/leagues/${id}`, {
    method: 'DELETE',
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to delete league')
  }
  
  return id
}

// React Query hooks
export function useLeagues() {
  return useQuery({
    queryKey: ['leagues'],
    queryFn: fetchLeagues,
  })
}

export function useLeague(id: string) {
  return useQuery({
    queryKey: ['leagues', id],
    queryFn: () => fetchLeague(id),
    enabled: !!id,
  })
}

export function useCreateLeague() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createLeague,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leagues'] })
    },
  })
}

export function useUpdateLeague() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateLeague,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['leagues'] })
      queryClient.invalidateQueries({ queryKey: ['leagues', id] })
    },
  })
}

export function useDeleteLeague() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteLeague,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leagues'] })
    },
  })
}