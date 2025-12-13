"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Zap, CheckCircle, Minus, XCircle } from "lucide-react";
import Image from "next/image";
import { Standing } from "@/lib/hooks/public/useLeagues";
import { useHomeNews } from "@/lib/hooks/public/useNews";
import { transformNewsList } from "@/lib/utils/transformers";
import NewsCard from "@/components/news/NewsCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

interface TableTabProps {
  standings: Standing[];
  isLoading: boolean;
}

export default function TableTab({ standings, isLoading }: TableTabProps) {
  const { t } = useLanguage();
  // Fetch news
  const { data: newsData, isLoading: isNewsLoading } = useHomeNews();
  const news = newsData ? transformNewsList(newsData).slice(0, 3) : [];

  // Get top 3 teams
  const topTeams = standings?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top 3 Teams Summary - Compact */}
      {topTeams.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {topTeams.map((team, index) => (
            <Card
              key={team.id}
              className={`bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden relative ${index === 0 ? "border-primary/30 bg-primary/5" : ""
                }`}
            >
              <CardContent className="p-3 flex flex-col items-center justify-center text-center relative z-10">
                <div className="absolute top-2 right-2 text-[10px] font-bold text-zinc-500">
                  #{index + 1}
                </div>
                <div className="w-10 h-10 mb-2 relative">
                  <Image
                    src={team.team?.logo_url || ""}
                    alt={team.team?.name_en || ""}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-xs font-bold text-white truncate w-full mb-1">
                  {team.team?.name_en}
                </div>
                <div className="text-sm font-bold text-primary">
                  {team.points}{" "}
                  <span className="text-[9px] text-zinc-500 font-normal">
                    pts
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Full Table */}
      <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <CardHeader className="py-2 px-3 border-b border-white/5">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            League Table
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {standings && standings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase text-zinc-500 font-medium tracking-wider">
                    <th className="p-2 w-8 text-center">#</th>
                    <th className="p-2">Team</th>
                    <th className="p-2 text-center w-8">P</th>
                    <th className="p-2 text-center w-8 hidden sm:table-cell">
                      W
                    </th>
                    <th className="p-2 text-center w-8 hidden sm:table-cell">
                      D
                    </th>
                    <th className="p-2 text-center w-8 hidden sm:table-cell">
                      L
                    </th>
                    <th className="p-2 text-center w-10">GD</th>
                    <th className="p-2 text-center w-10 font-bold text-white">
                      Pts
                    </th>
                    <th className="p-2 text-center w-16 hidden md:table-cell">
                      Form
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {standings.map((team, index) => (
                    <tr
                      key={team.id}
                      className={`group hover:bg-white/5 transition-colors ${index < 4
                          ? "bg-blue-500/5"
                          : index >= standings.length - 3
                            ? "bg-red-500/5"
                            : ""
                        }`}
                    >
                      <td className="p-2 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${index < 4
                              ? "bg-blue-500/20 text-blue-400"
                              : index >= standings.length - 3
                                ? "bg-red-500/20 text-red-400"
                                : "text-zinc-400"
                            }`}
                        >
                          {index + 1}
                        </span>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 relative shrink-0">
                            <Image
                              src={team.team?.logo_url || ""}
                              alt={team.team?.name_en || ""}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="text-xs font-medium text-zinc-200 group-hover:text-white truncate max-w-[100px] sm:max-w-none">
                            {t(team.team, 'name')}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 text-center text-xs text-zinc-400">
                        {team.played}
                      </td>
                      <td className="p-2 text-center text-xs text-zinc-400 hidden sm:table-cell">
                        {team.won}
                      </td>
                      <td className="p-2 text-center text-xs text-zinc-400 hidden sm:table-cell">
                        {team.draw}
                      </td>
                      <td className="p-2 text-center text-xs text-zinc-400 hidden sm:table-cell">
                        {team.lost}
                      </td>
                      <td className="p-2 text-center text-xs font-medium text-zinc-300">
                        {team.gd > 0 ? `+${team.gd}` : team.gd}
                      </td>
                      <td className="p-2 text-center text-xs font-bold text-primary">
                        {team.points}
                      </td>
                      <td className="p-2 hidden md:table-cell">
                        <div className="flex items-center justify-center gap-0.5">
                          {[...Array(5)].map((_, i) => {
                            // Mock form data since it's not in the interface yet
                            // Randomly generate W/D/L for visual demo
                            const result = ["W", "D", "L", "W", "D"][
                              (index + i) % 5
                            ];
                            return (
                              <div
                                key={i}
                                className={`w-3 h-3 rounded-sm flex items-center justify-center text-[8px] font-bold ${result === "W"
                                    ? "bg-green-500/20 text-green-400"
                                    : result === "D"
                                      ? "bg-zinc-500/20 text-zinc-400"
                                      : "bg-red-500/20 text-red-400"
                                  }`}
                              >
                                {result === "W" && (
                                  <CheckCircle className="w-2 h-2" />
                                )}
                                {result === "D" && (
                                  <Minus className="w-2 h-2" />
                                )}
                                {result === "L" && (
                                  <XCircle className="w-2 h-2" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-500 text-xs">
              No standings data available
            </div>
          )}
        </CardContent>
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
