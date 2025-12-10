// components/matches/KnockoutBracket.tsx
"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface KnockoutTeam {
  id: string;
  name: string;
  logo_url?: string | null;
  score?: number;
  isWinner?: boolean;
}

interface KnockoutMatch {
  id: string;
  homeTeam?: KnockoutTeam;
  awayTeam?: KnockoutTeam;
  isPlayed: boolean;
  date?: string;
}

interface KnockoutRound {
  name: string;
  matches: KnockoutMatch[];
}

interface KnockoutBracketProps {
  rounds: KnockoutRound[];
  champion?: KnockoutTeam;
  title?: string;
}

// Team slot component
const TeamSlot = ({ team, isTop }: { team?: KnockoutTeam; isTop: boolean }) => {
  if (!team) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 bg-zinc-800/50 border border-zinc-700/50",
          isTop ? "rounded-t-md" : "rounded-b-md"
        )}
      >
        <div className="w-5 h-5 rounded-full bg-zinc-700/50 flex items-center justify-center">
          <span className="text-[8px] text-zinc-500">?</span>
        </div>
        <span className="text-xs text-zinc-500">TBD</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 transition-colors",
        isTop ? "rounded-t-md" : "rounded-b-md",
        team.isWinner
          ? "bg-green-500/10 border border-green-500/30"
          : "bg-zinc-800/50 border border-zinc-700/50"
      )}
    >
      <div className="w-5 h-5 rounded-full bg-zinc-700/50 overflow-hidden flex items-center justify-center">
        {team.logo_url ? (
          <Image
            src={team.logo_url}
            alt={team.name}
            width={20}
            height={20}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[8px] text-zinc-400">
            {team.name.substring(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <span
        className={cn(
          "text-xs truncate flex-1 max-w-[80px]",
          team.isWinner ? "text-green-400 font-medium" : "text-zinc-300"
        )}
      >
        {team.name}
      </span>
      {team.score !== undefined && (
        <span
          className={cn(
            "text-xs font-bold",
            team.isWinner ? "text-green-400" : "text-zinc-400"
          )}
        >
          {team.score}
        </span>
      )}
    </div>
  );
};

// Match card component
const MatchCard = ({ match }: { match: KnockoutMatch }) => {
  return (
    <div className="w-[140px] sm:w-[160px] flex flex-col">
      <TeamSlot team={match.homeTeam} isTop={true} />
      <div className="h-px bg-zinc-700/30" />
      <TeamSlot team={match.awayTeam} isTop={false} />
    </div>
  );
};

// Connector line component
const ConnectorLine = ({ isLeft }: { isLeft: boolean }) => {
  return (
    <div
      className={cn(
        "w-4 sm:w-6 flex items-center",
        isLeft ? "justify-end" : "justify-start"
      )}
    >
      <div className="h-px w-full bg-zinc-700/50" />
    </div>
  );
};

// Vertical connector between rounds
const VerticalConnector = ({ height }: { height: number }) => {
  return (
    <div className="w-px bg-zinc-700/50" style={{ height: `${height}px` }} />
  );
};

export function KnockoutBracket({
  rounds,
  champion,
  title = "Knockout Stage",
}: KnockoutBracketProps) {
  const totalRounds = rounds.length;

  // Calculate if we should show left and right sides (for semi-finals format)
  const hasMultipleRounds = totalRounds > 1;
  const leftRounds = rounds.slice(0, Math.ceil(totalRounds / 2));
  const rightRounds = [...rounds.slice(Math.ceil(totalRounds / 2))].reverse();

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px] p-4">
        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>

        {/* Bracket layout */}
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {/* Left side of bracket */}
          <div className="flex items-center gap-2">
            {leftRounds.map((round, roundIndex) => (
              <React.Fragment key={round.name}>
                <div className="flex flex-col gap-8">
                  <div className="text-center mb-2">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wide">
                      {round.name}
                    </span>
                  </div>
                  {round.matches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
                {roundIndex < leftRounds.length - 1 && (
                  <ConnectorLine isLeft={false} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Final / Champion */}
          <div className="flex flex-col items-center gap-4 mx-4">
            {/* Trophy */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/30 flex items-center justify-center">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
            </div>

            {/* Champion label */}
            <div className="text-center">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1">
                Champion
              </div>
              {champion ? (
                <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                  {champion.logo_url ? (
                    <Image
                      src={champion.logo_url}
                      alt={champion.name}
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <span className="text-[8px] text-yellow-400">
                        {champion.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-bold text-yellow-400">
                    {champion.name}
                  </span>
                </div>
              ) : (
                <div className="text-xs text-zinc-500 bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-3 py-2">
                  To Be Determined
                </div>
              )}
            </div>

            {/* Final match */}
            {rounds[totalRounds - 1] && (
              <div className="mt-4">
                <div className="text-center mb-2">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wide">
                    Final
                  </span>
                </div>
                {rounds[totalRounds - 1].matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </div>

          {/* Right side of bracket (reversed) */}
          <div className="flex items-center gap-2">
            {rightRounds.map((round, roundIndex) => (
              <React.Fragment key={round.name}>
                {roundIndex > 0 && <ConnectorLine isLeft={true} />}
                <div className="flex flex-col gap-8">
                  <div className="text-center mb-2">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wide">
                      {round.name}
                    </span>
                  </div>
                  {round.matches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Play-offs format note */}
        <div className="text-center mt-6">
          <span className="text-[10px] text-zinc-600">Play-offs format ⓘ</span>
        </div>
      </div>
    </div>
  );
}

// Simple bracket for smaller tournaments
export function SimpleKnockoutBracket({
  rounds,
  champion,
}: {
  rounds: KnockoutRound[];
  champion?: KnockoutTeam;
}) {
  return (
    <div className="w-full space-y-4">
      {rounds.map((round, roundIndex) => (
        <div key={round.name} className="space-y-2">
          <h4 className="text-xs text-zinc-500 uppercase tracking-wide">
            {round.name}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {round.matches.map((match) => (
              <div
                key={match.id}
                className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {match.homeTeam?.logo_url && (
                      <Image
                        src={match.homeTeam.logo_url}
                        alt={match.homeTeam.name}
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain"
                      />
                    )}
                    <span
                      className={cn(
                        "text-xs",
                        match.homeTeam?.isWinner
                          ? "text-green-400 font-medium"
                          : "text-zinc-300"
                      )}
                    >
                      {match.homeTeam?.name || "TBD"}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-zinc-400">
                    {match.homeTeam?.score ?? "-"}
                  </span>
                </div>
                <div className="h-px bg-zinc-700/30 my-1" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {match.awayTeam?.logo_url && (
                      <Image
                        src={match.awayTeam.logo_url}
                        alt={match.awayTeam.name}
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain"
                      />
                    )}
                    <span
                      className={cn(
                        "text-xs",
                        match.awayTeam?.isWinner
                          ? "text-green-400 font-medium"
                          : "text-zinc-300"
                      )}
                    >
                      {match.awayTeam?.name || "TBD"}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-zinc-400">
                    {match.awayTeam?.score ?? "-"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Champion */}
      {champion && (
        <div className="text-center pt-4 border-t border-zinc-800">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wide mb-2">
            Champion
          </div>
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2">
            {champion.logo_url && (
              <Image
                src={champion.logo_url}
                alt={champion.name}
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
            )}
            <span className="text-sm font-bold text-yellow-400">
              {champion.name}
            </span>
            <Trophy className="w-4 h-4 text-yellow-500" />
          </div>
        </div>
      )}
    </div>
  );
}

export default KnockoutBracket;
