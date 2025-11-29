import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User, UpdateUserMetadata } from '@/lib/schemas/user'

// API helper functions
async function fetchUsers() {
  const res = await fetch('/api/users')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch users')
  }
  return res.json() as Promise<User[]>
}

async function updateUserMetadata({ id, updates }: { id: string, updates: UpdateUserMetadata }) {
  const res = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update user')
  }
  
  return res.json() as Promise<User>
}

// React Query hooks
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
}

export function useUpdateUserMetadata() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateUserMetadata,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
