"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  useMatchEvents,
  useCreateMatchEvent,
} from "@/lib/hooks/cms/useMatchEvents";
import { useMatchControl } from "@/lib/hooks/cms/useMatchControl";
import { calculateMatchTime, isClockRunning } from "@/lib/utils/matchTime";
import {
  useMatchLineups,
  useCreateMatchLineups,
  useDeleteMatchLineups,
} from "@/lib/hooks/cms/useMatchLineups";
import { useMatch } from "@/lib/hooks/cms/useMatches";
import { useQueryClient } from "@tanstack/react-query";
import { useTeams } from "@/lib/hooks/cms/useTeams";
import { Match } from "@/lib/schemas/match";
import { MatchEvent } from "@/lib/schemas/matchEvent";
import { MatchLineup } from "@/lib/schemas/matchLineup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Plus,
  Users,
  Calendar,
  MapPin,
  Trophy,
  Goal,
  CreditCard,
  UserMinus,
  UserPlus,
  Timer,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Save,
  RefreshCw,
  Clock,
  Zap,
  Eye,
  EyeOff,
  Flag,
  Triangle,
  Circle,
  Minus,
  MoreHorizontal,
  CloudSun,
  Thermometer,
  ShieldCheck,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

// Move StatusBadge component outside of render
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    scheduled: {
      label: "Scheduled",
      icon: Calendar,
      variant: "secondary" as const,
    },
    live: { label: "Live", icon: Play, variant: "destructive" as const },
    completed: {
      label: "Completed",
      icon: CheckCircle,
      variant: "default" as const,
    },
    postponed: { label: "Postponed", icon: Pause, variant: "outline" as const },
    cancelled: {
      label: "Cancelled",
      icon: XCircle,
      variant: "destructive" as const,
    },
    half_time: { label: "Half Time", icon: Timer, variant: "outline" as const },
    extra_time: {
      label: "Extra Time",
      icon: Clock,
      variant: "outline" as const,
    },
    penalties: { label: "Penalties", icon: Flag, variant: "outline" as const },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

// Formation types
const formations = [
  { id: "4-4-2", name: "4-4-2" },
  { id: "4-3-3", name: "4-3-3" },
  { id: "3-5-2", name: "3-5-2" },
  { id: "5-3-2", name: "5-3-2" },
  { id: "4-2-3-1", name: "4-2-3-1" },
  { id: "3-4-3", name: "3-4-3" },
];

// Position types
const positions = [
  { id: "GK", name: "Goalkeeper" },
  { id: "LB", name: "Left Back" },
  { id: "RB", name: "Right Back" },
  { id: "CB", name: "Center Back" },
  { id: "LM", name: "Left Midfielder" },
  { id: "RM", name: "Right Midfielder" },
  { id: "CM", name: "Central Midfielder" },
  { id: "CDM", name: "Defensive Midfielder" },
  { id: "CAM", name: "Attacking Midfielder" },
  { id: "LW", name: "Left Winger" },
  { id: "RW", name: "Right Winger" },
  { id: "ST", name: "Striker" },
  { id: "CF", name: "Center Forward" },
];

interface MatchControlPanelProps {
  match: Match;
}

