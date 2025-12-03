/* eslint-disable @typescript-eslint/no-explicit-any */
// components/live/LiveMatchesPage.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLiveMatches } from "@/lib/hooks/public/useMatches";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ChevronRight,
  Clock,
  Trophy,
  Search,
  Filter,
  RefreshCw,
  BarChart3,
  Flame,
  ChevronUp,
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

  // Component for a single match - compact design
  const CompactMatchItem = ({ match }: { match: any }) => {
    const getStatusBadge = () => {
      if (match.status === "live") {
        return (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">
              FT
            </span>
          </div>
        );
      }
      // For scheduled matches
      if (match.date) {
        const matchTime = new Date(match.date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        return (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-800/50">
            <Clock className="h-3 w-3 text-zinc-400" />
            <span className="text-xs font-medium text-zinc-300">
              {matchTime}
            </span>
          </div>
        );
      }
      return null;
    };

    return (
      <div
        className="flex items-center justify-between p-3 hover:bg-zinc-800/40 transition-all cursor-pointer group rounded-lg"
        onClick={() => handleMatchClick(match.id)}
      >
        {/* Home Team */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-zinc-700/50 shrink-0 bg-zinc-800 flex items-center justify-center">
            {match.home_team?.logo_url ? (
              <Image
                src={match.home_team.logo_url}
                alt={match.home_team?.name_en || ""}
                width={24}
                height={24}
                className="object-cover"
              />
            ) : (
              <span className="text-[9px] font-bold text-zinc-500">
                {match.home_team?.name_en?.substring(0, 2).toUpperCase() || "?"}
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">
            {match.home_team?.name_en}
          </span>
        </div>

        {/* Score/Status */}
        <div className="flex items-center gap-3 px-4">
          {match.status === "live" ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white min-w-[20px] text-right">
                  {match.score_home}
                </span>
                <span className="text-sm text-zinc-500 font-medium">-</span>
                <span className="text-lg font-bold text-white min-w-[20px] text-left">
                  {match.score_away}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </div>
              </div>
            </>
          ) : (
            getStatusBadge()
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors text-right">
            {match.away_team?.name_en}
          </span>
          <div className="w-6 h-6 rounded-full overflow-hidden border border-zinc-700/50 shrink-0 bg-zinc-800 flex items-center justify-center">
            {match.away_team?.logo_url ? (
              <Image
                src={match.away_team.logo_url}
                alt={match.away_team?.name_en || ""}
                width={24}
                height={24}
                className="object-cover"
              />
            ) : (
              <span className="text-[9px] font-bold text-zinc-500">
                {match.away_team?.name_en?.substring(0, 2).toUpperCase() || "?"}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Component for league group with matches
  const LeagueMatchGroup = ({
    league,
    matches,
  }: {
    league: any;
    matches: any[];
  }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const leagueMatches = matches.filter((m) => m.league?.id === league.id);

    return (
      <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50 overflow-hidden">
        {/* League Header */}
        <div
          className="flex items-center justify-between p-3 border-b border-zinc-800/50 cursor-pointer hover:bg-zinc-800/30 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-zinc-700/50 bg-zinc-800 flex items-center justify-center shrink-0">
              {league.logo_url ? (
                <Image
                  src={league.logo_url}
                  alt={league.name_en || ""}
                  width={24}
                  height={24}
                  className="object-cover"
                />
              ) : (
                <span className="text-[9px] font-bold text-zinc-500">
                  {league.name_en?.substring(0, 2).toUpperCase() || "?"}
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-white">
              {league.name_en}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-zinc-800/50 text-zinc-300 border-zinc-700/50 text-xs px-2 py-0"
            >
              {leagueMatches.length}
            </Badge>
            <ChevronUp
              className={cn(
                "h-4 w-4 text-zinc-400 transition-transform",
                !isExpanded && "rotate-180"
              )}
            />
          </div>
        </div>

        {/* Matches List */}
        {isExpanded && (
          <div className="divide-y divide-zinc-800/30">
            {leagueMatches.map((match) => (
              <CompactMatchItem key={match.id} match={match} />
            ))}
          </div>
        )}
      </Card>
    );
  };

  // Component for league stats
  const LeagueStatsCard = ({
    league,
    matches,
  }: {
    league: any;
    matches: any[];
  }) => {
    const leagueMatches = matches.filter((m) => m.league?.id === league.id);
    const totalGoals = leagueMatches.reduce(
      (sum, m) => sum + m.score_home + m.score_away,
      0
    );
    const avgGoals =
      leagueMatches.length > 0
        ? (totalGoals / leagueMatches.length).toFixed(1)
        : "0.0";

    return (
      <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <CardHeader className="pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 flex items-center justify-center">
              {league.logo_url ? (
                <Image
                  src={league.logo_url}
                  alt={league.name_en || ""}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-zinc-400">
                  {league.name_en?.substring(0, 2).toUpperCase() || "?"}
                </span>
              )}
            </div>
            <CardTitle className="text-sm text-white truncate">
              {league.name_en}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-white">
                {leagueMatches.length}
              </div>
              <div className="text-xs text-zinc-500">Live</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{totalGoals}</div>
              <div className="text-xs text-zinc-500">Goals</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{avgGoals}</div>
              <div className="text-xs text-zinc-500">Avg</div>
            </div>
          </div>
        </CardContent>
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Left Section */}
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="hidden sm:inline ml-1">Back</span>
                </Button>
              </Link>

              <div className="flex items-center gap-2">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </div>
                <h1 className="text-lg font-bold text-white">Live Matches</h1>
                <Badge className="bg-red-500/10 text-red-400 border-red-500/30">
                  {filteredMatches.length}
                </Badge>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 bg-zinc-800/40 backdrop-blur-sm border border-white/5 p-1 rounded-xl">
                <Button
                  variant={refreshInterval === 10 ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setRefreshInterval(10)}
                  className={cn(
                    "text-xs font-medium transition-all",
                    refreshInterval === 10
                      ? "bg-zinc-800 text-white shadow-lg"
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
                    "text-xs font-medium transition-all",
                    refreshInterval === 30
                      ? "bg-zinc-800 text-white shadow-lg"
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
                    "text-xs font-medium transition-all",
                    refreshInterval === 60
                      ? "bg-zinc-800 text-white shadow-lg"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  1m
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all"
                onClick={() => refetch()}
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                Total Live Matches
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-white text-center">
                {filteredMatches.length}
              </div>
              <div className="text-sm text-zinc-400 text-center">
                matches in progress
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Total Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-white text-center">
                {filteredMatches.reduce(
                  (sum, m) => sum + m.score_home + m.score_away,
                  0
                )}
              </div>
              <div className="text-sm text-zinc-400 text-center">
                goals scored
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Active Leagues
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-white text-center">
                {uniqueLeagues.length}
              </div>
              <div className="text-sm text-zinc-400 text-center">
                competitions
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search teams or leagues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-zinc-800/50 border-zinc-700/50 text-white"
                />
              </div>
              <div className="w-full sm:w-auto">
                <Select value={leagueFilter} onValueChange={setLeagueFilter}>
                  <SelectTrigger className="w-full bg-zinc-800/50 border-zinc-700/50 text-white">
                    <SelectValue placeholder="Filter by league" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700/50">
                    <SelectItem value="all">All Leagues</SelectItem>
                    {uniqueLeagues.map((league) => (
                      <SelectItem
                        key={league.id}
                        value={league.slug || league.id}
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

        {/* League Stats */}
        {uniqueLeagues.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              League Statistics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {uniqueLeagues.map((league) => (
                <LeagueStatsCard
                  key={league.id}
                  league={league}
                  matches={filteredMatches}
                />
              ))}
            </div>
          </div>
        )}

        {/* Live Matches - Grouped by League */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </div>
            Live Matches
            <Badge className="bg-red-500/10 text-red-400 border-red-500/30">
              {filteredMatches.length}
            </Badge>
          </h2>

          {filteredMatches.length === 0 ? (
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5">
              <CardContent className="p-8 text-center text-zinc-400">
                No live matches available
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
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
