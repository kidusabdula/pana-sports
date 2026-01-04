// components/matches/MatchRow.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Match } from "@/lib/hooks/public/useMatches";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { useLiveMatchTime } from "@/components/shared/LiveMatchTime";

interface MatchRowProps {
  match: Match;
  isLive?: boolean;
}

export default function MatchRow({ match, isLive = false }: MatchRowProps) {
  // Use hook for real-time minute calculation
  const displayMinute = useLiveMatchTime(match);

  const getStatusBadge = () => {
    if (
      isLive ||
      ["live", "second_half", "extra_time"].includes(match.status)
    ) {
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-800/30 animate-pulse text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-red-500 mr-1"></span>
          LIVE {displayMinute}&apos;
        </Badge>
      );
    }

    switch (match.status) {
      case "scheduled":
      case "upcoming":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-800/30 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
            <span className="hidden sm:inline">
              {new Date(match.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="sm:hidden">
              {new Date(match.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-800/30 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
            FT
          </Badge>
        );
      case "postponed":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-800/30 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
            <span className="hidden sm:inline">POSTPONED</span>
            <span className="sm:hidden">POST</span>
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Link href={`/matches/${match.id}`} className="block">
      <div
        className={cn(
          "flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 items-center hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 cursor-pointer group",
          isLive && "bg-red-900/10 hover:bg-red-900/15"
        )}
      >
        {/* Mobile: Top Row - Teams Side by Side */}
        <div className="flex sm:hidden items-center justify-between w-full gap-2">
          {/* Home Team - Mobile */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-zinc-700/50 shrink-0">
              <Image
                src={match.home_team.logo_url || ""}
                alt={match.home_team.name_en}
                width={28}
                height={28}
                className="object-cover"
              />
            </div>
            <span className="text-sm font-medium text-zinc-200 truncate">
              {match.home_team.name_en}
            </span>
          </div>

          {/* Score/VS - Mobile Center */}
          <div className="flex items-center justify-center px-2 shrink-0">
            {isLive || match.status === "completed" ? (
              <div className="text-base sm:text-lg font-bold text-white tabular-nums">
                {match.score_home} - {match.score_away}
              </div>
            ) : (
              <div className="text-base font-semibold text-zinc-400">vs</div>
            )}
          </div>

          {/* Away Team - Mobile */}
          <div className="flex items-center gap-2 justify-end flex-1 min-w-0">
            <span className="text-sm font-medium text-zinc-200 truncate text-right">
              {match.away_team.name_en}
            </span>
            <div className="w-7 h-7 rounded-full overflow-hidden border border-zinc-700/50 shrink-0">
              <Image
                src={match.away_team.logo_url || ""}
                alt={match.away_team.name_en}
                width={28}
                height={28}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Mobile: Bottom Row - Status Badge */}
        <div className="flex sm:hidden items-center justify-center w-full">
          {getStatusBadge()}
        </div>

        {/* Desktop: Home Team */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-zinc-700/50 shrink-0 group-hover:border-primary/30 transition-colors">
            <Image
              src={match.home_team.logo_url || ""}
              alt={match.home_team.name_en}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <span className="text-sm sm:text-base font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
            {match.home_team.name_en}
          </span>
        </div>

        {/* Desktop: Match Status */}
        <div className="hidden sm:flex flex-col items-center gap-1 sm:gap-1.5 min-w-[80px] sm:min-w-[100px]">
          {isLive || match.status === "completed" ? (
            <div className="text-lg sm:text-xl font-bold text-white tabular-nums">
              {match.score_home} - {match.score_away}
            </div>
          ) : (
            <div className="text-lg sm:text-xl font-bold text-zinc-400">vs</div>
          )}
          {getStatusBadge()}
        </div>

        {/* Desktop: Away Team */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3 justify-end min-w-0">
          <span className="text-sm sm:text-base font-medium text-zinc-200 truncate text-right group-hover:text-white transition-colors">
            {match.away_team.name_en}
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-zinc-700/50 shrink-0 group-hover:border-primary/30 transition-colors">
            <Image
              src={match.away_team.logo_url || ""}
              alt={match.away_team.name_en}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
