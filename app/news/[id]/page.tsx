// app/news/[id]/page.tsx
"use client"
import { notFound } from "next/navigation";
import { useNewsItem } from "@/lib/hooks/public/useNews";
import { transformNewsToUINews, transformNewsList } from "@/lib/utils/transformers";
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
  const { 
    data: newsData, 
    isLoading, 
    isError, 
    refetch 
  } = useNewsItem(id, true); // Fetch with related news

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
  const relatedNews = newsData.relatedNews ? transformNewsList(newsData.relatedNews) : [];

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
          </div>
        </div>

        {/* Related News Section - spans full width */}
        {relatedNews.length > 0 && (
          <div className="mt-24 pt-12 border-t border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Read Next
              </h2>
              <Link
                href="/news"
                className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((item, idx) => (
                <NewsCard key={item.id} news={item} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Add the default export wrapper
export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params promise
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  return (
    <Suspense fallback={<NewsDetailSkeleton />}>
      <NewsDetailPageContent id={id} />
    </Suspense>
  );
}