// components/news/NewsFilter.tsx
"use client";

import { useQuery } from '@tanstack/react-query';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Fetch categories from the API
async function fetchNewsCategories() {
  const res = await fetch('/api/news-categories');
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch news categories');
  }
  return res.json() as Promise<{ id: string, name: string, slug: string }[]>;
}

interface NewsFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function NewsFilter({
  activeCategory,
  setActiveCategory,
}: NewsFilterProps) {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['news-categories'],
    queryFn: fetchNewsCategories,
    gcTime: 1000 * 60 * 60, // 1hr garbage collection
    staleTime: 1000 * 60 * 10, // 10min stale cache
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="mb-10 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-center gap-2 min-w-max">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-24 bg-zinc-800 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-10 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-center gap-2 min-w-max">
          <div className="text-red-500">Failed to load categories</div>
        </div>
      </div>
    );
  }

  // Add "All" option to the categories
  const allCategories = [{ id: 'all', name: 'All', slug: 'all' }, ...(categories || [])];

  return (
    <div className="mb-10 overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex items-center gap-2 min-w-max">
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.slug)}
            className={cn(
              "relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300",
              activeCategory === category.slug
                ? "text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            )}
          >
            {activeCategory === category.slug && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}