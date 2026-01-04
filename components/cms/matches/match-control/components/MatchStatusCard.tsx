// components/cms/matches/match-control/components/MatchStatusCard.tsx
"use client";

import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Timer,
  Clock,
  Flag,
  Trophy,
  Calendar,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "./shared/StatusBadge";
import { Match } from "@/lib/schemas/match";

interface MatchStatusCardProps {
  match: Match;
  currentMatch: Match;
  localScoreHome: number;
  localScoreAway: number;
  matchMinute: number;
  matchSecond: number;
  isClockRunning: boolean;
  isExtraTime: boolean;
  isPenaltyShootout: boolean;
  isAnyFetching: boolean;
  formatTime: (minute: number, second: number) => string;
  onStartMatch: () => void;
  onPauseMatch: () => void;
  onResumeMatch: () => void;
  onHalfTime: () => void;
  onSecondHalf: () => void;
  onStartExtraTime: () => void;
  onEndExtraTime: () => void;
  onStartPenaltyShootout: () => void;
  onEndPenaltyShootout: () => void;
  onFullTime: () => void;
  onRestartMatch: () => void;
  onRefresh: () => void;
  onUpdateMinute: (minute: number) => void;
  onAddInjuryTime: (half: "first" | "second", minutes: number) => void;
  onOpenPenaltyDialog: () => void;
  setMatchMinute: React.Dispatch<React.SetStateAction<number>>;
}

