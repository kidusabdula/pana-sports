// components/cms/matches/MatchControlPanel.tsx
//
// LEGACY COMPATIBILITY WRAPPER
//
// The MatchControlPanel has been modularized into:
// - components/cms/matches/match-control/
//
// This file re-exports the new modular component for backward compatibility.
// Any new development should import from the match-control module directly:
//
// import { MatchControlPanel } from "@/components/cms/matches/match-control";
//

export { MatchControlPanel as default } from "./match-control";
