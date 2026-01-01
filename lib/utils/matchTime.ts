// lib/utils/matchTime.ts

/**
 * Match time calculation utilities for v2.0 time persistence
 *
 * These utilities calculate the current match minute based on database timestamps,
 * ensuring time persists correctly across page refreshes and browser sessions.
 */

export interface MatchTimeData {
  status: string;
  minute: number;
  match_started_at: string | null;
  second_half_started_at: string | null;
  extra_time_started_at: string | null;
  paused_at: string | null;
  total_paused_seconds: number;
}

export interface CalculatedTime {
  minutes: number;
  seconds: number;
  displayTime: string;
  period:
    | "first_half"
    | "second_half"
    | "extra_time_first"
    | "extra_time_second"
    | "half_time"
    | "penalties"
    | "not_started"
    | "completed";
  isRunning: boolean;
  addedTime: number; // Stoppage time beyond the period end
}

/**
 * Calculate the current match minute from database timestamps
 * This is the main function used by both CMS and public views
 */
export function calculateMatchTime(match: MatchTimeData): CalculatedTime {
  // Not started yet
  if (!match.match_started_at || match.status === "scheduled") {
    return {
      minutes: 0,
      seconds: 0,
      displayTime: "00:00",
      period: "not_started",
      isRunning: false,
      addedTime: 0,
    };
  }

  // Completed match - return stored minute
  if (match.status === "completed" || match.status === "cancelled") {
    return {
      minutes: match.minute,
      seconds: 0,
      displayTime: formatMatchTime(match.minute, 0),
      period: "completed",
      isRunning: false,
      addedTime: 0,
    };
  }

  // Paused match - return time when paused
  if (match.status === "paused" || match.status === "postponed") {
    const pausedTime = calculateTimeFromTimestamps(match);
    return {
      ...pausedTime,
      isRunning: false,
    };
  }

  // Half time - return 45 (or stored minute)
  if (match.status === "half_time") {
    return {
      minutes: match.minute || 45,
      seconds: 0,
      displayTime: formatMatchTime(match.minute || 45, 0),
      period: "half_time",
      isRunning: false,
      addedTime: Math.max(0, (match.minute || 45) - 45),
    };
  }

  // Penalties - clock doesn't run
  if (match.status === "penalties") {
    return {
      minutes: 120,
      seconds: 0,
      displayTime: "120:00",
      period: "penalties",
      isRunning: false,
      addedTime: 0,
    };
  }

  // Live match - calculate from timestamps
  return calculateTimeFromTimestamps(match);
}

/**
 * Calculate elapsed time from timestamps for live matches
 */
