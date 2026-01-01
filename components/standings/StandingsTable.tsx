// components/standings/StandingsTable.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CardContent } from "../ui/card";
import { Standing } from "@/lib/hooks/public/useStandings";
import { useRouter } from "next/navigation";

interface StandingsTableProps {
  title?: string;
  subtitle?: string;
  standings: Standing[];
  className?: string;
  showViewAllButton?: boolean;
  promotionSpots?: number;
  relegationSpots?: number;
  onTeamClick?: (teamId: string, teamSlug?: string) => void;
}

export default function StandingsTable({
  title = "League Table",
  subtitle,
  standings,
  className,
  showViewAllButton = true,
  promotionSpots = 1, // Default: 1st place gets promoted/title
  relegationSpots = 3, // Default: bottom 3 get relegated
  onTeamClick,
}: StandingsTableProps) {
  const router = useRouter();
  const totalTeams = standings.length;

  // Get position color based on rank
  const getPositionColor = (rank: number) => {
    if (rank <= promotionSpots) return "bg-emerald-500"; // Title/Promotion zone
    if (totalTeams > 10 && rank > totalTeams - relegationSpots)
      return "bg-red-500"; // Relegation zone
    return "bg-transparent";
  };

  const handleTeamClick = (team: Standing) => {
    if (onTeamClick) {
      onTeamClick(team.team_id, team.team?.slug);
    } else if (team.team?.slug) {
      router.push(`/teams/${team.team.slug}`);
    }
  };

  return (
    <div
      className={cn(
        "bg-zinc-900/40 backdrop-blur-xl border border-white/5 overflow-hidden rounded-2xl",
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
        <div className="overflow-x-auto pana-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[11px] uppercase text-zinc-500 font-medium tracking-wider">
                <th className="py-4 pl-4 w-12 text-center">#</th>
                <th className="py-4 px-2">Team</th>
                <th className="py-4 px-2 text-center w-10">PL</th>
                <th className="py-4 px-2 text-center w-10">W</th>
                <th className="py-4 px-2 text-center w-10">D</th>
                <th className="py-4 px-2 text-center w-10">L</th>
                <th className="py-4 px-2 text-center w-16 hidden sm:table-cell">
                  +/-
                </th>
                <th className="py-4 px-2 text-center w-12">GD</th>
                <th className="py-4 px-2 text-center w-12 text-white font-bold">
                  PTS
                </th>
                <th className="py-4 px-4 text-center w-32 hidden md:table-cell">
                  Form
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {standings
                .filter((team) => team.team)
                .map((team, index) => {
                  const rank = team.rank || index + 1;
                  const statusColor = getPositionColor(rank);

                  return (
                    <tr
                      key={team.id}
                      onClick={() => handleTeamClick(team)}
                      className="group hover:bg-white/5 transition-colors relative cursor-pointer"
                    >
                      <td className="py-3 pl-4 text-center relative">
                        {/* Status Bar */}
                        <div
                          className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${statusColor}`}
                        />

                        <span className="text-sm font-medium text-white">
                          {rank}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 relative shrink-0">
                            <Image
                              src={team.team?.logo_url || ""}
                              alt={team.team?.name_en || ""}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="text-sm font-bold text-white truncate max-w-[120px] sm:max-w-[180px] group-hover:text-primary transition-colors">
                            {team.team?.name_en}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center text-sm font-medium text-white">
                        {team.played}
                      </td>
                      <td className="py-3 px-2 text-center text-sm text-zinc-400 font-medium">
                        {team.won}
                      </td>
                      <td className="py-3 px-2 text-center text-sm text-zinc-400 font-medium">
                        {team.draw}
                      </td>
                      <td className="py-3 px-2 text-center text-sm text-zinc-400 font-medium">
                        {team.lost}
                      </td>
                      <td className="py-3 px-2 text-center text-sm text-zinc-400 hidden sm:table-cell tracking-tighter">
                        {team.goals_for}-{team.goals_against}
                      </td>
                      <td className="py-3 px-2 text-center text-sm font-medium text-white">
                        {team.gd > 0 ? `+${team.gd}` : team.gd}
                      </td>
                      <td className="py-3 px-2 text-center text-base font-bold text-white">
                        {team.points}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          {[...Array(5)].map((_, i) => {
                            // Mock form data - TODO: use real form data when available
                            const result = ["W", "D", "L", "W", "D"][
                              (index + i) % 5
                            ];
                            let badgeClass = "bg-zinc-700 text-zinc-400";
                            if (result === "W")
                              badgeClass = "bg-emerald-500 text-black";
                            if (result === "L")
                              badgeClass = "bg-red-500 text-white";
                            if (result === "D")
                              badgeClass = "bg-zinc-600 text-white";

                            return (
                              <div
                                key={i}
                                className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold ${badgeClass}`}
                              >
                                {result}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        {showViewAllButton && (
          <Button
            variant="ghost"
            className="w-full py-4 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors rounded-none border-t border-white/5"
          >
            View Full Standings
          </Button>
        )}
      </CardContent>
    </div>
  );
}
