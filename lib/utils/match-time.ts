// lib/utils/match-time.ts
/**
 * Match Time Calculation Utility
 *
 * This module provides functions for calculating real-time match minutes
 * based on stored timestamps. This allows the match clock to persist
 * across page refreshes and browser sessions.
 */

import { Match } from "@/lib/schemas/match";

/**
 * Match phase information
 */
export interface MatchPhase {
  phase:
    | "first_half"
    | "half_time"
    | "second_half"
    | "extra_time_first"
    | "extra_time_break"
    | "extra_time_second"
    | "penalties"
    | "completed"
    | "not_started"
    | "paused";
  baseMinute: number;
  maxMinute: number;
  displaySuffix?: string;
}

/**
 * Calculated match time result
 */
export interface CalculatedMatchTime {
  minute: number;
  second: number;
  displayTime: string;
  phase: MatchPhase["phase"];
  isRunning: boolean;
  injuryTime: number;
}

/**
 * Get the current match phase based on status
 */
export function getMatchPhase(status: string): MatchPhase {
  switch (status) {
    case "scheduled":
      return { phase: "not_started", baseMinute: 0, maxMinute: 0 };
    case "live":
      return { phase: "first_half", baseMinute: 0, maxMinute: 45 };
    case "half_time":
      return { phase: "half_time", baseMinute: 45, maxMinute: 45 };
    case "second_half":
      return { phase: "second_half", baseMinute: 45, maxMinute: 90 };
    case "extra_time":
      return {
        phase: "extra_time_first",
        baseMinute: 90,
        maxMinute: 105,
        displaySuffix: "ET",
      };
    case "extra_time_break":
      return {
        phase: "extra_time_break",
        baseMinute: 105,
        maxMinute: 105,
        displaySuffix: "ET",
      };
    case "penalties":
      return {
        phase: "penalties",
        baseMinute: 120,
        maxMinute: 120,
        displaySuffix: "PEN",
      };
    case "paused":
    case "postponed":
    case "suspended":
      return { phase: "paused", baseMinute: 0, maxMinute: 120 };
    case "completed":
    case "cancelled":
    case "abandoned":
      return { phase: "completed", baseMinute: 90, maxMinute: 120 };
    default:
      return { phase: "not_started", baseMinute: 0, maxMinute: 0 };
  }
}

/**
 * Calculate the current match time based on timestamps
 * This is the main function for time persistence
 */
export function calculateMatchTime(match: Match): CalculatedMatchTime {
  const now = new Date();
  const phase = getMatchPhase(match.status);

  // Default result for non-active matches
  const defaultResult: CalculatedMatchTime = {
    minute: match.minute ?? 0,
    second: 0,
    displayTime: formatMatchTime(match.minute ?? 0, 0),
    phase: phase.phase,
    isRunning: false,
    injuryTime: 0,
  };

  // For non-running statuses, return the stored minute
  if (!["live", "second_half", "extra_time"].includes(match.status)) {
    return defaultResult;
  }

  // Calculate elapsed time based on the current phase
  let elapsedSeconds = 0;
  let baseMinute = 0;
  let injuryTime = 0;

  switch (match.status) {
    case "live": {
      // First half
      if (!match.match_started_at) {
        return defaultResult;
      }
      const startTime = new Date(match.match_started_at);
      elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      baseMinute = 0;
      injuryTime = match.first_half_injury_time ?? 0;
      break;
    }
    case "second_half": {
      // Second half - starts at minute 45
      if (!match.second_half_started_at) {
        // Fallback to stored minute if timestamp missing
        return defaultResult;
      }
      const startTime = new Date(match.second_half_started_at);
      elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      baseMinute = 45;
      injuryTime = match.second_half_injury_time ?? 0;
      break;
    }
    case "extra_time": {
      // Extra time - starts at minute 90
      if (!match.extra_time_started_at) {
        return defaultResult;
      }
      const startTime = new Date(match.extra_time_started_at);
      elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      baseMinute = 90;
      injuryTime =
        (match.extra_time_first_injury_time ?? 0) +
        (match.extra_time_second_injury_time ?? 0);
      break;
    }
    default:
      return defaultResult;
  }

  // Calculate minute and second
  const totalElapsedMinutes = Math.floor(elapsedSeconds / 60);
  const second = elapsedSeconds % 60;
  const minute = baseMinute + totalElapsedMinutes;

  // Cap the minute based on phase max (for display purposes)
  // The minute can exceed the max during injury time
  const displayMinute = minute;

  return {
    minute: displayMinute,
    second,
    displayTime: formatMatchTime(displayMinute, second, phase.displaySuffix),
    phase: phase.phase,
    isRunning: true,
    injuryTime,
  };
}

