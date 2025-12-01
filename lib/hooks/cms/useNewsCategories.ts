// lib/hooks/cms/useNewsCategories.ts
import { useQuery } from '@tanstack/react-query';
import { NewsCategory } from '@/lib/schemas/news';

async function fetchNewsCategories() {
  const res = await fetch('/api/news-categories');
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch news categories');
  }
  return res.json() as Promise<NewsCategory[]>;
}

export function useNewsCategories() {
  return useQuery({
    queryKey: ['news-categories'],
    queryFn: fetchNewsCategories,
    gcTime: 1000 * 60 * 60, // 1hr garbage collection
    staleTime: 1000 * 60 * 10, // 10min stale cache
    refetchOnWindowFocus: false,
  });
}
