import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Team, CreateTeam, UpdateTeam } from '@/lib/schemas/team'

// API helper functions
async function fetchTeams() {
  const res = await fetch('/api/teams')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch teams')
  }
  return res.json() as Promise<Team[]>
}

async function fetchTeam(id: string) {
  const res = await fetch(`/api/teams/${id}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch team')
  }
  return res.json() as Promise<Team>
}

async function createTeam(newTeam: CreateTeam) {
  const res = await fetch('/api/teams', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTeam),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create team')
  }
  
  return res.json() as Promise<Team>
}

async function updateTeam({ id, updates }: { id: string, updates: UpdateTeam }) {
  const res = await fetch(`/api/teams/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update team')
  }
  
  return res.json() as Promise<Team>
}

async function deleteTeam(id: string) {
  const res = await fetch(`/api/teams/${id}`, {
    method: 'DELETE',
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to delete team')
  }
  
  return id
}

// React Query hooks
export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  })
}

export function useTeam(id: string) {
  return useQuery({
    queryKey: ['teams', id],
    queryFn: () => fetchTeam(id),
    enabled: !!id,
  })
}

export function useCreateTeam() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useUpdateTeam() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateTeam,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      queryClient.invalidateQueries({ queryKey: ['teams', id] })
    },
  })
}

export function useDeleteTeam() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}