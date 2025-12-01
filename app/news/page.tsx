// app/news/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useAllNews, useFilteredNews } from "@/lib/hooks/public/useNews";
import { transformNewsList } from "@/lib/utils/transformers";
import NewsCard from "@/components/news/NewsCard";
import NewsFilter from "@/components/news/NewsFilter";
import ErrorState from "@/components/shared/ErrorState";
import NewsPageSkeleton from "@/components/shared/Skeletons/NewsPageSkeleton";
import { motion } from "framer-motion";
import { TrendingUp, Zap } from "lucide-react";
import AdBanner from "@/components/shared/AdBanner";
import { Suspense } from "react";

function NewsPageContent() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Fetch all news
  const {
    data: allNews,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    refetch: refetchAll,
  } = useAllNews();

  // Fetch filtered news if a category is selected
  const {
    data: filteredNewsData,
    isLoading: isLoadingFiltered,
    isError: isErrorFiltered,
    refetch: refetchFiltered,
  } = useFilteredNews(activeCategory);

  // Determine which data to use based on active category
  const isLoading = activeCategory === "All" ? isLoadingAll : isLoadingFiltered;
  const isError = activeCategory === "All" ? isErrorAll : isErrorFiltered;
  const refetch = activeCategory === "All" ? refetchAll : refetchFiltered;

  // Transform data to UI format
  const transformedNews = useMemo(() => {
    const newsData = activeCategory === "All" ? allNews : filteredNewsData;
    if (!newsData) return [];

    return transformNewsList(newsData);
  }, [allNews, filteredNewsData, activeCategory]);

  // Extract categories from all news for sidebar
  const categories = useMemo(() => {
    if (!allNews) return ["All"];

    // Extract category names
    const uniqueCategories = new Set(
      allNews
        .map((news) => news.category?.name)
        .filter((name): name is string => !!name)
    );
    return ["All", ...Array.from(uniqueCategories)];
  }, [allNews]);

  // Handle error state
  if (isError) {
    return (
      <>
        <AdBanner />
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 bg-linear-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
                THE FEED
              </h1>
              <p className="text-zinc-400 text-lg md:text-xl max-w-2xl">
                Stay ahead of game with the latest updates, match reports, and
                exclusive insights from the world of Ethiopian football.
              </p>
            </div>
            <ErrorState
              message="Failed to load news. Please try again later."
              onRetry={refetch}
            />
          </div>
        </div>
      </>
    );
  }

  // Handle loading state
  if (isLoading) {
    return <NewsPageSkeleton />;
  }

  const featuredNews = transformedNews[0];
  const trendingNews = transformedNews.slice(0, 4); // Simulate trending
  const latestNews = transformedNews.slice(1);

  return (
    <>
      <AdBanner />
      <div className="min-h-screen bg-black text-white pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header Section */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 bg-linear-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
                THE FEED
              </h1>
              <p className="text-zinc-400 text-lg md:text-xl max-w-2xl">
                Stay ahead of game with the latest updates, match reports, and
                exclusive insights from the world of Ethiopian football.
              </p>
            </motion.div>
          </div>

          <NewsFilter
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-12">
              {/* Featured Section */}
              {featuredNews && (
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <Zap className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold tracking-wide uppercase">
                      Top Story
                    </h2>
                  </div>
                  <NewsCard news={featuredNews} variant="featured" />
                </section>
              )}

              {/* Latest News Grid */}
              {latestNews.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    <h2 className="text-xl font-bold tracking-wide uppercase">
                      Latest Updates
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {latestNews.map((news, idx) => (
                      <NewsCard key={news.id} news={news} index={idx} />
                    ))}
                  </div>
                </section>
              )}

              {transformedNews.length === 0 && (
                <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
                  <p className="text-zinc-500 text-lg">
                    No news found in this category.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-10">
              {/* Trending Section */}
              <div className="bg-zinc-900/20 border border-white/5 rounded-3xl p-6 md:p-8 sticky top-24 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold tracking-wide uppercase">
                    Trending Now
                  </h2>
                </div>

                <div className="space-y-4">
                  {trendingNews.map((news, idx) => (
                    <NewsCard
                      key={`trending-${news.id}`}
                      news={news}
                      variant="minimal"
                      index={idx}
                    />
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(1).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-zinc-400 hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={<NewsPageSkeleton />}>
      <NewsPageContent />
    </Suspense>
  );
}
