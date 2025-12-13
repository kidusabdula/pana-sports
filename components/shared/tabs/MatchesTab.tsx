"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  CheckCircle,
  Zap,
  Goal,
  Square,
  Triangle,
  Circle,
} from "lucide-react";
import Image from "next/image";
import { useLeagueMatches } from "@/lib/hooks/public/useLeagues";
import { useMatchDetail } from "@/lib/hooks/public/useMatchDetail";
import { useHomeNews } from "@/lib/hooks/public/useNews";
import { transformNewsList } from "@/lib/utils/transformers";
import NewsCard from "@/components/news/NewsCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Match } from "@/lib/hooks/public/useMatches";
import { MatchEvent } from "@/lib/hooks/public/useMatchDetail";
import { useLanguage } from "@/components/providers/language-provider";

interface MatchesTabProps {
  leagueId: string;
}

export default function MatchesTab({ leagueId }: MatchesTabProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const router = useRouter();
  const { t } = useLanguage();

  const { data: matches, isLoading } = useLeagueMatches(leagueId);

  // Fetch news
  const { data: newsData, isLoading: isNewsLoading } = useHomeNews();
  const news = newsData ? transformNewsList(newsData).slice(0, 3) : [];

  // Filter matches by status
  const filteredMatches = matches
    ? matches.filter((match) => {
        if (statusFilter === "all") return true;
        return match.status === statusFilter;
      })
    : [];

  // Group matches by status
  const matchesByStatus = {
    live: filteredMatches.filter((match) => match.status === "live"),
    upcoming: filteredMatches.filter(
      (match) => match.status === "upcoming" || match.status === "scheduled"
    ),
    completed: filteredMatches.filter((match) => match.status === "completed"),
  };

  // Handle match click
  const handleMatchClick = (matchId: string) => {
    router.push(`/matches/${matchId}`);
  };

  // Get event icon based on event type
  const getEventIcon = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case "goal":
        return <Goal className="h-3 w-3 text-green-400" />;
      case "yellow_card":
        return <Square className="h-3 w-3 text-yellow-400" />;
      case "red_card":
        return <Square className="h-3 w-3 text-red-400" />;
      case "substitution":
        return <Triangle className="h-3 w-3 text-blue-400" />;
      default:
        return <Circle className="h-3 w-3 text-zinc-400" />;
    }
  };

  // Compact Match Item Component
  const MatchItem = ({
    match,
    showScore = true,
    events = [],
  }: {
    match: Match;
    showScore?: boolean;
    events?: MatchEvent[];
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
      <div className="flex flex-col border-b border-white/5 last:border-0">
        <div
          className="flex items-center gap-2 md:gap-3 px-3 py-2 hover:bg-white/5 transition-colors cursor-pointer group"
          onClick={() => handleMatchClick(match.id)}
        >
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

        {/* Match Events Summary - Compact */}
        {events.length > 0 && (
          <div className="px-3 pb-2 flex items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex gap-1.5 flex-wrap justify-center">
              {events.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-1"
                  title={`${event.type} - ${event.minute}'`}
                >
                  {getEventIcon(event.type)}
                  <span className="text-[9px] text-zinc-400">
                    {event.minute}&apos;
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Component for completed matches with events
  const CompletedMatchItem = ({ match }: { match: Match }) => {
    const { data: matchDetail } = useMatchDetail(match.id);
    const events = matchDetail?.events || [];

    return <MatchItem match={match} showScore={true} events={events} />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Controls - Compact */}
      <div className="flex items-center justify-between bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-lg p-2">
        <div className="flex items-center gap-2 px-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-white">Matches</span>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] h-8 text-xs bg-zinc-800/50 border-zinc-700/50 text-white">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700/50">
            <SelectItem value="all">All Matches</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Live Matches */}
      {matchesByStatus.live.length > 0 && (
        <Card className="bg-zinc-900/40 backdrop-blur-xl border-red-500/20 overflow-hidden">
          <CardHeader className="py-2 px-3 border-b border-white/5 bg-red-500/5">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </div>
              Live Now
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-800/50">
              {matchesByStatus.live.map((match) => (
                <MatchItem key={match.id} match={match} showScore={true} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Matches */}
      {(statusFilter === "all" ||
        statusFilter === "upcoming" ||
        statusFilter === "scheduled") && (
        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
          <CardHeader className="py-2 px-3 border-b border-white/5">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-zinc-400" />
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {matchesByStatus.upcoming.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 text-xs">
                No scheduled matches
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/50">
                {matchesByStatus.upcoming.map((match) => (
                  <MatchItem key={match.id} match={match} showScore={false} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Results */}
      {(statusFilter === "all" || statusFilter === "completed") && (
        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
          <CardHeader className="py-2 px-3 border-b border-white/5">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-zinc-400" />
              Recent Results
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {matchesByStatus.completed.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 text-xs">
                No completed matches
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/50">
                {matchesByStatus.completed.map((match) => (
                  <CompletedMatchItem key={match.id} match={match} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
