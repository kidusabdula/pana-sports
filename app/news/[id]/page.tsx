// app/news/[id]/page.tsx
"use client";
import { notFound } from "next/navigation";
import { useNewsItem, useFilteredNews } from "@/lib/hooks/public/useNews";
import { transformNewsToUINews } from "@/lib/utils/transformers";
import NewsDetail from "@/components/news/NewsDetail";
import NewsCard from "@/components/news/NewsCard";
import ErrorState from "@/components/shared/ErrorState";
import NewsDetailSkeleton from "@/components/shared/Skeletons/NewsDetailSkeleton";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import React from "react";
import AdBanner from "@/components/shared/AdBanner";

// Make sure to export as default
function NewsDetailPageContent({ id }: { id: string }) {
  const { data: newsData, isLoading, isError, refetch } = useNewsItem(id);

  // Fetch related news (hook must be called at top level)
  // It will only execute when category ID is available
  const { data: relatedNewsRaw } = useFilteredNews(
    newsData?.category?.id || ""
  );

  // Handle error state
  if (isError) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <ErrorState
            message="Failed to load news article. Please try again later."
            onRetry={refetch}
          />
        </div>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return <NewsDetailSkeleton />;
  }

  if (!newsData) {
    notFound();
  }

  // Transform news data to UI format
  const transformedNews = transformNewsToUINews(newsData);

  // Transform related news to UI format
  const relatedNews = relatedNewsRaw
    ? relatedNewsRaw
        .filter((item) => item.id !== newsData.id)
        .slice(0, 3)
        .map(transformNewsToUINews)
    : [];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Two-column layout for news content and ad banner */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content column - takes 2/3 of the space on large screens */}
          <div className="w-full lg:w-2/3">
            <NewsDetail news={transformedNews} />
          </div>

          {/* Ad banner column - takes 1/3 of the space on large screens */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-24 h-fit">
            <div className="lg:pl-8">
              <AdBanner />
            </div>

            {/* Related News in Sidebar */}
            {relatedNews.length > 0 && (
              <div className="lg:pl-8 mt-12 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                    Read Next
                  </h3>
                  <Link
                    href="/news"
                    className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="flex flex-col gap-6">
                  {relatedNews.map((item, idx) => (
                    <NewsCard
                      key={item.id}
                      news={item}
                      variant="minimal"
                      index={idx}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related News Section - spans full width */}
      </div>
    </div>
  );
}

// Add the default export wrapper
export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params promise
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  return (
    <Suspense fallback={<NewsDetailSkeleton />}>
      <NewsDetailPageContent id={id} />
    </Suspense>
  );
}
