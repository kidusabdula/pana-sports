"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Trophy,
  TrendingUp,
  Clock,
  MapPin,
  Play,
  CheckCircle,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { League, Standing } from "@/lib/hooks/public/useLeagues";
import { Match } from "@/lib/hooks/public/useMatches";
import { cn } from "@/lib/utils";
import { useHomeNews } from "@/lib/hooks/public/useNews";
import { transformNewsList } from "@/lib/utils/transformers";
import NewsCard from "@/components/news/NewsCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface OverviewTabProps {
  league: League;
  matches: Match[];
  standings: Standing[];
}

export default function OverviewTab({
  league,
  matches,
  standings,
}: OverviewTabProps) {
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

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status color based on match status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "live":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "upcoming":
      case "scheduled":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
    }
  };

  const MatchItem = ({
    match,
    showScore = true,
  }: {
    match: Match;
    showScore?: boolean;
  }) => (
    <Link href={`/matches/${match.id}`} className="block">
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors gap-4 sm:gap-0 cursor-pointer">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="flex items-center gap-3 flex-1 justify-end sm:justify-start">
            <span className="text-white font-medium text-right sm:text-left truncate w-full sm:w-auto">
              {match.home_team?.name_en}
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-zinc-700 shrink-0">
              <Image
                src={match.home_team?.logo_url || ""}
                alt={match.home_team?.name_en || ""}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="text-center px-2 sm:px-4 min-w-[100px]">
          {showScore ? (
            <div className="text-xl sm:text-2xl font-bold text-white">
              {match.score_home} - {match.score_away}
            </div>
          ) : (
            <div className="text-sm font-medium text-zinc-400 bg-zinc-800/50 px-3 py-1 rounded-full">
              VS
            </div>
          )}

          <div className="flex flex-col items-center gap-1 mt-1">
            <div className="flex items-center justify-center gap-2">
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border uppercase",
                  getStatusColor(match.status)
                )}
              >
                {match.status}
              </span>
              {match.status === "live" && (
                <span className="text-xs text-red-400 flex items-center gap-1 animate-pulse font-bold">
                  <Clock className="h-3 w-3" />
                  {match.minute}&apos;
                </span>
              )}
            </div>
            <div className="text-[10px] sm:text-xs text-zinc-500">
              {formatDate(match.date)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-1 justify-end w-full sm:w-auto">
          <div className="flex items-center gap-3 flex-1 justify-start sm:justify-end">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-zinc-700 shrink-0">
              <Image
                src={match.away_team?.logo_url || ""}
                alt={match.away_team?.name_en || ""}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <span className="text-white font-medium text-left sm:text-right truncate w-full sm:w-auto">
              {match.away_team?.name_en}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-8">
      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <Card className="bg-zinc-900/40 backdrop-blur-xl border-red-500/20 overflow-hidden">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </div>
              Live Matches
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-800">
              {liveMatches.map((match) => (
                <MatchItem key={match.id} match={match} showScore={true} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Matches */}
      <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Scheduled Matches
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {scheduledMatches.length === 0 ? (
            <div className="p-8 text-center text-zinc-400">
              No scheduled matches available
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {scheduledMatches.map((match) => (
                <MatchItem key={match.id} match={match} showScore={false} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Results */}
      <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Recent Results
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {completedMatches.length === 0 ? (
            <div className="p-8 text-center text-zinc-400">
              No completed matches available
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {completedMatches.map((match) => (
                <MatchItem key={match.id} match={match} showScore={true} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
