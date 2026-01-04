// components/shared/LiveMatchTime.tsx
"use client";

import { useState, useEffect } from "react";

interface MatchTimeData {
  status: string;
  minute?: number | null;
  match_started_at?: string | null;
  second_half_started_at?: string | null;
  extra_time_started_at?: string | null;
  calculated_minute?: number;
}

/**
 * Calculate match minute based on timestamps (client-side)
 */
function calculateMatchMinute(match: MatchTimeData): number {
  const now = new Date();

  // Check if match is in a running state
  if (!["live", "second_half", "extra_time"].includes(match.status)) {
    return match.minute ?? 0;
  }

  switch (match.status) {
    case "live": {
      if (!match.match_started_at) return match.minute ?? 0;
      const startTime = new Date(match.match_started_at);
      const elapsedSeconds = Math.floor(
        (now.getTime() - startTime.getTime()) / 1000
      );
      return Math.floor(elapsedSeconds / 60);
    }
    case "second_half": {
      if (!match.second_half_started_at) return match.minute ?? 46;
      const startTime = new Date(match.second_half_started_at);
      const elapsedSeconds = Math.floor(
        (now.getTime() - startTime.getTime()) / 1000
      );
      return 45 + Math.floor(elapsedSeconds / 60);
    }
    case "extra_time": {
      if (!match.extra_time_started_at) return match.minute ?? 91;
      const startTime = new Date(match.extra_time_started_at);
      const elapsedSeconds = Math.floor(
        (now.getTime() - startTime.getTime()) / 1000
      );
      return 90 + Math.floor(elapsedSeconds / 60);
    }
    default:
      return match.minute ?? 0;
  }
}

/**
 * Hook to get live-updating match minute
 * Works with any match object that has the required time fields
 */
export function useLiveMatchTime(match: MatchTimeData): number {
  // Calculate initial value
  const getInitialMinute = (): number => {
    if (["live", "second_half", "extra_time"].includes(match.status)) {
      const hasTimestamps =
        (match.status === "live" && match.match_started_at) ||
        (match.status === "second_half" && match.second_half_started_at) ||
        (match.status === "extra_time" && match.extra_time_started_at);

      if (hasTimestamps) {
        return calculateMatchMinute(match);
      }
    }
    return match.calculated_minute ?? match.minute ?? 0;
  };

  const [displayMinute, setDisplayMinute] = useState<number>(getInitialMinute);

  useEffect(() => {
    // For non-active matches, just return the stored minute directly
    const isActiveMatch = ["live", "second_half", "extra_time"].includes(
      match.status
    );

    if (!isActiveMatch) {
      // Use a microtask to avoid synchronous setState warning
      const value = match.minute ?? 0;
      if (displayMinute !== value) {
        queueMicrotask(() => setDisplayMinute(value));
      }
      return;
    }

    // Check if we have timestamps
    const hasTimestamps =
      (match.status === "live" && match.match_started_at) ||
      (match.status === "second_half" && match.second_half_started_at) ||
      (match.status === "extra_time" && match.extra_time_started_at);

    if (!hasTimestamps) {
      const value = match.calculated_minute ?? match.minute ?? 0;
      if (displayMinute !== value) {
        queueMicrotask(() => setDisplayMinute(value));
      }
      return;
    }

    // Update function for interval
    const updateTime = () => {
      setDisplayMinute(calculateMatchMinute(match));
    };

    // Initial update via timeout to avoid sync setState
    const timeoutId = setTimeout(updateTime, 0);

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [
    match.status,
    match.match_started_at,
    match.second_half_started_at,
    match.extra_time_started_at,
    match.minute,
    match.calculated_minute,
    displayMinute,
  ]);

  return displayMinute;
}

interface LiveMatchTimeDisplayProps {
  match: MatchTimeData;
  className?: string;
  showLabel?: boolean;
}

/**
 * Component to display live-updating match time
 */
export function LiveMatchTimeDisplay({
  match,
  className,
  showLabel = false,
}: LiveMatchTimeDisplayProps) {
  const displayMinute = useLiveMatchTime(match);

  if (
    !["live", "second_half", "extra_time", "half_time", "penalties"].includes(
      match.status
    )
  ) {
    return null;
  }

  return (
    <span className={className}>
      {showLabel && "LIVE "}
      {displayMinute}&apos;
    </span>
  );
}
