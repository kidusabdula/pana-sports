// components/shared/HomeNewsSection.tsx
"use client";

import { useState, useMemo } from "react";
import { useHomeNews, useFilteredNews } from "@/lib/hooks/public/useNews";
import {
  transformNewsToUINews,
  transformNewsList,
} from "@/lib/utils/transformers";
import NewsCard from "@/components/news/NewsCard";
import NewsFilter from "@/components/news/NewsFilter";
import ErrorState from "@/components/shared/ErrorState";
import HomeNewsSectionSkeleton from "@/components/shared/Skeletons/HomeNewsSectionSkeleton";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Suspense } from "react";

export default function HomeNewsSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  // Fetch all news for the home page (limited to 5 items)
  const {
    data: allNews,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    refetch: refetchAll,
  } = useHomeNews();

  // Fetch filtered news if a category is selected
  const {
    data: filteredNewsData,
    isLoading: isLoadingFiltered,
    isError: isErrorFiltered,
    refetch: refetchFiltered,
  } = useFilteredNews(activeCategory);

  // Determine which data to use based on active category
  const isLoading = activeCategory === "all" ? isLoadingAll : isLoadingFiltered;
  const isError = activeCategory === "all" ? isErrorAll : isErrorFiltered;
  const refetch = activeCategory === "all" ? refetchAll : refetchFiltered;

  // Transform data to UI format
  const transformedNews = useMemo(() => {
    const newsData = activeCategory === "all" ? allNews : filteredNewsData;
    if (!newsData) return [];

    // Transform and limit to 5 items for the home page
    const transformed = transformNewsList(newsData);
    return transformed.slice(0, 5);
  }, [allNews, filteredNewsData, activeCategory]);

  // Handle error state
  if (isError) {
    return (
      <div className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-3 bg-linear-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
            PANA SPORTS
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl">
            Stay ahead of the game with the latest updates and exclusive
            insights.
          </p>
        </div>
        <ErrorState
          message="Failed to load news. Please try again later."
          onRetry={refetch}
        />
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return <HomeNewsSectionSkeleton />;
  }

  const featuredNews = transformedNews[0];
  const latestNews = transformedNews.slice(1, 5); // Show only 4 latest on home

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-3 bg-linear-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
          PANA SPORTS
        </h2>
        <p className="text-zinc-400 text-base md:text-lg max-w-2xl">
          Stay ahead of the game with the latest updates and exclusive insights.
        </p>
      </motion.div>

      <NewsFilter
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Main News Content */}
      <div className="space-y-10">
        {/* Featured Section */}
        {featuredNews && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold tracking-wide uppercase">
                Top Story
              </h3>
            </div>
            <NewsCard news={featuredNews} variant="featured" />
          </section>
        )}

        {/* Latest News Grid */}
        {latestNews.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-xl font-bold tracking-wide uppercase">
                Latest Updates
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestNews.map((news, idx) => (
                <NewsCard key={news.id} news={news} index={idx} />
              ))}
            </div>
          </section>
        )}

        {transformedNews.length === 0 && !isLoading && (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
            <p className="text-zinc-500 text-lg">
              No news found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
