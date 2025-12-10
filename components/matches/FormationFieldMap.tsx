// components/matches/FormationFieldMap.tsx
"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { MatchLineup } from "@/lib/hooks/public/useMatchDetail";

interface FormationFieldMapProps {
  homeLineup: MatchLineup[];
  awayLineup: MatchLineup[];
  homeFormation: string;
  awayFormation: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamLogo?: string | null;
  awayTeamLogo?: string | null;
  homeCoach?: string | null;
  awayCoach?: string | null;
  compact?: boolean;
}

// Formation position mappings for SIDE-BY-SIDE layout
// Each half shows one team, GK at outer edge, strikers at center
type FormationPositions = {
  [key: string]: { x: number; y: number }[];
};

// Positions for LEFT side (home team) - GK on left, strikers facing center
const homeFormationPositions: FormationPositions = {
  "4-4-2": [
    { x: 8, y: 50 }, // GK
    { x: 25, y: 15 }, // LB
    { x: 22, y: 37 }, // CB
    { x: 22, y: 63 }, // CB
    { x: 25, y: 85 }, // RB
    { x: 50, y: 15 }, // LM
    { x: 45, y: 37 }, // CM
    { x: 45, y: 63 }, // CM
    { x: 50, y: 85 }, // RM
    { x: 75, y: 35 }, // ST
    { x: 75, y: 65 }, // ST
  ],
  "4-3-3": [
    { x: 8, y: 50 }, // GK
    { x: 25, y: 15 }, // LB
    { x: 22, y: 37 }, // CB
    { x: 22, y: 63 }, // CB
    { x: 25, y: 85 }, // RB
    { x: 45, y: 30 }, // CM
    { x: 42, y: 50 }, // CDM
    { x: 45, y: 70 }, // CM
    { x: 70, y: 15 }, // LW
    { x: 78, y: 50 }, // ST
    { x: 70, y: 85 }, // RW
  ],
  "3-5-2": [
    { x: 8, y: 50 }, // GK
    { x: 25, y: 28 }, // CB
    { x: 22, y: 50 }, // CB
    { x: 25, y: 72 }, // CB
    { x: 45, y: 10 }, // LWB
    { x: 42, y: 33 }, // CM
    { x: 40, y: 50 }, // CDM
    { x: 42, y: 67 }, // CM
    { x: 45, y: 90 }, // RWB
    { x: 70, y: 35 }, // ST
    { x: 70, y: 65 }, // ST
  ],
  "4-2-3-1": [
    { x: 8, y: 50 }, // GK
    { x: 25, y: 15 }, // LB
    { x: 22, y: 37 }, // CB
    { x: 22, y: 63 }, // CB
    { x: 25, y: 85 }, // RB
    { x: 40, y: 35 }, // CDM
    { x: 40, y: 65 }, // CDM
    { x: 58, y: 15 }, // LM
    { x: 55, y: 50 }, // CAM
    { x: 58, y: 85 }, // RM
    { x: 78, y: 50 }, // ST
  ],
  "5-3-2": [
    { x: 8, y: 50 }, // GK
    { x: 25, y: 10 }, // LWB
    { x: 22, y: 30 }, // CB
    { x: 20, y: 50 }, // CB
    { x: 22, y: 70 }, // CB
    { x: 25, y: 90 }, // RWB
    { x: 45, y: 30 }, // CM
    { x: 42, y: 50 }, // CM
    { x: 45, y: 70 }, // CM
    { x: 70, y: 35 }, // ST
    { x: 70, y: 65 }, // ST
  ],
  "3-4-3": [
    { x: 8, y: 50 }, // GK
    { x: 25, y: 28 }, // CB
    { x: 22, y: 50 }, // CB
    { x: 25, y: 72 }, // CB
    { x: 45, y: 10 }, // LM
    { x: 42, y: 37 }, // CM
    { x: 42, y: 63 }, // CM
    { x: 45, y: 90 }, // RM
    { x: 70, y: 22 }, // LW
    { x: 75, y: 50 }, // ST
    { x: 70, y: 78 }, // RW
  ],
};

// Positions for RIGHT side (away team) - mirror of home positions
const awayFormationPositions: FormationPositions = Object.fromEntries(
  Object.entries(homeFormationPositions).map(([formation, positions]) => [
    formation,
    positions.map((pos) => ({
      x: 100 - pos.x, // Mirror X coordinate
      y: pos.y,
    })),
  ])
);

// Get formation positions
const getPositions = (formation: string, isAway: boolean) => {
  const positions = isAway ? awayFormationPositions : homeFormationPositions;
  return positions[formation] || positions["4-4-2"];
};

