// components/standings/StandingsTable.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, ChevronUp, ChevronDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CardContent } from "../ui/card";
import { Standing } from "@/lib/hooks/public/useStandings";

interface StandingsTableProps {
  title?: string;
  subtitle?: string;
  standings: Standing[];
  className?: string;
  showViewAllButton?: boolean;
}

const getStatusIcon = (gd: number) => {
  if (gd > 0) return <ChevronUp className="w-3 h-3 text-green-500" />;
  if (gd < 0) return <ChevronDown className="w-3 h-3 text-red-500" />;
  return <Minus className="w-3 h-3 text-zinc-500" />;
};

export default function StandingsTable({
  title = "League Table",
  subtitle,
  standings,
  className,
  showViewAllButton = true,
}: StandingsTableProps) {
  return (
    <div
      className={cn(
        "bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden",
        className
      )}
    >
      {title && (
        <div className="py-3 px-4 border-b border-white/5 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-zinc-200">{title}</span>
          </div>
          {subtitle && (
            <Badge
              variant="secondary"
              className="bg-white/5 hover:bg-white/10 text-[10px] text-zinc-400"
            >
              {subtitle}
            </Badge>
          )}
        </div>
      )}
      <CardContent className="p-0">
        <div className="grid grid-cols-[2rem_1fr_2rem_2rem_2rem_2rem_2rem_2rem_2rem_3rem] gap-1 px-2 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-white/5">
          <div className="text-center">#</div>
          <div>Team</div>
          <div className="text-center">P</div>
          <div className="text-center">W</div>
          <div className="text-center">D</div>
          <div className="text-center">L</div>
          <div className="text-center">GF</div>
          <div className="text-center">GA</div>
          <div className="text-center">GD</div>
          <div className="text-center">PTS</div>
        </div>
        {standings
          .filter((team) => team.team)
          .map((team) => (
            <div
              key={team.id}
              className="grid grid-cols-[2rem_1fr_2rem_2rem_2rem_2rem_2rem_2rem_2rem_3rem] gap-1 px-2 py-2 text-xs border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center justify-center text-zinc-500 font-mono">
                {team.rank}
              </div>
              <div className="flex items-center gap-2 font-medium text-zinc-200 truncate">
                <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={team.team?.logo_url || ""}
                    alt={team.team?.name_en || "Team"}
                    width={20}
                    height={20}
                    className="object-cover"
                  />
                </div>
                <span className="truncate">{team.team?.name_en}</span>
              </div>
              <div className="text-center text-zinc-400">{team.played}</div>
              <div className="text-center text-zinc-400">{team.won}</div>
              <div className="text-center text-zinc-400">{team.draw}</div>
              <div className="text-center text-zinc-400">{team.lost}</div>
              <div className="text-center text-zinc-400">{team.goals_for}</div>
              <div className="text-center text-zinc-400">
                {team.goals_against}
              </div>
              <div className="text-center text-zinc-400">{team.gd}</div>
              <div className="text-right font-bold text-white font-mono flex items-center justify-end gap-1">
                {team.points}
                {getStatusIcon(team.gd)}
              </div>
            </div>
          ))}
        {showViewAllButton && (
          <Button
            variant="ghost"
            className="w-full py-3 text-xs text-zinc-500 hover:text-primary hover:bg-white/5 transition-colors rounded-none"
          >
            View Full Standings
          </Button>
        )}
      </CardContent>
    </div>
  );
}
