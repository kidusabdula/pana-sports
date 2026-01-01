// components/cms/matches/match-control/constants.ts
import {
  Play,
  Pause,
  Calendar,
  CheckCircle,
  XCircle,
  Timer,
  Clock,
  Flag,
  Goal,
  CreditCard,
  UserMinus,
  Square,
  Eye,
  EyeOff,
  Zap,
  Minus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Formation options
export const FORMATIONS = [
  { id: "4-4-2", name: "4-4-2" },
  { id: "4-3-3", name: "4-3-3" },
  { id: "3-5-2", name: "3-5-2" },
  { id: "5-3-2", name: "5-3-2" },
  { id: "4-2-3-1", name: "4-2-3-1" },
  { id: "3-4-3", name: "3-4-3" },
  { id: "4-1-4-1", name: "4-1-4-1" },
  { id: "4-5-1", name: "4-5-1" },
  { id: "5-4-1", name: "5-4-1" },
  { id: "4-4-1-1", name: "4-4-1-1" },
] as const;

// Position options
export const POSITIONS = [
  { id: "GK", name: "Goalkeeper" },
  { id: "LB", name: "Left Back" },
  { id: "RB", name: "Right Back" },
  { id: "CB", name: "Center Back" },
  { id: "LWB", name: "Left Wing Back" },
  { id: "RWB", name: "Right Wing Back" },
  { id: "LM", name: "Left Midfielder" },
  { id: "RM", name: "Right Midfielder" },
  { id: "CM", name: "Central Midfielder" },
  { id: "CDM", name: "Defensive Midfielder" },
  { id: "CAM", name: "Attacking Midfielder" },
  { id: "LW", name: "Left Winger" },
  { id: "RW", name: "Right Winger" },
  { id: "ST", name: "Striker" },
  { id: "CF", name: "Center Forward" },
] as const;

// Status configuration for badges
export interface StatusConfig {
  label: string;
  icon: LucideIcon;
  variant: "default" | "secondary" | "destructive" | "outline";
  color?: string;
}

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  scheduled: {
    label: "Scheduled",
    icon: Calendar,
    variant: "secondary",
    color: "text-blue-500",
  },
  live: {
    label: "Live",
    icon: Play,
    variant: "destructive",
    color: "text-red-500",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    variant: "default",
    color: "text-green-500",
  },
  postponed: {
    label: "Postponed",
    icon: Pause,
    variant: "outline",
    color: "text-yellow-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    variant: "destructive",
    color: "text-red-600",
  },
  half_time: {
    label: "Half Time",
    icon: Timer,
    variant: "outline",
    color: "text-orange-500",
  },
  extra_time: {
    label: "Extra Time",
    icon: Clock,
    variant: "outline",
    color: "text-purple-500",
  },
  penalties: {
    label: "Penalties",
    icon: Flag,
    variant: "outline",
    color: "text-pink-500",
  },
};

// Event type icons and colors
export interface EventTypeConfig {
  icon: LucideIcon;
  color: string;
  label: string;
}

export const EVENT_TYPE_CONFIG: Record<string, EventTypeConfig> = {
  goal: { icon: Goal, color: "text-green-600", label: "Goal" },
  own_goal: { icon: Goal, color: "text-orange-600", label: "Own Goal" },
  penalty_goal: { icon: Flag, color: "text-green-600", label: "Penalty Goal" },
  penalty_miss: {
    icon: XCircle,
    color: "text-red-600",
    label: "Penalty Missed",
  },
  yellow: { icon: CreditCard, color: "text-yellow-500", label: "Yellow Card" },
  second_yellow: {
    icon: CreditCard,
    color: "text-yellow-600",
    label: "Second Yellow",
  },
  red: { icon: XCircle, color: "text-red-600", label: "Red Card" },
  sub: { icon: UserMinus, color: "text-blue-600", label: "Substitution" },
  half_time: { icon: Timer, color: "text-gray-600", label: "Half Time" },
  second_half: {
    icon: Timer,
    color: "text-gray-600",
    label: "Second Half Start",
  },
  match_end: { icon: Square, color: "text-gray-600", label: "Match End" },
  match_start: { icon: Play, color: "text-green-600", label: "Match Start" },
  match_pause: { icon: Pause, color: "text-yellow-600", label: "Match Paused" },
  match_resume: { icon: Play, color: "text-green-600", label: "Match Resumed" },
  extra_time_start: {
    icon: Clock,
    color: "text-blue-600",
    label: "Extra Time Start",
  },
  extra_time_end: {
    icon: Clock,
    color: "text-blue-600",
    label: "Extra Time End",
  },
  penalty_shootout_start: {
    icon: Flag,
    color: "text-purple-600",
    label: "Penalty Shootout Start",
  },
  penalty_shootout_end: {
    icon: Flag,
    color: "text-purple-600",
    label: "Penalty Shootout End",
  },
  penalty_shootout_scored: {
    icon: Flag,
    color: "text-green-600",
    label: "Penalty Scored",
  },
  penalty_shootout_missed: {
    icon: Flag,
    color: "text-red-600",
    label: "Penalty Missed",
  },
  var_check: { icon: Eye, color: "text-blue-600", label: "VAR Check" },
  var_goal: { icon: Eye, color: "text-green-600", label: "VAR Goal Confirmed" },
  var_no_goal: {
    icon: EyeOff,
    color: "text-red-600",
    label: "VAR Goal Disallowed",
  },
  corner: { icon: Flag, color: "text-gray-600", label: "Corner" },
  free_kick: { icon: Zap, color: "text-gray-600", label: "Free Kick" },
  offside: { icon: Minus, color: "text-gray-600", label: "Offside" },
  injury_time: { icon: Clock, color: "text-orange-600", label: "Injury Time" },
};

