import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Author, CreateAuthor, UpdateAuthor } from '@/lib/schemas/author'

// API helper functions
async function fetchAuthors() {
  const res = await fetch('/api/authors')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch authors')
  }
  return res.json() as Promise<Author[]>
}

async function fetchAuthor(id: string) {
  const res = await fetch(`/api/authors/${id}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch author')
  }
  return res.json() as Promise<Author>
}

async function createAuthor(newAuthor: CreateAuthor) {
  const res = await fetch('/api/authors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newAuthor),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create author')
  }
  
  return res.json() as Promise<Author>
}

async function updateAuthor({ id, updates }: { id: string, updates: UpdateAuthor }) {
  const res = await fetch(`/api/authors/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update author')
  }
  
  return res.json() as Promise<Author>
}

async function deleteAuthor(id: string) {
  const res = await fetch(`/api/authors/${id}`, {
    method: 'DELETE',
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to delete author')
  }
  
  return id
}

// React Query hooks
export function useAuthors() {
  return useQuery({
    queryKey: ['authors'],
    queryFn: fetchAuthors,
  })
}

export function useAuthor(id: string) {
  return useQuery({
    queryKey: ['authors', id],
    queryFn: () => fetchAuthor(id),
    enabled: !!id,
  })
}

export function useCreateAuthor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createAuthor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] })
    },
  })
}

export function useUpdateAuthor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateAuthor,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['authors'] })
      queryClient.invalidateQueries({ queryKey: ['authors', id] })
    },
  })
}

export function useDeleteAuthor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteAuthor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] })
    },
  })
}
