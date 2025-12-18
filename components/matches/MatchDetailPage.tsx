// components/matches/MatchDetailPage.tsx
"use client";

import {
  useMatchDetail,
  type MatchEvent,
  type MatchLineup,
} from "@/lib/hooks/public/useMatchDetail";
import { useStandings } from "@/lib/hooks/public/useStandings";
import { useHeadToHead } from "@/lib/hooks/public/useHeadToHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  ArrowLeft,
  Share2,
  Bookmark,
  ArrowRightLeft,
  Clock,
  Thermometer,
  Wind,
  Eye,
  Target,
  Zap,
  Shield,
  Flame,
  Star,
  BarChart3,
  CloudSun,
  Droplets,
  Map,
  Shirt,
  UserCircle,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormationFieldMap } from "./FormationFieldMap";
import { SimpleKnockoutBracket } from "./KnockoutBracket";

interface MatchDetailPageProps {
  matchId: string;
}

// Timeline Event Component
const TimelineEvent = ({
  event,
  isHome,
  homeTeamName,
  awayTeamName,
}: {
  event: MatchEvent;
  isHome: boolean;
  homeTeamName: string;
  awayTeamName: string;
}) => {
  // Get icon for event type
  const getEventIcon = (type: string): React.ReactNode => {
    switch (type) {
      // Goals
      case "goal":
        return "⚽";
      case "penalty_goal":
        return "⚽";
      case "own_goal":
        return "⚽";
      // Cards
      case "yellow":
      case "yellow_card":
        return "🟨";
      case "red":
      case "red_card":
        return "🟥";
      case "second_yellow":
        return "🟨🟥";
      // Substitution
      case "sub":
      case "substitution":
        return <ArrowRightLeft className="h-3 w-3" />;
      // Penalties
      case "penalty":
        return "⚽";
      case "penalty_miss":
        return "❌";
      // VAR
      case "var_check":
        return "📺";
      case "var_goal":
        return "✅";
      case "var_no_goal":
        return "❌";
      // Other match events visible to fans
      case "assist":
        return "🅰️";
      case "corner":
        return "🚩";
      case "free_kick":
        return "⚡";
      case "offside":
        return "🚫";
      case "injury":
        return "🏥";
      case "injury_time":
        return "⏱️";
      // Internal CMS events - return null to filter out
      case "match_start":
      case "match_end":
      case "match_pause":
      case "match_resume":
      case "half_time":
      case "second_half":
      case "extra_time_start":
      case "extra_time_end":
      case "penalty_shootout_start":
      case "penalty_shootout_end":
        return null; // These are filtered out
      default:
        return "📝";
    }
  };

  // Get user-friendly label for event type
  const getEventLabel = (type: string): string => {
    switch (type) {
      case "goal":
        return "Goal";
      case "penalty_goal":
        return "Penalty Goal";
      case "own_goal":
        return "Own Goal";
      case "yellow":
      case "yellow_card":
        return "Yellow Card";
      case "red":
      case "red_card":
        return "Red Card";
      case "second_yellow":
        return "Second Yellow";
      case "sub":
      case "substitution":
        return "Substitution";
      case "penalty":
        return "Penalty";
      case "penalty_miss":
        return "Penalty Missed";
      case "var_check":
        return "VAR Check";
      case "var_goal":
        return "VAR: Goal Confirmed";
      case "var_no_goal":
        return "VAR: Goal Disallowed";
      case "assist":
        return "Assist";
      case "corner":
        return "Corner Kick";
      case "free_kick":
        return "Free Kick";
      case "offside":
        return "Offside";
      case "injury":
        return "Injury";
      case "injury_time":
        return "Injury Time";
      default:
        return "Event";
    }
  };

  // Check if event has a player
  const hasPlayer = event.player && event.player.name_en;

  // Get team name for events without players
  const teamName = isHome ? homeTeamName : awayTeamName;

  // Skip internal CMS events
  const icon = getEventIcon(event.type);
  if (icon === null) return null;

  const isSub = event.type === "sub" || event.type === "substitution";
  const isGoal = ["goal", "penalty_goal", "own_goal", "penalty"].includes(
    event.type
  );
  const isCard = [
    "yellow",
    "yellow_card",
    "red",
    "red_card",
    "second_yellow",
  ].includes(event.type);
  const isVAR = event.type.startsWith("var_");

  // Determine primary display text
  const getPrimaryText = (): string => {
    if (hasPlayer) {
      return event.player!.name_en;
    }
    // For events without players, show meaningful text
    if (isVAR) {
      return event.description_en || getEventLabel(event.type);
    }
    if (event.description_en) {
      return event.description_en;
    }
    // Fallback to team name + event type
    return `${teamName}`;
  };

  // Determine secondary display text
  const getSecondaryText = (): string | null => {
    if (hasPlayer) {
      // Show description if available, otherwise show event label
      return event.description_en || getEventLabel(event.type);
    }
    // For events without players
    if (isVAR && event.description_en) {
      return getEventLabel(event.type);
    }
    return getEventLabel(event.type);
  };

  return (
    <div
      className={cn(
        "flex items-center w-full mb-4 relative group",
        isHome ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Content Side */}
      <div
        className={cn(
          "flex-1 flex items-center gap-3",
          isHome
            ? "justify-start flex-row-reverse text-right"
            : "justify-start flex-row text-left"
        )}
      >
        {/* Icon with colored background */}
        <div
          className={cn(
            "shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform active:scale-95",
            isGoal && "bg-green-500/20 ring-2 ring-green-500/30",
            isCard &&
              event.type.includes("red") &&
              "bg-red-500/20 ring-2 ring-red-500/30",
            isCard &&
              !event.type.includes("red") &&
              "bg-yellow-500/20 ring-2 ring-yellow-500/30",
            isVAR && "bg-blue-500/20 ring-2 ring-blue-500/30",
            isSub && "bg-purple-500/20 ring-2 ring-purple-500/30",
            !isGoal &&
              !isCard &&
              !isVAR &&
              !isSub &&
              "bg-zinc-800 ring-2 ring-zinc-700"
          )}
        >
          {typeof icon === "string" ? (
            <span className="text-base sm:text-lg">{icon}</span>
          ) : (
            <div className="text-zinc-300">{icon}</div>
          )}
        </div>

        {/* Event Info */}
        <div className="flex flex-col justify-center min-w-0">
          <div
            className={cn(
              "font-semibold text-xs sm:text-sm text-white truncate max-w-[90px] sm:max-w-none",
              isGoal && "text-green-400",
              isCard && event.type.includes("red") && "text-red-400",
              isCard && !event.type.includes("red") && "text-yellow-400",
              isVAR && "text-blue-400",
              isSub && "text-purple-400"
            )}
          >
            {getPrimaryText()}
          </div>
          {getSecondaryText() && (
            <div className="text-[10px] sm:text-[11px] text-zinc-400 truncate max-w-[90px] sm:max-w-none">
              {getSecondaryText()}
            </div>
          )}
        </div>
      </div>

      {/* Center Line & Minute */}
      <div className="w-10 sm:w-14 flex justify-center relative shrink-0 mx-1 sm:mx-2">
        <div
          className={cn(
            "w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center z-10 transition-all",
            isGoal && "bg-green-500/30 border-2 border-green-500/50",
            isCard && "bg-zinc-800 border-2 border-zinc-600",
            isVAR && "bg-blue-500/30 border-2 border-blue-500/50",
            !isGoal &&
              !isCard &&
              !isVAR &&
              "bg-zinc-800 border-2 border-zinc-700"
          )}
        >
          <span
            className={cn(
              "text-xs font-bold",
              isGoal && "text-green-400",
              !isGoal && "text-white"
            )}
          >
            {event.minute}&apos;
          </span>
        </div>
      </div>

      {/* Empty Side */}
      <div className="flex-1"></div>
    </div>
  );
};

const TimelineSeparator = ({ label }: { label: string }) => (
  <div className="flex items-center justify-center w-full my-4 relative">
    <div className="absolute left-0 right-0 h-px bg-zinc-800"></div>
    <div className="bg-zinc-950 px-3 z-10 text-xs font-bold text-zinc-400 uppercase tracking-wider">
      {label}
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({
  icon: Icon,
  label,
  value,
  color = "text-primary",
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
  value: string | number;
  color?: string;
}) => (
  <div className="bg-zinc-800/30 rounded-lg p-2 sm:p-3 border border-zinc-800/50 min-w-0">
    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
      <Icon className={cn("h-3 w-3 sm:h-4 sm:w-4 shrink-0", color)} />
      <span className="text-[10px] sm:text-xs text-zinc-400 truncate">
        {label}
      </span>
    </div>
    <div className="text-sm sm:text-lg font-bold text-white truncate">
      {value}
    </div>
  </div>
);

// Team Stat Bar Component
const TeamStatBar = ({
  homeValue,
  awayValue,
  label,
}: {
  homeValue: number;
  awayValue: number;
  label: string;
}) => {
  const total = homeValue + awayValue;
  const homePercentage = total > 0 ? (homeValue / total) * 100 : 50;
  const awayPercentage = total > 0 ? (awayValue / total) * 100 : 50;

  return (
    <div className="mb-3 sm:mb-4">
      <div className="flex justify-between text-[10px] sm:text-xs text-zinc-400 mb-1 sm:mb-1.5">
        <span className="font-medium">{homeValue}</span>
        <span className="text-zinc-500 uppercase tracking-wide text-[9px] sm:text-[10px] truncate px-1">
          {label}
        </span>
        <span className="font-medium">{awayValue}</span>
      </div>
      <div className="flex h-1.5 sm:h-2 rounded-full overflow-hidden bg-zinc-800">
        <div
          className="bg-primary transition-all"
          style={{ width: `${homePercentage}%` }}
        />
        <div
          className="bg-red-500 transition-all"
          style={{ width: `${awayPercentage}%` }}
        />
      </div>
    </div>
  );
};

// Lineup list component
const LineupList = ({
  lineups,
  teamName,
  showInjured = false,
}: {
  lineups: MatchLineup[];
  teamName: string;
  showInjured?: boolean;
}) => {
  const starters = lineups.filter((l) => l.is_starting);
  const subs = lineups.filter((l) => !l.is_starting);
  const injured = lineups.filter((l) => l.is_injured);

  return (
    <div className="space-y-2 sm:space-y-3">
      <h4 className="text-xs sm:text-sm font-semibold text-zinc-300 flex items-center gap-2">
        <Shirt className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
        <span className="truncate">{teamName}</span>
      </h4>

      {/* Starting XI */}
      <div className="space-y-1">
        <div className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-wide">
          Starting XI
        </div>
        {starters.map((lineup) => (
          <div
            key={lineup.id}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-zinc-800/30 active:bg-zinc-700/40 touch-manipulation",
              lineup.captain && "ring-1 ring-yellow-500/30"
            )}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden bg-zinc-700/50 flex items-center justify-center shrink-0">
              {lineup.player?.photo_url ? (
                <Image
                  src={lineup.player.photo_url}
                  alt={lineup.player.name_en}
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[9px] sm:text-[10px] text-zinc-400">
                  {lineup.jersey_number || "?"}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <span className="text-[11px] sm:text-xs text-white truncate block">
                {lineup.player?.name_en || "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              {lineup.captain && (
                <Badge className="h-3.5 sm:h-4 px-0.5 sm:px-1 text-[7px] sm:text-[8px] bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  C
                </Badge>
              )}
              <Badge
                variant="outline"
                className="text-[8px] sm:text-[10px] h-3.5 sm:h-4 px-0.5 sm:px-1"
              >
                {(
                  lineup.position ||
                  lineup.player?.position_en ||
                  "-"
                ).substring(0, 3)}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Substitutes */}
      {subs.length > 0 && (
        <div className="space-y-1 pt-2 border-t border-zinc-800/50">
          <div className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-wide">
            Substitutes
          </div>
          {subs.map((lineup) => (
            <div
              key={lineup.id}
              className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-zinc-800/20 active:bg-zinc-700/30 touch-manipulation"
            >
              <span className="text-[10px] text-zinc-500 w-4 text-center">
                {lineup.jersey_number || "?"}
              </span>
              <span className="text-xs text-zinc-400 truncate flex-1">
                {lineup.player?.name_en || "Unknown"}
              </span>
              <span className="text-[10px] text-zinc-600">
                {lineup.position || lineup.player?.position_en || "-"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Injured/Suspended */}
      {showInjured && injured.length > 0 && (
        <div className="space-y-1 pt-2 border-t border-zinc-800/50">
          <div className="text-[10px] text-red-400 uppercase tracking-wide flex items-center gap-1">
            <span>🏥</span> Injured & Suspended
          </div>
          {injured.map((lineup) => (
            <div
              key={lineup.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10"
            >
              <span className="text-xs text-red-300 truncate flex-1">
                {lineup.player?.name_en || "Unknown"}
              </span>
              <div className="text-right">
                <span className="text-[10px] text-red-400 block">
                  {lineup.injury_type || "Unavailable"}
                </span>
                {lineup.injury_return_date && (
                  <span className="text-[9px] text-zinc-500">
                    Returns: {lineup.injury_return_date}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// League table row component
const StandingRow = ({
  standing,
  isHighlighted,
  rank,
}: {
  standing: {
    team_id?: string;
    team?: {
      logo_url?: string | null;
      name_en?: string;
    };
    played?: number;
    gd?: number;
    points?: number;
  };
  isHighlighted: boolean;
  rank: number;
}) => (
  <div
    className={cn(
      "flex items-center gap-2 p-2 rounded-lg",
      isHighlighted
        ? "bg-primary/10 border border-primary/30"
        : "bg-zinc-800/20",
      rank <= 4 && "border-l-2 border-l-green-500/50",
      rank > 12 && "border-l-2 border-l-red-500/50"
    )}
  >
    <span className="text-xs text-zinc-500 w-5 text-center">{rank}</span>
    <div className="w-5 h-5 rounded overflow-hidden bg-zinc-700/50 flex items-center justify-center">
      {standing.team?.logo_url ? (
        <Image
          src={standing.team.logo_url}
          alt={standing.team.name_en || "Team"}
          width={20}
          height={20}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-[8px] text-zinc-400">
          {standing.team?.name_en?.substring(0, 2).toUpperCase()}
        </span>
      )}
    </div>
    <span
      className={cn(
        "text-xs truncate flex-1",
        isHighlighted ? "text-white font-medium" : "text-zinc-300"
      )}
    >
      {standing.team?.name_en || "Unknown"}
    </span>
    <span className="text-xs text-zinc-500 w-6 text-center">
      {standing.played}
    </span>
    <span className="text-xs text-zinc-400 w-6 text-center">{standing.gd}</span>
    <span className="text-xs text-white font-bold w-6 text-center">
      {standing.points}
    </span>
  </div>
);

export function MatchDetailPage({ matchId }: MatchDetailPageProps) {
  const router = useRouter();
  const { data: matchData, isLoading, error } = useMatchDetail(matchId);
  const [activeTab, setActiveTab] = useState("preview");

  // Get standings for league table
  const { data: standings } = useStandings(
    matchData?.match
      ? {
          league_id: matchData.match.league.id,
          season: matchData.match.season || undefined,
        }
      : undefined
  );

  // Get head-to-head data
  const { data: h2hData } = useHeadToHead(
    matchData?.match?.home_team?.id || "",
    matchData?.match?.away_team?.id || ""
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !matchData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Match Not Found
          </h1>
          <p className="text-zinc-400 mb-6">
            The match you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { match, events, lineups, stats } = matchData;
  const isLive = match.status === "live";
  const isCompleted = match.status === "completed";
  const isScheduled = match.status === "scheduled";

  // Separate lineups by team
  const homeLineups = lineups.filter((l) => l.team_id === match.home_team.id);
  const awayLineups = lineups.filter((l) => l.team_id === match.away_team.id);

  // Get stats by team
  const homeStats = stats.find((s) => s.team_id === match.home_team.id);
  const awayStats = stats.find((s) => s.team_id === match.away_team.id);

  // Group events for HT separator
  const firstHalfEvents = events.filter((e) => e.minute <= 45);
  const secondHalfEvents = events.filter((e) => e.minute > 45);

  // Use real stats if available, otherwise use defaults
  const matchStats = {
    possession: {
      home: homeStats?.possession || 50,
      away: awayStats?.possession || 50,
    },
    shots: {
      home: homeStats?.total_shots || 0,
      away: awayStats?.total_shots || 0,
    },
    shotsOnTarget: {
      home: homeStats?.shots_on_target || 0,
      away: awayStats?.shots_on_target || 0,
    },
    corners: { home: homeStats?.corners || 0, away: awayStats?.corners || 0 },
    fouls: {
      home: homeStats?.fouls_committed || 0,
      away: awayStats?.fouls_committed || 0,
    },
    yellowCards: {
      home: homeStats?.yellow_cards || 0,
      away: awayStats?.yellow_cards || 0,
    },
    redCards: {
      home: homeStats?.red_cards || 0,
      away: awayStats?.red_cards || 0,
    },
    passes: {
      home: homeStats?.total_passes || 0,
      away: awayStats?.total_passes || 0,
    },
    passAccuracy: {
      home: homeStats?.pass_accuracy || 0,
      away: awayStats?.pass_accuracy || 0,
    },
  };

  // Use real match conditions if available
  const matchConditions = {
    weather: match.weather || "Clear",
    temperature: match.temperature || "-",
    humidity: match.humidity || "-",
    wind: match.wind || "-",
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-zinc-400 hover:text-white transition-colors gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white h-8 w-8"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white h-8 w-8"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 space-y-4">
        {/* League Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-zinc-700/50 bg-zinc-800 flex items-center justify-center">
            {match.league.logo_url ? (
              <Image
                src={match.league.logo_url}
                alt={match.league.name_en}
                width={24}
                height={24}
                className="object-cover"
              />
            ) : (
              <Trophy className="h-3 w-3 text-zinc-500" />
            )}
          </div>
          <h2 className="text-sm font-semibold text-zinc-300">
            {match.league.name_en}
          </h2>
          {match.round && (
            <Badge variant="outline" className="text-[10px]">
              {match.round}
            </Badge>
          )}
          {match.match_day && (
            <Badge variant="outline" className="text-[10px]">
              Matchday {match.match_day}
            </Badge>
          )}
          {isLive && (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px] px-1.5 py-0">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1 animate-pulse"></span>
              LIVE
            </Badge>
          )}
        </div>

        {/* Match Score Card */}
        <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50 overflow-hidden">
          <CardContent className="p-4">
            {/* Teams and Score */}
            <div className="flex items-center justify-between mb-4">
              {/* Home Team */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden mb-2 bg-zinc-800/50 p-2 border border-zinc-700/30">
                  {match.home_team.logo_url ? (
                    <Image
                      src={match.home_team.logo_url}
                      alt={match.home_team.name_en}
                      width={80}
                      height={80}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold text-xl">
                      {match.home_team.name_en.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white text-center">
                  {match.home_team.name_en}
                </h3>
                {match.home_formation && (
                  <Badge variant="outline" className="mt-1 text-[10px]">
                    {match.home_formation}
                  </Badge>
                )}
              </div>

              {/* Score */}
              <div className="flex flex-col items-center px-4">
                <div className="text-3xl sm:text-5xl font-bold text-white mb-1">
                  {isLive || isCompleted ? (
                    <div className="flex items-center gap-3">
                      <span>{match.score_home}</span>
                      <span className="text-zinc-600">-</span>
                      <span>{match.score_away}</span>
                    </div>
                  ) : (
                    <span className="text-2xl text-zinc-500">VS</span>
                  )}
                </div>
                {isLive && (
                  <div className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
                    <Clock className="h-3 w-3" />
                    <span>{match.minute}&apos;</span>
                  </div>
                )}
                {isCompleted && (
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
                    Full Time
                  </Badge>
                )}
                {isScheduled && (
                  <div className="text-xs text-zinc-400 text-center mt-1">
                    {format(new Date(match.date), "HH:mm")}
                  </div>
                )}
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden mb-2 bg-zinc-800/50 p-2 border border-zinc-700/30">
                  {match.away_team.logo_url ? (
                    <Image
                      src={match.away_team.logo_url}
                      alt={match.away_team.name_en}
                      width={80}
                      height={80}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold text-xl">
                      {match.away_team.name_en.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white text-center">
                  {match.away_team.name_en}
                </h3>
                {match.away_formation && (
                  <Badge variant="outline" className="mt-1 text-[10px]">
                    {match.away_formation}
                  </Badge>
                )}
              </div>
            </div>

            {/* Match Info Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-zinc-800/50">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                <Calendar className="h-3 w-3" />
                <span className="truncate">
                  {format(new Date(match.date), "MMM dd, yyyy")}
                </span>
              </div>
              {match.venue && (
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{match.venue.name_en}</span>
                </div>
              )}
              {match.attendance && (
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                  <Users className="h-3 w-3" />
                  <span>{match.attendance.toLocaleString()}</span>
                </div>
              )}
              {match.surface && (
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                  <Target className="h-3 w-3" />
                  <span className="capitalize">{match.surface}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-zinc-900/60 border border-zinc-800/50 h-10 sm:h-11">
            <TabsTrigger
              value="preview"
              className="text-[10px] sm:text-sm px-1 sm:px-3"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="table"
              className="text-[10px] sm:text-sm px-1 sm:px-3"
            >
              Table
            </TabsTrigger>
            <TabsTrigger
              value="knockout"
              className="text-[10px] sm:text-sm px-1 sm:px-3"
            >
              <span className="hidden sm:inline">Knockout</span>
              <span className="sm:hidden">K.O.</span>
            </TabsTrigger>
            <TabsTrigger
              value="h2h"
              className="text-[10px] sm:text-sm px-1 sm:px-3"
            >
              <span className="hidden sm:inline">Head-to-Head</span>
              <span className="sm:hidden">H2H</span>
            </TabsTrigger>
          </TabsList>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4 mt-4">
            {/* Formation Field Map - Always show */}
            <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Predicted Lineup
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <FormationFieldMap
                  homeLineup={homeLineups}
                  awayLineup={awayLineups}
                  homeFormation={match.home_formation || "4-4-2"}
                  awayFormation={match.away_formation || "4-4-2"}
                  homeTeamName={match.home_team.name_en}
                  awayTeamName={match.away_team.name_en}
                  homeTeamLogo={match.home_team.logo_url}
                  awayTeamLogo={match.away_team.logo_url}
                  homeCoach={match.coach_home}
                  awayCoach={match.coach_away}
                />
              </CardContent>
            </Card>

            {/* Lineups Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50">
                <CardContent className="p-4">
                  <LineupList
                    lineups={homeLineups}
                    teamName={match.home_team.name_en}
                    showInjured={true}
                  />
                </CardContent>
              </Card>
              <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50">
                <CardContent className="p-4">
                  <LineupList
                    lineups={awayLineups}
                    teamName={match.away_team.name_en}
                    showInjured={true}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Coaches */}
            {(match.coach_home || match.coach_away) && (
              <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <UserCircle className="h-4 w-4 text-primary" />
                    Coaches
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                        <UserCircle className="h-4 w-4 text-zinc-500" />
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500">
                          {match.home_team.name_en}
                        </div>
                        <div className="text-sm text-white">
                          {match.coach_home || "TBD"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <div className="text-right">
                        <div className="text-[10px] text-zinc-500">
                          {match.away_team.name_en}
                        </div>
                        <div className="text-sm text-white">
                          {match.coach_away || "TBD"}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                        <UserCircle className="h-4 w-4 text-zinc-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Match Events Timeline */}
            <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Match Events
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 relative">
                {events.length === 0 ? (
                  <div className="text-center text-zinc-400 py-6 text-sm">
                    No events recorded for this match
                  </div>
                ) : (
                  <div className="relative">
                    {/* Central Vertical Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-800 -translate-x-1/2"></div>

                    {/* First Half Events */}
                    {firstHalfEvents.map((event) => (
                      <TimelineEvent
                        key={event.id}
                        event={event}
                        isHome={event.team_id === match.home_team.id}
                        homeTeamName={match.home_team.name_en}
                        awayTeamName={match.away_team.name_en}
                      />
                    ))}

                    {/* HT Separator */}
                    {(firstHalfEvents.length > 0 ||
                      secondHalfEvents.length > 0) && (
                      <TimelineSeparator label="Half Time" />
                    )}

                    {/* Second Half Events */}
                    {secondHalfEvents.map((event) => (
                      <TimelineEvent
                        key={event.id}
                        event={event}
                        isHome={event.team_id === match.home_team.id}
                        homeTeamName={match.home_team.name_en}
                        awayTeamName={match.away_team.name_en}
                      />
                    ))}

                    {/* FT Separator */}
                    {isCompleted && (
                      <TimelineSeparator
                        label={`Full Time ${match.score_home} - ${match.score_away}`}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Table Tab */}
          <TabsContent value="table" className="space-y-4 mt-4">
            <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  League Table
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {/* Table header */}
                <div className="flex items-center gap-2 p-2 text-[10px] text-zinc-500 uppercase tracking-wide border-b border-zinc-800/50 mb-2">
                  <span className="w-5 text-center">#</span>
                  <span className="w-5"></span>
                  <span className="flex-1">Team</span>
                  <span className="w-6 text-center">P</span>
                  <span className="w-6 text-center">GD</span>
                  <span className="w-6 text-center">Pts</span>
                </div>

                {standings && standings.length > 0 ? (
                  <div className="space-y-1">
                    {standings.map((standing, index) => (
                      <StandingRow
                        key={standing.id}
                        standing={standing}
                        rank={standing.rank || index + 1}
                        isHighlighted={
                          standing.team_id === match.home_team.id ||
                          standing.team_id === match.away_team.id
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-zinc-400 py-6 text-sm">
                    No standings data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knockout Tab */}
          <TabsContent value="knockout" className="space-y-4 mt-4">
            <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  Knockout Stage
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {/* Placeholder knockout bracket - would be populated from actual data */}
                <div className="text-center text-zinc-400 py-6 text-sm">
                  <p className="mb-4">
                    Knockout bracket will be displayed here when available.
                  </p>
                  <SimpleKnockoutBracket
                    rounds={[
                      {
                        name: "Semi-finals",
                        matches: [
                          {
                            id: "1",
                            homeTeam: {
                              id: "1",
                              name: "Team A",
                              score: 2,
                              isWinner: true,
                            },
                            awayTeam: { id: "2", name: "Team B", score: 1 },
                            isPlayed: true,
                          },
                          {
                            id: "2",
                            homeTeam: { id: "3", name: "Team C", score: 0 },
                            awayTeam: {
                              id: "4",
                              name: "Team D",
                              score: 3,
                              isWinner: true,
                            },
                            isPlayed: true,
                          },
                        ],
                      },
                      {
                        name: "Final",
                        matches: [
                          {
                            id: "3",
                            homeTeam: { id: "1", name: "Team A" },
                            awayTeam: { id: "4", name: "Team D" },
                            isPlayed: false,
                          },
                        ],
                      },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Head-to-Head Tab */}
          <TabsContent value="h2h" className="space-y-4 mt-4">
            <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  Head to Head
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {h2hData ? (
                  <>
                    {/* Stats Summary */}
                    <div className="text-center mb-4">
                      <div className="text-[10px] text-zinc-500 mb-2">
                        Last {h2hData.stats.totalMatches} Meetings
                      </div>
                      <div className="flex items-center justify-center gap-3 sm:gap-4 text-sm font-bold">
                        <div className="text-center flex-1">
                          <div className="text-xl sm:text-2xl text-primary">
                            {h2hData.stats.homeWins}
                          </div>
                          <div className="text-[9px] sm:text-[10px] text-zinc-500 truncate">
                            {match.home_team.name_en}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl text-zinc-400">
                            {h2hData.stats.draws}
                          </div>
                          <div className="text-[9px] sm:text-[10px] text-zinc-500">
                            Draws
                          </div>
                        </div>
                        <div className="text-center flex-1">
                          <div className="text-xl sm:text-2xl text-red-400">
                            {h2hData.stats.awayWins}
                          </div>
                          <div className="text-[9px] sm:text-[10px] text-zinc-500 truncate">
                            {match.away_team.name_en}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Matches */}
                    <div className="space-y-2 pt-4 border-t border-zinc-800/50">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wide mb-2">
                        Recent Matches
                      </div>
                      {h2hData.matches.map((h2hMatch) => (
                        <div
                          key={h2hMatch.id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-zinc-800/20 rounded-lg gap-1 sm:gap-2"
                        >
                          <span className="text-[9px] sm:text-[10px] text-zinc-500">
                            {format(new Date(h2hMatch.date), "MMM dd, yyyy")}
                          </span>
                          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                            <span className="text-[10px] sm:text-xs text-zinc-300 truncate max-w-[60px] sm:max-w-[80px]">
                              {h2hMatch.home_team.name_en}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-white shrink-0">
                              {h2hMatch.score_home} - {h2hMatch.score_away}
                            </span>
                            <span className="text-[10px] sm:text-xs text-zinc-300 truncate max-w-[60px] sm:max-w-[80px]">
                              {h2hMatch.away_team.name_en}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center text-zinc-400 py-6 text-sm">
                    No head-to-head data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Match Conditions */}
        <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <CloudSun className="h-4 w-4 text-primary" />
              Match Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <StatCard
                icon={Thermometer}
                label="Temperature"
                value={matchConditions.temperature}
                color="text-orange-400"
              />
              <StatCard
                icon={Wind}
                label="Wind"
                value={matchConditions.wind}
                color="text-blue-400"
              />
              <StatCard
                icon={CloudSun}
                label="Weather"
                value={matchConditions.weather}
                color="text-cyan-400"
              />
              <StatCard
                icon={Droplets}
                label="Humidity"
                value={matchConditions.humidity}
                color="text-green-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Match Officials */}
        {(match.referee ||
          match.assistant_referee_1 ||
          match.fourth_official) && (
          <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Match Officials
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {match.referee && (
                  <div className="flex items-center gap-2 p-2 bg-zinc-800/30 rounded-lg">
                    <Users className="h-4 w-4 text-zinc-400" />
                    <div>
                      <div className="text-[10px] text-zinc-500">Referee</div>
                      <div className="text-xs font-medium text-white">
                        {match.referee}
                      </div>
                    </div>
                  </div>
                )}
                {match.assistant_referee_1 && (
                  <div className="flex items-center gap-2 p-2 bg-zinc-800/30 rounded-lg">
                    <Users className="h-4 w-4 text-zinc-400" />
                    <div>
                      <div className="text-[10px] text-zinc-500">
                        Assistant Referee 1
                      </div>
                      <div className="text-xs font-medium text-white">
                        {match.assistant_referee_1}
                      </div>
                    </div>
                  </div>
                )}
                {match.assistant_referee_2 && (
                  <div className="flex items-center gap-2 p-2 bg-zinc-800/30 rounded-lg">
                    <Users className="h-4 w-4 text-zinc-400" />
                    <div>
                      <div className="text-[10px] text-zinc-500">
                        Assistant Referee 2
                      </div>
                      <div className="text-xs font-medium text-white">
                        {match.assistant_referee_2}
                      </div>
                    </div>
                  </div>
                )}
                {match.fourth_official && (
                  <div className="flex items-center gap-2 p-2 bg-zinc-800/30 rounded-lg">
                    <Users className="h-4 w-4 text-zinc-400" />
                    <div>
                      <div className="text-[10px] text-zinc-500">
                        Fourth Official
                      </div>
                      <div className="text-xs font-medium text-white">
                        {match.fourth_official}
                      </div>
                    </div>
                  </div>
                )}
                {match.assistant_referee_3 && (
                  <div className="flex items-center gap-2 p-2 bg-zinc-800/30 rounded-lg">
                    <Eye className="h-4 w-4 text-zinc-400" />
                    <div>
                      <div className="text-[10px] text-zinc-500">VAR</div>
                      <div className="text-xs font-medium text-white">
                        {match.assistant_referee_3}
                      </div>
                    </div>
                  </div>
                )}
                {match.match_commissioner && (
                  <div className="flex items-center gap-2 p-2 bg-zinc-800/30 rounded-lg">
                    <Shield className="h-4 w-4 text-zinc-400" />
                    <div>
                      <div className="text-[10px] text-zinc-500">
                        Match Commissioner
                      </div>
                      <div className="text-xs font-medium text-white">
                        {match.match_commissioner}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Venue with Google Maps */}
        {match.venue && (
          <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Map className="h-4 w-4 text-primary" />
                Venue
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white">
                    {match.venue.name_en}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    {match.venue.city}
                  </p>
                  {match.venue.capacity && (
                    <p className="text-xs text-zinc-500 mt-1">
                      Capacity: {match.venue.capacity.toLocaleString()}
                    </p>
                  )}
                  {match.venue.surface && (
                    <p className="text-xs text-zinc-500 mt-1 capitalize">
                      Surface: {match.venue.surface}
                    </p>
                  )}
                </div>
                {/* Google Maps iframe (if coordinates available) */}
                {match.venue.latitude && match.venue.longitude && (
                  <div className="w-32 h-24 rounded-lg overflow-hidden border border-zinc-700/50">
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/view?key=${
                        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
                      }&center=${match.venue.latitude},${
                        match.venue.longitude
                      }&zoom=15&maptype=roadmap`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Match Statistics */}
        {(isLive || isCompleted) && (
          <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Match Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <TeamStatBar
                homeValue={matchStats.possession.home}
                awayValue={matchStats.possession.away}
                label="Possession %"
              />
              <TeamStatBar
                homeValue={matchStats.shots.home}
                awayValue={matchStats.shots.away}
                label="Total Shots"
              />
              <TeamStatBar
                homeValue={matchStats.shotsOnTarget.home}
                awayValue={matchStats.shotsOnTarget.away}
                label="Shots on Target"
              />
              <TeamStatBar
                homeValue={matchStats.corners.home}
                awayValue={matchStats.corners.away}
                label="Corners"
              />
              <TeamStatBar
                homeValue={matchStats.passes.home}
                awayValue={matchStats.passes.away}
                label="Passes"
              />
              <TeamStatBar
                homeValue={matchStats.passAccuracy.home}
                awayValue={matchStats.passAccuracy.away}
                label="Pass Accuracy %"
              />
              <TeamStatBar
                homeValue={matchStats.fouls.home}
                awayValue={matchStats.fouls.away}
                label="Fouls"
              />
              <TeamStatBar
                homeValue={matchStats.yellowCards.home}
                awayValue={matchStats.yellowCards.away}
                label="Yellow Cards"
              />
            </CardContent>
          </Card>
        )}

        {/* Recent Form */}
        <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" />
              Recent Form
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-3">
            <div>
              <div className="text-xs text-zinc-400 mb-1.5">
                {match.home_team.name_en}
              </div>
              <div className="flex gap-1">
                {/* These would come from real form data */}
                {["W", "W", "D", "W", "L"].map((result, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-6 h-6 rounded flex items-center justify-center",
                      result === "W" &&
                        "bg-green-500/20 border border-green-500/30",
                      result === "D" &&
                        "bg-zinc-700/20 border border-zinc-600/30",
                      result === "L" && "bg-red-500/20 border border-red-500/30"
                    )}
                  >
                    <span
                      className={cn(
                        "text-[10px] font-bold",
                        result === "W" && "text-green-400",
                        result === "D" && "text-zinc-400",
                        result === "L" && "text-red-400"
                      )}
                    >
                      {result}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-400 mb-1.5">
                {match.away_team.name_en}
              </div>
              <div className="flex gap-1">
                {["W", "D", "D", "W", "W"].map((result, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-6 h-6 rounded flex items-center justify-center",
                      result === "W" &&
                        "bg-green-500/20 border border-green-500/30",
                      result === "D" &&
                        "bg-zinc-700/20 border border-zinc-600/30",
                      result === "L" && "bg-red-500/20 border border-red-500/30"
                    )}
                  >
                    <span
                      className={cn(
                        "text-[10px] font-bold",
                        result === "W" && "text-green-400",
                        result === "D" && "text-zinc-400",
                        result === "L" && "text-red-400"
                      )}
                    >
                      {result}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
