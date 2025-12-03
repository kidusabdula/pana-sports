// components/matches/MatchDetailPage.tsx
"use client";

import {
  useMatchDetail,
  type MatchEvent,
} from "@/lib/hooks/public/useMatchDetail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  TrendingUp,
  Target,
  Activity,
  Zap,
  Shield,
  Flame,
  Star,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface MatchDetailPageProps {
  matchId: string;
}

// Timeline Event Component
const TimelineEvent = ({
  event,
  isHome,
}: {
  event: MatchEvent;
  isHome: boolean;
}) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal":
        return "⚽";
      case "yellow":
        return "🟨";
      case "red":
        return "🟥";
      case "sub":
        return <ArrowRightLeft className="h-3 w-3" />;
      case "assist":
        return "🎯";
      case "own_goal":
        return "⚽";
      case "penalty":
        return "⚽";
      default:
        return "📝";
    }
  };

  const isSub = event.type === "sub";

  return (
    <div
      className={cn(
        "flex items-center w-full mb-3 relative",
        isHome ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Content Side */}
      <div
        className={cn(
          "flex-1 flex items-center gap-2",
          isHome
            ? "justify-start flex-row-reverse text-right"
            : "justify-start flex-row text-left"
        )}
      >
        {/* Player Info */}
        <div className="flex flex-col justify-center">
          <div
            className={cn(
              "font-semibold text-xs text-white",
              isSub && "text-green-400"
            )}
          >
            {event.player.name_en}
          </div>
          {isSub && (
            <div className="text-[10px] text-red-400 font-medium">
              {event.description_en || "Player Out"}
            </div>
          )}
          {!isSub && event.description_en && (
            <div className="text-[10px] text-zinc-500">
              {event.description_en}
            </div>
          )}
        </div>

        {/* Icon */}
        <div className="shrink-0 w-5 h-5 flex items-center justify-center">
          {typeof getEventIcon(event.type) === "string" ? (
            <span className="text-base">{getEventIcon(event.type)}</span>
          ) : (
            <div className="bg-zinc-800 p-0.5 rounded-full text-zinc-400">
              {getEventIcon(event.type)}
            </div>
          )}
        </div>
      </div>

      {/* Center Line & Minute */}
      <div className="w-10 flex justify-center relative shrink-0 mx-1.5">
        <div className="w-7 h-7 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center z-10">
          <span className="text-[10px] font-bold text-white">
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
  <div className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-800/50">
    <div className="flex items-center gap-2 mb-1">
      <Icon className={cn("h-4 w-4", color)} />
      <span className="text-xs text-zinc-400">{label}</span>
    </div>
    <div className="text-lg font-bold text-white">{value}</div>
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
    <div className="mb-4">
      <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
        <span className="font-medium">{homeValue}</span>
        <span className="text-zinc-500 uppercase tracking-wide text-[10px]">
          {label}
        </span>
        <span className="font-medium">{awayValue}</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-zinc-800">
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

export function MatchDetailPage({ matchId }: MatchDetailPageProps) {
  const { data: matchData, isLoading, error } = useMatchDetail(matchId);

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

  const { match, events } = matchData;
  const isLive = match.status === "live";
  const isCompleted = match.status === "completed";
  const isScheduled = match.status === "scheduled";

  // Group events for HT separator
  const firstHalfEvents = events.filter((e) => e.minute <= 45);
  const secondHalfEvents = events.filter((e) => e.minute > 45);

  // Hardcoded stats for cozy feel (would come from API in production)
  const matchStats = {
    possession: { home: 58, away: 42 },
    shots: { home: 14, away: 9 },
    shotsOnTarget: { home: 6, away: 4 },
    corners: { home: 7, away: 3 },
    fouls: { home: 11, away: 15 },
    yellowCards: { home: 2, away: 3 },
    redCards: { home: 0, away: 0 },
    passes: { home: 487, away: 356 },
    passAccuracy: { home: 84, away: 78 },
  };

  // Hardcoded match conditions for atmosphere
  const matchConditions = {
    weather: "Partly Cloudy",
    temperature: "24°C",
    humidity: "65%",
    wind: "12 km/h",
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/live"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
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
              </div>
            </div>

            {/* Match Info Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-zinc-800/50">
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
            </div>
          </CardContent>
        </Card>

        {/* Match Conditions */}
        <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
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
                icon={Eye}
                label="Weather"
                value={matchConditions.weather}
                color="text-cyan-400"
              />
              <StatCard
                icon={TrendingUp}
                label="Humidity"
                value={matchConditions.humidity}
                color="text-green-400"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Match Statistics */}
          <div className="lg:col-span-2 space-y-4">
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
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Stats */}
            <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-2">
                <div className="flex items-center justify-between p-2 bg-zinc-800/30 rounded-lg">
                  <span className="text-xs text-zinc-400">Goals</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {match.score_home}
                    </span>
                    <span className="text-xs text-zinc-600">-</span>
                    <span className="text-sm font-bold text-white">
                      {match.score_away}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-zinc-800/30 rounded-lg">
                  <span className="text-xs text-zinc-400">Yellow Cards</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-yellow-400">
                      {matchStats.yellowCards.home}
                    </span>
                    <span className="text-xs text-zinc-600">-</span>
                    <span className="text-sm font-bold text-yellow-400">
                      {matchStats.yellowCards.away}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-zinc-800/30 rounded-lg">
                  <span className="text-xs text-zinc-400">Red Cards</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-red-400">
                      {matchStats.redCards.home}
                    </span>
                    <span className="text-xs text-zinc-600">-</span>
                    <span className="text-sm font-bold text-red-400">
                      {matchStats.redCards.away}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Match Officials */}
            {match.referee && (
              <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Match Officials
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="flex items-center gap-2 p-2 bg-zinc-800/30 rounded-lg">
                    <Users className="h-4 w-4 text-zinc-400" />
                    <div>
                      <div className="text-xs text-zinc-500">Referee</div>
                      <div className="text-sm font-medium text-white">
                        {match.referee}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form Guide (Hardcoded for cozy feel) */}
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
                    <div className="w-6 h-6 rounded bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-green-400">
                        W
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-green-400">
                        W
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded bg-zinc-700/20 border border-zinc-600/30 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-zinc-400">
                        D
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-green-400">
                        W
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-red-400">
                        L
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400 mb-1.5">
                    {match.away_team.name_en}
                  </div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-green-400">
                        W
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded bg-zinc-700/20 border border-zinc-600/30 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-zinc-400">
                        D
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded bg-zinc-700/20 border border-zinc-600/30 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-zinc-400">
                        D
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-green-400">
                        W
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-green-400">
                        W
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Head to Head */}
            <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  Head to Head
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="text-center mb-3">
                  <div className="text-xs text-zinc-500 mb-1">
                    Last 5 Meetings
                  </div>
                  <div className="flex items-center justify-center gap-3 text-sm font-bold">
                    <span className="text-primary">3</span>
                    <span className="text-zinc-600">-</span>
                    <span className="text-zinc-400">1</span>
                    <span className="text-zinc-600">-</span>
                    <span className="text-red-400">1</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs p-1.5 bg-zinc-800/20 rounded">
                    <span className="text-zinc-500">Oct 15, 2024</span>
                    <span className="font-medium text-white">2 - 1</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-1.5 bg-zinc-800/20 rounded">
                    <span className="text-zinc-500">May 22, 2024</span>
                    <span className="font-medium text-white">1 - 1</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-1.5 bg-zinc-800/20 rounded">
                    <span className="text-zinc-500">Jan 8, 2024</span>
                    <span className="font-medium text-white">3 - 0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
