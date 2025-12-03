// components/matches/MatchRow.tsx (updated)
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Match } from "@/lib/hooks/public/useMatches";
import Image from 'next/image';
import Link from 'next/link';

interface MatchRowProps {
  match: Match;
  isLive?: boolean;
}

export default function MatchRow({ match, isLive = false }: MatchRowProps) {
  const getStatusBadge = () => {
    if (isLive) {
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-800/30 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1"></span>
          LIVE {match.minute}'
        </Badge>
      );
    }

    switch (match.status) {
      case 'scheduled':
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-800/30">
            {new Date(match.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-800/30">
            FT
          </Badge>
        );
      case 'postponed':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-800/30">
            POSTPONED
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Link href={`/matches/${match.id}`}>
      <div className={cn(
        "grid grid-cols-[1fr_auto_1fr] gap-3 px-3 py-2 items-center hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 cursor-pointer",
        isLive && "bg-red-900/10"
      )}>
        {/* Home Team */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <Image
              src={match.home_team.logo_url || ''}
              alt={match.home_team.name_en}
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <span className="text-sm text-zinc-200 truncate">{match.home_team.name_en}</span>
        </div>

        {/* Match Status */}
        <div className="flex flex-col items-center gap-1">
          {isLive ? (
            <div className="text-lg font-bold text-white">
              {match.score_home} - {match.score_away}
            </div>
          ) : match.status === 'completed' ? (
            <div className="text-lg font-bold text-white">
              {match.score_home} - {match.score_away}
            </div>
          ) : (
            <div className="text-lg font-bold text-zinc-400">
              vs
            </div>
          )}
          {getStatusBadge()}
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-2 justify-end">
          <span className="text-sm text-zinc-200 truncate text-right">{match.away_team.name_en}</span>
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <Image
              src={match.away_team.logo_url || ''}
              alt={match.away_team.name_en}
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}