export function MatchStatusCard({
  match,
  currentMatch,
  localScoreHome,
  localScoreAway,
  matchMinute,
  matchSecond,
  isClockRunning,
  isExtraTime,
  isPenaltyShootout,
  isAnyFetching,
  formatTime,
  onStartMatch,
  onPauseMatch,
  onResumeMatch,
  onHalfTime,
  onSecondHalf,
  onStartExtraTime,
  onEndExtraTime,
  onStartPenaltyShootout,
  onEndPenaltyShootout,
  onFullTime,
  onRestartMatch,
  onRefresh,
  onUpdateMinute,
  onAddInjuryTime,
  onOpenPenaltyDialog,
  setMatchMinute,
}: MatchStatusCardProps) {
  // Local state for minute input to prevent timer from overwriting during editing
  const [localMinuteInput, setLocalMinuteInput] = useState(matchMinute);
  const [isEditingMinute, setIsEditingMinute] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync local input with parent state when not editing
  useEffect(() => {
    if (!isEditingMinute) {
      setLocalMinuteInput(matchMinute);
    }
  }, [matchMinute, isEditingMinute]);

  // Handle minute input change
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalMinuteInput(value);
  };

  // Handle minute update submission
  const handleMinuteUpdate = () => {
    onUpdateMinute(localMinuteInput);
    setIsEditingMinute(false);
    // Blur the input after update
    inputRef.current?.blur();
  };

  // Handle keyboard submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleMinuteUpdate();
    } else if (e.key === "Escape") {
      setIsEditingMinute(false);
      setLocalMinuteInput(matchMinute);
      inputRef.current?.blur();
    }
  };

  return (
    <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
      <CardHeader className="bg-muted/20 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Match Status
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isAnyFetching}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isAnyFetching ? "animate-spin" : ""}`}
              />
              {isAnyFetching ? "Refreshing..." : "Refresh"}
            </Button>
            <StatusBadge status={currentMatch.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Teams and Score */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              {/* Home Team */}
              <div className="flex items-center gap-3">
                {match.home_team?.logo_url && (
                  <img
                    src={match.home_team.logo_url}
                    alt={match.home_team.name_en}
                    className="h-10 w-10 object-contain"
                  />
                )}
                <div>
                  <h3 className="font-bold text-lg truncate max-w-[150px] sm:max-w-none">
                    {match.home_team?.name_en}
                  </h3>
                  <p className="text-sm text-muted-foreground">Home</p>
                </div>
              </div>

              {/* Score */}
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {localScoreHome} - {localScoreAway}
                </div>
                <div className="text-sm text-muted-foreground">
                  {[
                    "live",
                    "second_half",
                    "extra_time",
                    "paused",
                    "half_time",
                    "penalties",
                  ].includes(currentMatch.status) && (
                    <Badge
                      variant="outline"
                      className={`mt-1 ${
                        currentMatch.status === "paused"
                          ? "border-yellow-500 text-yellow-500"
                          : ""
                      }`}
                    >
                      {formatTime(matchMinute, matchSecond)}
                      {currentMatch.status === "paused" && " (PAUSED)"}
                      {currentMatch.status === "half_time" && " (HT)"}
                      {isExtraTime && " (ET)"}
                      {isPenaltyShootout && " (PEN)"}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Away Team */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <h3 className="font-bold text-lg truncate max-w-[150px] sm:max-w-none">
                    {match.away_team?.name_en}
                  </h3>
                  <p className="text-sm text-muted-foreground">Away</p>
                </div>
                {match.away_team?.logo_url && (
                  <img
                    src={match.away_team.logo_url}
                    alt={match.away_team.name_en}
                    className="h-10 w-10 object-contain"
                  />
                )}
              </div>
            </div>

            {/* Match Control Buttons */}
            <div className="flex flex-wrap gap-2 mt-6">
              {/* Scheduled State */}
              {currentMatch.status === "scheduled" && (
                <Button onClick={onStartMatch} className="gap-2">
                  <Play className="h-4 w-4" />
                  Start Match
                </Button>
              )}

              {/* Live State */}
              {currentMatch.status === "live" && (
                <>
                  <Button
                    onClick={isClockRunning ? onPauseMatch : onResumeMatch}
                    variant="outline"
                    className="gap-2"
                  >
                    {isClockRunning ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Resume
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={onHalfTime}
                    variant="outline"
                    className="gap-2"
                  >
                    <Timer className="h-4 w-4" />
                    Half Time
                  </Button>
                  <Button
                    onClick={onSecondHalf}
                    variant="outline"
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Second Half
                  </Button>
                  <Button
                    onClick={onStartExtraTime}
                    variant="outline"
                    className="gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Extra Time
                  </Button>
                  <Button
                    onClick={onStartPenaltyShootout}
                    variant="outline"
                    className="gap-2"
                  >
                    <Flag className="h-4 w-4" />
                    Penalties
                  </Button>
                  <Button onClick={onFullTime} className="gap-2">
                    <Square className="h-4 w-4" />
                    Full Time
                  </Button>
                </>
              )}

              {/* Half Time State */}
              {currentMatch.status === "half_time" && (
                <Button onClick={onSecondHalf} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Start Second Half
                </Button>
              )}

              {/* Second Half State - Active running state with all controls */}
              {currentMatch.status === "second_half" && (
                <>
                  <Button
                    onClick={isClockRunning ? onPauseMatch : onResumeMatch}
                    variant="outline"
                    className="gap-2"
                  >
                    {isClockRunning ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Resume
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={onStartExtraTime}
                    variant="outline"
                    className="gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Extra Time
                  </Button>
                  <Button
                    onClick={onStartPenaltyShootout}
                    variant="outline"
                    className="gap-2"
                  >
                    <Flag className="h-4 w-4" />
                    Penalties
                  </Button>
                  <Button onClick={onFullTime} className="gap-2">
                    <Square className="h-4 w-4" />
                    Full Time
                  </Button>
                </>
              )}

              {/* Extra Time State */}
              {currentMatch.status === "extra_time" && (
                <>
                  <Button
                    onClick={isClockRunning ? onPauseMatch : onResumeMatch}
                    variant="outline"
                    className="gap-2"
                  >
                    {isClockRunning ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Resume
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={onStartPenaltyShootout}
                    variant="outline"
                    className="gap-2"
                  >
                    <Flag className="h-4 w-4" />
                    Go to Penalties
                  </Button>
                  <Button onClick={onEndExtraTime} className="gap-2">
                    <Square className="h-4 w-4" />
                    End Extra Time
                  </Button>
                </>
              )}

              {/* Penalties State */}
              {currentMatch.status === "penalties" && (
                <>
                  <Button
                    onClick={onOpenPenaltyDialog}
                    variant="outline"
                    className="gap-2"
                  >
                    <Flag className="h-4 w-4" />
                    Record Penalty
                  </Button>
                  <Button onClick={onEndPenaltyShootout} className="gap-2">
                    <Square className="h-4 w-4" />
                    End Penalties
                  </Button>
                </>
              )}

              {/* Paused State - In-game pause with full control options */}
              {currentMatch.status === "paused" && (
                <>
                  <Button onClick={onResumeMatch} className="gap-2">
                    <Play className="h-4 w-4" />
                    Resume
                  </Button>
                  <Button
                    onClick={onHalfTime}
                    variant="outline"
                    className="gap-2"
                  >
                    <Timer className="h-4 w-4" />
                    Half Time
                  </Button>
                  <Button
                    onClick={onSecondHalf}
                    variant="outline"
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Second Half
                  </Button>
                  <Button
                    onClick={onStartExtraTime}
                    variant="outline"
                    className="gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Extra Time
                  </Button>
                  <Button
                    onClick={onStartPenaltyShootout}
                    variant="outline"
                    className="gap-2"
                  >
                    <Flag className="h-4 w-4" />
                    Penalties
                  </Button>
                  <Button
                    onClick={onFullTime}
                    variant="destructive"
                    className="gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Full Time
                  </Button>
                </>
              )}

              {/* Postponed State */}
              {currentMatch.status === "postponed" && (
                <Button onClick={onResumeMatch} className="gap-2">
                  <Play className="h-4 w-4" />
                  Resume Match
                </Button>
              )}

              {/* Completed State */}
              {currentMatch.status === "completed" && (
                <>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Trophy className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-500">
                      Match Completed
                    </span>
                  </div>
                  <Button
                    onClick={onRestartMatch}
                    variant="outline"
                    className="gap-2 border-yellow-500/50 hover:border-yellow-500 text-yellow-600 hover:text-yellow-500"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restart Match
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Match Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{format(new Date(match.date), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">{match.venue?.name_en || "TBD"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">
                {match.league?.name_en || "No League"}
              </span>
            </div>

            {/* Minute Control */}
            <div className="pt-4">
              <Label htmlFor="minute" className="text-sm font-medium">
                Match Minute{" "}
                {isEditingMinute && (
                  <span className="text-xs text-yellow-500 ml-2">
                    (editing...)
                  </span>
                )}
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  ref={inputRef}
                  id="minute"
                  type="number"
                  value={localMinuteInput}
                  onChange={handleMinuteChange}
                  onFocus={() => setIsEditingMinute(true)}
                  onBlur={() => {
                    // Delay to allow button click to register
                    setTimeout(() => setIsEditingMinute(false), 200);
                  }}
                  onKeyDown={handleKeyDown}
                  className={`w-20 ${
                    isEditingMinute
                      ? "border-yellow-500 ring-1 ring-yellow-500"
                      : ""
                  }`}
                  min={0}
                  max={120}
                />
                <Button
                  size="sm"
                  variant={isEditingMinute ? "default" : "outline"}
                  onClick={handleMinuteUpdate}
                >
                  Update
                </Button>
              </div>
            </div>

            {/* Extra Time Controls */}
            {currentMatch.status === "live" && (
              <div className="pt-4">
                <Label className="text-sm font-medium">Injury Time</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddInjuryTime("first", 1)}
                  >
                    +1' 1st
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddInjuryTime("first", 2)}
                  >
                    +2' 1st
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddInjuryTime("second", 1)}
                  >
                    +1' 2nd
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddInjuryTime("second", 2)}
                  >
                    +2' 2nd
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
