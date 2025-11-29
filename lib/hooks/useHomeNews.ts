// /lib/hooks/useHomeNews.ts
import { useQuery } from '@tanstack/react-query'
import { News } from '@/lib/schemas/news'

// API helper function
async function fetchHomeNews() {
  const res = await fetch('/api/news?limit=5')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch news')
  }
  return res.json() as Promise<News[]>
}

// React Query hook
export function useHomeNews() {
  return useQuery({
    queryKey: ['news', 'home'],
    queryFn: fetchHomeNews,
    gcTime: 1000 * 60 * 60,        // 1hr garbage collection
    staleTime: 1000 * 60 * 5,      // 5min stale cache
    refetchOnWindowFocus: false, 
    retry: 1,
  })
}