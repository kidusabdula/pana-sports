// components/cms/matches/match-control/hooks/useMatchControlState.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Match } from "@/lib/schemas/match";
import { MatchLineup } from "@/lib/schemas/matchLineup";
import { useMatch } from "@/lib/hooks/cms/useMatches";
import {
  useMatchEvents,
  useCreateMatchEvent,
} from "@/lib/hooks/cms/useMatchEvents";
import { useMatchControl } from "@/lib/hooks/cms/useMatchControl";
import {
  useMatchLineups,
  useCreateMatchLineups,
  useDeleteMatchLineups,
} from "@/lib/hooks/cms/useMatchLineups";
import { useTeams } from "@/lib/hooks/cms/useTeams";
import { toast } from "sonner";
import {
  ACTIVE_MATCH_STATUSES,
  POLLING_INTERVAL,
  EVENT_MESSAGES,
} from "../constants";
import type { Player, CreateEventPayload } from "../types";
import {
  calculateMatchTime,
  isMatchRunning,
  createMatchControlPayload,
} from "@/lib/utils/match-time";

interface UseMatchControlStateProps {
  match: Match;
}

export function useMatchControlState({ match }: UseMatchControlStateProps) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  // ============ Core Data Fetching ============
  const {
    data: liveMatch,
    refetch: refetchMatch,
    isFetching: isMatchFetching,
  } = useMatch(match.id);

  const {
    data: events,
    isLoading: isEventsLoading,
    refetch: refetchEvents,
    isFetching: isEventsFetching,
  } = useMatchEvents(match.id);

  const {
    data: lineups,
    refetch: refetchLineups,
    isFetching: isLineupsFetching,
  } = useMatchLineups(match.id);

  const { data: teams } = useTeams();

  // ============ Mutations ============
  const createEventMutation = useCreateMatchEvent(match.id);
  const matchControlMutation = useMatchControl(match.id);
  const createLineupsMutation = useCreateMatchLineups(match.id);
  const deleteLineupsMutation = useDeleteMatchLineups(match.id);

  // Use the live match data if available, otherwise fall back to the initial prop
  const currentMatch = liveMatch ?? match;

  // ============ UI State ============
  const [activeTab, setActiveTab] = useState("control");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ============ Event Creation State ============
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedSubInPlayer, setSelectedSubInPlayer] = useState("");
  const [selectedSubOutPlayer, setSelectedSubOutPlayer] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  // ============ Dialog State ============
  const [isSubstitutionOpen, setIsSubstitutionOpen] = useState(false);
  const [lineupDialogOpen, setLineupDialogOpen] = useState(false);
  const [varDialogOpen, setVarDialogOpen] = useState(false);
  const [penaltyDialogOpen, setPenaltyDialogOpen] = useState(false);
  const [varType, setVarType] = useState("");
  const [penaltyTeam, setPenaltyTeam] = useState("");
  const [penaltyResult, setPenaltyResult] = useState("");

  // ============ Timer State ============
  const [matchMinute, setMatchMinute] = useState(match.minute ?? 0);
  const [matchSecond, setMatchSecond] = useState(0);
  const [isClockRunning, setIsClockRunning] = useState(match.status === "live");
  const [isExtraTime, setIsExtraTime] = useState(match.status === "extra_time");
  const [isPenaltyShootout, setIsPenaltyShootout] = useState(
    match.status === "penalties"
  );
  const lastSyncedMinuteRef = useRef(matchMinute);

  // ============ Score State ============
  const [localScoreHome, setLocalScoreHome] = useState(match.score_home ?? 0);
  const [localScoreAway, setLocalScoreAway] = useState(match.score_away ?? 0);

  // ============ Lineup State ============
  const [homeLineup, setHomeLineup] = useState<MatchLineup[]>([]);
  const [awayLineup, setAwayLineup] = useState<MatchLineup[]>([]);
  const [homeFormation, setHomeFormation] = useState(
    match.home_formation ?? "4-4-2"
  );
  const [awayFormation, setAwayFormation] = useState(
    match.away_formation ?? "4-4-2"
  );

  // ============ Match Details State ============
  const [matchRound, setMatchRound] = useState(match.round ?? "");
  const [coachHome, setCoachHome] = useState(match.coach_home ?? "");
  const [coachAway, setCoachAway] = useState(match.coach_away ?? "");
  const [assistantReferee1, setAssistantReferee1] = useState(
    match.assistant_referee_1 ?? ""
  );
  const [assistantReferee2, setAssistantReferee2] = useState(
    match.assistant_referee_2 ?? ""
  );
  const [assistantReferee3, setAssistantReferee3] = useState(
    match.assistant_referee_3 ?? ""
  );
  const [fourthOfficial, setFourthOfficial] = useState(
    match.fourth_official ?? ""
  );
  const [matchCommissioner, setMatchCommissioner] = useState(
    match.match_commissioner ?? ""
  );
  const [weather, setWeather] = useState(match.weather ?? "");
  const [temperature, setTemperature] = useState(match.temperature ?? "");
  const [humidity, setHumidity] = useState(match.humidity ?? "");
  const [wind, setWind] = useState(match.wind ?? "");
  const [surface, setSurface] = useState(match.surface ?? "grass");

  // ============ Computed Values ============
  const isAnyFetching =
    isRefreshing || isMatchFetching || isEventsFetching || isLineupsFetching;

  const homeTeamPlayers: Player[] =
    teams?.find((t) => t.id === match.home_team_id)?.players || [];
  const awayTeamPlayers: Player[] =
    teams?.find((t) => t.id === match.away_team_id)?.players || [];

  // ============ Effects ============

  // Real-time clock effect using timestamp-based calculation for PERSISTENCE
  // This calculates time from stored timestamps, so time persists across page refreshes
  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Determine if the match is in a running state based on STATUS only
    // Don't rely on calculateMatchTime for this - it might not have timestamps yet
    const isActivelyRunning = isMatchRunning(currentMatch.status);

    if (isActivelyRunning) {
      // Set clock running based on status, not calculated value
      setIsClockRunning(true);

      // Calculate time - use timestamps if available, otherwise fallback to client-side timing
      const updateTime = () => {
        // Check if we have timestamps for proper calculation
        const hasTimestamps =
          (currentMatch.status === "live" && currentMatch.match_started_at) ||
          (currentMatch.status === "second_half" &&
            currentMatch.second_half_started_at) ||
          (currentMatch.status === "extra_time" &&
            currentMatch.extra_time_started_at);

        if (hasTimestamps) {
          // Use timestamp-based calculation for accuracy and persistence
          const calculatedTime = calculateMatchTime(currentMatch);
          setMatchMinute(calculatedTime.minute);
          setMatchSecond(calculatedTime.second);
        } else {
          // Fallback: client-side timing when timestamps aren't available yet
          // This happens right after starting when mutation hasn't synced
          setMatchSecond((prevSecond) => {
            if (prevSecond >= 59) {
              setMatchMinute((prevMinute) => prevMinute + 1);
              return 0;
            }
            return prevSecond + 1;
          });
        }
      };

      // Calculate time IMMEDIATELY on mount/status change, then start interval
      updateTime();
      interval = setInterval(updateTime, 1000);
    } else {
      // For non-running states, just use the stored minute
      setMatchMinute(currentMatch.minute ?? 0);
      setMatchSecond(0);
      setIsClockRunning(false);
    }

    return () => clearInterval(interval);
  }, [currentMatch]);

  // Real-time subscription for match events
  useEffect(() => {
    const channel = supabase
      .channel(`match_events:${match.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "match_events",
          filter: `match_id=eq.${match.id}`,
        },
        () => refetchEvents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, match.id, refetchEvents]);

  // Real-time subscription for match control
  useEffect(() => {
    const channel = supabase
      .channel(`match:${match.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "matches",
          filter: `id=eq.${match.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["matches", match.id] });
          refetchMatch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, match.id, queryClient, refetchMatch]);

  // Polling fallback for active matches
  useEffect(() => {
    const isActiveMatch = ACTIVE_MATCH_STATUSES.includes(
      currentMatch.status as any
    );
    if (!isActiveMatch) return;

    const pollInterval = setInterval(() => {
      Promise.all([refetchMatch(), refetchEvents()]).catch((error) => {
        console.error("Polling refresh error:", error);
      });
    }, POLLING_INTERVAL);

    return () => clearInterval(pollInterval);
  }, [currentMatch.status, refetchMatch, refetchEvents]);

  // Process lineups
  useEffect(() => {
    if (lineups) {
      const homeTeamId = match.home_team_id;
      const awayTeamId = match.away_team_id;

      setTimeout(() => {
        setHomeLineup(lineups.filter((l) => l.team_id === homeTeamId));
        setAwayLineup(lineups.filter((l) => l.team_id === awayTeamId));
      }, 0);
    }
  }, [lineups, match.home_team_id, match.away_team_id]);

  // Sync local state when live match data changes
  useEffect(() => {
    if (liveMatch) {
      setTimeout(() => {
        if (liveMatch.minute !== undefined && liveMatch.minute !== null) {
          setMatchMinute(liveMatch.minute);
          lastSyncedMinuteRef.current = liveMatch.minute;
        }
        if (
          liveMatch.score_home !== undefined &&
          liveMatch.score_home !== null
        ) {
          setLocalScoreHome(liveMatch.score_home);
        }
        if (
          liveMatch.score_away !== undefined &&
          liveMatch.score_away !== null
        ) {
          setLocalScoreAway(liveMatch.score_away);
        }
        setIsClockRunning(liveMatch.status === "live");
        setIsExtraTime(liveMatch.status === "extra_time");
        setIsPenaltyShootout(liveMatch.status === "penalties");
      }, 0);
    }
  }, [liveMatch]);

  // ============ Helper Functions ============
  const formatTime = (minute: number, second: number) => {
    return `${minute.toString().padStart(2, "0")}:${second
      .toString()
      .padStart(2, "0")}`;
  };

  const refreshAllData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchMatch(), refetchEvents(), refetchLineups()]);
      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
      console.error("Refresh error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const createEvent = (payload: CreateEventPayload) => {
    createEventMutation.mutate(payload);
  };

  const resetEventForm = () => {
    setSelectedPlayer("");
    setSelectedTeam("");
    setEventDescription("");
  };

  const resetSubstitutionForm = () => {
    setSelectedSubInPlayer("");
    setSelectedSubOutPlayer("");
    setEventDescription("");
  };

  // ============ Match Control Actions ============
  const startMatch = useCallback(() => {
    // Use createMatchControlPayload to set match_started_at timestamp
    const payload = createMatchControlPayload("start");
    matchControlMutation.mutate(payload);
    setIsClockRunning(true);
    setMatchMinute(0);
    setMatchSecond(0);
    setIsExtraTime(false);
    setIsPenaltyShootout(false);

    createEvent({
      match_id: match.id,
      type: "match_start",
      minute: 0,
      description_en: EVENT_MESSAGES.match_start.en,
      description_am: EVENT_MESSAGES.match_start.am,
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  }, [match.id, matchControlMutation]);

  const pauseMatch = useCallback(() => {
    // Use "paused" status instead of "postponed" for in-game pause
    matchControlMutation.mutate({
      status: "paused",
      minute: matchMinute,
    });
    setIsClockRunning(false);

    createEvent({
      match_id: match.id,
      type: "match_pause",
      minute: matchMinute,
      description_en: EVENT_MESSAGES.match_pause.en,
      description_am: EVENT_MESSAGES.match_pause.am,
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  }, [match.id, matchMinute, matchControlMutation]);

  const resumeMatch = useCallback(() => {
    // Resume match - we need to recalculate the timestamp based on stored minute
    // For now, we update match_started_at to account for the pause
    const now = new Date();
    // Calculate how far back the match_started_at should be based on current minute
    const adjustedStartTime = new Date(now.getTime() - matchMinute * 60 * 1000);

    matchControlMutation.mutate({
      status: "live",
      match_started_at: adjustedStartTime.toISOString(),
    });
    setIsClockRunning(true);

    createEvent({
      match_id: match.id,
      type: "match_resume",
      minute: matchMinute,
      description_en: EVENT_MESSAGES.match_resume.en,
      description_am: EVENT_MESSAGES.match_resume.am,
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  }, [match.id, matchMinute, matchControlMutation]);

  const halfTime = useCallback(() => {
    const payload = createMatchControlPayload("half_time");
    matchControlMutation.mutate(payload);
    setIsClockRunning(false);

    createEvent({
      match_id: match.id,
      type: "half_time",
      minute: 45,
      description_en: EVENT_MESSAGES.half_time.en,
      description_am: EVENT_MESSAGES.half_time.am,
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  }, [match.id, matchControlMutation]);

  const secondHalf = useCallback(() => {
    const payload = createMatchControlPayload("second_half");
    matchControlMutation.mutate(payload);
    setIsClockRunning(true);
    setMatchMinute(46);
    setMatchSecond(0);

    createEvent({
      match_id: match.id,
      type: "second_half",
      minute: 46,
      description_en: EVENT_MESSAGES.second_half.en,
      description_am: EVENT_MESSAGES.second_half.am,
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  }, [match.id, matchControlMutation]);

  const fullTime = useCallback(() => {
    const payload = createMatchControlPayload("full_time");
    matchControlMutation.mutate(payload);
    setIsClockRunning(false);

    createEvent({
      match_id: match.id,
      type: "match_end",
      minute: 90,
      description_en: EVENT_MESSAGES.full_time.en,
      description_am: EVENT_MESSAGES.full_time.am,
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  }, [match.id, matchControlMutation]);

  const startExtraTime = useCallback(() => {
    const payload = createMatchControlPayload("extra_time");
    matchControlMutation.mutate(payload);
    setIsClockRunning(true);
    setIsExtraTime(true);
    setMatchMinute(91);
    setMatchSecond(0);

    createEvent({
      match_id: match.id,
      type: "extra_time_start",
      minute: 91,
      description_en: EVENT_MESSAGES.extra_time_start.en,
      description_am: EVENT_MESSAGES.extra_time_start.am,
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  }, [match.id, matchControlMutation]);

  const endExtraTime = useCallback(() => {
    const payload = createMatchControlPayload("end_extra_time");
    matchControlMutation.mutate(payload);
    setIsClockRunning(false);

    createEvent({
      match_id: match.id,
      type: "extra_time_end",
      minute: 120,
      description_en: EVENT_MESSAGES.extra_time_end.en,
      description_am: EVENT_MESSAGES.extra_time_end.am,
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  }, [match.id, matchControlMutation]);

  const startPenaltyShootout = useCallback(() => {
    const payload = createMatchControlPayload("penalties");
    matchControlMutation.mutate(payload);
    setIsClockRunning(false);
    setIsPenaltyShootout(true);

    createEvent({
      match_id: match.id,
      type: "penalty_shootout_start",
      minute: 120,
      description_en: EVENT_MESSAGES.penalty_shootout_start.en,
      description_am: EVENT_MESSAGES.penalty_shootout_start.am,
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  }, [match.id, matchControlMutation]);

  const endPenaltyShootout = useCallback(() => {
    const payload = createMatchControlPayload("end_penalties");
    matchControlMutation.mutate(payload);

    createEvent({
      match_id: match.id,
      type: "penalty_shootout_end",
      minute: 120,
      description_en: EVENT_MESSAGES.penalty_shootout_end.en,
      description_am: EVENT_MESSAGES.penalty_shootout_end.am,
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  }, [match.id, matchControlMutation]);

  const updateMinute = useCallback(
    (newMinute: number) => {
      // For manual time updates, we need to recalculate the timestamp
      // so that automatic timing continues from the new minute
      const now = new Date();

      // Build the update payload based on current match status
      const updatePayload: Record<string, unknown> = {
        minute: newMinute,
      };

      // Recalculate the appropriate timestamp based on current status
      if (currentMatch.status === "live") {
        // Recalculate match_started_at to reflect the manual override
        const adjustedStartTime = new Date(
          now.getTime() - newMinute * 60 * 1000
        );
        updatePayload.match_started_at = adjustedStartTime.toISOString();
      } else if (currentMatch.status === "second_half") {
        // Second half: newMinute - 45 = elapsed seconds in second half
        const elapsedInSecondHalf = (newMinute - 45) * 60 * 1000;
        const adjustedStartTime = new Date(now.getTime() - elapsedInSecondHalf);
        updatePayload.second_half_started_at = adjustedStartTime.toISOString();
      } else if (currentMatch.status === "extra_time") {
        // Extra time: newMinute - 90 = elapsed seconds in extra time
        const elapsedInExtraTime = (newMinute - 90) * 60 * 1000;
        const adjustedStartTime = new Date(now.getTime() - elapsedInExtraTime);
        updatePayload.extra_time_started_at = adjustedStartTime.toISOString();
      }

      matchControlMutation.mutate(updatePayload);
      setMatchMinute(newMinute);
      setMatchSecond(0);
      lastSyncedMinuteRef.current = newMinute;
    },
    [matchControlMutation, currentMatch.status]
  );

  // ============ Event Actions ============
  const updateScore = useCallback(
    (isHomeTeam: boolean, increment: number) => {
      const newScoreHome = isHomeTeam
        ? localScoreHome + increment
        : localScoreHome;
      const newScoreAway = !isHomeTeam
        ? localScoreAway + increment
        : localScoreAway;

      setLocalScoreHome(newScoreHome);
      setLocalScoreAway(newScoreAway);

      matchControlMutation.mutate({
        score_home: newScoreHome,
        score_away: newScoreAway,
      });
    },
    [localScoreHome, localScoreAway, matchControlMutation]
  );

  const addGoal = useCallback(() => {
    if (!selectedPlayer || !selectedTeam) {
      toast.error("Please select a player and team");
      return;
    }

    createEvent({
      match_id: match.id,
      player_id: selectedPlayer,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "goal",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
    });

    const isHomeTeam = selectedTeam === match.home_team_id;
    updateScore(isHomeTeam, 1);
    resetEventForm();
  }, [
    match.id,
    match.home_team_id,
    selectedPlayer,
    selectedTeam,
    matchMinute,
    eventDescription,
    updateScore,
  ]);

  const addOwnGoal = useCallback(() => {
    if (!selectedPlayer || !selectedTeam) {
      toast.error("Please select a player and team");
      return;
    }

    createEvent({
      match_id: match.id,
      player_id: selectedPlayer,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "own_goal",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
    });

    // Own goal scores for opposite team
    const isHomeTeam = selectedTeam === match.home_team_id;
    updateScore(!isHomeTeam, 1);
    resetEventForm();
  }, [
    match.id,
    match.home_team_id,
    selectedPlayer,
    selectedTeam,
    matchMinute,
    eventDescription,
    updateScore,
  ]);

  const addPenaltyGoal = useCallback(() => {
    if (!selectedPlayer || !selectedTeam) {
      toast.error("Please select a player and team");
      return;
    }

    createEvent({
      match_id: match.id,
      player_id: selectedPlayer,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "penalty_goal",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
    });

    const isHomeTeam = selectedTeam === match.home_team_id;
    updateScore(isHomeTeam, 1);
    resetEventForm();
  }, [
    match.id,
    match.home_team_id,
    selectedPlayer,
    selectedTeam,
    matchMinute,
    eventDescription,
    updateScore,
  ]);

  const addMissedPenalty = useCallback(() => {
    if (!selectedPlayer || !selectedTeam) {
      toast.error("Please select a player and team");
      return;
    }

    createEvent({
      match_id: match.id,
      player_id: selectedPlayer,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "penalty_miss",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
    });

    resetEventForm();
  }, [match.id, selectedPlayer, selectedTeam, matchMinute, eventDescription]);

  const addYellowCard = useCallback(() => {
    if (!selectedPlayer || !selectedTeam) {
      toast.error("Please select a player and team");
      return;
    }

    createEvent({
      match_id: match.id,
      player_id: selectedPlayer,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "yellow",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
    });

    resetEventForm();
  }, [match.id, selectedPlayer, selectedTeam, matchMinute, eventDescription]);

  const addRedCard = useCallback(() => {
    if (!selectedPlayer || !selectedTeam) {
      toast.error("Please select a player and team");
      return;
    }

    createEvent({
      match_id: match.id,
      player_id: selectedPlayer,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "red",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
    });

    resetEventForm();
  }, [match.id, selectedPlayer, selectedTeam, matchMinute, eventDescription]);

  const addSecondYellow = useCallback(() => {
    if (!selectedPlayer || !selectedTeam) {
      toast.error("Please select a player and team");
      return;
    }

    createEvent({
      match_id: match.id,
      player_id: selectedPlayer,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "second_yellow",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
    });

    resetEventForm();
  }, [match.id, selectedPlayer, selectedTeam, matchMinute, eventDescription]);

  const addSubstitution = useCallback(() => {
    if (!selectedSubInPlayer || !selectedSubOutPlayer || !selectedTeam) {
      toast.error("Please select both players and team");
      return;
    }

    createEvent({
      match_id: match.id,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "sub",
      description_en: eventDescription,
      subbed_in_player_id: selectedSubInPlayer,
      subbed_out_player_id: selectedSubOutPlayer,
      is_assist: false,
      confirmed: false,
      player_id: null,
    });

    resetSubstitutionForm();
    setIsSubstitutionOpen(false);
  }, [
    match.id,
    selectedTeam,
    matchMinute,
    eventDescription,
    selectedSubInPlayer,
    selectedSubOutPlayer,
  ]);

  const addCorner = useCallback(() => {
    if (!selectedTeam) {
      toast.error("Please select a team");
      return;
    }

    createEvent({
      match_id: match.id,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "corner",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
      player_id: null,
    });

    setEventDescription("");
  }, [match.id, selectedTeam, matchMinute, eventDescription]);

  const addFreeKick = useCallback(() => {
    if (!selectedTeam) {
      toast.error("Please select a team");
      return;
    }

    createEvent({
      match_id: match.id,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "free_kick",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
      player_id: null,
    });

    setEventDescription("");
  }, [match.id, selectedTeam, matchMinute, eventDescription]);

  const addOffside = useCallback(() => {
    if (!selectedTeam) {
      toast.error("Please select a team");
      return;
    }

    createEvent({
      match_id: match.id,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "offside",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
      player_id: null,
    });

    setEventDescription("");
  }, [match.id, selectedTeam, matchMinute, eventDescription]);

  const addInjuryTime = useCallback(
    (half: "first" | "second", minutes: number) => {
      const eventMinute = half === "first" ? 45 : 90;
      createEvent({
        match_id: match.id,
        minute: eventMinute,
        type: "injury_time",
        description_en: `${minutes} minutes of injury time added to ${half} half`,
        description_am: `${minutes} ደቂቃዎች የጉዳት ጊዜ ተጨምሮ ${
          half === "first" ? "መጀመሪያ" : "ሁለተኛ"
        } አጋማሽ`,
        player_id: null,
        team_id: null,
        is_assist: false,
        confirmed: false,
      });
    },
    [match.id]
  );

  const addVarCheck = useCallback(() => {
    if (!varType) {
      toast.error("Please select a VAR check type");
      return;
    }

    createEvent({
      match_id: match.id,
      minute: matchMinute,
      type: "var_check",
      description_en: `VAR check for ${varType}`,
      description_am: `የVAR ምርመራ ለ ${varType}`,
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });

    setVarType("");
    setVarDialogOpen(false);
  }, [match.id, matchMinute, varType]);

  const addPenaltyShootoutResult = useCallback(() => {
    if (!penaltyTeam || !penaltyResult) {
      toast.error("Please select a team and result");
      return;
    }

    createEvent({
      match_id: match.id,
      team_id: penaltyTeam,
      minute: 120,
      type:
        penaltyResult === "scored"
          ? "penalty_shootout_scored"
          : "penalty_shootout_missed",
      description_en:
        penaltyResult === "scored"
          ? EVENT_MESSAGES.penalty_scored.en
          : EVENT_MESSAGES.penalty_missed.en,
      description_am:
        penaltyResult === "scored"
          ? EVENT_MESSAGES.penalty_scored.am
          : EVENT_MESSAGES.penalty_missed.am,
      player_id: null,
      is_assist: false,
      confirmed: false,
    });

    setPenaltyTeam("");
    setPenaltyResult("");
    setPenaltyDialogOpen(false);
  }, [match.id, penaltyTeam, penaltyResult]);

  // ============ Lineup Actions ============
  const saveLineups = useCallback(() => {
    const allLineups = [...homeLineup, ...awayLineup].map((lineup) => ({
      match_id: match.id,
      team_id: lineup.team_id,
      player_id: lineup.player_id,
      is_starting: lineup.is_starting,
      captain: lineup.captain ?? false,
      position: lineup.position || undefined,
      jersey_number: lineup.jersey_number || undefined,
    }));

    createLineupsMutation.mutate(allLineups);
    setLineupDialogOpen(false);
  }, [match.id, homeLineup, awayLineup, createLineupsMutation]);

  const clearLineups = useCallback(() => {
    deleteLineupsMutation.mutate();
    setHomeLineup([]);
    setAwayLineup([]);
  }, [deleteLineupsMutation]);

  // ============ Details Actions ============
  const saveMatchDetails = useCallback(() => {
    matchControlMutation.mutate({
      round: matchRound || undefined,
      home_formation: homeFormation,
      away_formation: awayFormation,
      coach_home: coachHome || undefined,
      coach_away: coachAway || undefined,
      assistant_referee_1: assistantReferee1 || undefined,
      assistant_referee_2: assistantReferee2 || undefined,
      assistant_referee_3: assistantReferee3 || undefined,
      fourth_official: fourthOfficial || undefined,
      match_commissioner: matchCommissioner || undefined,
      weather: weather || undefined,
      temperature: temperature || undefined,
      humidity: humidity || undefined,
      wind: wind || undefined,
      surface: surface || undefined,
    });
    toast.success("Match details saved successfully");
  }, [
    matchRound,
    homeFormation,
    awayFormation,
    coachHome,
    coachAway,
    assistantReferee1,
    assistantReferee2,
    assistantReferee3,
    fourthOfficial,
    matchCommissioner,
    weather,
    temperature,
    humidity,
    wind,
    surface,
    matchControlMutation,
  ]);

  return {
    // Data
    currentMatch,
    events,
    homeTeamPlayers,
    awayTeamPlayers,

    // Loading states
    isEventsLoading,
    isAnyFetching,
    isEventPending: createEventMutation.isPending,
    isControlPending: matchControlMutation.isPending,

    // UI State
    activeTab,
    setActiveTab,

    // Timer state
    matchMinute,
    setMatchMinute,
    matchSecond,
    isClockRunning,
    isExtraTime,
    isPenaltyShootout,
    formatTime,

    // Score state
    localScoreHome,
    localScoreAway,

    // Event creation state
    selectedPlayer,
    setSelectedPlayer,
    selectedTeam,
    setSelectedTeam,
    selectedSubInPlayer,
    setSelectedSubInPlayer,
    selectedSubOutPlayer,
    setSelectedSubOutPlayer,
    eventDescription,
    setEventDescription,

    // Dialog state
    isSubstitutionOpen,
    setIsSubstitutionOpen,
    lineupDialogOpen,
    setLineupDialogOpen,
    varDialogOpen,
    setVarDialogOpen,
    penaltyDialogOpen,
    setPenaltyDialogOpen,
    varType,
    setVarType,
    penaltyTeam,
    setPenaltyTeam,
    penaltyResult,
    setPenaltyResult,

    // Lineup state
    homeLineup,
    setHomeLineup,
    awayLineup,
    setAwayLineup,
    homeFormation,
    setHomeFormation,
    awayFormation,
    setAwayFormation,

    // Details state
    matchRound,
    setMatchRound,
    coachHome,
    setCoachHome,
    coachAway,
    setCoachAway,
    assistantReferee1,
    setAssistantReferee1,
    assistantReferee2,
    setAssistantReferee2,
    assistantReferee3,
    setAssistantReferee3,
    fourthOfficial,
    setFourthOfficial,
    matchCommissioner,
    setMatchCommissioner,
    weather,
    setWeather,
    temperature,
    setTemperature,
    humidity,
    setHumidity,
    wind,
    setWind,
    surface,
    setSurface,

    // Match control actions
    startMatch,
    pauseMatch,
    resumeMatch,
    halfTime,
    secondHalf,
    fullTime,
    startExtraTime,
    endExtraTime,
    startPenaltyShootout,
    endPenaltyShootout,
    updateMinute,

    // Event actions
    addGoal,
    addOwnGoal,
    addPenaltyGoal,
    addMissedPenalty,
    addYellowCard,
    addRedCard,
    addSecondYellow,
    addSubstitution,
    addCorner,
    addFreeKick,
    addOffside,
    addInjuryTime,
    addVarCheck,
    addPenaltyShootoutResult,

    // Lineup actions
    saveLineups,
    clearLineups,

    // Details actions
    saveMatchDetails,

    // Misc
    refreshAllData,
    refetchEvents,
  };
}
