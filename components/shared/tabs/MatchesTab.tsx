"use client";

import { useState } from "react";
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
  Clock,
  Filter,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useLeagueMatches } from "@/lib/hooks/public/useLeagues";
import { useRouter } from "next/navigation";
import { Match } from "@/lib/hooks/public/useMatches";
import { useLanguage } from "@/components/providers/language-provider";
import AdBanner from "@/components/shared/AdBanner";
import { motion } from "framer-motion";
import { useLiveMatchTime } from "@/components/shared/LiveMatchTime";

interface MatchesTabProps {
  leagueId: string;
}

// Live minute badge component that uses the hook
const LiveMinuteBadge = ({ match }: { match: Match }) => {
  const displayMinute = useLiveMatchTime(match);
  return (
    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
      Live • {displayMinute}&apos;
    </span>
  );
};

export default function MatchesTab({ leagueId }: MatchesTabProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const router = useRouter();
  const { t } = useLanguage();

  const { data: matches, isLoading } = useLeagueMatches(leagueId);

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

  // Match Card Component
  const MatchCard = ({
    match,
    isLive = false,
  }: {
    match: Match;
    isLive?: boolean;
  }) => {
    const isCompleted = match.status === "completed";

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => handleMatchClick(match.id)}
        className="group cursor-pointer"
      >
        <div
          className={`bg-zinc-900/60 backdrop-blur-xl rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-lg ${
            isLive
              ? "border-red-500/30 hover:border-red-500/50 hover:shadow-red-500/10"
              : "border-white/10 hover:border-primary/30 hover:shadow-primary/5"
          }`}
        >
          {/* Live Badge */}
          {isLive && (
            <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 flex items-center justify-center gap-2">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </div>
              <LiveMinuteBadge match={match} />
            </div>
          )}

          <div className="p-5">
            {/* Date/Time Header */}
            {!isLive && (
              <div className="text-center mb-4">
                <p className="text-xs text-zinc-500">
                  {new Date(match.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                {!isCompleted && (
                  <p className="text-sm font-bold text-white mt-0.5">
                    {new Date(match.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                )}
              </div>
            )}

            {/* Teams and Score */}
            <div className="flex items-center justify-between gap-4">
              {/* Home Team */}
              <div className="flex-1 text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Image
                    src={match.home_team?.logo_url || ""}
                    alt={t(match.home_team, "name")}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                  {t(match.home_team, "name")}
                </p>
              </div>

              {/* Score / VS */}
              <div className="flex flex-col items-center px-4">
                {isCompleted || isLive ? (
                  <div className="flex items-center gap-2 bg-zinc-800/80 px-4 py-2 rounded-xl">
                    <span className="text-2xl font-bold text-white">
                      {match.score_home ?? 0}
                    </span>
                    <span className="text-lg text-zinc-500">-</span>
                    <span className="text-2xl font-bold text-white">
                      {match.score_away ?? 0}
                    </span>
                  </div>
                ) : (
                  <div className="bg-zinc-800/50 px-4 py-2 rounded-xl">
                    <span className="text-lg font-bold text-zinc-500">VS</span>
                  </div>
                )}
                {isCompleted && (
                  <span className="text-[10px] text-emerald-500 font-medium mt-1.5 uppercase">
                    Full Time
                  </span>
                )}
              </div>

              {/* Away Team */}
              <div className="flex-1 text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Image
                    src={match.away_team?.logo_url || ""}
                    alt={t(match.away_team, "name")}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                  {t(match.away_team, "name")}
                </p>
              </div>
            </div>

            {/* Match Info Footer */}
            <div className="flex items-center justify-center mt-4 pt-4 border-t border-white/5">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-primary text-xs"
              >
                View Match Details
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Match Schedule</h2>
              <p className="text-xs text-zinc-500">
                {filteredMatches.length} matches total
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-10 bg-zinc-800/50 border-zinc-700/50 text-white rounded-xl">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700/50">
                <SelectItem value="all">All Matches</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Live Matches */}
      {matchesByStatus.live.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </div>
            <h3 className="text-lg font-bold text-white">Live Now</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchesByStatus.live.map((match) => (
              <MatchCard key={match.id} match={match} isLive={true} />
            ))}
          </div>
        </div>
      )}

      {/* Ad Banner */}
      <AdBanner variant="full" showClose={false} page="league-matches" />

      {/* Upcoming Matches */}
      {(statusFilter === "all" || statusFilter === "upcoming") &&
        matchesByStatus.upcoming.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-white">
                Upcoming Fixtures
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchesByStatus.upcoming.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

      {/* Completed Matches */}
      {(statusFilter === "all" || statusFilter === "completed") &&
        matchesByStatus.completed.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <h3 className="text-lg font-bold text-white">Recent Results</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchesByStatus.completed.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

      {filteredMatches.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No matches found</p>
        </div>
      )}

      {/* Bottom Ad Banner */}
      <AdBanner variant="inline" showClose={false} page="league-matches" />
    </div>
  );
}
