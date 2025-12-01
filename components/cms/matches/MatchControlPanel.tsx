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

  const supabase = createClient();
  const { data: events, isLoading, refetch: refetchEvents } = useMatchEvents(match.id);
  const createEventMutation = useCreateMatchEvent(match.id);
  const matchControlMutation = useMatchControl(match.id);
  const { data: lineups, refetch: refetchLineups } = useMatchLineups(match.id);
  const createLineupsMutation = useCreateMatchLineups(match.id);
  const deleteLineupsMutation = useDeleteMatchLineups(match.id);
  const { data: teams } = useTeams();

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

  // Match control functions
  const startMatch = () => {
    matchControlMutation.mutate({
      status: "live",
      minute: 0,
    });
  };

  const pauseMatch = () => {
    matchControlMutation.mutate({
      status: "postponed",
    });
  };

  const resumeMatch = () => {
    matchControlMutation.mutate({
      status: "live",
    });
  };

  const halfTime = () => {
    matchControlMutation.mutate({
      status: "live",
      minute: 45,
    });

    // Create half-time event with proper typing
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

    // Create second half event with proper typing
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

    // Create full-time event with proper typing
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

  // Event creation functions with proper typing
  const addGoal = () => {
    if (!selectedPlayer || !selectedTeam) {
      toast.error("Please select a player and team");
      return;
    }

    createEventMutation.mutate({
      match_id: match.id,
      player_id: selectedPlayer,
      team_id: selectedTeam,
      minute: eventMinute,
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

  const addYellowCard = () => {
    if (!selectedPlayer || !selectedTeam) {
      toast.error("Please select a player and team");
      return;
    }

    createEventMutation.mutate({
      match_id: match.id,
      player_id: selectedPlayer,
      team_id: selectedTeam,
      minute: eventMinute,
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
      minute: eventMinute,
      type: "red",
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
      minute: eventMinute,
      type: "sub",
      description_en: eventDescription,
      subbed_in_player_id: selectedSubInPlayer,
      subbed_out_player_id: selectedSubOutPlayer,
      is_assist: false,
      confirmed: false,
      player_id: null, // Add missing player_id field
    });

    // Reset form
    setSelectedSubInPlayer("");
    setSelectedSubOutPlayer("");
    setEventDescription("");
  };

  const updateMinute = (newMinute: number) => {
    matchControlMutation.mutate({
      minute: newMinute,
    });
    setEventMinute(newMinute);
  };

  // Lineup management with proper typing
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
    <div className="space-y-6">
      {/* Match Status Card */}
      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <CardHeader className="bg-muted/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Match Status
            </CardTitle>
            <StatusBadge status={match.status} />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Teams and Score */}
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {match.home_team?.logo_url && (
                    <img
                      src={match.home_team.logo_url}
                      alt={match.home_team.name_en}
                      className="h-10 w-10 object-contain"
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-lg">
                      {match.home_team?.name_en}
                    </h3>
                    <p className="text-sm text-muted-foreground">Home</p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">
                    {match.score_home} - {match.score_away}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {match.status === "live" && (
                      <Badge variant="outline" className="mt-1">
                        {match.minute}'
 
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <h3 className="font-bold text-lg">
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
                      onClick={pauseMatch}
                      variant="outline"
                      className="gap-2"
                    >
                      <Pause className="h-4 w-4" />
                      Pause
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
                    <Button onClick={fullTime} className="gap-2">
                      <Square className="h-4 w-4" />
                      Full Time
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
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(match.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{match.venue?.name_en || "TBD"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <span>{match.league?.name_en || "No League"}</span>
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
                    value={eventMinute}
                    onChange={(e) => setEventMinute(Number(e.target.value))}
                    className="w-20"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateMinute(eventMinute)}
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Control Panel */}
      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">
            Match Control Panel
          </CardTitle>
          <CardDescription>
            Manage events and control match flow
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="control">Control</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="lineups">Lineups</TabsTrigger>
            </TabsList>
            <TabsContent value="control" className="space-y-6">
              {/* Event Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      onClick={addYellowCard}
                      variant="outline"
                      className="gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      Yellow Card
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
                  </div>
                </div>
              </div>

              {/* Substitution Dialog */}
              <Dialog open={isSubstitution} onOpenChange={setIsSubstitution}>
                <DialogContent>
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
                  <DialogFooter>
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
                      <div className="text-sm font-medium text-muted-foreground w-12">
                        {event.minute}'
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {event.type === "goal" && (
                            <Goal className="h-4 w-4 text-green-600" />
                          )}
                          {event.type === "yellow" && (
                            <CreditCard className="h-4 w-4 text-yellow-600" />
                          )}
                          {event.type === "red" && (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          {event.type === "sub" && (
                            <UserMinus className="h-4 w-4 text-blue-600" />
                          )}
                          {event.type === "half_time" && (
                            <Timer className="h-4 w-4 text-gray-600" />
                          )}
                          {event.type === "second_half" && (
                            <Timer className="h-4 w-4 text-gray-600" />
                          )}
                          {event.type === "match_end" && (
                            <Square className="h-4 w-4 text-gray-600" />
                          )}

                          <span className="font-medium">
                            {event.player?.name_en || "Match Event"}
                          </span>

                          {event.team?.logo_url && (
                            <img
                              src={event.team.logo_url}
                              alt={event.team.name_en}
                              className="h-5 w-5 object-contain"
                            />
                          )}
                        </div>

                        {event.description_en && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description_en}
                          </p>
                        )}

                        {event.type === "sub" && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span>{event.subbed_out_player?.name_en}</span>
                            <span>→</span>
                            <span>{event.subbed_in_player?.name_en}</span>
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
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Manage Match Lineups</DialogTitle>
                        <DialogDescription>
                          Set starting lineups and substitutes for both teams
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        {/* Home Team Lineup */}
                        <div className="space-y-4">
                          <h4 className="font-semibold">
                            {match.home_team?.name_en}
                          </h4>
                          <div className="space-y-2">
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
                                <span>
                                  {player.jersey_number} - {player.name_en}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  ({player.position_en})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Away Team Lineup */}
                        <div className="space-y-4">
                          <h4 className="font-semibold">
                            {match.away_team?.name_en}
                          </h4>
                          <div className="space-y-2">
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
                                <span>
                                  {player.jersey_number} - {player.name_en}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  ({player.position_en})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
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
                  <h4 className="font-semibold">{match.home_team?.name_en}</h4>
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
                          <span>{lineup.player?.name_en}</span>
                          <Badge variant="outline">{lineup.position}</Badge>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Away Team Lineup */}
                <div className="space-y-4">
                  <h4 className="font-semibold">{match.away_team?.name_en}</h4>
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
                          <span>{lineup.player?.name_en}</span>
                          <Badge variant="outline">{lineup.position}</Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}