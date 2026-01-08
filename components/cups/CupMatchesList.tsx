"use client";

import Image from "next/image";
import Link from "next/link";
import { Swords, Calendar, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CupMatch {
  id: string;
  date?: string;
  match_date?: string;
  time?: string;
  status: string;
  round?: string;
  home_team?: {
    id: string;
    name_en: string;
    name_am?: string;
    logo_url?: string;
    slug: string;
  };
  away_team?: {
    id: string;
    name_en: string;
    name_am?: string;
    logo_url?: string;
    slug: string;
  };
  home_score?: number;
  away_score?: number;
  venue?: {
    name: string;
    city?: string;
  };
}

interface CupMatchesListProps {
  matches: CupMatch[];
  showAll?: boolean;
}

function MatchCard({ match }: { match: CupMatch }) {
  const matchDate = match.match_date || match.date;
  const isLive = match.status === "live";
  const isCompleted =
    match.status === "completed" || match.status === "finished";

  return (
    <Link href={`/matches/${match.id}`} className="block group">
      <div
        className={`relative p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
          isLive
            ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40"
            : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50"
        }`}
      >
        {/* Round Badge */}
        {match.round && (
          <div className="flex items-center justify-between mb-3">
            <Badge
              variant="outline"
              className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border-amber-500/20"
            >
              {match.round}
            </Badge>
            {isLive && (
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-red-400 text-[10px] font-bold uppercase">
                  Live
                </span>
              </div>
            )}
          </div>
        )}

        {/* Teams */}
        <div className="flex items-center justify-between gap-4">
          {/* Home Team */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative h-10 w-10 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 shrink-0 flex items-center justify-center">
              {match.home_team?.logo_url ? (
                <Image
                  src={match.home_team.logo_url}
                  alt={match.home_team.name_en}
                  fill
                  className="object-cover"
                />
              ) : (
                <Swords className="h-4 w-4 text-zinc-600" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
                {match.home_team?.name_en || "TBD"}
              </p>
              <p className="text-xs text-zinc-500 truncate">
                {match.home_team?.name_am}
              </p>
            </div>
          </div>

          {/* Score / Time */}
          <div className="shrink-0 text-center min-w-[80px]">
            {isCompleted || isLive ? (
              <div
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg ${
                  isLive ? "bg-red-500/10" : "bg-zinc-800/50"
                }`}
              >
                <span
                  className={`text-xl font-bold ${
                    (match.home_score ?? 0) > (match.away_score ?? 0)
                      ? "text-green-400"
                      : "text-white"
                  }`}
                >
                  {match.home_score ?? "-"}
                </span>
                <span className="text-zinc-600">:</span>
                <span
                  className={`text-xl font-bold ${
                    (match.away_score ?? 0) > (match.home_score ?? 0)
                      ? "text-green-400"
                      : "text-white"
                  }`}
                >
                  {match.away_score ?? "-"}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-xs text-zinc-500 font-medium uppercase">
                  VS
                </span>
                {matchDate && (
                  <span className="text-[10px] text-zinc-600 mt-1">
                    {new Date(matchDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-3 flex-1 min-w-0 justify-end text-right">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
                {match.away_team?.name_en || "TBD"}
              </p>
              <p className="text-xs text-zinc-500 truncate">
                {match.away_team?.name_am}
              </p>
            </div>
            <div className="relative h-10 w-10 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 shrink-0 flex items-center justify-center">
              {match.away_team?.logo_url ? (
                <Image
                  src={match.away_team.logo_url}
                  alt={match.away_team.name_en}
                  fill
                  className="object-cover"
                />
              ) : (
                <Swords className="h-4 w-4 text-zinc-600" />
              )}
            </div>
          </div>
        </div>

        {/* Match Info Footer */}
        <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-zinc-800/50 text-[10px] text-zinc-500">
          {matchDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(matchDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
          {match.time && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{match.time}</span>
            </div>
          )}
          {match.venue && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{match.venue.name}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function CupMatchesList({
  matches,
  showAll = false,
}: CupMatchesListProps) {
  if (!matches || matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Swords className="h-12 w-12 text-zinc-800 mb-4" />
        <p className="text-zinc-500 font-medium">No matches available</p>
        <p className="text-zinc-600 text-sm mt-1">
          Matches will appear here once scheduled.
        </p>
      </div>
    );
  }

  // Group matches by round if showing all
  if (showAll) {
    const matchesByRound: Record<string, CupMatch[]> = {};
    matches.forEach((match) => {
      const round = match.round || "Other";
      if (!matchesByRound[round]) {
        matchesByRound[round] = [];
      }
      matchesByRound[round].push(match);
    });

    return (
      <div className="space-y-8">
        {Object.entries(matchesByRound).map(([round, roundMatches]) => (
          <div key={round}>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-tight">
              <Swords className="h-5 w-5 text-amber-500" />
              {round}
            </h3>
            <div className="space-y-3">
              {roundMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