// Player marker component
const PlayerMarker = ({
  player,
  position,
  isAway,
  index,
}: {
  player?: MatchLineup;
  position: { x: number; y: number };
  isAway: boolean;
  index: number;
}) => {
  const hasPlayer = player && player.player;
  const playerName = hasPlayer
    ? player.player?.name_en.split(" ").pop()
    : `Player ${index + 1}`;
  const jerseyNumber = hasPlayer
    ? player.jersey_number || player.player?.jersey_number
    : index + 1;

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 group z-10"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    >
      {/* Player photo/number circle */}
      <div
        className={cn(
          "w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110 shadow-lg",
          isAway ? "bg-white border-orange-400" : "bg-white border-teal-400",
          player?.captain &&
            "ring-2 ring-yellow-400 ring-offset-1 ring-offset-teal-700"
        )}
      >
        {hasPlayer && player.player?.photo_url ? (
          <Image
            src={player.player.photo_url}
            alt={player.player.name_en}
            width={44}
            height={44}
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            className={cn(
              "font-bold text-xs sm:text-sm",
              isAway ? "text-orange-600" : "text-teal-700"
            )}
          >
            {jerseyNumber || "?"}
          </span>
        )}
      </div>

      {/* Player info label */}
      <div
        className={cn(
          "flex items-center gap-1 px-1.5 py-0.5 rounded text-center whitespace-nowrap",
          isAway ? "text-white" : "text-white"
        )}
      >
        <span className="text-[9px] sm:text-[10px] font-medium opacity-80">
          {jerseyNumber}
        </span>
        <span className="text-[9px] sm:text-[10px] font-semibold max-w-[60px] truncate">
          {playerName}
        </span>
      </div>

      {/* Captain indicator */}
      {player?.captain && (
        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-[8px] font-bold text-black">C</span>
        </div>
      )}

      {/* Substitution minute indicator (if player was subbed) */}
      {player?.is_injured && (
        <div className="absolute -bottom-0.5 -right-0.5">
          <span className="text-red-400 text-[10px]">🏥</span>
        </div>
      )}
    </div>
  );
};

// Substitute row component
const SubstituteRow = ({
  player,
  isAway,
}: {
  player: MatchLineup;
  isAway: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 py-1.5 px-2 rounded-lg",
        isAway ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "w-7 h-7 rounded-full border flex items-center justify-center overflow-hidden",
          isAway
            ? "bg-orange-100 border-orange-200"
            : "bg-teal-100 border-teal-200"
        )}
      >
        {player.player?.photo_url ? (
          <Image
            src={player.player.photo_url}
            alt={player.player.name_en}
            width={28}
            height={28}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[10px] font-bold text-zinc-600">
            {player.jersey_number || "?"}
          </span>
        )}
      </div>
      <div
        className={cn("flex-1 min-w-0", isAway ? "text-right" : "text-left")}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-zinc-500">
            {player.jersey_number}
          </span>
          <span className="text-xs text-white truncate">
            {player.player?.name_en || "Unknown"}
          </span>
        </div>
      </div>
    </div>
  );
};

