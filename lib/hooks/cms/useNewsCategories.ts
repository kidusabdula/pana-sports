// lib/hooks/cms/useNewsCategories.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Define the NewsCategory type if not already defined
type NewsCategory = {
  id: string;
  name: string;
  name_en: string;
  name_am: string;
  slug: string;
  color: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// API helper functions
async function fetchNewsCategories() {
  const res = await fetch('/api/news-categories')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch news categories')
  }
  return res.json() as Promise<NewsCategory[]>
}

// React Query hooks
export function useNewsCategories() {
  return useQuery({
    queryKey: ['news-categories'],
    queryFn: fetchNewsCategories,
  })
}