/**
 * Format match time for display
 */
export function formatMatchTime(
  minute: number,
  second: number,
  suffix?: string
): string {
  const minStr = minute.toString().padStart(2, "0");
  const secStr = second.toString().padStart(2, "0");
  const base = `${minStr}:${secStr}`;
  return suffix ? `${base} (${suffix})` : base;
}

/**
 * Get the timestamp field name for a given action
 */
export function getTimestampFieldForAction(action: string): keyof Match | null {
  const mapping: Record<string, keyof Match> = {
    start_match: "match_started_at",
    half_time: "first_half_ended_at",
    second_half: "second_half_started_at",
    full_time: "second_half_ended_at",
    extra_time_start: "extra_time_started_at",
    extra_time_end: "extra_time_ended_at",
    penalties_start: "penalties_started_at",
    match_end: "match_ended_at",
  };
  return mapping[action] || null;
}

/**
 * Create the update payload for match control with proper timestamps
 */
export function createMatchControlPayload(
  action:
    | "start"
    | "pause"
    | "resume"
    | "half_time"
    | "second_half"
    | "full_time"
    | "extra_time"
    | "end_extra_time"
    | "penalties"
    | "end_penalties",
  currentMinute?: number
): Partial<Match> & { status: Match["status"] } {
  const now = new Date().toISOString();

  switch (action) {
    case "start":
      return {
        status: "live",
        minute: 0,
        match_started_at: now,
      };
    case "pause":
      return {
        status: "paused",
        minute: currentMinute ?? 0,
      };
    case "resume":
      return {
        status: "live",
        // Note: We might need to adjust match_started_at to account for pause time
        // For simplicity, we keep the same timestamp and the minute persists
      };
    case "half_time":
      return {
        status: "half_time",
        minute: 45,
        first_half_ended_at: now,
      };
    case "second_half":
      return {
        status: "second_half",
        minute: 46,
        second_half_started_at: now,
      };
    case "full_time":
      return {
        status: "completed",
        minute: 90,
        second_half_ended_at: now,
        match_ended_at: now,
      };
    case "extra_time":
      return {
        status: "extra_time",
        minute: 91,
        extra_time_started_at: now,
      };
    case "end_extra_time":
      return {
        status: "completed",
        minute: 120,
        extra_time_ended_at: now,
        match_ended_at: now,
      };
    case "penalties":
      return {
        status: "penalties",
        minute: 120,
        penalties_started_at: now,
      };
    case "end_penalties":
      return {
        status: "completed",
        minute: 120,
        match_ended_at: now,
      };
    default:
      return { status: "scheduled" };
  }
}

/**
 * Check if a match is currently in a running state
 */
export function isMatchRunning(status: string): boolean {
  return ["live", "second_half", "extra_time"].includes(status);
}

/**
 * Check if a match is in an active but paused state
 */
export function isMatchPaused(status: string): boolean {
  return ["half_time", "extra_time_break", "paused"].includes(status);
}

/**
 * Check if a match has ended
 */
export function isMatchEnded(status: string): boolean {
  return ["completed", "cancelled", "abandoned"].includes(status);
}
