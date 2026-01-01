// components/cms/matches/match-control/index.ts
// Main component export
export { default as MatchControlPanel } from "./MatchControlPanel";

// Types export
export * from "./types";

// Constants export
export * from "./constants";

// Hooks export
export { useMatchControlState } from "./hooks/useMatchControlState";
export { useMatchTimer } from "./hooks/useMatchTimer";

// Component exports for potential standalone use
export { MatchStatusCard } from "./components/MatchStatusCard";
export {
  StatusBadge,
  EventIcon,
  TeamPlayerSelector,
} from "./components/shared";
export {
  ControlTab,
  EventsTab,
  LineupsTab,
  DetailsTab,
  VARTab,
} from "./components/tabs";
export {
  SubstitutionDialog,
  VARDialog,
  PenaltyDialog,
} from "./components/dialogs";
