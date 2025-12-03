"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar,
  Trophy,
  TrendingUp,
  Clock,
  MapPin,
  Play,
  CheckCircle,
  Zap,
  Goal,
  Square,
  Triangle,
  Circle,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLeagueMatches } from "@/lib/hooks/public/useLeagues";
import { useMatchDetail } from "@/lib/hooks/public/useMatchDetail";
import { useHomeNews } from "@/lib/hooks/public/useNews";
import { transformNewsList } from "@/lib/utils/transformers";
import NewsCard from "@/components/news/NewsCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Match } from "@/lib/hooks/public/useMatches";
import { MatchEvent } from "@/lib/hooks/public/useMatchDetail";

interface MatchesTabProps {
  leagueId: string;
}

export default function MatchesTab({ leagueId }: MatchesTabProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const router = useRouter();
  
  const { data: matches, isLoading } = useLeagueMatches(leagueId);
  
  // Fetch news
  const { data: newsData, isLoading: isNewsLoading } = useHomeNews();
  const news = newsData ? transformNewsList(newsData).slice(0, 3) : [];

  // Filter matches by status
  const filteredMatches = matches ? matches.filter(match => {
    if (statusFilter === "all") return true;
    return match.status === statusFilter;
  }) : [];

  // Group matches by status
  const matchesByStatus = {
    live: filteredMatches.filter(match => match.status === "live"),
    upcoming: filteredMatches.filter(match => match.status === "upcoming" || match.status === "scheduled"),
    completed: filteredMatches.filter(match => match.status === "completed")
  };

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

  // Match Item Component
  const MatchItem = ({
    match,
    showScore = true,
    events = []
  }: {
    match: Match;
    showScore?: boolean;
    events?: MatchEvent[];
  }) => (
    <div className="flex flex-col">
      <div 
        className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors gap-4 sm:gap-0 cursor-pointer"
        onClick={() => handleMatchClick(match.id)}
      >
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
                  {match.minute}'
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

      {/* Match Events Summary */}
      {events.length > 0 && (
        <div className="bg-zinc-800/20 p-3 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-zinc-300">Key Events</h4>
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white h-auto p-0 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                handleMatchClick(match.id);
              }}
            >
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
          </div>
          
          <div className="flex gap-1 flex-wrap">
            {events.slice(0, 5).map((event) => (
              <div 
                key={event.id} 
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-700/50"
              >
                {getEventIcon(event.type)}
                <span className="text-xs text-zinc-300">
                  {event.minute}'
                </span>
              </div>
            ))}
            {events.length > 5 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-700/50">
                <span className="text-xs text-zinc-300">
                  +{events.length - 5} more
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Component for completed matches with events
  const CompletedMatchItem = ({ match }: { match: Match }) => {
    const { data: matchDetail, isLoading: isEventsLoading } = useMatchDetail(match.id);
    const events = matchDetail?.events || [];

    return (
      <MatchItem 
        match={match} 
        showScore={true} 
        events={events}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters and Controls */}
      <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <CardHeader className="pb-3 border-b border-white/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Matches
            </CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px] bg-zinc-800/50 border-zinc-700/50 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700/50">
                  <SelectItem value="all">All Matches</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Live Matches */}
      {matchesByStatus.live.length > 0 && (
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
              {matchesByStatus.live.map((match) => (
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
          {matchesByStatus.upcoming.length === 0 ? (
            <div className="p-8 text-center text-zinc-400">
              No scheduled matches available
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {matchesByStatus.upcoming.map((match) => (
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
          {matchesByStatus.completed.length === 0 ? (
            <div className="p-8 text-center text-zinc-400">
              No completed matches available
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {matchesByStatus.completed.map((match) => (
                <CompletedMatchItem key={match.id} match={match} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* No matches found */}
      {filteredMatches.length === 0 && (
        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="text-zinc-400">
              No matches found
            </div>
          </CardContent>
        </Card>
      )}

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