"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Zap } from "lucide-react";
import Image from "next/image";
import { Standing } from "@/lib/hooks/public/useLeagues";
import { useHomeNews } from "@/lib/hooks/public/useNews";
import { transformNewsList } from "@/lib/utils/transformers";
import NewsCard from "@/components/news/NewsCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    <div className="space-y-4">
      {/* Full Table */}
      <Card className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          {standings && standings.length > 0 ? (
            <div className="overflow-x-auto pana-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[11px] uppercase text-zinc-500 font-medium tracking-wider">
                    <th className="py-4 pl-4 w-12 text-center">#</th>
                    <th className="py-4 px-2">Team</th>
                    <th className="py-4 px-2 text-center w-10">PL</th>
                    <th className="py-4 px-2 text-center w-10">W</th>
                    <th className="py-4 px-2 text-center w-10">D</th>
                    <th className="py-4 px-2 text-center w-10">L</th>
                    <th className="py-4 px-2 text-center w-16 hidden sm:table-cell">
                      +/-
                    </th>
                    <th className="py-4 px-2 text-center w-12">GD</th>
                    <th className="py-4 px-2 text-center w-12 text-white font-bold">
                      PTS
                    </th>
                    <th className="py-4 px-4 text-center w-32 hidden md:table-cell">
                      Form
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {standings.map((team, index) => {
                    // Determine status color bar
                    let statusColor = "bg-transparent";
                    if (index < 4) statusColor = "bg-emerald-500"; // UCL
                    else if (index === 4) statusColor = "bg-blue-500"; // UEL
                    else if (index >= standings.length - 3)
                      statusColor = "bg-red-500"; // Relegation

                    return (
                      <tr
                        key={team.id}
                        className="group hover:bg-white/5 transition-colors relative"
                      >
                        <td className="py-3 pl-4 text-center relative">
                          {/* Status Bar */}
                          <div
                            className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${statusColor}`}
                          />

                          <span className="text-sm font-medium text-white">
                            {team.rank || index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 relative shrink-0">
                              <Image
                                src={team.team?.logo_url || ""}
                                alt={team.team?.name_en || ""}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span className="text-sm font-bold text-white truncate max-w-[120px] sm:max-w-[180px]">
                              {team.team?.name_en}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center text-sm font-medium text-white">
                          {team.played}
                        </td>
                        <td className="py-3 px-2 text-center text-sm text-zinc-400 font-medium">
                          {team.won}
                        </td>
                        <td className="py-3 px-2 text-center text-sm text-zinc-400 font-medium">
                          {team.draw}
                        </td>
                        <td className="py-3 px-2 text-center text-sm text-zinc-400 font-medium">
                          {team.lost}
                        </td>
                        <td className="py-3 px-2 text-center text-sm text-zinc-400 hidden sm:table-cell">
                          <span className="tracking-tighter text-zinc-500">
                            {team.goals_for}-{team.goals_against}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center text-sm font-medium text-white">
                          {team.gd > 0 ? `+${team.gd}` : team.gd}
                        </td>
                        <td className="py-3 px-2 text-center text-base font-bold text-white">
                          {team.points}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <div className="flex items-center justify-center gap-1">
                            {[...Array(5)].map((_, i) => {
                              // Mock form data for visual demo - matches the previous implementation's mock
                              const result = ["W", "D", "L", "W", "D"][
                                (index + i) % 5
                              ];
                              let badgeClass = "bg-zinc-700 text-zinc-400"; // Default/Draw
                              if (result === "W")
                                badgeClass = "bg-emerald-500 text-black";
                              if (result === "L")
                                badgeClass = "bg-red-500 text-white";
                              if (result === "D")
                                badgeClass = "bg-zinc-600 text-white";

                              return (
                                <div
                                  key={i}
                                  className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold ${badgeClass}`}
                                >
                                  {result}
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 text-sm">
              <Trophy className="h-8 w-8 mx-auto mb-3 opacity-20" />
              <p>No standings data available</p>
            </div>
          )}
        </CardContent>

        {/* Legend */}
        {standings && standings.length > 0 && (
          <div className="px-4 py-3 border-t border-white/5 flex flex-wrap gap-4 text-[10px] text-zinc-500">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Champions League</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Europa League</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Relegation</span>
            </div>
          </div>
        )}
      </Card>

      {/* Latest News Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Latest News
          </h2>
          <Link href="/news">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white h-6 text-xs"
            >
              View All
            </Button>
          </Link>
        </div>

        {isNewsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-zinc-900/40 rounded-xl animate-pulse border border-white/5"
              ></div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
