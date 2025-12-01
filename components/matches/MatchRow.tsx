// components/matches/MatchRow.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MatchRowProps {
  match: {
    id: string;
    home: string;
    away: string;
    homeScore: number;
    awayScore: number;
    minute: number;
    status: string;
    time: string;
    homeLogo: string;
    awayLogo: string;
  };
  isLive?: boolean;
}

export default function MatchRow({
  match,
  isLive = false,
}: MatchRowProps) {
  return (
    <div className="group relative flex items-center justify-between py-3 px-1 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
      {/* Time / Status */}
      <div className="w-12 flex flex-col items-center justify-center gap-1">
        {isLive ? (
          <span className="text-[10px] font-bold text-red-500 animate-pulse">
            {match.minute}&apos;
          </span>
        ) : (
          <span className="text-[10px] font-medium text-zinc-500">
            {match.time || match.status || "FT"}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 text-zinc-600 hover:text-yellow-500 p-0"
        >
          <Star className="h-3 w-3" />
        </Button>
      </div>

      {/* Match Info */}
      <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
        {/* Home Team */}
        <div
          className={cn(
            "flex items-center justify-end gap-2 text-right",
            isLive && match.homeScore > match.awayScore
              ? "font-bold text-white"
              : "text-zinc-300"
          )}
        >
          <span className="truncate hidden sm:block">{match.home}</span>
          <span className="sm:hidden">
            {match.home.substring(0, 3).toUpperCase()}
          </span>
          {/* Team Logo */}
          <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={match.homeLogo}
              alt={match.home}
              width={20}
              height={20}
              className="object-cover"
            />
          </div>
        </div>

        {/* Score */}
        <div className="px-2 py-0.5 bg-zinc-900/50 rounded-md font-mono text-xs font-bold text-white border border-white/5">
          {isLive || match.status === "FT" ? (
            `${match.homeScore} - ${match.awayScore}`
          ) : (
            <span className="text-zinc-500">VS</span>
          )}
        </div>

        {/* Away Team */}
        <div
          className={cn(
            "flex items-center justify-start gap-2 text-left",
            isLive && match.awayScore > match.homeScore
              ? "font-bold text-white"
              : "text-zinc-300"
          )}
        >
          {/* Team Logo */}
          <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={match.awayLogo}
              alt={match.away}
              width={20}
              height={20}
              className="object-cover"
            />
          </div>
          <span className="truncate hidden sm:block">{match.away}</span>
          <span className="sm:hidden">
            {match.away.substring(0, 3).toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}