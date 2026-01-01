// components/cms/matches/match-control/types.ts
import { Match } from "@/lib/schemas/match";
import { MatchEvent } from "@/lib/schemas/matchEvent";
import { MatchLineup } from "@/lib/schemas/matchLineup";

// Match Status Types
export type MatchStatus =
  | "scheduled"
  | "live"
  | "completed"
  | "postponed"
  | "cancelled"
  | "half_time"
  | "extra_time"
  | "penalties";

// Event Types
export type MatchEventType =
  | "goal"
  | "own_goal"
  | "penalty_goal"
  | "penalty_miss"
  | "yellow"
  | "red"
  | "second_yellow"
  | "sub"
  | "corner"
  | "free_kick"
  | "offside"
  | "injury_time"
  | "var_check"
  | "var_goal"
  | "var_no_goal"
  | "half_time"
  | "second_half"
  | "match_start"
  | "match_end"
  | "match_pause"
  | "match_resume"
  | "extra_time_start"
  | "extra_time_end"
  | "penalty_shootout_start"
  | "penalty_shootout_end"
  | "penalty_shootout_scored"
  | "penalty_shootout_missed";

// VAR Types
export type VARCheckType =
  | "goal"
  | "penalty"
  | "red_card"
  | "offside"
  | "handball"
  | "foul"
  | "mistake";

// Surface Types
export type SurfaceType = "grass" | "artificial" | "hybrid";

// Weather Types
export type WeatherType =
  | "sunny"
  | "partly_cloudy"
  | "cloudy"
  | "rainy"
  | "stormy"
  | "windy"
  | "foggy"
  | "snowy"
  | "clear";

// Props interfaces
export interface MatchControlPanelProps {
  match: Match;
}

export interface MatchStatusCardProps {
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
  onRefresh: () => void;
  onUpdateMinute: (minute: number) => void;
  onAddInjuryTime: (half: "first" | "second", minutes: number) => void;
  onOpenPenaltyDialog: () => void;
}

export interface ControlTabProps {
  match: Match;
  selectedTeam: string;
  selectedPlayer: string;
  eventDescription: string;
  matchMinute: number;
  homeTeamPlayers: Player[];
  awayTeamPlayers: Player[];
  isEventPending: boolean;
  isControlPending: boolean;
  onTeamChange: (teamId: string) => void;
  onPlayerChange: (playerId: string) => void;
  onDescriptionChange: (description: string) => void;
  onAddGoal: () => void;
  onAddOwnGoal: () => void;
  onAddPenaltyGoal: () => void;
  onAddMissedPenalty: () => void;
  onAddYellowCard: () => void;
  onAddRedCard: () => void;
  onAddSecondYellow: () => void;
  onOpenSubstitution: () => void;
  onAddCorner: () => void;
  onAddFreeKick: () => void;
  onAddOffside: () => void;
  onOpenVARDialog: () => void;
}

export interface EventsTabProps {
  events: MatchEvent[] | undefined;
  isLoading: boolean;
  onRefresh: () => void;
}

export interface LineupsTabProps {
  match: Match;
  homeLineup: MatchLineup[];
  awayLineup: MatchLineup[];
  homeFormation: string;
  awayFormation: string;
  homeTeamPlayers: Player[];
  awayTeamPlayers: Player[];
  onHomeLineupChange: (lineup: MatchLineup[]) => void;
  onAwayLineupChange: (lineup: MatchLineup[]) => void;
  onHomeFormationChange: (formation: string) => void;
  onAwayFormationChange: (formation: string) => void;
  onSaveLineups: () => void;
  onClearLineups: () => void;
  lineupDialogOpen: boolean;
  onLineupDialogChange: (open: boolean) => void;
}

export interface DetailsTabProps {
  match: Match;
  matchRound: string;
  homeFormation: string;
  awayFormation: string;
  coachHome: string;
  coachAway: string;
  assistantReferee1: string;
  assistantReferee2: string;
  assistantReferee3: string;
  fourthOfficial: string;
  matchCommissioner: string;
  weather: string;
  temperature: string;
  humidity: string;
  wind: string;
  surface: string;
  isPending: boolean;
  onMatchRoundChange: (value: string) => void;
  onHomeFormationChange: (value: string) => void;
  onAwayFormationChange: (value: string) => void;
  onCoachHomeChange: (value: string) => void;
  onCoachAwayChange: (value: string) => void;
  onAssistantReferee1Change: (value: string) => void;
  onAssistantReferee2Change: (value: string) => void;
  onAssistantReferee3Change: (value: string) => void;
  onFourthOfficialChange: (value: string) => void;
  onMatchCommissionerChange: (value: string) => void;
  onWeatherChange: (value: string) => void;
  onTemperatureChange: (value: string) => void;
  onHumidityChange: (value: string) => void;
  onWindChange: (value: string) => void;
  onSurfaceChange: (value: string) => void;
  onSaveDetails: () => void;
}

export interface VARTabProps {
  events: MatchEvent[] | undefined;
  onOpenVARDialog: () => void;
}

// Dialog Props
export interface SubstitutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match: Match;
  selectedTeam: string;
  homeTeamPlayers: Player[];
  awayTeamPlayers: Player[];
  selectedSubInPlayer: string;
  selectedSubOutPlayer: string;
  onSubInChange: (playerId: string) => void;
  onSubOutChange: (playerId: string) => void;
  onSubmit: () => void;
}

export interface VARDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  varType: string;
  onVarTypeChange: (type: string) => void;
  onSubmit: () => void;
}

export interface PenaltyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match: Match;
  penaltyTeam: string;
  penaltyResult: string;
  onTeamChange: (teamId: string) => void;
  onResultChange: (result: string) => void;
  onSubmit: () => void;
}

// Player type from teams hook - compatible with database schema
export interface Player {
  id: string;
  name_en: string;
  name_am?: string | null;
  jersey_number?: number | null;
  position_en?: string | null;
  photo_url?: string | null;
}

// State types for the control panel
export interface MatchControlState {
  activeTab: string;
  eventMinute: number;
  selectedPlayer: string;
  selectedTeam: string;
  selectedSubInPlayer: string;
  selectedSubOutPlayer: string;
  eventDescription: string;
  lineupDialogOpen: boolean;
  homeLineup: MatchLineup[];
  awayLineup: MatchLineup[];
  isSubstitution: boolean;
  homeFormation: string;
  awayFormation: string;
  isClockRunning: boolean;
  extraTime: { firstHalf: number; secondHalf: number };
  varDialogOpen: boolean;
  varType: string;
  penaltyDialogOpen: boolean;
  penaltyTeam: string;
  penaltyResult: string;
  matchMinute: number;
  matchSecond: number;
  isExtraTime: boolean;
  isPenaltyShootout: boolean;
  localScoreHome: number;
  localScoreAway: number;
  // Match details
  matchRound: string;
  coachHome: string;
  coachAway: string;
  assistantReferee1: string;
  assistantReferee2: string;
  assistantReferee3: string;
  fourthOfficial: string;
  matchCommissioner: string;
  weather: string;
  temperature: string;
  humidity: string;
  wind: string;
  surface: string;
  isRefreshing: boolean;
}

// Event creation payload
export interface CreateEventPayload {
  match_id: string;
  type: MatchEventType;
  minute: number;
  description_en?: string;
  description_am?: string;
  player_id: string | null;
  team_id: string | null;
  is_assist: boolean;
  confirmed: boolean;
  subbed_in_player_id?: string;
  subbed_out_player_id?: string;
}
