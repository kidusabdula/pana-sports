// components/cms/matches/match-control/hooks/useMatchTimer.ts
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Match } from "@/lib/schemas/match";

interface UseMatchTimerProps {
  match: Match;
  currentMatch: Match;
  onMinuteSync: (minute: number) => void;
}

interface UseMatchTimerReturn {
  matchMinute: number;
  matchSecond: number;
  isClockRunning: boolean;
  isExtraTime: boolean;
  isPenaltyShootout: boolean;
  setMatchMinute: React.Dispatch<React.SetStateAction<number>>;
  setMatchSecond: React.Dispatch<React.SetStateAction<number>>;
  setIsClockRunning: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExtraTime: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPenaltyShootout: React.Dispatch<React.SetStateAction<boolean>>;
  formatTime: (minute: number, second: number) => string;
  resetTimer: () => void;
  startTimer: () => void;
  stopTimer: () => void;
}

export function useMatchTimer({
  match,
  currentMatch,
  onMinuteSync,
}: UseMatchTimerProps): UseMatchTimerReturn {
  const [matchMinute, setMatchMinute] = useState(match.minute ?? 0);
  const [matchSecond, setMatchSecond] = useState(0);
  const [isClockRunning, setIsClockRunning] = useState(match.status === "live");
  const [isExtraTime, setIsExtraTime] = useState(match.status === "extra_time");
  const [isPenaltyShootout, setIsPenaltyShootout] = useState(
    match.status === "penalties"
  );

  // Track last synced minute with a ref to avoid effect re-runs
  const lastSyncedMinuteRef = useRef(matchMinute);

  // Real-time clock effect with DB sync every 60 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isClockRunning && currentMatch.status === "live") {
      interval = setInterval(() => {
        setMatchSecond((prevSecond) => {
          if (prevSecond >= 59) {
            setMatchMinute((prevMinute) => {
              const newMinute = prevMinute + 1;
              // Sync to DB every minute (when second rolls over)
              if (newMinute !== lastSyncedMinuteRef.current) {
                lastSyncedMinuteRef.current = newMinute;
                onMinuteSync(newMinute);
              }
              return newMinute;
            });
            return 0;
          }
          return prevSecond + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isClockRunning, currentMatch.status, onMinuteSync]);

  // Format time display with leading zeros
  const formatTime = useCallback((minute: number, second: number): string => {
    return `${minute.toString().padStart(2, "0")}:${second
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // Reset timer to initial state
  const resetTimer = useCallback(() => {
    setMatchMinute(0);
    setMatchSecond(0);
    setIsClockRunning(false);
    setIsExtraTime(false);
    setIsPenaltyShootout(false);
    lastSyncedMinuteRef.current = 0;
  }, []);

  // Start the timer
  const startTimer = useCallback(() => {
    setIsClockRunning(true);
  }, []);

  // Stop the timer
  const stopTimer = useCallback(() => {
    setIsClockRunning(false);
  }, []);

  return {
    matchMinute,
    matchSecond,
    isClockRunning,
    isExtraTime,
    isPenaltyShootout,
    setMatchMinute,
    setMatchSecond,
    setIsClockRunning,
    setIsExtraTime,
    setIsPenaltyShootout,
    formatTime,
    resetTimer,
    startTimer,
    stopTimer,
  };
}