// VAR check types
export const VAR_CHECK_TYPES = [
  { id: "goal", label: "Goal Decision" },
  { id: "penalty", label: "Penalty Decision" },
  { id: "red_card", label: "Red Card" },
  { id: "offside", label: "Offside" },
  { id: "handball", label: "Handball" },
  { id: "foul", label: "Foul" },
  { id: "mistake", label: "Referee Mistake" },
] as const;

// Weather options
export const WEATHER_OPTIONS = [
  { id: "sunny", label: "Sunny" },
  { id: "partly_cloudy", label: "Partly Cloudy" },
  { id: "cloudy", label: "Cloudy" },
  { id: "rainy", label: "Rainy" },
  { id: "stormy", label: "Stormy" },
  { id: "windy", label: "Windy" },
  { id: "foggy", label: "Foggy" },
  { id: "snowy", label: "Snowy" },
  { id: "clear", label: "Clear" },
] as const;

// Surface options
export const SURFACE_OPTIONS = [
  { id: "grass", label: "Natural Grass" },
  { id: "artificial", label: "Artificial Turf" },
  { id: "hybrid", label: "Hybrid" },
] as const;

// Match phase configurations
export const MATCH_PHASES = {
  FIRST_HALF: { start: 0, end: 45, label: "First Half" },
  HALF_TIME: { start: 45, end: 45, label: "Half Time" },
  SECOND_HALF: { start: 46, end: 90, label: "Second Half" },
  EXTRA_TIME_FIRST: { start: 91, end: 105, label: "Extra Time First Half" },
  EXTRA_TIME_SECOND: { start: 106, end: 120, label: "Extra Time Second Half" },
  PENALTIES: { start: 120, end: 120, label: "Penalty Shootout" },
} as const;

// Active match statuses for polling
export const ACTIVE_MATCH_STATUSES = [
  "live",
  "extra_time",
  "penalties",
  "half_time",
] as const;

// Polling interval in milliseconds
export const POLLING_INTERVAL = 5000;

// Auto-sync interval for minute updates (in seconds)
export const MINUTE_SYNC_INTERVAL = 60;

// Default formation
export const DEFAULT_FORMATION = "4-4-2";

// Localized event messages
export const EVENT_MESSAGES = {
  match_start: { en: "Match started", am: "ጨዋታ ጀመረ" },
  match_pause: { en: "Match paused", am: "ጨዋታ ቆመ" },
  match_resume: { en: "Match resumed", am: "ጨዋታ ቀጠለ" },
  half_time: { en: "First half ended", am: "የመጀመሪያ አጋማሽ አበቃ" },
  second_half: { en: "Second half started", am: "ሁለተኛ አጋማሽ ጀመረ" },
  full_time: { en: "Match ended", am: "ጨዋታ አበቃ" },
  extra_time_start: { en: "Extra time started", am: "ተጨማሪ ጊዜ ጀመረ" },
  extra_time_end: { en: "Extra time ended", am: "ተጨማሪ ጊዜ አበቃ" },
  penalty_shootout_start: {
    en: "Penalty shootout started",
    am: "የፔናልቲ ውድድር ጀመረ",
  },
  penalty_shootout_end: { en: "Penalty shootout ended", am: "የፔናልቲ ውድድር አበቃ" },
  penalty_scored: { en: "Penalty scored", am: "ፔናልቲ ገባ" },
  penalty_missed: { en: "Penalty missed", am: "ፔናልቲ አልገባም" },
} as const;
