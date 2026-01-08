"use client";

import { CupGroup } from "@/lib/types/cup";
import Image from "next/image";
import Link from "next/link";
import { Users, Trophy } from "lucide-react";

interface CupGroupStageProps {
  groups: CupGroup[];
}

export default function CupGroupStage({ groups }: CupGroupStageProps) {
  if (!groups || groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800">
        <Users className="h-16 w-16 text-zinc-800 mb-4" />
        <h3 className="text-xl font-bold text-zinc-500">No Groups Available</h3>
        <p className="text-zinc-600 text-sm mt-2">
          Group stage information will appear here once available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {groups.map((group) => (
        <div
          key={group.id}
          className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden"
        >
          {/* Group Header */}
          <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              {group.name}
            </h3>
            <span className="text-xs text-zinc-500 font-medium">
              {group.teams?.length || 0} teams
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
                  <th className="text-left py-3 px-4 font-bold">#</th>
                  <th className="text-left py-3 px-2 font-bold">Team</th>
                  <th className="text-center py-3 px-2 font-bold w-10">P</th>
                  <th className="text-center py-3 px-2 font-bold w-10">W</th>
                  <th className="text-center py-3 px-2 font-bold w-10">D</th>
                  <th className="text-center py-3 px-2 font-bold w-10">L</th>
                  <th className="text-center py-3 px-2 font-bold w-10">GD</th>
                  <th className="text-center py-3 px-4 font-bold w-14">PTS</th>
                </tr>
              </thead>
              <tbody>
                {group.teams && group.teams.length > 0 ? (
                  group.teams.map((gt, idx) => {
                    // Top 2 qualify (green), others normal
                    const qualifies = idx < 2;

                    return (
                      <tr
                        key={gt.id}
                        className={`border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors ${
                          qualifies ? "bg-green-500/5" : ""
                        }`}
                      >
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                              qualifies
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <Link
                            href={`/teams/${gt.team?.slug}`}
                            className="flex items-center gap-2 hover:text-primary transition-colors"
                          >
                            {gt.team?.logo_url ? (
                              <div className="relative h-6 w-6 rounded-full overflow-hidden border border-zinc-700 shrink-0">
                                <Image
                                  src={gt.team.logo_url}
                                  alt={gt.team.name_en}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                                <Users className="h-3 w-3 text-zinc-600" />
                              </div>
                            )}
                            <span className="font-medium text-white truncate max-w-[140px]">
                              {gt.team?.name_en || "TBD"}
                            </span>
                          </Link>
                        </td>
                        <td className="text-center py-3 px-2 text-zinc-400">
                          {gt.played}
                        </td>
                        <td className="text-center py-3 px-2 text-green-400 font-medium">
                          {gt.won}
                        </td>
                        <td className="text-center py-3 px-2 text-zinc-500">
                          {gt.draw}
                        </td>
                        <td className="text-center py-3 px-2 text-red-400">
                          {gt.lost}
                        </td>
                        <td className="text-center py-3 px-2 text-zinc-300 font-medium">
                          {gt.gd > 0 ? `+${gt.gd}` : gt.gd}
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className="inline-flex items-center justify-center w-8 h-6 bg-primary/10 text-primary font-bold rounded">
                            {gt.points}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-8 text-center text-zinc-600 italic"
                    >
                      No teams in this group yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-950/30">
            <div className="flex items-center gap-4 text-[10px] text-zinc-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>Qualifies for knockout</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
