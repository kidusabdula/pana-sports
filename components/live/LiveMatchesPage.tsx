/* eslint-disable @typescript-eslint/no-explicit-any */
// components/live/LiveMatchesPage.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLiveMatches } from "@/lib/hooks/public/useMatches";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  Trophy,
  Search,
  RefreshCw,
  BarChart3,
  Flame,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Suspense } from "react";
import Link from "next/link";

function LiveMatchesPageContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [leagueFilter, setLeagueFilter] = useState("all");
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const router = useRouter();

  const { data: matches, isLoading, refetch } = useLiveMatches();

  // Auto-refresh live matches
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval, refetch]);

  // Filter matches by search term and league
  const filteredMatches = matches
    ? matches.filter((match) => {
        const matchesSearch =
          match.home_team?.name_en
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          match.away_team?.name_en
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          match.league?.name_en
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesLeague =
          leagueFilter === "all" || match.league?.slug === leagueFilter;

        return matchesSearch && matchesLeague;
      })
    : [];

  // Get unique leagues from matches
  const uniqueLeagues = matches
    ? Array.from(
        new Map(
          matches.map((match) => [match.league?.id, match.league])
        ).values()
      ).filter(Boolean)
    : [];

  // Handle match click
  const handleMatchClick = (matchId: string) => {
    router.push(`/matches/${matchId}`);
  };

  // Component for a single match - ultra compact horizontal design
  const CompactMatchItem = ({
    match,
    showMinute,
  }: {
    match: any;
    showMinute?: boolean;
  }) => {
    const getStatusDisplay = () => {
      if (match.status === "live") {
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 group-hover:border-red-500/30 transition-colors">
            <div className="flex flex-col items-center justify-center">
              <span className="text-[9px] font-bold text-red-500 leading-none">
                {showMinute ? `${match.minute}'` : "LIVE"}
              </span>
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
          <div className="flex items-center justify-center w-8 h-8">
            <span className="text-[10px] font-medium text-zinc-500">
              {matchTime}
            </span>
          </div>
        );
      }
      return <div className="w-8" />;
    };

    return (
      <div
        className="flex items-center gap-2 md:gap-4 px-2 py-1 hover:bg-zinc-800/40 transition-colors cursor-pointer border-b border-zinc-800/20 last:border-0 h-10"
        onClick={() => handleMatchClick(match.id)}
      >
        {/* Status Badge */}
        <div className="shrink-0">{getStatusDisplay()}</div>

        {/* Match Content Grid */}
        <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4">
          {/* Home Team */}
          <div className="flex items-center justify-end gap-2 min-w-0">
            <span className="text-xs font-medium text-zinc-300 truncate text-right group-hover:text-white transition-colors">
              {match.home_team?.name_en}
            </span>
            <div className="w-5 h-5 rounded-full overflow-hidden border border-zinc-700/30 shrink-0 bg-zinc-800/50 flex items-center justify-center">
              {match.home_team?.logo_url ? (
                <Image
                  src={match.home_team.logo_url}
                  alt={match.home_team?.name_en || ""}
                  width={20}
                  height={20}
                  className="object-cover"
                />
              ) : (
                <span className="text-[8px] font-bold text-zinc-500">
                  {match.home_team?.name_en?.substring(0, 2).toUpperCase() ||
                    "?"}
                </span>
              )}
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center justify-center bg-zinc-800/30 rounded px-2 py-0.5 min-w-[40px]">
            <span className="text-xs font-bold text-white tracking-wider">
              {match.score_home ?? 0} - {match.score_away ?? 0}
            </span>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-start gap-2 min-w-0">
            <div className="w-5 h-5 rounded-full overflow-hidden border border-zinc-700/30 shrink-0 bg-zinc-800/50 flex items-center justify-center">
              {match.away_team?.logo_url ? (
                <Image
                  src={match.away_team.logo_url}
                  alt={match.away_team?.name_en || ""}
                  width={20}
                  height={20}
                  className="object-cover"
                />
              ) : (
                <span className="text-[8px] font-bold text-zinc-500">
                  {match.away_team?.name_en?.substring(0, 2).toUpperCase() ||
                    "?"}
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-zinc-300 truncate text-left group-hover:text-white transition-colors">
              {match.away_team?.name_en}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Component for league group with matches - more compact
  const LeagueMatchGroup = ({
    league,
    matches,
  }: {
    league: any;
    matches: any[];
  }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const leagueMatches = matches.filter((m) => m.league?.id === league.id);
    const liveCount = leagueMatches.filter((m) => m.status === "live").length;
    const totalGoals = leagueMatches.reduce(
      (sum, m) => sum + (m.score_home || 0) + (m.score_away || 0),
      0
    );

    return (
      <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800/40 overflow-hidden">
        {/* League Header - Compact */}
        <div
          className="flex items-center justify-between px-2 md:px-3 py-1.5 md:py-2 border-b border-zinc-800/40 cursor-pointer hover:bg-zinc-800/40 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full overflow-hidden border border-zinc-700/50 bg-zinc-800/50 flex items-center justify-center shrink-0">
              {league.logo_url ? (
                <Image
                  src={league.logo_url}
                  alt={league.name_en || ""}
                  width={20}
                  height={20}
                  className="object-cover"
                />
              ) : (
                <span className="text-[7px] md:text-[8px] font-bold text-zinc-500">
                  {league.name_en?.substring(0, 2).toUpperCase() || "?"}
                </span>
              )}
            </div>
            <h3 className="text-xs md:text-sm font-semibold text-zinc-100">
              {league.name_en}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            {liveCount > 0 && (
              <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[9px] md:text-[10px] px-1.5 py-0 h-4">
                {liveCount} Live
              </Badge>
            )}
            {/* Goals badge - desktop only */}
            {totalGoals > 0 && (
              <Badge className="hidden md:inline-flex bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] px-1.5 py-0 h-4">
                {totalGoals}G
              </Badge>
            )}
            <ChevronDown
              className={cn(
                "h-3 md:h-3.5 w-3 md:w-3.5 text-zinc-500 transition-transform",
                isExpanded && "rotate-180"
              )}
            />
          </div>
        </div>

        {/* Matches List */}
        {isExpanded && (
          <div>
            {leagueMatches.map((match) => (
              <CompactMatchItem key={match.id} match={match} showMinute />
            ))}
          </div>
        )}
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalGoals = filteredMatches.reduce(
    (sum, m) => sum + (m.score_home || 0) + (m.score_away || 0),
    0
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header - More Compact */}
      <div className="bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between py-4.5">
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all h-8 px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1 text-xs">Back</span>
                </Button>
              </Link>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </div>
                <h1 className="text-sm sm:text-base font-bold text-white">
                  Live Matches
                </h1>
                <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px] h-4 px-1.5">
                  {filteredMatches.length}
                </Badge>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden sm:flex items-center gap-1 bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/30 p-0.5 rounded-lg">
                <Button
                  variant={refreshInterval === 10 ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setRefreshInterval(10)}
                  className={cn(
                    "text-[10px] font-medium transition-all h-6 px-2",
                    refreshInterval === 10
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  10s
                </Button>
                <Button
                  variant={refreshInterval === 30 ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setRefreshInterval(30)}
                  className={cn(
                    "text-[10px] font-medium transition-all h-6 px-2",
                    refreshInterval === 30
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  30s
                </Button>
                <Button
                  variant={refreshInterval === 60 ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setRefreshInterval(60)}
                  className={cn(
                    "text-[10px] font-medium transition-all h-6 px-2",
                    refreshInterval === 60
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  1m
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all h-8 w-8"
                onClick={() => refetch()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 space-y-4">
        {/* Stats Cards - Compact */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800/40 overflow-hidden">
            <CardContent className="p-3">
              <div className="flex flex-col items-center gap-1">
                <Flame className="h-4 w-4 text-red-400" />
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {filteredMatches.length}
                </div>
                <div className="text-[10px] text-zinc-500 text-center">
                  Live Matches
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800/40 overflow-hidden">
            <CardContent className="p-3">
              <div className="flex flex-col items-center gap-1">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {totalGoals}
                </div>
                <div className="text-[10px] text-zinc-500 text-center">
                  Total Goals
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800/40 overflow-hidden">
            <CardContent className="p-3">
              <div className="flex flex-col items-center gap-1">
                <Trophy className="h-4 w-4 text-amber-400" />
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {uniqueLeagues.length}
                </div>
                <div className="text-[10px] text-zinc-500 text-center">
                  Leagues
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters - Compact */}
        <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800/40 overflow-hidden">
          <CardContent className="p-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                <Input
                  placeholder="Search teams or leagues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-8 text-xs bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-600"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select value={leagueFilter} onValueChange={setLeagueFilter}>
                  <SelectTrigger className="h-8 text-xs bg-zinc-800/50 border-zinc-700/50 text-white">
                    <SelectValue placeholder="Filter by league" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700/50">
                    <SelectItem value="all" className="text-xs">
                      All Leagues
                    </SelectItem>
                    {uniqueLeagues.map((league) => (
                      <SelectItem
                        key={league.id}
                        value={league.slug || league.id}
                        className="text-xs"
                      >
                        {league.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Matches - Grouped by League */}
        <div className="space-y-2">
          {filteredMatches.length === 0 ? (
            <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800/40">
              <CardContent className="p-8 text-center text-zinc-500 text-sm">
                No live matches available
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {uniqueLeagues.map((league) => (
                <LeagueMatchGroup
                  key={league.id}
                  league={league}
                  matches={filteredMatches}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LiveMatchesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <LiveMatchesPageContent />
    </Suspense>
  );
}
