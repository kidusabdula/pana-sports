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
  const [activeCategory, setActiveCategory] = useState("all");

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
  const isLoading = activeCategory === "all" ? isLoadingAll : isLoadingFiltered;
  const isError = activeCategory === "all" ? isErrorAll : isErrorFiltered;
  const refetch = activeCategory === "all" ? refetchAll : refetchFiltered;

  // Transform data to UI format
  const transformedNews = useMemo(() => {
    const newsData = activeCategory === "all" ? allNews : filteredNewsData;
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
          {/* Background Glow */}
          <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] -z-10 rounded-full pointer-events-none" />
          <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] -z-10 rounded-full pointer-events-none" />

          {/* Header Section */}
          <div className="mb-16 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-primary"></div>
                <span className="text-primary font-mono text-sm tracking-widest uppercase">
                  Daily Curated
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-white leading-[0.9]">
                THE{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-400 via-zinc-200 to-white">
                  FEED
                </span>
              </h1>
              <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-light leading-relaxed border-l-2 border-zinc-800 pl-6">
                Stay ahead of the game with the latest updates, match reports,
                and exclusive insights from the world of Ethiopian football.
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
                  <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold tracking-tight text-white">
                        Top Story
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                      Featured
                    </span>
                  </div>
                  <NewsCard news={featuredNews} variant="featured" />
                </section>
              )}

              {/* Latest News Grid */}
              {latestNews.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-8 pt-8 border-t border-zinc-800/50">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-1 rounded-full bg-primary" />
                      <h2 className="text-2xl font-bold tracking-tight text-white">
                        Latest Updates
                      </h2>
                    </div>
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
              <div className="bg-zinc-900/60 border border-white/5 rounded-3xl p-6 md:p-8 sticky top-24 backdrop-blur-xl shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold tracking-wide uppercase text-white">
                      Trending
                    </h2>
                  </div>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                </div>

                <div className="space-y-6">
                  {trendingNews.map((news, idx) => (
                    <div
                      key={`trending-${news.id}`}
                      className="pb-6 border-b border-white/5 last:border-0 last:pb-0"
                    >
                      <NewsCard news={news} variant="minimal" index={idx} />
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
                    Explore Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(1).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-3 py-1.5 rounded-full bg-zinc-800/50 text-zinc-400 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer border border-white/5 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
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
