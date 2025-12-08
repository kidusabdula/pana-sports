"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
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
import { useMatch } from "@/lib/hooks/cms/useMatches";
import { useTeams } from "@/lib/hooks/cms/useTeams";
import { Match, MatchEvent } from "@/lib/schemas/match";
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
} from "lucide-react";
import { toast } from "sonner";

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
  const [homeFormation, setHomeFormation] = useState("4-4-2");
  const [awayFormation, setAwayFormation] = useState("4-4-2");
  const [isClockRunning, setIsClockRunning] = useState(false);
  const [extraTime, setExtraTime] = useState({ firstHalf: 0, secondHalf: 0 });
  const [varDialogOpen, setVarDialogOpen] = useState(false);
  const [varType, setVarType] = useState("");
  const [penaltyDialogOpen, setPenaltyDialogOpen] = useState(false);
  const [penaltyTeam, setPenaltyTeam] = useState("");
  const [penaltyResult, setPenaltyResult] = useState("");
  const [matchMinute, setMatchMinute] = useState(0);
  const [matchSecond, setMatchSecond] = useState(0);
  const [isExtraTime, setIsExtraTime] = useState(false);
  const [isPenaltyShootout, setIsPenaltyShootout] = useState(false);

  const supabase = createClient();
  const {
    data: events,
    isLoading,
    refetch: refetchEvents,
  } = useMatchEvents(match.id);
  const createEventMutation = useCreateMatchEvent(match.id);
  const matchControlMutation = useMatchControl(match.id);
  const { data: lineups, refetch: refetchLineups } = useMatchLineups(match.id);
  const createLineupsMutation = useCreateMatchLineups(match.id);
  const deleteLineupsMutation = useDeleteMatchLineups(match.id);
  const { data: teams } = useTeams();

  // Real-time clock effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isClockRunning && match.status === "live") {
      interval = setInterval(() => {
        setMatchSecond((prevSecond) => {
          if (prevSecond >= 59) {
            setMatchMinute((prevMinute) => prevMinute + 1);
            return 0;
          }
          return prevSecond + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isClockRunning, match.status]);

  // Initialize match minute from match data
  useEffect(() => {
    if (match.minute) {
      setMatchMinute(match.minute);
    }
  }, [match.minute]);

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
          // Match control updated, could trigger a refetch if needed
          console.log("Match control updated");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, match.id]);

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
    matchControlMutation.mutate({
      status: "live",
      minute: 0,
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
    matchControlMutation.mutate({
      status: "postponed",
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
    matchControlMutation.mutate({
      status: "live",
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
    matchControlMutation.mutate({
      status: "live",
      minute: 46,
    });
    setIsClockRunning(true);

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
    matchControlMutation.mutate({
      status: "extra_time",
      minute: 91,
    });
    setIsClockRunning(true);
    setIsExtraTime(true);

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

    // Update score based on team
    const isHomeTeam = selectedTeam === match.home_team_id;
    matchControlMutation.mutate({
      score_home: isHomeTeam ? (match.score_home || 0) + 1 : match.score_home,
      score_away: !isHomeTeam ? (match.score_away || 0) + 1 : match.score_away,
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
    matchControlMutation.mutate({
      score_home: !isHomeTeam ? (match.score_home || 0) + 1 : match.score_home,
      score_away: isHomeTeam ? (match.score_away || 0) + 1 : match.score_away,
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

    // Update score based on team
    const isHomeTeam = selectedTeam === match.home_team_id;
    matchControlMutation.mutate({
      score_home: isHomeTeam ? (match.score_home || 0) + 1 : match.score_home,
      score_away: !isHomeTeam ? (match.score_away || 0) + 1 : match.score_away,
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
            <StatusBadge status={match.status} />
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
                    {match.score_home} - {match.score_away}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {match.status === "live" && (
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
                {match.status === "scheduled" && (
                  <Button onClick={startMatch} className="gap-2">
                    <Play className="h-4 w-4" />
                    Start Match
                  </Button>
                )}

                {match.status === "live" && (
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

                {match.status === "half_time" && (
                  <Button onClick={secondHalf} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Start Second Half
                  </Button>
                )}

                {match.status === "extra_time" && (
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

                {match.status === "penalties" && (
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
                <span>{new Date(match.date).toLocaleDateString()}</span>
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="control">Control</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="lineups">Lineups</TabsTrigger>
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
                    <Button onClick={addGoal} className="gap-2">
                      <Goal className="h-4 w-4" />
                      Goal
                    </Button>
                    <Button
                      onClick={addOwnGoal}
                      variant="outline"
                      className="gap-2"
                    >
                      <Goal className="h-4 w-4" />
                      Own Goal
                    </Button>
                    <Button
                      onClick={addPenaltyGoal}
                      variant="outline"
                      className="gap-2"
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

              {/* VAR Dialog */}
              <Dialog open={varDialogOpen} onOpenChange={setVarDialogOpen}>
                <DialogContent className="max-w-[90vw] sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>VAR Check</DialogTitle>
                    <DialogDescription>
                      Select the type of VAR check
                    </DialogDescription>
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
                          <SelectItem value="mistake">
                            Referee Mistake
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setVarDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={addVarCheck} className="gap-2">
                      <Eye className="h-4 w-4" />
                      Initiate VAR Check
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

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
    </div>
  );
}
