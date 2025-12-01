// components/shared/Skeletons/RightColumnSkeleton.tsx
import MatchesListSkeleton from "./MatchesListSkeleton";
import StandingsTableSkeleton from "./StandingsTableSkeleton";
import PlayerSpotlightSkeleton from "./PlayerSpotlightSkeleton";

export default function RightColumnSkeleton() {
  return (
    <div className="space-y-6">
      <MatchesListSkeleton />
      <StandingsTableSkeleton />
      <PlayerSpotlightSkeleton />
    </div>
  );
}