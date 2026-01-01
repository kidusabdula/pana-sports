"use client";

import { Trophy, Zap } from "lucide-react";
import { Standing } from "@/lib/hooks/public/useLeagues";
import { useHomeNews } from "@/lib/hooks/public/useNews";
import { transformNewsList } from "@/lib/utils/transformers";
import NewsCard from "@/components/news/NewsCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StandingsTable from "@/components/standings/StandingsTable";
import AdBanner from "@/components/shared/AdBanner";

interface TableTabProps {
  standings: Standing[];
  isLoading: boolean;
}

export default function TableTab({ standings, isLoading }: TableTabProps) {
  // Fetch news
  const { data: newsData, isLoading: isNewsLoading } = useHomeNews();
  const news = newsData ? transformNewsList(newsData).slice(0, 3) : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">League Standings</h2>
            <p className="text-xs text-zinc-500">
              {standings?.length || 0} teams • Click on a team for details
            </p>
          </div>
        </div>
      </div>

      {/* Full Standings Table - Using the shared component */}
      <StandingsTable
        standings={standings}
        promotionSpots={1}
        relegationSpots={3}
        showViewAllButton={false}
        title=""
      />

      {/* Legend */}
      {standings && standings.length > 0 && (
        <div className="bg-zinc-900/40 border border-white/5 rounded-xl px-4 py-3 flex flex-wrap gap-6 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Champion / Promotion</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>Relegation Zone</span>
          </div>
        </div>
      )}

      {/* Ad Banner */}
      <AdBanner variant="full" showClose={false} page="league-standings" />

      {/* Latest News Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Latest News
          </h2>
          <Link href="/news">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white"
            >
              View All
            </Button>
          </Link>
        </div>

        {isNewsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-zinc-900/40 rounded-xl animate-pulse border border-white/5"
              ></div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {news.map((item, idx) => (
              <NewsCard key={item.id} news={item} index={idx} />
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-zinc-500 text-xs bg-zinc-900/40 rounded-xl border border-white/5">
            No news available
          </div>
        )}
      </div>
    </div>
  );
}
