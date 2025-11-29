import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Player, CreatePlayer, UpdatePlayer } from '@/lib/schemas/player'

// API helper functions
async function fetchPlayers() {
  const res = await fetch('/api/players')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch players')
  }
  return res.json() as Promise<Player[]>
}

async function fetchPlayer(id: string) {
  const res = await fetch(`/api/players/${id}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch player')
  }
  return res.json() as Promise<Player>
}

async function createPlayer(newPlayer: CreatePlayer) {
  const res = await fetch('/api/players', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPlayer),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create player')
  }
  
  return res.json() as Promise<Player>
}

async function updatePlayer({ id, updates }: { id: string, updates: UpdatePlayer }) {
  const res = await fetch(`/api/players/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update player')
  }
  
  return res.json() as Promise<Player>
}

async function deletePlayer(id: string) {
  const res = await fetch(`/api/players/${id}`, {
    method: 'DELETE',
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to delete player')
  }
  
  return id
}

// React Query hooks
export function usePlayers() {
  return useQuery({
    queryKey: ['players'],
    queryFn: fetchPlayers,
  })
}

export function usePlayer(id: string) {
  return useQuery({
    queryKey: ['players', id],
    queryFn: () => fetchPlayer(id),
    enabled: !!id,
  })
}

export function useCreatePlayer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
    },
  })
}

export function useUpdatePlayer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updatePlayer,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
      queryClient.invalidateQueries({ queryKey: ['players', id] })
    },
  })
}

export function useDeletePlayer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deletePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
    },
  })
}