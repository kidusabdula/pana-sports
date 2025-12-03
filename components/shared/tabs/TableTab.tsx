"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, ChevronRight, Zap, MapPin } from "lucide-react";
import { useLeagueStandings } from "@/lib/hooks/public/useLeagues";
import { useHomeNews } from "@/lib/hooks/public/useNews";
import { transformNewsList } from "@/lib/utils/transformers";
import NewsCard from "@/components/news/NewsCard";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, Minus } from "lucide-react";

interface TableTabProps {
  leagueId: string;
}

const getStatusIcon = (gd: number) => {
  if (gd > 0) return <ChevronUp className="w-3 h-3 text-green-500" />;
  if (gd < 0) return <ChevronDown className="w-3 h-3 text-red-500" />;
  return <Minus className="w-3 h-3 text-zinc-500" />;
};

export default function TableTab({ leagueId }: TableTabProps) {
  const { data: standings, isLoading } = useLeagueStandings(leagueId);
  
  // Fetch news
  const { data: newsData, isLoading: isNewsLoading } = useHomeNews();
  const news = newsData ? transformNewsList(newsData).slice(0, 3) : [];

  // Get top 3 teams from standings
  const topTeams = standings?.slice(0, 3) || [];

  return (
    <div className="space-y-8">
      {/* Top Teams */}
      <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Top Teams
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {topTeams.length === 0 ? (
            <div className="p-8 text-center text-zinc-400">
              No standings available
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {topTeams.map((team, index) => (
                <div
                  key={team.id}
                  className="flex items-center gap-3 p-4 hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent border border-white/20 shrink-0">
                    <span className="text-white font-bold text-sm sm:text-base">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-zinc-700 shrink-0">
                      <Image
                        src={team.team?.logo_url || ""}
                        alt={team.team?.name_en || ""}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-medium truncate">
                        {team.team?.name_en}
                      </div>
                      <div className="text-zinc-400 text-xs sm:text-sm flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3" />
                        {team.team?.city || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-6">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-medium text-white">
                        {team.played}
                      </div>
                      <div className="text-xs text-zinc-500">P</div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-medium text-white">
                        {team.won}-{team.draw}-{team.lost}
                      </div>
                      <div className="text-xs text-zinc-500">W-D-L</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">
                        {team.gd > 0 ? "+" : ""}
                        {team.gd}
                      </div>
                      <div className="text-xs text-zinc-500">GD</div>
                    </div>
                    <div className="text-right min-w-[40px]">
                      <div className="text-lg font-bold text-primary">
                        {team.points}
                      </div>
                      <div className="text-xs text-zinc-500">PTS</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full Table */}
      <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <CardHeader className="pb-3 border-b border-white/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              League Table
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              View Full Table
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : standings && standings.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-[2rem_1fr_2rem_2rem_2rem_2rem_2rem_2rem_2rem_3rem] gap-1 px-2 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-white/5">
                  <div className="text-center">#</div>
                  <div>Team</div>
                  <div className="text-center">P</div>
                  <div className="text-center">W</div>
                  <div className="text-center">D</div>
                  <div className="text-center">L</div>
                  <div className="text-center">GF</div>
                  <div className="text-center">GA</div>
                  <div className="text-center">GD</div>
                  <div className="text-center">PTS</div>
                </div>
                {standings
                  .filter((team) => team.team)
                  .map((team) => (
                    <div
                      key={team.id}
                      className="grid grid-cols-[2rem_1fr_2rem_2rem_2rem_2rem_2rem_2rem_2rem_3rem] gap-1 px-2 py-2 text-xs border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center justify-center text-zinc-500 font-mono">
                        {team.rank}
                      </div>
                      <div className="flex items-center gap-2 font-medium text-zinc-200 truncate">
                        <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={team.team?.logo_url || ""}
                            alt={team.team?.name_en || "Team"}
                            width={20}
                            height={20}
                            className="object-cover"
                          />
                        </div>
                        <span className="truncate">{team.team?.name_en}</span>
                      </div>
                      <div className="text-center text-zinc-400">{team.played}</div>
                      <div className="text-center text-zinc-400">{team.won}</div>
                      <div className="text-center text-zinc-400">{team.draw}</div>
                      <div className="text-center text-zinc-400">{team.lost}</div>
                      <div className="text-center text-zinc-400">{team.goals_for}</div>
                      <div className="text-center text-zinc-400">
                        {team.goals_against}
                      </div>
                      <div className="text-center text-zinc-400">{team.gd}</div>
                      <div className="text-right font-bold text-white font-mono flex items-center justify-end gap-1">
                        {team.points}
                        {getStatusIcon(team.gd)}
                      </div>
                    </div>
                  ))}
                <Button
                  variant="ghost"
                  className="w-full py-3 text-xs text-zinc-500 hover:text-primary hover:bg-white/5 transition-colors rounded-none"
                >
                  View Full Standings
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-400">
              No standings available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Latest News Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Latest News
          </h2>
          <Link href="/news">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white"
            >
              View All News
            </Button>
          </Link>
        </div>

        {isNewsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-zinc-900/40 rounded-2xl animate-pulse border border-white/5"
              ></div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item, idx) => (
              <NewsCard key={item.id} news={item} index={idx} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-400 bg-zinc-900/40 rounded-2xl border border-white/5">
            No news available
          </div>
        )}
      </div>
    </div>
  );
}