// lib/hooks/public/useNews.ts
import { useQuery } from "@tanstack/react-query";
import { News } from "@/lib/schemas/news";

// API helper function to fetch limited news for the home page
async function fetchHomeNews() {
  const res = await fetch("/api/news?limit=5");
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch news");
  }
  return res.json() as Promise<News[]>;
}

// React Query hook for home page news
export function useHomeNews() {
  return useQuery({
    queryKey: ["news", "home"],
    queryFn: fetchHomeNews,
    gcTime: 1000 * 60 * 60, // 1hr garbage collection
    staleTime: 1000 * 60 * 5, // 5min stale cache
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

// API helper function to fetch news by category
async function fetchNewsByCategory(category: string) {
  const res = await fetch(`/api/news?category=${category}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch news");
  }
  return res.json() as Promise<News[]>;
}

// React Query hook for filtered news
export function useFilteredNews(category: string) {
  return useQuery({
    queryKey: ["news", "category", category],
    queryFn: () => fetchNewsByCategory(category),
    gcTime: 1000 * 60 * 60, // 1hr garbage collection
    staleTime: 1000 * 60 * 5, // 5min stale cache
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!category && category !== "all", // Changed from "All" to "all"
  });
}

// API helper function to fetch all news
async function fetchAllNews() {
  const res = await fetch("/api/news");
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch news");
  }
  return res.json() as Promise<News[]>;
}

// React Query hook for all news
export function useAllNews() {
  return useQuery({
    queryKey: ["news", "all"],
    queryFn: fetchAllNews,
    gcTime: 1000 * 60 * 60, // 1hr garbage collection
    staleTime: 1000 * 60 * 5, // 5min stale cache
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

// API helper function to fetch a single news item with optional related news
async function fetchNewsItem(id: string, includeRelated = false) {
  const url = includeRelated
    ? `/api/news/${id}?includeRelated=true`
    : `/api/news/${id}`;
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch news");
  }
  return res.json() as Promise<News & { relatedNews?: News[] }>;
}

// React Query hook for a single news item
export function useNewsItem(id: string, includeRelated = false) {
  return useQuery({
    queryKey: ["news", "item", id, { includeRelated }],
    queryFn: () => fetchNewsItem(id, includeRelated),
    gcTime: 1000 * 60 * 60, // 1hr garbage collection
    staleTime: 1000 * 60 * 5, // 5min stale cache
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!id,
  });
}
