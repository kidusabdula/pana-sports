// components/matches/MatchesList.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import MatchRow from "./MatchRow";
import { cn } from "@/lib/utils";
import { Match } from "@/lib/hooks/public/useMatches";

interface MatchesListProps {
  title: string;
  matches: Match[];
  isLive?: boolean;
  className?: string;
}

export default function MatchesList({
  title,
  matches,
  isLive = false,
  className,
}: MatchesListProps) {
  return (
    <div className={cn("bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden", className)}>
      <div className={cn(
        "px-4 py-2 border-b border-white/5 flex justify-between items-center",
        isLive && "bg-gradient-to-r from-red-900/20 to-transparent"
      )}>
        <span className={cn(
          "text-xs font-bold",
          isLive ? "text-red-400 flex items-center gap-2" : "text-zinc-400"
        )}>
          {isLive && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          )}
          {title}
        </span>
        <ChevronRight className="h-3 w-3 text-zinc-400/50" />
      </div>
      <div className="px-2">
        {matches.length === 0 ? (
          <div className="py-8 text-center text-zinc-500">
            {isLive ? "No live matches at the moment" : `No ${title.toLowerCase()} available`}
          </div>
        ) : (
          matches.map((match) => (
            <MatchRow key={match.id} match={match} isLive={isLive} />
          ))
        )}
      </div>
    </div>
  );
}