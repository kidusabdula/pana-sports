import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Standing, CreateStanding, UpdateStanding } from '@/lib/schemas/standing'

// API helper functions
async function fetchStandings() {
  const res = await fetch('/api/standings')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch standings')
  }
  return res.json() as Promise<Standing[]>
}

async function fetchStanding(id: string) {
  const res = await fetch(`/api/standings/${id}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch standing')
  }
  return res.json() as Promise<Standing>
}

async function createStanding(newStanding: CreateStanding) {
  const res = await fetch('/api/standings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newStanding),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create standing')
  }
  
  return res.json() as Promise<Standing>
}

async function updateStanding({ id, updates }: { id: string, updates: UpdateStanding }) {
  const res = await fetch(`/api/standings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update standing')
  }
  
  return res.json() as Promise<Standing>
}

async function deleteStanding(id: string) {
  const res = await fetch(`/api/standings/${id}`, {
    method: 'DELETE',
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to delete standing')
  }
  
  return id
}

// React Query hooks
export function useStandings() {
  return useQuery({
    queryKey: ['standings'],
    queryFn: fetchStandings,
  })
}

export function useStanding(id: string) {
  return useQuery({
    queryKey: ['standings', id],
    queryFn: () => fetchStanding(id),
    enabled: !!id,
  })
}

export function useCreateStanding() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createStanding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standings'] })
    },
  })
}

export function useUpdateStanding() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateStanding,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['standings'] })
      queryClient.invalidateQueries({ queryKey: ['standings', id] })
    },
  })
}

export function useDeleteStanding() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteStanding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standings'] })
    },
  })
}