// lib/hooks/useNews.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { News, CreateNews, UpdateNews } from '@/lib/schemas/news'

// API helper functions
async function fetchNews() {
  const res = await fetch('/api/news')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch news')
  }
  return res.json() as Promise<News[]>
}

async function fetchNewsItem(id: string) {
  const res = await fetch(`/api/news/${id}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch news')
  }
  return res.json() as Promise<News>
}

async function createNews(newNews: CreateNews) {
  const res = await fetch('/api/news', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newNews),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create news')
  }
  
  return res.json() as Promise<News>
}

async function updateNews({ id, updates }: { id: string, updates: UpdateNews }) {
  const res = await fetch(`/api/news/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update news')
  }
  
  return res.json() as Promise<News>
}

async function deleteNews(id: string) {
  const res = await fetch(`/api/news/${id}`, {
    method: 'DELETE',
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to delete news')
  }
  
  return id
}

// React Query hooks
export function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    gcTime: 1000 * 60 * 60,        // 1hr garbage collection
    staleTime: 1000 * 60 * 5,      // 5min stale cache
    refetchOnWindowFocus: false, 
    retry: 1,
  })
}

export function useNewsItem(id: string) {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => fetchNewsItem(id),
    enabled: !!id,
    gcTime: 1000 * 60 * 60,        // 1hr garbage collection
    staleTime: 1000 * 60 * 5,      // 5min stale cache
    refetchOnWindowFocus: false, 
    retry: 1,
  })
}

export function useCreateNews() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
    },
  })
}

export function useUpdateNews() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateNews,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
      queryClient.invalidateQueries({ queryKey: ['news', id] })
    },
  })
}

export function useDeleteNews() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
    },
  })
}