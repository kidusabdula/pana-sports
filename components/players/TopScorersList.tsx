// components/players/TopScorersList.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";

interface TopScorersListProps {
  title: string;
  subtitle?: string;
  topScorers: Array<{
    id: string;
    name: string;
    team: string;
    goals: number;
    avatar: string;
    teamLogo: string;
  }>;
  className?: string;
  showViewAllButton?: boolean;
}

export default function TopScorersList({
  title,
  subtitle,
  topScorers,
  className,
  showViewAllButton = true,
}: TopScorersListProps) {
  return (
    <div className={cn("bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden", className)}>
      <div className="bg-zinc-900/50 px-4 py-2 border-b border-white/5 flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-400 flex items-center gap-2">
          <Trophy className="w-3 h-3 text-yellow-500" />
          {title}
        </span>
        {subtitle && (
          <Badge
            variant="outline"
            className="text-[10px] py-0 px-1.5 border-zinc-700 text-zinc-400"
          >
            {subtitle}
          </Badge>
        )}
      </div>
      <div className="max-h-64 overflow-y-auto">
        {topScorers.map((player, i) => (
          <div key={player.id} className="flex items-center gap-3 p-2 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
            <div className="w-6 text-center font-bold text-zinc-500 text-xs">
              {i + 1}
            </div>
            {/* Player Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={player.avatar}
                alt={player.name}
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-zinc-200 truncate">
                {player.name}
              </div>
              <div className="flex items-center gap-1 text-xs text-zinc-500 truncate">
                {/* Team Logo */}
                <div className="w-3 h-3 rounded-full overflow-hidden">
                  <Image
                    src={player.teamLogo}
                    alt={player.team}
                    width={12}
                    height={12}
                    className="object-cover"
                  />
                </div>
                <span>{player.team}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-white">{player.goals}</div>
              <div className="text-xs text-zinc-500">goals</div>
            </div>
          </div>
        ))}
      </div>
      
      {showViewAllButton && (
        <div className="p-2 border-t border-white/5">
          <Button
            variant="ghost"
            className="w-full py-3 text-xs text-zinc-500 hover:text-primary hover:bg-white/5 transition-colors rounded-none"
          >
            View All Top Scorers
          </Button>
        </div>
      )}
    </div>
  );
}