export function FormationFieldMap({
  homeLineup,
  awayLineup,
  homeFormation,
  awayFormation,
  homeTeamName,
  awayTeamName,
  homeTeamLogo,
  awayTeamLogo,
  homeCoach,
  awayCoach,
}: FormationFieldMapProps) {
  const homeStarters = homeLineup.filter((l) => l.is_starting).slice(0, 11);
  const awayStarters = awayLineup.filter((l) => l.is_starting).slice(0, 11);
  const homeSubs = homeLineup.filter((l) => !l.is_starting).slice(0, 7);
  const awaySubs = awayLineup.filter((l) => !l.is_starting).slice(0, 7);

  const homePositions = getPositions(homeFormation, false);
  const awayPositions = getPositions(awayFormation, true);

  // Check if we have actual lineup data
  const hasHomeLineup = homeStarters.length > 0;
  const hasAwayLineup = awayStarters.length > 0;

  return (
    <div className="w-full space-y-3">
      {/* Team header bar */}
      <div className="bg-teal-700 rounded-lg px-3 py-2.5 flex items-center justify-between">
        {/* Home team */}
        <div className="flex items-center gap-2">
          {homeTeamLogo && (
            <div className="w-6 h-6 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
              <Image
                src={homeTeamLogo}
                alt={homeTeamName}
                width={24}
                height={24}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <span className="text-white text-sm font-semibold">
            {homeTeamName}
          </span>
          <Badge className="bg-white/20 text-white text-[10px] hover:bg-white/30 border-0">
            {homeFormation}
          </Badge>
        </div>

        {/* Away team */}
        <div className="flex items-center gap-2">
          <Badge className="bg-white/20 text-white text-[10px] hover:bg-white/30 border-0">
            {awayFormation}
          </Badge>
          <span className="text-white text-sm font-semibold">
            {awayTeamName}
          </span>
          {awayTeamLogo && (
            <div className="w-6 h-6 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
              <Image
                src={awayTeamLogo}
                alt={awayTeamName}
                width={24}
                height={24}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* Football pitch - side by side layout */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] bg-teal-600 rounded-lg overflow-hidden">
        {/* Field markings */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 100"
          preserveAspectRatio="none"
        >
          {/* Outer border */}
          <rect
            x="2"
            y="2"
            width="196"
            height="96"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />

          {/* Center line */}
          <line
            x1="100"
            y1="2"
            x2="100"
            y2="98"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />

          {/* Center circle */}
          <circle
            cx="100"
            cy="50"
            r="12"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />
          <circle cx="100" cy="50" r="1" fill="rgba(255,255,255,0.5)" />

          {/* Left penalty area */}
          <rect
            x="2"
            y="25"
            width="20"
            height="50"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />
          <rect
            x="2"
            y="35"
            width="8"
            height="30"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />
          <circle cx="16" cy="50" r="1" fill="rgba(255,255,255,0.4)" />

          {/* Right penalty area */}
          <rect
            x="178"
            y="25"
            width="20"
            height="50"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />
          <rect
            x="190"
            y="35"
            width="8"
            height="30"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />
          <circle cx="184" cy="50" r="1" fill="rgba(255,255,255,0.4)" />

          {/* Left goal */}
          <rect
            x="0"
            y="40"
            width="2"
            height="20"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="0.5"
          />

          {/* Right goal */}
          <rect
            x="198"
            y="40"
            width="2"
            height="20"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="0.5"
          />

          {/* Left goal arc */}
          <path
            d="M 22 42 A 8 8 0 0 1 22 58"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />

          {/* Right goal arc */}
          <path
            d="M 178 42 A 8 8 0 0 0 178 58"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />
        </svg>

        {/* Home team players (left half) */}
        <div className="absolute inset-0" style={{ width: "50%" }}>
          {hasHomeLineup
            ? homeStarters.map((player, index) => {
                const pos = homePositions[index] || { x: 25, y: 50 };
                // Scale X to left half (0-50%)
                const scaledPos = {
                  x: pos.x * 0.5,
                  y: pos.y,
                };
                return (
                  <PlayerMarker
                    key={player.id}
                    player={player}
                    position={scaledPos}
                    isAway={false}
                    index={index}
                  />
                );
              })
            : // Show placeholder positions
              homePositions.slice(0, 11).map((pos, index) => {
                const scaledPos = {
                  x: pos.x * 0.5,
                  y: pos.y,
                };
                return (
                  <PlayerMarker
                    key={`home-placeholder-${index}`}
                    position={scaledPos}
                    isAway={false}
                    index={index}
                  />
                );
              })}
        </div>

        {/* Away team players (right half) */}
        <div className="absolute inset-0" style={{ left: "50%", width: "50%" }}>
          {hasAwayLineup
            ? awayStarters.map((player, index) => {
                const pos = awayPositions[index] || { x: 75, y: 50 };
                // Scale X to right half (50-100%)
                const scaledPos = {
                  x: (pos.x - 50) * 1 + 50 - (pos.x - 50) * 0.5,
                  y: pos.y,
                };
                return (
                  <PlayerMarker
                    key={player.id}
                    player={player}
                    position={scaledPos}
                    isAway={true}
                    index={index}
                  />
                );
              })
            : // Show placeholder positions
              awayPositions.slice(0, 11).map((pos, index) => {
                const scaledPos = {
                  x: (pos.x - 50) * 1 + 50 - (pos.x - 50) * 0.5,
                  y: pos.y,
                };
                return (
                  <PlayerMarker
                    key={`away-placeholder-${index}`}
                    position={scaledPos}
                    isAway={true}
                    index={index}
                  />
                );
              })}
        </div>
      </div>

      {/* Coach section */}
      {(homeCoach || awayCoach) && (
        <div className="bg-zinc-800/50 rounded-lg p-3">
          <div className="text-center text-[10px] text-zinc-500 uppercase tracking-wide mb-2">
            Coach
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                <span className="text-zinc-400 text-xs">👤</span>
              </div>
              <span className="text-sm text-white">{homeCoach || "TBD"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white">{awayCoach || "TBD"}</span>
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                <span className="text-zinc-400 text-xs">👤</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Substitutes section */}
      {(homeSubs.length > 0 || awaySubs.length > 0) && (
        <div className="bg-zinc-800/50 rounded-lg p-3">
          <div className="text-center text-[10px] text-zinc-500 uppercase tracking-wide mb-2">
            Substitutes
          </div>
          <div className="grid grid-cols-2 gap-2">
            {/* Home subs */}
            <div className="space-y-1">
              {homeSubs.map((player) => (
                <SubstituteRow key={player.id} player={player} isAway={false} />
              ))}
            </div>
            {/* Away subs */}
            <div className="space-y-1">
              {awaySubs.map((player) => (
                <SubstituteRow key={player.id} player={player} isAway={true} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormationFieldMap;
