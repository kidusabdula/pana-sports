"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Trophy, CheckCircle, Zap } from "lucide-react";
import Image from "next/image";
import { League, Standing } from "@/lib/hooks/public/useLeagues";
import { Match } from "@/lib/hooks/public/useMatches";
import { useHomeNews } from "@/lib/hooks/public/useNews";
import { transformNewsList } from "@/lib/utils/transformers";
import NewsCard from "@/components/news/NewsCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

interface OverviewTabProps {
  league: League;
  matches: Match[];
  standings: Standing[];
}

export default function OverviewTab({ matches, standings }: OverviewTabProps) {
  const { t } = useLanguage();

  // Get top 3 teams from standings
  const topTeams = standings?.slice(0, 5) || [];

  // Fetch news
  const { data: newsData, isLoading: isNewsLoading } = useHomeNews();
  const news = newsData ? transformNewsList(newsData).slice(0, 3) : [];

  // Categorize matches
  const liveMatches = matches?.filter((m) => m.status === "live") || [];
  const scheduledMatches =
    matches
      ?.filter((m) => m.status === "scheduled" || m.status === "upcoming")
      .slice(0, 5) || [];
  const completedMatches =
    matches?.filter((m) => m.status === "completed").slice(0, 5) || [];

  const MatchItem = ({
    match,
    showScore = true,
  }: {
    match: Match;
    showScore?: boolean;
  }) => {
    const getStatusDisplay = () => {
      if (match.status === "live") {
        return (
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider">
              {match.minute}&apos;
            </span>
            <div className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
            </div>
          </div>
        );
      }
      if (match.date) {
        const matchTime = new Date(match.date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        return (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-medium text-zinc-500">
              {matchTime}
            </span>
            <span className="text-[9px] text-zinc-600">
              {new Date(match.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        );
      }
      return null;
    };

    return (
      <Link href={`/matches/${match.id}`} className="block group">
        <div className="flex flex-col border-b border-white/5 last:border-0">
          <div className="flex items-center gap-2 md:gap-3 px-3 py-2 hover:bg-white/5 transition-colors">
            {/* Status/Time - Left aligned */}
            <div className="w-10 md:w-12 shrink-0 flex justify-center">
              {getStatusDisplay()}
            </div>

            {/* Home Team */}
            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
              <span className="text-xs font-medium text-zinc-200 truncate group-hover:text-white transition-colors text-right">
                {t(match.home_team, 'name')}
              </span>
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden border border-zinc-700/50 shrink-0 bg-zinc-800/50 flex items-center justify-center">
                <Image
                  src={match.home_team?.logo_url || ""}
                  alt={t(match.home_team, 'name')}
                  width={24}
                  height={24}
                  className="object-cover"
                />
              </div>
            </div>

            {/* Score */}
            <div className="flex items-center justify-center min-w-[40px] px-2">
              {showScore ? (
                <div className="flex items-center gap-1 bg-zinc-800/50 px-2 py-0.5 rounded text-white font-bold text-sm">
                  <span>{match.score_home ?? 0}</span>
                  <span className="text-zinc-500 text-xs">-</span>
                  <span>{match.score_away ?? 0}</span>
                </div>
              ) : (
                <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800/30 px-1.5 py-0.5 rounded">
                  VS
                </span>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden border border-zinc-700/50 shrink-0 bg-zinc-800/50 flex items-center justify-center">
                <Image
                  src={match.away_team?.logo_url || ""}
                  alt={t(match.away_team, 'name')}
                  width={24}
                  height={24}
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                {t(match.away_team, 'name')}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-4">
      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <Card className="bg-zinc-900/40 backdrop-blur-xl border-red-500/20 overflow-hidden">
          <CardHeader className="py-2 px-3 border-b border-white/5 bg-red-500/5">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </div>
              Live Matches
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-800/50">
              {liveMatches.map((match) => (
                <MatchItem key={match.id} match={match} showScore={true} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Matches */}
      <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <CardHeader className="py-2 px-3 border-b border-white/5">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-zinc-400" />
            Scheduled Matches
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {scheduledMatches.length === 0 ? (
            <div className="p-4 text-center text-zinc-500 text-xs">
              No scheduled matches available
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {scheduledMatches.map((match) => (
                <MatchItem key={match.id} match={match} showScore={false} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Results */}
      <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <CardHeader className="py-2 px-3 border-b border-white/5">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-zinc-400" />
            Recent Results
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {completedMatches.length === 0 ? (
            <div className="p-4 text-center text-zinc-500 text-xs">
              No completed matches available
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {completedMatches.map((match) => (
                <MatchItem key={match.id} match={match} showScore={true} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Teams */}
      <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <CardHeader className="py-2 px-3 border-b border-white/5">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            Top Teams
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {topTeams.length === 0 ? (
            <div className="p-4 text-center text-zinc-500 text-xs">
              No standings available
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {topTeams.map((team, index) => (
                <div
                  key={team.id}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent border border-white/20 shrink-0">
                    <span className="text-white font-bold text-xs">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-zinc-700 shrink-0">
                      <Image
                        src={team.team?.logo_url || ""}
                        alt={team.team?.name_en || ""}
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-medium truncate text-xs">
                        {t(team.team, 'name')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-6">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-medium text-white">
                        {team.played}
                      </div>
                      <div className="text-[9px] text-zinc-500">P</div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-medium text-white">
                        {team.won}-{team.draw}-{team.lost}
                      </div>
                      <div className="text-[9px] text-zinc-500">W-D-L</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-white">
                        {team.gd > 0 ? "+" : ""}
                        {team.gd}
                      </div>
                      <div className="text-[9px] text-zinc-500">GD</div>
                    </div>
                    <div className="text-right min-w-[30px]">
                      <div className="text-sm font-bold text-primary">
                        {team.points}
                      </div>
                      <div className="text-[9px] text-zinc-500">PTS</div>
                    </div>
                  </div>
                </div>
              ))}
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
