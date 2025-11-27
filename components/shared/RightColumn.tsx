// components/shared/RightColumn.tsx
import LeftColumn from "./LeftColumn"; // This has the matches with tabs
import LeagueStandings from "./LeagueStandings";
import PlayerSpotlight from "./PlayerSpotlight";

export default function RightColumn() {
  return (
    <div className="space-y-6">
      {/* Matches Section with 3 Tabs */}
      <LeftColumn />

      {/* League Standings Table */}
      <LeagueStandings />

      {/* Player Spotlight */}
      <PlayerSpotlight />
    </div>
  );
}