function calculateTimeFromTimestamps(match: MatchTimeData): CalculatedTime {
  const now = new Date();
  let elapsedSeconds = 0;
  let period: CalculatedTime["period"] = "first_half";
  let isInExtraTime = false;
  let baseMinutes = 0;

  // Determine which period we're in based on status and timestamps
  if (match.status === "extra_time" && match.extra_time_started_at) {
    // Extra time - starts from minute 91
    const extraTimeStart = new Date(match.extra_time_started_at);
    elapsedSeconds = Math.floor(
      (now.getTime() - extraTimeStart.getTime()) / 1000
    );

    // Subtract any pause time that occurred during extra time
    if (match.paused_at) {
      const pausedAt = new Date(match.paused_at);
      elapsedSeconds = Math.floor(
        (pausedAt.getTime() - extraTimeStart.getTime()) / 1000
      );
    }

    elapsedSeconds -= match.total_paused_seconds || 0;
    baseMinutes = 90;
    isInExtraTime = true;

    // Determine if first or second half of extra time
    const extraMinutes = Math.floor(elapsedSeconds / 60);
    period = extraMinutes < 15 ? "extra_time_first" : "extra_time_second";
  } else if (
    (match.status === "live" || match.status === "second_half") &&
    match.second_half_started_at
  ) {
    // Second half - starts from minute 46
    const secondHalfStart = new Date(match.second_half_started_at);
    elapsedSeconds = Math.floor(
      (now.getTime() - secondHalfStart.getTime()) / 1000
    );

    // Subtract any pause time that occurred during second half
    if (match.paused_at) {
      const pausedAt = new Date(match.paused_at);
      elapsedSeconds = Math.floor(
        (pausedAt.getTime() - secondHalfStart.getTime()) / 1000
      );
    }

    elapsedSeconds -= match.total_paused_seconds || 0;
    baseMinutes = 45;
    period = "second_half";
  } else if (match.match_started_at) {
    // First half
    const matchStart = new Date(match.match_started_at);
    elapsedSeconds = Math.floor((now.getTime() - matchStart.getTime()) / 1000);

    // Subtract any pause time that occurred during first half
    if (match.paused_at) {
      const pausedAt = new Date(match.paused_at);
      elapsedSeconds = Math.floor(
        (pausedAt.getTime() - matchStart.getTime()) / 1000
      );
    }

    elapsedSeconds -= match.total_paused_seconds || 0;
    period = "first_half";
  }

  // Calculate total minutes and seconds
  const periodMinutes = Math.floor(Math.max(0, elapsedSeconds) / 60);
  const totalMinutes = baseMinutes + periodMinutes;
  const seconds = Math.max(0, elapsedSeconds) % 60;

  // Calculate added time (stoppage time)
  let addedTime = 0;
  if (!isInExtraTime) {
    if (period === "first_half" && totalMinutes > 45) {
      addedTime = totalMinutes - 45;
    } else if (period === "second_half" && totalMinutes > 90) {
      addedTime = totalMinutes - 90;
    }
  } else {
    if (period === "extra_time_first" && totalMinutes > 105) {
      addedTime = totalMinutes - 105;
    } else if (period === "extra_time_second" && totalMinutes > 120) {
      addedTime = totalMinutes - 120;
    }
  }

  // Cap the displayed time based on period (but track added time separately)
  const displayMinutes = totalMinutes;

  return {
    minutes: displayMinutes,
    seconds: seconds,
    displayTime: formatMatchTime(displayMinutes, seconds),
    period,
    isRunning:
      match.status === "live" ||
      match.status === "second_half" ||
      match.status === "extra_time",
    addedTime,
  };
}

/**
 * Format time as MM:SS
 */
export function formatMatchTime(minutes: number, seconds: number): string {
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Format match minute for display (e.g., "45+2'" for stoppage time)
 */
export function formatMatchMinute(calculatedTime: CalculatedTime): string {
  if (calculatedTime.addedTime > 0) {
    const baseMinute = getBasePeriodMinute(calculatedTime.period);
    return `${baseMinute}+${calculatedTime.addedTime}'`;
  }
  return `${calculatedTime.minutes}'`;
}

/**
 * Get the base minute for a period (for stoppage time display)
 */
function getBasePeriodMinute(period: CalculatedTime["period"]): number {
  switch (period) {
    case "first_half":
      return 45;
    case "second_half":
      return 90;
    case "extra_time_first":
      return 105;
    case "extra_time_second":
      return 120;
    default:
      return 0;
  }
}

/**
 * Check if the match clock should be running based on status
 */
export function isClockRunning(status: string): boolean {
  return ["live", "second_half", "extra_time"].includes(status);
}

/**
 * Get the period name for display
 */
export function getPeriodName(period: CalculatedTime["period"]): string {
  switch (period) {
    case "first_half":
      return "First Half";
    case "second_half":
      return "Second Half";
    case "extra_time_first":
      return "Extra Time (1st)";
    case "extra_time_second":
      return "Extra Time (2nd)";
    case "half_time":
      return "Half Time";
    case "penalties":
      return "Penalties";
    case "not_started":
      return "Not Started";
    case "completed":
      return "Full Time";
    default:
      return "";
  }
}
