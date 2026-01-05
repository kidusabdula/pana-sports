/* eslint-disable @typescript-eslint/no-explicit-any */
// components/live/LiveMatchesPage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLiveMatches } from "@/lib/hooks/public/useMatches";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  ChevronRight,
  Clock,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Suspense } from "react";
import { useLiveMatchTime } from "@/components/shared/LiveMatchTime";
import { motion, AnimatePresence } from "framer-motion";

// Status constants
const runningStatuses = ["live", "second_half", "extra_time"];

// Enhanced Match Card Component
function LiveMatchCard({
  match,
  onClick,
}: {
  match: any;
  onClick: (id: string) => void;
}) {
  const displayMinute = useLiveMatchTime(match);

  const isPaused = match.status === "paused";
  const isHalfTime = match.status === "half_time";
  const isPenalties = match.status === "penalties";
  const isRunning = runningStatuses.includes(match.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => onClick(match.id)}
      className="group cursor-pointer relative"
    >
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-linear-to-r from-primary/10 via-purple-500/5 to-primary/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>

      <Card className="relative bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] rounded-2xl">
        {/* Status Header */}
        <div
          className={cn(
            "px-4 py-2 flex items-center justify-center gap-2 border-b border-white/5",
            isPaused
              ? "bg-yellow-500/5"
              : isHalfTime
              ? "bg-orange-500/5"
              : isPenalties
              ? "bg-purple-500/5"
              : "bg-red-500/5"
          )}
        >
          {isRunning && (
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </div>
          )}
          <span
            className={cn(
              "text-[10px] font-black uppercase tracking-widest",
              isPaused
                ? "text-yellow-500"
                : isHalfTime
                ? "text-orange-500"
                : isPenalties
                ? "text-purple-500"
                : "text-red-500"
            )}
          >
            {isPaused && "PAUSED"}
            {isHalfTime && "HALF TIME"}
            {isPenalties && "PENALTIES"}
            {isRunning && `LIVE • ${displayMinute}'`}
          </span>
        </div>

        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            {/* Home Team */}
            <div className="flex-1 flex flex-col items-center gap-3">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 transition-transform group-hover:scale-105">
                {match.home_team?.logo_url ? (
                  <Image
                    src={match.home_team.logo_url}
                    alt={match.home_team.name_en}
                    width={48}
                    height={48}
                    className="object-contain w-full h-full drop-shadow-lg"
                  />
                ) : (
                  <span className="text-zinc-500 font-bold text-lg">
                    {match.home_team?.name_en?.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-bold text-white text-center line-clamp-2">
                {match.home_team?.name_en}
              </span>
            </div>

            {/* Score Center */}
            <div className="flex flex-col items-center shrink-0 min-w-[80px]">
              <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2 shadow-inner">
                <span className="text-2xl sm:text-3xl font-black text-white tabular-nums drop-shadow-sm">
                  {match.score_home ?? 0}
                </span>
                <span className="text-zinc-600 font-bold">:</span>
                <span className="text-2xl sm:text-3xl font-black text-white tabular-nums drop-shadow-sm">
                  {match.score_away ?? 0}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 opacity-50">
                <BarChart3 className="h-3 w-3 text-zinc-400" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                  Stats
                </span>
              </div>
            </div>

            {/* Away Team */}
            <div className="flex-1 flex flex-col items-center gap-3">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 transition-transform group-hover:scale-105">
                {match.away_team?.logo_url ? (
                  <Image
                    src={match.away_team.logo_url}
                    alt={match.away_team.name_en}
                    width={48}
                    height={48}
                    className="object-contain w-full h-full drop-shadow-lg"
                  />
                ) : (
                  <span className="text-zinc-500 font-bold text-lg">
                    {match.away_team?.name_en?.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-bold text-white text-center line-clamp-2">
                {match.away_team?.name_en}
              </span>
            </div>
          </div>
        </CardContent>

        {/* Bottom Detail Strip */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-zinc-500 font-medium">
              {match.league?.name_en}
            </span>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Details
            </span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>

        {/* Live Progress Bar */}
        {isRunning && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(((match.minute || 0) / 90) * 100, 100)}%`,
              }}
              className="h-full bg-linear-to-r from-red-500 to-primary"
            />
          </div>
        )}
      </Card>
    </motion.div>
  );
}

function LiveMatchesPageContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [leagueFilter, setLeagueFilter] = useState("all");
  const router = useRouter();

  const { data: matches, isLoading, refetch } = useLiveMatches();

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

  const uniqueLeagues = matches
    ? Array.from(
        new Map(
          matches.map((match) => [match.league?.id, match.league])
        ).values()
      ).filter(Boolean)
    : [];

  const handleMatchClick = (matchId: string) => {
    router.push(`/matches/${matchId}`);
  };

  const LeagueMatchGroup = ({
    league,
    matches,
  }: {
    league: any;
    matches: any[];
  }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const leagueMatches = matches.filter((m) => m.league?.id === league.id);
    const liveCount = leagueMatches.length;

    return (
      <div className="space-y-3">
        {/* League Header - Revamped */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between px-1"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 p-1.5 flex items-center justify-center shrink-0">
              {league.logo_url ? (
                <Image
                  src={league.logo_url}
                  alt={league.name_en || ""}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              ) : (
                <Trophy className="h-4 w-4 text-zinc-500" />
              )}
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                {league.name_en}
              </h3>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
                {liveCount} Active Matches
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                isExpanded && "rotate-180"
              )}
            />
          </Button>
        </motion.div>

        {/* Matches Grid */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {leagueMatches.map((match) => (
                <LiveMatchCard
                  key={match.id}
                  match={match}
                  onClick={handleMatchClick}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin"></div>
        </div>
      </div>
    );
  }

  const totalGoals = filteredMatches.reduce(
    (sum, m) => sum + (m.score_home || 0) + (m.score_away || 0),
    0
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-primary/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Header - Premium Refined */}
      <div className="sticky top-0 border-b border-white/5 bg-zinc-950/80 backdrop-blur-2xl z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
                className="rounded-xl border-white/10 hover:border-primary/50 transition-all bg-white/5"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                  </div>
                  <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                    Live Arena
                  </h1>
                </div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] ml-6">
                  Real-time Sports Intelligence
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2 rounded-xl border-white/10 hover:border-primary/50 bg-white/5 transition-all"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Refresh
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-10 relative">
        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center gap-2 text-center group"
          >
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center transition-colors group-hover:bg-red-500/20">
              <Flame className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <div className="text-3xl font-black text-white tracking-tight">
                {filteredMatches.length}
              </div>
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                Live Feed
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center gap-2 text-center group"
          >
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-3xl font-black text-white tracking-tight">
                {totalGoals}
              </div>
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                Total Goals
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center gap-2 text-center group"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center transition-colors group-hover:bg-amber-500/20">
              <Trophy className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <div className="text-3xl font-black text-white tracking-tight">
                {uniqueLeagues.length}
              </div>
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                Active Leagues
              </div>
            </div>
          </motion.div>
        </div>

        {/* Global Control Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Filter by match, team or competition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 rounded-2xl bg-white/5 border-white/5 text-white placeholder:text-zinc-600 focus:border-primary/50 transition-all"
            />
          </div>
          <div className="w-full sm:w-64">
            <Select value={leagueFilter} onValueChange={setLeagueFilter}>
              <SelectTrigger className="h-12 rounded-2xl bg-white/5 border-white/5 text-white focus:border-primary/50 transition-all">
                <SelectValue placeholder="All Competitions" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/10 rounded-2xl backdrop-blur-xl">
                <SelectItem value="all">All Competitions</SelectItem>
                {uniqueLeagues.map((league) => (
                  <SelectItem key={league.id} value={league.slug || league.id}>
                    {league.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dynamic League Feeds */}
        <div className="space-y-12">
          {filteredMatches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-20 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-zinc-500" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest">
                No Active Matches
              </h3>
              <p className="text-zinc-500 mt-2 font-medium">
                Please check back later for live coverage.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-12 pb-20">
              {uniqueLeagues
                .filter((l) =>
                  filteredMatches.some((m) => m.league?.id === l.id)
                )
                .map((league) => (
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
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin"></div>
          </div>
        </div>
      }
    >
      <LiveMatchesPageContent />
    </Suspense>
  );
}
