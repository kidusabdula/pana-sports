// app/news/[id]/page.tsx
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

// app/news/[id]/page.tsx (update the NewsDetailPageContent function)
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
        <NewsDetail news={transformedNews} />

        {/* Related News Section */}
        {relatedNews.length > 0 && (
          <div className="max-w-5xl mx-auto mt-24 pt-12 border-t border-white/5">
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