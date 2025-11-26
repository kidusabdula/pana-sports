// app/news/[id]/page.tsx
import { notFound } from "next/navigation";
import { newsData } from "@/lib/newsData";
import NewsDetail from "@/components/news/NewsDetail";
import NewsCard from "@/components/news/NewsCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const newsId = parseInt(id);
  const news = newsData.find((item) => item.id === newsId);

  if (!news) {
    notFound();
  }

  // Get related news (exclude current one, take 3)
  const relatedNews = newsData.filter((item) => item.id !== newsId).slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <NewsDetail news={news} />

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
