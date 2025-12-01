import { useQuery } from '@tanstack/react-query'
import { League } from '@/lib/schemas/league'

// API helper function to fetch leagues for public
async function fetchPublicLeagues(options?: {
  category?: string;
  active?: boolean;
  limit?: number;
}) {
  const params = new URLSearchParams()
  
  if (options?.category && options.category !== 'all') {
    params.append('category', options.category)
  }
  
  if (options?.active === true) {
    params.append('active', 'true')
  }
  
  if (options?.limit) {
    params.append('limit', options.limit.toString())
  }
  
  const res = await fetch(`/api/public/leagues?${params.toString()}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch leagues')
  }
  return res.json() as Promise<League[]>
}

// React Query hook for public leagues
export function usePublicLeagues(options?: {
  category?: string;
  active?: boolean;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['public-leagues', options],
    queryFn: () => fetchPublicLeagues(options),
    gcTime: 1000 * 60 * 60,        // 1hr garbage collection
    staleTime: 1000 * 60 * 5,      // 5min stale cache
    refetchOnWindowFocus: false, 
    retry: 1,
  })
}

// React Query hook for a single league
export function usePublicLeague(id: string) {
  return useQuery({
    queryKey: ['public-leagues', id],
    queryFn: () => {
      // We don't have a specific public endpoint for single league
      // So we'll use the public leagues endpoint and filter by slug
      return fetchPublicLeagues({ limit: 100 }).then(leagues => 
        leagues.find(league => league.id === id)
      )
    },
    enabled: !!id,
    gcTime: 1000 * 60 * 60,        // 1hr garbage collection
    staleTime: 1000 * 60 * 5,      // 5min stale cache
    refetchOnWindowFocus: false, 
    retry: 1,
  })
}