// components/cms/matches/LiveMatchMinute.tsx
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { calculateMatchTime, isMatchRunning } from "@/lib/utils/match-time";
import { Match } from "@/lib/schemas/match";

interface LiveMatchMinuteProps {
  match: Match;
  showBadge?: boolean;
  className?: string;
}

/**
 * Component that displays real-time match minute for live matches.
 * Uses the same timestamp-based calculation as the match control panel.
 */
export function LiveMatchMinute({
  match,
  showBadge = true,
  className,
}: LiveMatchMinuteProps) {
  const [displayMinute, setDisplayMinute] = useState<number>(match.minute ?? 0);

  useEffect(() => {
    // Only run timer for active matches
    if (!isMatchRunning(match.status)) {
      setDisplayMinute(match.minute ?? 0);
      return;
    }

    // Calculate time immediately
    const updateTime = () => {
      const hasTimestamps =
        (match.status === "live" && match.match_started_at) ||
        (match.status === "second_half" && match.second_half_started_at) ||
        (match.status === "extra_time" && match.extra_time_started_at);

      if (hasTimestamps) {
        const calculatedTime = calculateMatchTime(match);
        setDisplayMinute(calculatedTime.minute);
      } else {
        // Fallback to stored minute if no timestamps
        setDisplayMinute(match.minute ?? 0);
      }
    };

    // Initial calculation
    updateTime();

    // Update every second for live matches
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [match]);

  // Don't show anything for scheduled or non-live matches
  if (
    ![
      "live",
      "second_half",
      "extra_time",
      "half_time",
      "penalties",
      "paused",
    ].includes(match.status)
  ) {
    return null;
  }

  if (showBadge) {
    return (
      <Badge variant="outline" className={className}>
        {displayMinute}&apos;
      </Badge>
    );
  }

  return <span className={className}>{displayMinute}&apos;</span>;
}

/**
 * Hook for getting the calculated match minute.
 * Useful when you need the raw value instead of a component.
 */
export function useLiveMatchMinute(match: Match): number {
  const [displayMinute, setDisplayMinute] = useState<number>(match.minute ?? 0);

  useEffect(() => {
    if (!isMatchRunning(match.status)) {
      setDisplayMinute(match.minute ?? 0);
      return;
    }

    const updateTime = () => {
      const hasTimestamps =
        (match.status === "live" && match.match_started_at) ||
        (match.status === "second_half" && match.second_half_started_at) ||
        (match.status === "extra_time" && match.extra_time_started_at);

      if (hasTimestamps) {
        const calculatedTime = calculateMatchTime(match);
        setDisplayMinute(calculatedTime.minute);
      } else {
        setDisplayMinute(match.minute ?? 0);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [match]);

  return displayMinute;
}
