// components/matches/FormationFieldMap.tsx
"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
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
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    <div className="w-full space-y-4">
      {/* Team header bar */}
      <div className="bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-white/5 px-4 py-3 flex items-center justify-between">
        {/* Home team */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center p-1">
            {homeTeamLogo ? (
              <Image
                src={homeTeamLogo}
                alt={homeTeamName}
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-teal-500 text-[10px] font-bold">H</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs sm:text-sm font-bold truncate max-w-[80px] sm:max-w-none">
              {homeTeamName}
            </span>
            <span className="text-teal-400 text-[10px] font-medium">
              {homeFormation}
            </span>
          </div>
        </div>

        <div className="text-zinc-500 font-black text-xs tracking-widest italic opacity-50">
          VS
        </div>

        {/* Away team */}
        <div className="flex items-center gap-3 flex-row-reverse">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center p-1">
            {awayTeamLogo ? (
              <Image
                src={awayTeamLogo}
                alt={awayTeamName}
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-orange-500 text-[10px] font-bold">A</span>
            )}
          </div>
          <div className="flex flex-col items-end">
            <span className="text-white text-xs sm:text-sm font-bold truncate max-w-[80px] sm:max-w-none">
              {awayTeamName}
            </span>
            <span className="text-orange-400 text-[10px] font-medium">
              {awayFormation}
            </span>
          </div>
        </div>
      </div>

      {/* Football pitch - adaptive layout */}
      <div
        className={cn(
          "relative w-full rounded-3xl overflow-hidden bg-zinc-950/50 border border-white/10 shadow-3xl transition-all duration-500",
          isMobile ? "aspect-2/3" : "aspect-16/10 sm:aspect-2/1"
        )}
      >
        {/* Pitch texture/gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-teal-900/40 via-teal-800/40 to-teal-900/40"></div>

        {/* Field markings */}
        <svg
          className="absolute inset-0 w-full h-full opacity-60"
          viewBox={isMobile ? "0 0 100 200" : "0 0 200 100"}
          preserveAspectRatio="none"
        >
          {isMobile ? (
            // Vertical Pitch (Mobile)
            <>
              <rect
                x="2"
                y="2"
                width="96"
                height="196"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <line
                x1="2"
                y1="100"
                x2="98"
                y2="100"
                stroke="white"
                strokeWidth="0.5"
              />
              <circle
                cx="50"
                cy="100"
                r="15"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <rect
                x="25"
                y="2"
                width="50"
                height="25"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <rect
                x="35"
                y="2"
                width="30"
                height="10"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <rect
                x="25"
                y="173"
                width="50"
                height="25"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <rect
                x="35"
                y="188"
                width="30"
                height="10"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <path
                d="M 40 27 A 10 10 0 0 1 60 27"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <path
                d="M 40 173 A 10 10 0 0 0 60 173"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </>
          ) : (
            // Horizontal Pitch (Desktop)
            <>
              <rect
                x="2"
                y="2"
                width="196"
                height="96"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <line
                x1="100"
                y1="2"
                x2="100"
                y2="98"
                stroke="white"
                strokeWidth="0.5"
              />
              <circle
                cx="100"
                cy="50"
                r="15"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <rect
                x="2"
                y="25"
                width="30"
                height="50"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <rect
                x="168"
                y="25"
                width="30"
                height="50"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <path
                d="M 32 40 A 10 10 0 0 1 32 60"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <path
                d="M 168 40 A 10 10 0 0 0 168 60"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </>
          )}
        </svg>

        {/* Home team players */}
        <div
          className="absolute inset-0"
          style={
            isMobile
              ? { height: "50%", width: "100%" }
              : { width: "50%", height: "100%" }
          }
        >
          {(hasHomeLineup ? homeStarters : homePositions.slice(0, 11)).map(
            (player, index) => {
              const pos = homePositions[index] || { x: 25, y: 50 };
              const scaledPos = isMobile
                ? {
                    x: pos.y, // Swapped for vertical
                    y: pos.x * 0.5, // Scaled to top half
                  }
                : {
                    x: pos.x * 0.5, // Scaled to left half
                    y: pos.y,
                  };
              return (
                <PlayerMarker
                  key={
                    hasHomeLineup ? (player as MatchLineup).id : `home-${index}`
                  }
                  player={hasHomeLineup ? (player as MatchLineup) : undefined}
                  position={scaledPos}
                  isAway={false}
                  index={index}
                />
              );
            }
          )}
        </div>

        {/* Away team players */}
        <div
          className="absolute inset-0"
          style={
            isMobile
              ? { top: "50%", height: "50%", width: "100%" }
              : { left: "50%", width: "50%", height: "100%" }
          }
        >
          {(hasAwayLineup ? awayStarters : awayPositions.slice(0, 11)).map(
            (player, index) => {
              const pos = awayPositions[index] || { x: 75, y: 50 };
              const scaledPos = isMobile
                ? {
                    x: pos.y, // Swapped for vertical
                    y: (pos.x - 50) * 0.5, // Scaled to bottom half (local coords)
                  }
                : {
                    x: (pos.x - 50) * 0.5, // Scaled to right half (local coords)
                    y: pos.y,
                  };
              return (
                <PlayerMarker
                  key={
                    hasAwayLineup ? (player as MatchLineup).id : `away-${index}`
                  }
                  player={hasAwayLineup ? (player as MatchLineup) : undefined}
                  position={scaledPos}
                  isAway={true}
                  index={index}
                />
              );
            }
          )}
        </div>
      </div>

      {/* Substitutes section (Improved UI) */}
      {(homeSubs.length > 0 || awaySubs.length > 0) && (
        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden rounded-2xl">
          <CardHeader className="py-3 px-4 border-b border-white/5 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">
              Bench
            </CardTitle>
            <Users className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Home subs */}
              <div className="space-y-1">
                {homeSubs.map((player) => (
                  <SubstituteRow
                    key={player.id}
                    player={player}
                    isAway={false}
                  />
                ))}
              </div>
              {/* Away subs */}
              <div className="space-y-1">
                {awaySubs.map((player) => (
                  <SubstituteRow
                    key={player.id}
                    player={player}
                    isAway={true}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coach section */}
      {(homeCoach || awayCoach) && (
        <div className="flex gap-4">
          <div className="flex-1 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
              <UserCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Home Coach
              </p>
              <p className="text-sm font-bold text-white truncate">
                {homeCoach || "TBD"}
              </p>
            </div>
          </div>
          <div className="flex-1 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
              <UserCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Away Coach
              </p>
              <p className="text-sm font-bold text-white truncate">
                {awayCoach || "TBD"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const UserCircle = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default FormationFieldMap;