export default function MatchControlPanel({ match }: MatchControlPanelProps) {
  const [activeTab, setActiveTab] = useState("control");
  const [eventMinute, setEventMinute] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedSubInPlayer, setSelectedSubInPlayer] = useState("");
  const [selectedSubOutPlayer, setSelectedSubOutPlayer] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [lineupDialogOpen, setLineupDialogOpen] = useState(false);
  const [homeLineup, setHomeLineup] = useState<MatchLineup[]>([]);
  const [awayLineup, setAwayLineup] = useState<MatchLineup[]>([]);
  const [isSubstitution, setIsSubstitution] = useState(false);
  const [homeFormation, setHomeFormation] = useState(
    match.home_formation ?? "4-4-2"
  );
  const [awayFormation, setAwayFormation] = useState(
    match.away_formation ?? "4-4-2"
  );
  const [isClockRunning, setIsClockRunning] = useState(match.status === "live");
  const [extraTime, setExtraTime] = useState({ firstHalf: 0, secondHalf: 0 });
  const [varDialogOpen, setVarDialogOpen] = useState(false);
  const [varType, setVarType] = useState("");
  const [penaltyDialogOpen, setPenaltyDialogOpen] = useState(false);
  const [penaltyTeam, setPenaltyTeam] = useState("");
  const [penaltyResult, setPenaltyResult] = useState("");
  const [matchMinute, setMatchMinute] = useState(match.minute ?? 0);
  const [matchSecond, setMatchSecond] = useState(0);
  const [isExtraTime, setIsExtraTime] = useState(false);
  const [isPenaltyShootout, setIsPenaltyShootout] = useState(false);
  // Local score state to prevent stale closure issues with mutations
  const [localScoreHome, setLocalScoreHome] = useState(match.score_home ?? 0);
  const [localScoreAway, setLocalScoreAway] = useState(match.score_away ?? 0);

  // Match details state (officials, weather, round)
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

  const supabase = createClient();
  const queryClient = useQueryClient();

  // Use useMatch hook to get live match data with refetch capability
  const {
    data: liveMatch,
    refetch: refetchMatch,
    isFetching: isMatchFetching,
  } = useMatch(match.id);
  // Use the live match data if available, otherwise fall back to the initial prop
  const currentMatch = liveMatch ?? match;

  // State for manual refresh
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: events,
    isLoading,
    refetch: refetchEvents,
    isFetching: isEventsFetching,
  } = useMatchEvents(match.id);
  const createEventMutation = useCreateMatchEvent(match.id);
  const matchControlMutation = useMatchControl(match.id);
  const {
    data: lineups,
    refetch: refetchLineups,
    isFetching: isLineupsFetching,
  } = useMatchLineups(match.id);
  const createLineupsMutation = useCreateMatchLineups(match.id);
  const deleteLineupsMutation = useDeleteMatchLineups(match.id);
  const { data: teams } = useTeams();

  // Manual refresh function for all data
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

  // Combined fetching state
  const isAnyFetching =
    isRefreshing || isMatchFetching || isEventsFetching || isLineupsFetching;

  // Clock running state is initialized from match.status in useState above

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
                matchControlMutation.mutate({ minute: newMinute });
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
  }, [isClockRunning, currentMatch.status, matchControlMutation]);

  // Set up real-time subscription for match events
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
        () => {
          // Refetch events when there's a change
          refetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, match.id, refetchEvents]);

  // Set up real-time subscription for match control
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
          // Invalidate the cache and refetch match data when updates occur
          console.log("Match control updated - refetching data");
          queryClient.invalidateQueries({ queryKey: ["matches", match.id] });
          refetchMatch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, match.id, queryClient, refetchMatch]);

  // Polling fallback for active matches - auto-refresh every 5 seconds
  useEffect(() => {
    const activeStatuses = ["live", "extra_time", "penalties", "half_time"];
    const isActiveMatch = activeStatuses.includes(currentMatch.status);

    if (!isActiveMatch) return;

    const pollInterval = setInterval(() => {
      // Silent refresh without toast notification
      Promise.all([refetchMatch(), refetchEvents()]).catch((error) => {
        console.error("Polling refresh error:", error);
      });
    }, 5000); // Poll every 5 seconds for active matches

    return () => clearInterval(pollInterval);
  }, [currentMatch.status, refetchMatch, refetchEvents]);

  // Process lineups into home and away with useEffect to avoid direct setState in render
  useEffect(() => {
    if (lineups) {
      const homeTeamId = match.home_team_id;
      const awayTeamId = match.away_team_id;

      // Use setTimeout to avoid calling setState synchronously within effect
      setTimeout(() => {
        setHomeLineup(lineups.filter((l) => l.team_id === homeTeamId));
        setAwayLineup(lineups.filter((l) => l.team_id === awayTeamId));
      }, 0);
    }
  }, [lineups, match.home_team_id, match.away_team_id]);

  // Sync local state when live match data changes from the database
  useEffect(() => {
    if (liveMatch) {
      // Use setTimeout to avoid calling setState synchronously within effect
      setTimeout(() => {
        // Sync match minute from database
        if (liveMatch.minute !== undefined && liveMatch.minute !== null) {
          setMatchMinute(liveMatch.minute);
          lastSyncedMinuteRef.current = liveMatch.minute;
        }

        // Sync scores from database
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

        // Sync clock running state based on match status
        const isLive = liveMatch.status === "live";
        setIsClockRunning(isLive);

        // Sync extra time and penalty shootout states
        setIsExtraTime(liveMatch.status === "extra_time");
        setIsPenaltyShootout(liveMatch.status === "penalties");
      }, 0);
    }
  }, [liveMatch]);

  // Get players for each team
  const homeTeamPlayers =
    teams?.find((t) => t.id === match.home_team_id)?.players || [];
  const awayTeamPlayers =
    teams?.find((t) => t.id === match.away_team_id)?.players || [];

  // Format time display
  const formatTime = (minute: number, second: number) => {
    return `${minute.toString().padStart(2, "0")}:${second
      .toString()
      .padStart(2, "0")}`;
  };

  // Match control functions
  const startMatch = () => {
    const now = new Date().toISOString();
    matchControlMutation.mutate({
      status: "live",
      minute: 0,
      match_started_at: now,
      second_half_started_at: null,
      extra_time_started_at: null,
      paused_at: null,
      total_paused_seconds: 0,
    });
    setIsClockRunning(true);
    setMatchMinute(0);
    setMatchSecond(0);
    setIsExtraTime(false);
    setIsPenaltyShootout(false);

    // Create match start event
    createEventMutation.mutate({
      match_id: match.id,
      type: "match_start",
      minute: 0,
      description_en: "Match started",
      description_am: "ጨዋት ጀመረ",
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  };

  const pauseMatch = () => {
    const now = new Date().toISOString();
    matchControlMutation.mutate({
      status: "paused",
      paused_at: now,
      minute: matchMinute,
    });
    setIsClockRunning(false);

    // Create pause event
    createEventMutation.mutate({
      match_id: match.id,
      type: "match_pause",
      minute: matchMinute,
      description_en: "Match paused",
      description_am: "ጨዋት ቆመ",
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  };

  const resumeMatch = () => {
    // Calculate pause duration and add to total
    const pausedAt = currentMatch.paused_at
      ? new Date(currentMatch.paused_at)
      : null;
    const pauseDuration = pausedAt
      ? Math.floor((Date.now() - pausedAt.getTime()) / 1000)
      : 0;
    const newTotalPaused =
      (currentMatch.total_paused_seconds || 0) + pauseDuration;

    // Determine which status to resume to based on the current period
    const resumeStatus = isExtraTime
      ? "extra_time"
      : matchMinute >= 46
      ? "second_half"
      : "live";

    matchControlMutation.mutate({
      status: resumeStatus,
      paused_at: null,
      total_paused_seconds: newTotalPaused,
    });
    setIsClockRunning(true);

    // Create resume event
    createEventMutation.mutate({
      match_id: match.id,
      type: "match_resume",
      minute: matchMinute,
      description_en: "Match resumed",
      description_am: "ጨዋት ተመለሰ",
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  };

  const halfTime = () => {
    matchControlMutation.mutate({
      status: "half_time",
      minute: 45,
    });
    setIsClockRunning(false);

    // Create half-time event
    createEventMutation.mutate({
      match_id: match.id,
      type: "half_time",
      minute: 45,
      description_en: "First half ended",
      description_am: "የመጀመሪያ ጊዜ ወጣ",
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  };

  const secondHalf = () => {
    const now = new Date().toISOString();
    matchControlMutation.mutate({
      status: "second_half",
      minute: 46,
      second_half_started_at: now,
      paused_at: null,
      total_paused_seconds: 0, // Reset pause time for second half
    });
    setIsClockRunning(true);
    setMatchMinute(46);
    setMatchSecond(0);

    // Create second half event
    createEventMutation.mutate({
      match_id: match.id,
      type: "second_half",
      minute: 46,
      description_en: "Second half started",
      description_am: "ሁለት ጊዜ ጀመረ",
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  };

  const fullTime = () => {
    matchControlMutation.mutate({
      status: "completed",
      minute: 90,
    });
    setIsClockRunning(false);

    // Create full-time event
    createEventMutation.mutate({
      match_id: match.id,
      type: "match_end",
      minute: 90,
      description_en: "Match ended",
      description_am: "ጨዋቱ ወጣ",
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  };

  const startExtraTime = () => {
    const now = new Date().toISOString();
    matchControlMutation.mutate({
      status: "extra_time",
      minute: 91,
      extra_time_started_at: now,
      paused_at: null,
      total_paused_seconds: 0, // Reset pause time for extra time
    });
    setIsClockRunning(true);
    setIsExtraTime(true);
    setMatchMinute(91);
    setMatchSecond(0);

    // Create extra time event
    createEventMutation.mutate({
      match_id: match.id,
      type: "extra_time_start",
      minute: 91,
      description_en: "Extra time started",
      description_am: "ተጨማሪ ጊዜ ጀመረ",
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  };

  const endExtraTime = () => {
    matchControlMutation.mutate({
      status: "completed",
      minute: 120,
    });
    setIsClockRunning(false);

    // Create extra time end event
    createEventMutation.mutate({
      match_id: match.id,
      type: "extra_time_end",
      minute: 120,
      description_en: "Extra time ended",
      description_am: "ተጨማሪ ጊዜ ወጣ",
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  };

  const startPenaltyShootout = () => {
    matchControlMutation.mutate({
      status: "penalties",
      minute: 120,
    });
    setIsClockRunning(false);
    setIsPenaltyShootout(true);

    // Create penalty shootout event
    createEventMutation.mutate({
      match_id: match.id,
      type: "penalty_shootout_start",
      minute: 120,
      description_en: "Penalty shootout started",
      description_am: "የፔናልቲ ውስጥ ውድድር ጀመረ",
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  };

  const endPenaltyShootout = () => {
    matchControlMutation.mutate({
      status: "completed",
      minute: 120,
    });

    // Create penalty shootout end event
    createEventMutation.mutate({
      match_id: match.id,
      type: "penalty_shootout_end",
      minute: 120,
      description_en: "Penalty shootout ended",
      description_am: "የፔናልቲ ውስጥ ውድድር ወጣ",
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });
  };

  // Event creation functions
  const addGoal = () => {
    if (!selectedPlayer || !selectedTeam) {
      toast.error("Please select a player and team");
      return;
    }

    createEventMutation.mutate({
      match_id: match.id,
      player_id: selectedPlayer,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "goal",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
    });

    // Update score based on team - use local state to prevent stale closure issues
    const isHomeTeam = selectedTeam === match.home_team_id;
    const newScoreHome = isHomeTeam ? localScoreHome + 1 : localScoreHome;
    const newScoreAway = !isHomeTeam ? localScoreAway + 1 : localScoreAway;

    // Update local state first
    setLocalScoreHome(newScoreHome);
    setLocalScoreAway(newScoreAway);

    // Then sync to database
    matchControlMutation.mutate({
      score_home: newScoreHome,
      score_away: newScoreAway,
    });

    // Reset form
    setSelectedPlayer("");
    setEventDescription("");
  };

  const addOwnGoal = () => {
    if (!selectedPlayer || !selectedTeam) {
      toast.error("Please select a player and team");
      return;
    }

    createEventMutation.mutate({
      match_id: match.id,
      player_id: selectedPlayer,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "own_goal",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
    });

    // Update score based on team (own goal scores for opposite team)
    const isHomeTeam = selectedTeam === match.home_team_id;
    const newScoreHome = !isHomeTeam ? localScoreHome + 1 : localScoreHome;
    const newScoreAway = isHomeTeam ? localScoreAway + 1 : localScoreAway;

    // Update local state first
    setLocalScoreHome(newScoreHome);
    setLocalScoreAway(newScoreAway);

    // Then sync to database
    matchControlMutation.mutate({
      score_home: newScoreHome,
      score_away: newScoreAway,
    });

    // Reset form
    setSelectedPlayer("");
    setEventDescription("");
  };

  const addPenaltyGoal = () => {
    if (!selectedPlayer || !selectedTeam) {
      toast.error("Please select a player and team");
      return;
    }

    createEventMutation.mutate({
      match_id: match.id,
      player_id: selectedPlayer,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "penalty_goal",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
    });

    // Update score based on team - use local state to prevent stale closure issues
    const isHomeTeam = selectedTeam === match.home_team_id;
    const newScoreHome = isHomeTeam ? localScoreHome + 1 : localScoreHome;
    const newScoreAway = !isHomeTeam ? localScoreAway + 1 : localScoreAway;

    // Update local state first
    setLocalScoreHome(newScoreHome);
    setLocalScoreAway(newScoreAway);

    // Then sync to database
    matchControlMutation.mutate({
      score_home: newScoreHome,
      score_away: newScoreAway,
    });

    // Reset form
    setSelectedPlayer("");
    setEventDescription("");
  };

  const addMissedPenalty = () => {
    if (!selectedPlayer || !selectedTeam) {
      toast.error("Please select a player and team");
      return;
    }

    createEventMutation.mutate({
      match_id: match.id,
      player_id: selectedPlayer,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "penalty_miss",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
    });

    // Reset form
    setSelectedPlayer("");
    setEventDescription("");
  };

  const addYellowCard = () => {
    if (!selectedPlayer || !selectedTeam) {
      toast.error("Please select a player and team");
      return;
    }

    createEventMutation.mutate({
      match_id: match.id,
      player_id: selectedPlayer,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "yellow",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
    });

    // Reset form
    setSelectedPlayer("");
    setEventDescription("");
  };

  const addRedCard = () => {
    if (!selectedPlayer || !selectedTeam) {
      toast.error("Please select a player and team");
      return;
    }

    createEventMutation.mutate({
      match_id: match.id,
      player_id: selectedPlayer,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "red",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
    });

    // Reset form
    setSelectedPlayer("");
    setEventDescription("");
  };

  const addSecondYellow = () => {
    if (!selectedPlayer || !selectedTeam) {
      toast.error("Please select a player and team");
      return;
    }

    createEventMutation.mutate({
      match_id: match.id,
      player_id: selectedPlayer,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "second_yellow",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
    });

    // Reset form
    setSelectedPlayer("");
    setEventDescription("");
  };

  const addSubstitution = () => {
    if (!selectedSubInPlayer || !selectedSubOutPlayer || !selectedTeam) {
      toast.error("Please select both players and team");
      return;
    }

    createEventMutation.mutate({
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

    // Reset form
    setSelectedSubInPlayer("");
    setSelectedSubOutPlayer("");
    setEventDescription("");
  };

  const addVarCheck = () => {
    if (!varType) {
      toast.error("Please select a VAR check type");
      return;
    }

    createEventMutation.mutate({
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

    // Reset form
    setVarType("");
    setVarDialogOpen(false);
  };

  const addVarDecision = (decision: "goal" | "no_goal") => {
    createEventMutation.mutate({
      match_id: match.id,
      minute: matchMinute,
      type: decision === "goal" ? "var_goal" : "var_no_goal",
      description_en:
        decision === "goal" ? "VAR: Goal confirmed" : "VAR: Goal disallowed",
      description_am: decision === "goal" ? "VAR: ጎል ተረጋገጠ" : "VAR: ጎል ተወገደ",
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });

    // Update score if VAR confirms a goal
    if (decision === "goal" && selectedPlayer && selectedTeam) {
      const isHomeTeam = selectedTeam === match.home_team_id;
      matchControlMutation.mutate({
        score_home: isHomeTeam ? (match.score_home || 0) + 1 : match.score_home,
        score_away: !isHomeTeam
          ? (match.score_away || 0) + 1
          : match.score_away,
      });
    }

    setVarDialogOpen(false);
  };

  const addPenaltyShootoutResult = () => {
    if (!penaltyTeam || !penaltyResult) {
      toast.error("Please select a team and result");
      return;
    }

    createEventMutation.mutate({
      match_id: match.id,
      team_id: penaltyTeam,
      minute: 120,
      type:
        penaltyResult === "scored"
          ? "penalty_shootout_scored"
          : "penalty_shootout_missed",
      description_en:
        penaltyResult === "scored" ? "Penalty scored" : "Penalty missed",
      description_am: penaltyResult === "scored" ? "ፔናልቲ ገባ" : "ፔናልቲ አልገባም",
      player_id: null,
      is_assist: false,
      confirmed: false,
    });

    // Reset form
    setPenaltyTeam("");
    setPenaltyResult("");
    setPenaltyDialogOpen(false);
  };

  const addCornerKick = () => {
    if (!selectedTeam) {
      toast.error("Please select a team");
      return;
    }

    createEventMutation.mutate({
      match_id: match.id,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "corner",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
      player_id: null,
    });

    // Reset form
    setEventDescription("");
  };

  const addFreeKick = () => {
    if (!selectedTeam) {
      toast.error("Please select a team");
      return;
    }

    createEventMutation.mutate({
      match_id: match.id,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "free_kick",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
      player_id: null,
    });

    // Reset form
    setEventDescription("");
  };

  const addOffside = () => {
    if (!selectedTeam) {
      toast.error("Please select a team");
      return;
    }

    createEventMutation.mutate({
      match_id: match.id,
      team_id: selectedTeam,
      minute: matchMinute,
      type: "offside",
      description_en: eventDescription,
      is_assist: false,
      confirmed: false,
      player_id: null,
    });

    // Reset form
    setEventDescription("");
  };

  const addInjuryTime = (half: "first" | "second", minutes: number) => {
    createEventMutation.mutate({
      match_id: match.id,
      minute: half === "first" ? 45 : 90,
      type: "injury_time",
      description_en: `${minutes} minutes of injury time added to ${half} half`,
      description_am: `${minutes} ደቂቃዎች የጉዳት ጊዜ ተጨምሮ ተጨማለረ ${
        half === "first" ? "መጀመሪያ" : "ሁለት"
      } ጊዜ`,
      player_id: null,
      team_id: null,
      is_assist: false,
      confirmed: false,
    });

    // Update extra time state
    if (half === "first") {
      setExtraTime({ ...extraTime, firstHalf: minutes });
    } else {
      setExtraTime({ ...extraTime, secondHalf: minutes });
    }
  };

  const updateMinute = (newMinute: number) => {
    matchControlMutation.mutate({
      minute: newMinute,
    });
    setMatchMinute(newMinute);
    setMatchSecond(0);
  };

  // Lineup management
  const saveLineups = () => {
    // Transform lineup data to match expected schema
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
  };

  const clearLineups = () => {
    deleteLineupsMutation.mutate();
    setHomeLineup([]);
    setAwayLineup([]);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Match Status Card */}
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
                onClick={refreshAllData}
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

                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">
                    {localScoreHome} - {localScoreAway}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currentMatch.status === "live" && (
                      <Badge variant="outline" className="mt-1">
                        {formatTime(matchMinute, matchSecond)}
                        {isExtraTime && " (ET)"}
                        {isPenaltyShootout && " (PEN)"}
                      </Badge>
                    )}
                  </div>
                </div>

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
                {currentMatch.status === "scheduled" && (
                  <Button onClick={startMatch} className="gap-2">
                    <Play className="h-4 w-4" />
                    Start Match
                  </Button>
                )}

                {currentMatch.status === "live" && (
                  <>
                    <Button
                      onClick={isClockRunning ? pauseMatch : resumeMatch}
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
                      onClick={halfTime}
                      variant="outline"
                      className="gap-2"
                    >
                      <Timer className="h-4 w-4" />
                      Half Time
                    </Button>
                    <Button
                      onClick={secondHalf}
                      variant="outline"
                      className="gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Second Half
                    </Button>
                    <Button
                      onClick={startExtraTime}
                      variant="outline"
                      className="gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      Extra Time
                    </Button>
                    <Button
                      onClick={startPenaltyShootout}
                      variant="outline"
                      className="gap-2"
                    >
                      <Flag className="h-4 w-4" />
                      Penalties
                    </Button>
                    <Button onClick={fullTime} className="gap-2">
                      <Square className="h-4 w-4" />
                      Full Time
                    </Button>
                  </>
                )}

                {currentMatch.status === "half_time" && (
                  <Button onClick={secondHalf} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Start Second Half
                  </Button>
                )}

                {currentMatch.status === "extra_time" && (
                  <>
                    <Button
                      onClick={isClockRunning ? pauseMatch : resumeMatch}
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
                    <Button onClick={endExtraTime} className="gap-2">
                      <Square className="h-4 w-4" />
                      End Extra Time
                    </Button>
                  </>
                )}

                {currentMatch.status === "penalties" && (
                  <>
                    <Button
                      onClick={() => setPenaltyDialogOpen(true)}
                      variant="outline"
                      className="gap-2"
                    >
                      <Flag className="h-4 w-4" />
                      Record Penalty
                    </Button>
                    <Button onClick={endPenaltyShootout} className="gap-2">
                      <Square className="h-4 w-4" />
                      End Penalties
                    </Button>
                  </>
                )}

                {match.status === "postponed" && (
                  <Button onClick={resumeMatch} className="gap-2">
                    <Play className="h-4 w-4" />
                    Resume Match
                  </Button>
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
                <span className="truncate">
                  {match.venue?.name_en || "TBD"}
                </span>
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
                  Match Minute
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="minute"
                    type="number"
                    value={matchMinute}
                    onChange={(e) => setMatchMinute(Number(e.target.value))}
                    className="w-20"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateMinute(matchMinute)}
                  >
                    Update
                  </Button>
                </div>
              </div>

              {/* Extra Time Controls */}
              {match.status === "live" && (
                <div className="pt-4">
                  <Label className="text-sm font-medium">Injury Time</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addInjuryTime("first", 1)}
                    >
                      +1' 1st Half
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addInjuryTime("first", 2)}
                    >
                      +2' 1st Half
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addInjuryTime("second", 1)}
                    >
                      +1' 2nd Half
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addInjuryTime("second", 2)}
                    >
                      +2' 2nd Half
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Control Panel */}
      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <CardHeader className="px-4 sm:px-6 py-4">
          <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
            Match Control Panel
          </CardTitle>
          <CardDescription>
            Manage events and control match flow
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="control">Control</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="lineups">Lineups</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="var">VAR</TabsTrigger>
            </TabsList>
            <TabsContent value="control" className="space-y-4 sm:space-y-6">
              {/* Event Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Team and Player Selection */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="team">Team</Label>
                    <Select
                      value={selectedTeam}
                      onValueChange={setSelectedTeam}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={match.home_team_id}>
                          {match.home_team?.name_en}
                        </SelectItem>
                        <SelectItem value={match.away_team_id}>
                          {match.away_team?.name_en}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="player">Player</Label>
                    <Select
                      value={selectedPlayer}
                      onValueChange={setSelectedPlayer}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select player" />
                      </SelectTrigger>
                      <SelectContent>
                        {(selectedTeam === match.home_team_id
                          ? homeTeamPlayers
                          : awayTeamPlayers
                        ).map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.jersey_number} - {player.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      placeholder="Event description"
                    />
                  </div>
                </div>

                {/* Event Buttons */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={addGoal}
                      className="gap-2"
                      disabled={
                        createEventMutation.isPending ||
                        matchControlMutation.isPending
                      }
                    >
                      <Goal className="h-4 w-4" />
                      {createEventMutation.isPending ? "Adding..." : "Goal"}
                    </Button>
                    <Button
                      onClick={addOwnGoal}
                      variant="outline"
                      className="gap-2"
                      disabled={
                        createEventMutation.isPending ||
                        matchControlMutation.isPending
                      }
                    >
                      <Goal className="h-4 w-4" />
                      Own Goal
                    </Button>
                    <Button
                      onClick={addPenaltyGoal}
                      variant="outline"
                      className="gap-2"
                      disabled={
                        createEventMutation.isPending ||
                        matchControlMutation.isPending
                      }
                    >
                      <Flag className="h-4 w-4" />
                      Penalty Goal
                    </Button>
                    <Button
                      onClick={addMissedPenalty}
                      variant="outline"
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Missed Penalty
                    </Button>
                    <Button
                      onClick={addYellowCard}
                      variant="outline"
                      className="gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      Yellow Card
                    </Button>
                    <Button
                      onClick={addSecondYellow}
                      variant="outline"
                      className="gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      Second Yellow
                    </Button>
                    <Button
                      onClick={addRedCard}
                      variant="outline"
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Red Card
                    </Button>
                    <Button
                      onClick={() => setIsSubstitution(true)}
                      variant="outline"
                      className="gap-2"
                    >
                      <UserMinus className="h-4 w-4" />
                      Substitution
                    </Button>
                    <Button
                      onClick={addCornerKick}
                      variant="outline"
                      className="gap-2"
                    >
                      <Flag className="h-4 w-4" />
                      Corner
                    </Button>
                    <Button
                      onClick={addFreeKick}
                      variant="outline"
                      className="gap-2"
                    >
                      <Zap className="h-4 w-4" />
                      Free Kick
                    </Button>
                    <Button
                      onClick={addOffside}
                      variant="outline"
                      className="gap-2"
                    >
                      <Minus className="h-4 w-4" />
                      Offside
                    </Button>
                    <Button
                      onClick={() => setVarDialogOpen(true)}
                      variant="outline"
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      VAR Check
                    </Button>
                  </div>
                </div>
              </div>

              {/* Substitution Dialog */}
              <Dialog open={isSubstitution} onOpenChange={setIsSubstitution}>
                <DialogContent className="max-w-[90vw] sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Substitution</DialogTitle>
                    <DialogDescription>
                      Select players to substitute
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                      <Label htmlFor="subOut">Player Out</Label>
                      <Select
                        value={selectedSubOutPlayer}
                        onValueChange={setSelectedSubOutPlayer}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select player out" />
                        </SelectTrigger>
                        <SelectContent>
                          {(selectedTeam === match.home_team_id
                            ? homeTeamPlayers
                            : awayTeamPlayers
                          ).map((player) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.jersey_number} - {player.name_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subIn">Player In</Label>
                      <Select
                        value={selectedSubInPlayer}
                        onValueChange={setSelectedSubInPlayer}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select player in" />
                        </SelectTrigger>
                        <SelectContent>
                          {(selectedTeam === match.home_team_id
                            ? homeTeamPlayers
                            : awayTeamPlayers
                          ).map((player) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.jersey_number} - {player.name_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button onClick={addSubstitution} className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Make Substitution
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
            <TabsContent value="events" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Match Events</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchEvents()}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : events && events.length > 0 ? (
                <div className="space-y-2">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 p-3 rounded-lg border"
                    >
                      <div className="text-sm font-medium text-muted-foreground w-12 shrink-0">
                        {event.minute}'
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {event.type === "goal" && (
                            <Goal className="h-4 w-4 text-green-600 shrink-0" />
                          )}
                          {event.type === "own_goal" && (
                            <Goal className="h-4 w-4 text-orange-600 shrink-0" />
                          )}
                          {event.type === "penalty_goal" && (
                            <Flag className="h-4 w-4 text-green-600 shrink-0" />
                          )}
                          {event.type === "penalty_miss" && (
                            <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                          )}
                          {event.type === "yellow" && (
                            <CreditCard className="h-4 w-4 text-yellow-600 shrink-0" />
                          )}
                          {event.type === "second_yellow" && (
                            <CreditCard className="h-4 w-4 text-yellow-600 shrink-0" />
                          )}
                          {event.type === "red" && (
                            <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                          )}
                          {event.type === "sub" && (
                            <UserMinus className="h-4 w-4 text-blue-600 shrink-0" />
                          )}
                          {event.type === "half_time" && (
                            <Timer className="h-4 w-4 text-gray-600 shrink-0" />
                          )}
                          {event.type === "second_half" && (
                            <Timer className="h-4 w-4 text-gray-600 shrink-0" />
                          )}
                          {event.type === "match_end" && (
                            <Square className="h-4 w-4 text-gray-600 shrink-0" />
                          )}
                          {event.type === "match_start" && (
                            <Play className="h-4 w-4 text-green-600 shrink-0" />
                          )}
                          {event.type === "match_pause" && (
                            <Pause className="h-4 w-4 text-yellow-600 shrink-0" />
                          )}
                          {event.type === "match_resume" && (
                            <Play className="h-4 w-4 text-green-600 shrink-0" />
                          )}
                          {event.type === "extra_time_start" && (
                            <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                          )}
                          {event.type === "extra_time_end" && (
                            <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                          )}
                          {event.type === "penalty_shootout_start" && (
                            <Flag className="h-4 w-4 text-purple-600 shrink-0" />
                          )}
                          {event.type === "penalty_shootout_end" && (
                            <Flag className="h-4 w-4 text-purple-600 shrink-0" />
                          )}
                          {event.type === "var_check" && (
                            <Eye className="h-4 w-4 text-blue-600 shrink-0" />
                          )}
                          {event.type === "var_goal" && (
                            <Eye className="h-4 w-4 text-green-600 shrink-0" />
                          )}
                          {event.type === "var_no_goal" && (
                            <EyeOff className="h-4 w-4 text-red-600 shrink-0" />
                          )}
                          {event.type === "corner" && (
                            <Flag className="h-4 w-4 text-gray-600 shrink-0" />
                          )}
                          {event.type === "free_kick" && (
                            <Zap className="h-4 w-4 text-gray-600 shrink-0" />
                          )}
                          {event.type === "offside" && (
                            <Minus className="h-4 w-4 text-gray-600 shrink-0" />
                          )}
                          {event.type === "injury_time" && (
                            <Clock className="h-4 w-4 text-orange-600 shrink-0" />
                          )}

                          <span className="font-medium truncate">
                            {event.player?.name_en || "Match Event"}
                          </span>

                          {event.team?.logo_url && (
                            <img
                              src={event.team.logo_url}
                              alt={event.team.name_en}
                              className="h-5 w-5 object-contain shrink-0"
                            />
                          )}
                        </div>

                        {event.description_en && (
                          <p className="text-sm text-muted-foreground mt-1 truncate">
                            {event.description_en}
                          </p>
                        )}

                        {event.type === "sub" && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span className="truncate">
                              {event.subbed_out_player?.name_en}
                            </span>
                            <span>→</span>
                            <span className="truncate">
                              {event.subbed_in_player?.name_en}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No events recorded yet
                </div>
              )}
            </TabsContent>
            <TabsContent value="lineups" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Match Lineups</h3>
                <div className="flex gap-2">
                  <Dialog
                    open={lineupDialogOpen}
                    onOpenChange={setLineupDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Users className="h-4 w-4" />
                        Manage Lineups
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] sm:max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Manage Match Lineups</DialogTitle>
                        <DialogDescription>
                          Set starting lineups and substitutes for both teams
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        {/* Home Team Lineup */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">
                              {match.home_team?.name_en}
                            </h4>
                            <Select
                              value={homeFormation}
                              onValueChange={setHomeFormation}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Formation" />
                              </SelectTrigger>
                              <SelectContent>
                                {formations.map((formation) => (
                                  <SelectItem
                                    key={formation.id}
                                    value={formation.id}
                                  >
                                    {formation.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {homeTeamPlayers.map((player) => (
                              <div
                                key={player.id}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={homeLineup.some(
                                    (l) => l.player_id === player.id
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setHomeLineup((prev) => [
                                        ...prev,
                                        {
                                          match_id: match.id,
                                          team_id: match.home_team_id,
                                          player_id: player.id,
                                          is_starting: true,
                                          position: player.position_en,
                                          jersey_number: player.jersey_number,
                                        } as MatchLineup,
                                      ]);
                                    } else {
                                      setHomeLineup((prev) =>
                                        prev.filter(
                                          (l) => l.player_id !== player.id
                                        )
                                      );
                                    }
                                  }}
                                />
                                <span className="truncate">
                                  {player.jersey_number} - {player.name_en}
                                </span>
                                <span className="text-sm text-muted-foreground shrink-0">
                                  ({player.position_en})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Away Team Lineup */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">
                              {match.away_team?.name_en}
                            </h4>
                            <Select
                              value={awayFormation}
                              onValueChange={setAwayFormation}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Formation" />
                              </SelectTrigger>
                              <SelectContent>
                                {formations.map((formation) => (
                                  <SelectItem
                                    key={formation.id}
                                    value={formation.id}
                                  >
                                    {formation.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {awayTeamPlayers.map((player) => (
                              <div
                                key={player.id}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={awayLineup.some(
                                    (l) => l.player_id === player.id
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setAwayLineup((prev) => [
                                        ...prev,
                                        {
                                          match_id: match.id,
                                          team_id: match.away_team_id,
                                          player_id: player.id,
                                          is_starting: true,
                                          position: player.position_en,
                                          jersey_number: player.jersey_number,
                                        } as MatchLineup,
                                      ]);
                                    } else {
                                      setAwayLineup((prev) =>
                                        prev.filter(
                                          (l) => l.player_id !== player.id
                                        )
                                      );
                                    }
                                  }}
                                />
                                <span className="truncate">
                                  {player.jersey_number} - {player.name_en}
                                </span>
                                <span className="text-sm text-muted-foreground shrink-0">
                                  ({player.position_en})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={clearLineups}>
                          Clear All
                        </Button>
                        <Button onClick={saveLineups} className="gap-2">
                          <Save className="h-4 w-4" />
                          Save Lineups
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Display Current Lineups */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Home Team Lineup */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      {match.home_team?.name_en}
                    </h4>
                    <Badge variant="outline">{homeFormation}</Badge>
                  </div>
                  <div className="space-y-2">
                    {homeLineup
                      .filter((l) => l.is_starting)
                      .map((lineup) => (
                        <div
                          key={lineup.id}
                          className="flex items-center gap-2 p-2 rounded-lg border"
                        >
                          <span className="font-medium">
                            {lineup.jersey_number}
                          </span>
                          <span className="truncate">
                            {lineup.player?.name_en}
                          </span>
                          <Badge variant="outline">{lineup.position}</Badge>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Away Team Lineup */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      {match.away_team?.name_en}
                    </h4>
                    <Badge variant="outline">{awayFormation}</Badge>
                  </div>
                  <div className="space-y-2">
                    {awayLineup
                      .filter((l) => l.is_starting)
                      .map((lineup) => (
                        <div
                          key={lineup.id}
                          className="flex items-center gap-2 p-2 rounded-lg border"
                        >
                          <span className="font-medium">
                            {lineup.jersey_number}
                          </span>
                          <span className="truncate">
                            {lineup.player?.name_en}
                          </span>
                          <Badge variant="outline">{lineup.position}</Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Match Details</h3>
                <Button
                  onClick={() => {
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
                  }}
                  size="sm"
                  className="gap-2"
                  disabled={matchControlMutation.isPending}
                >
                  <Save className="h-4 w-4" />
                  {matchControlMutation.isPending
                    ? "Saving..."
                    : "Save Details"}
                </Button>
              </div>

              {/* Round/Matchday */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="matchRound">Round / Stage</Label>
                  <Input
                    id="matchRound"
                    value={matchRound}
                    onChange={(e) => setMatchRound(e.target.value)}
                    placeholder="e.g., Quarter-final, Matchday 12"
                  />
                </div>
                <div>
                  <Label htmlFor="surface">Playing Surface</Label>
                  <Select value={surface} onValueChange={setSurface}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select surface" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grass">Natural Grass</SelectItem>
                      <SelectItem value="artificial">
                        Artificial Turf
                      </SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Formations */}
              <Separator />
              <h4 className="font-semibold text-sm text-muted-foreground">
                Formations
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="homeFormation">
                    {match.home_team?.name_en} Formation
                  </Label>
                  <Select
                    value={homeFormation}
                    onValueChange={setHomeFormation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select formation" />
                    </SelectTrigger>
                    <SelectContent>
                      {formations.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="awayFormation">
                    {match.away_team?.name_en} Formation
                  </Label>
                  <Select
                    value={awayFormation}
                    onValueChange={setAwayFormation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select formation" />
                    </SelectTrigger>
                    <SelectContent>
                      {formations.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Coaches */}
              <Separator />
              <h4 className="font-semibold text-sm text-muted-foreground">
                Coaches
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="coachHome">
                    {match.home_team?.name_en} Coach
                  </Label>
                  <Input
                    id="coachHome"
                    value={coachHome}
                    onChange={(e) => setCoachHome(e.target.value)}
                    placeholder="Coach name"
                  />
                </div>
                <div>
                  <Label htmlFor="coachAway">
                    {match.away_team?.name_en} Coach
                  </Label>
                  <Input
                    id="coachAway"
                    value={coachAway}
                    onChange={(e) => setCoachAway(e.target.value)}
                    placeholder="Coach name"
                  />
                </div>
              </div>

              {/* Match Officials */}
              <Separator />
              <h4 className="font-semibold text-sm text-muted-foreground">
                Match Officials
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="assistantReferee1">Assistant Referee 1</Label>
                  <Input
                    id="assistantReferee1"
                    value={assistantReferee1}
                    onChange={(e) => setAssistantReferee1(e.target.value)}
                    placeholder="Name"
                  />
                </div>
                <div>
                  <Label htmlFor="assistantReferee2">Assistant Referee 2</Label>
                  <Input
                    id="assistantReferee2"
                    value={assistantReferee2}
                    onChange={(e) => setAssistantReferee2(e.target.value)}
                    placeholder="Name"
                  />
                </div>
                <div>
                  <Label htmlFor="assistantReferee3">VAR Official</Label>
                  <Input
                    id="assistantReferee3"
                    value={assistantReferee3}
                    onChange={(e) => setAssistantReferee3(e.target.value)}
                    placeholder="Name"
                  />
                </div>
                <div>
                  <Label htmlFor="fourthOfficial">Fourth Official</Label>
                  <Input
                    id="fourthOfficial"
                    value={fourthOfficial}
                    onChange={(e) => setFourthOfficial(e.target.value)}
                    placeholder="Name"
                  />
                </div>
                <div>
                  <Label htmlFor="matchCommissioner">Match Commissioner</Label>
                  <Input
                    id="matchCommissioner"
                    value={matchCommissioner}
                    onChange={(e) => setMatchCommissioner(e.target.value)}
                    placeholder="Name"
                  />
                </div>
              </div>

              {/* Weather Conditions */}
              <Separator />
              <h4 className="font-semibold text-sm text-muted-foreground">
                Weather Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="weather">Weather</Label>
                  <Select value={weather} onValueChange={setWeather}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select weather" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunny">Sunny</SelectItem>
                      <SelectItem value="partly_cloudy">
                        Partly Cloudy
                      </SelectItem>
                      <SelectItem value="cloudy">Cloudy</SelectItem>
                      <SelectItem value="rainy">Rainy</SelectItem>
                      <SelectItem value="stormy">Stormy</SelectItem>
                      <SelectItem value="windy">Windy</SelectItem>
                      <SelectItem value="foggy">Foggy</SelectItem>
                      <SelectItem value="snowy">Snowy</SelectItem>
                      <SelectItem value="clear">Clear</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="e.g., 24°C"
                  />
                </div>
                <div>
                  <Label htmlFor="humidity">Humidity</Label>
                  <Input
                    id="humidity"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    placeholder="e.g., 65%"
                  />
                </div>
                <div>
                  <Label htmlFor="wind">Wind</Label>
                  <Input
                    id="wind"
                    value={wind}
                    onChange={(e) => setWind(e.target.value)}
                    placeholder="e.g., 12 km/h NW"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="var" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">VAR Control</h3>
                <Button
                  onClick={() => setVarDialogOpen(true)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Initiate VAR Check
                </Button>
              </div>

              {/* VAR Dialog is defined outside the Tabs component */}

              {/* Penalty Shootout Dialog */}
              <Dialog
                open={penaltyDialogOpen}
                onOpenChange={setPenaltyDialogOpen}
              >
                <DialogContent className="max-w-[90vw] sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Penalty Shootout</DialogTitle>
                    <DialogDescription>
                      Record penalty shootout result
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="penaltyTeam">Team</Label>
                      <Select
                        value={penaltyTeam}
                        onValueChange={setPenaltyTeam}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={match.home_team_id}>
                            {match.home_team?.name_en}
                          </SelectItem>
                          <SelectItem value={match.away_team_id}>
                            {match.away_team?.name_en}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="penaltyResult">Result</Label>
                      <Select
                        value={penaltyResult}
                        onValueChange={setPenaltyResult}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select result" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scored">Scored</SelectItem>
                          <SelectItem value="missed">Missed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPenaltyDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={addPenaltyShootoutResult}
                      className="gap-2"
                    >
                      <Flag className="h-4 w-4" />
                      Record Penalty
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Display VAR Events */}
              <div className="space-y-2">
                {events
                  ?.filter((e) => e.type.startsWith("var"))
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-blue-50 dark:bg-blue-950/20"
                    >
                      <div className="text-sm font-medium text-muted-foreground w-12 shrink-0">
                        {event.minute}'
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {event.type === "var_check" && (
                            <Eye className="h-4 w-4 text-blue-600 shrink-0" />
                          )}
                          {event.type === "var_goal" && (
                            <Eye className="h-4 w-4 text-green-600 shrink-0" />
                          )}
                          {event.type === "var_no_goal" && (
                            <EyeOff className="h-4 w-4 text-red-600 shrink-0" />
                          )}
                          <span className="font-medium truncate">
                            {event.description_en}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* VAR Dialog - placed at component level to work from any tab */}
      <Dialog open={varDialogOpen} onOpenChange={setVarDialogOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>VAR Check</DialogTitle>
            <DialogDescription>Select the type of VAR check</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="varType">VAR Check Type</Label>
              <Select value={varType} onValueChange={setVarType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select VAR check type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="goal">Goal</SelectItem>
                  <SelectItem value="penalty">Penalty</SelectItem>
                  <SelectItem value="red_card">Red Card</SelectItem>
                  <SelectItem value="offside">Offside</SelectItem>
                  <SelectItem value="handball">Handball</SelectItem>
                  <SelectItem value="foul">Foul</SelectItem>
                  <SelectItem value="mistake">Referee Mistake</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setVarDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addVarCheck} className="gap-2">
              <Eye className="h-4 w-4" />
              Initiate VAR Check
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
