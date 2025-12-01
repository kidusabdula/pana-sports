import { useQuery } from '@tanstack/react-query'

// API helper functions
async function fetchVenues() {
  const res = await fetch('/api/venues')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch venues')
  }
  return res.json()
}

// React Query hooks
export function useVenues() {
  return useQuery({
    queryKey: ['venues'],
    queryFn: fetchVenues,
  })
}