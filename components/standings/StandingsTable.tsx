// components/standings/StandingsTable.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { CardContent } from "../ui/card";

// Define the status type properly
type TeamStatus = 'up' | 'down' | 'same';

interface StandingsTableProps {
  title: string;
  subtitle?: string;
  standings: Array<{
    id: string;
    name: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    gf: number;
    ga: number;
    gd: number;
    points: number;
    logo: string;
    status: TeamStatus;
  }>;
  className?: string;
  showViewAllButton?: boolean;
}

const getStatusIcon = (status: TeamStatus) => {
  switch (status) {
    case 'up':
      return <ChevronUp className="w-3 h-3 text-green-500" />;
    case 'down':
      return <ChevronDown className="w-3 h-3 text-red-500" />;
    default:
      return <Minus className="w-3 h-3 text-zinc-500" />;
  }
};

export default function StandingsTable({
  title,
  subtitle,
  standings,
  className,
  showViewAllButton = true,
}: StandingsTableProps) {
  return (
    <div className={cn("bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden", className)}>
      <div className="py-3 px-4 border-b border-white/5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
           <Trophy className="w-4 h-4 text-primary" />
           <span className="text-sm font-bold text-zinc-200">Table</span>
        </div>
        {subtitle && (
          <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-[10px] text-zinc-400">
             {subtitle}
          </Badge>
        )}
      </div>
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
         {standings.map((team, i) => (
            <div key={team.id} className="grid grid-cols-[2rem_1fr_2rem_2rem_2rem_2rem_2rem_2rem_2rem_3rem] gap-1 px-2 py-2 text-xs border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
               <div className="flex items-center justify-center text-zinc-500 font-mono">
                  {i + 1}
               </div>
               <div className="flex items-center gap-2 font-medium text-zinc-200 truncate">
                  <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                     <Image 
                        src={team.logo} 
                        alt={team.name} 
                        width={20} 
                        height={20} 
                        className="object-cover" 
                     />
                  </div>
                  <span className="truncate">{team.name}</span>
               </div>
               <div className="text-center text-zinc-400">{team.played}</div>
               <div className="text-center text-zinc-400">{team.won}</div>
               <div className="text-center text-zinc-400">{team.drawn}</div>
               <div className="text-center text-zinc-400">{team.lost}</div>
               <div className="text-center text-zinc-400">{team.gf}</div>
               <div className="text-center text-zinc-400">{team.ga}</div>
               <div className="text-center text-zinc-400">{team.gd}</div>
               <div className="text-right font-bold text-white font-mono flex items-center justify-end gap-1">
                  {team.points}
                  {getStatusIcon(team.status)}
               </div>
            </div>
         ))}
         {showViewAllButton && (
           <Button variant="ghost" className="w-full py-3 text-xs text-zinc-500 hover:text-primary hover:bg-white/5 transition-colors rounded-none">
              View Full Standings
           </Button>
         )}
      </CardContent>
    </div>
  );
}