// components/shared/RightColumn.tsx
"use client";

import { useState } from "react";

import {
  useLiveMatches,
  useUpcomingMatches,
  useRecentMatches,
} from "@/lib/hooks/public/useMatches";
import { useStandings } from "@/lib/hooks/public/useStandings";
import { useTopScorers } from "@/lib/hooks/public/useTopScorers";
import { useLeagues } from "@/lib/hooks/public/useLeagues";
import ErrorState from "@/components/shared/ErrorState";
import MatchesList from "@/components/matches/MatchesList";
import StandingsTable from "@/components/standings/StandingsTable";
import PlayerSpotlight from "@/components/players/PlayerSpotlight";
import MatchesListSkeleton from "@/components/shared/Skeletons/MatchesListSkeleton";
import StandingsTableSkeleton from "@/components/shared/Skeletons/StandingsTableSkeleton";
import PlayerSpotlightSkeleton from "@/components/shared/Skeletons/PlayerSpotlightSkeleton";
import AdBanner from "@/components/shared/AdBanner";
import { Suspense } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeasonSelector } from "@/components/shared/SeasonSelector";

function RightColumnContent() {
  const [currentLeagueIndex, setCurrentLeagueIndex] = useState(0);
  const [selectedSeason, setSelectedSeason] = useState("all");

  // Fetch data
  const {
    data: liveMatches,
    isLoading: isLoadingLive,
    isError: isErrorLive,
  } = useLiveMatches();

  const {
    data: upcomingMatches,
    isLoading: isLoadingUpcoming,
    isError: isErrorUpcoming,
  } = useUpcomingMatches({ limit: 5 });

  const {
    data: recentMatches,
    isLoading: isLoadingRecent,
    isError: isErrorRecent,
  } = useRecentMatches({ limit: 5 });

  const {
    data: topScorer,
    isLoading: isLoadingTopScorer,
    isError: isErrorTopScorer,
  } = useTopScorers({ limit: 1 });

  const { data: leagues, isLoading: isLoadingLeagues } = useLeagues();

  const {
    data: standings,
    isLoading: isLoadingStandings,
    isError: isErrorStandings,
  } = useStandings({
    league_id: leagues?.[currentLeagueIndex]?.id,
    season_id: selectedSeason === "all" ? undefined : selectedSeason,
  });

  // Handle loading states
  const isLoadingMatches =
    isLoadingLive || isLoadingUpcoming || isLoadingRecent;
  const isLoading =
    isLoadingMatches ||
    isLoadingStandings ||
    isLoadingTopScorer ||
    isLoadingLeagues;

  // Handle error states
  const isErrorMatches = isErrorLive || isErrorUpcoming || isErrorRecent;
  const isError = isErrorMatches || isErrorStandings || isErrorTopScorer;

  // Handle navigation between leagues
  const handlePrevLeague = () => {
    setCurrentLeagueIndex((prev) =>
      prev > 0 ? prev - 1 : (leagues?.length ?? 0) - 1
    );
  };

  const handleNextLeague = () => {
    setCurrentLeagueIndex((prev) =>
      prev < (leagues?.length ?? 0) - 1 ? prev + 1 : 0
    );
  };

  // Handle error state
  if (isError) {
    return (
      <div className="space-y-6">
        <ErrorState
          message="Failed to load data. Please try again later."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <MatchesListSkeleton />
        <StandingsTableSkeleton />
        <PlayerSpotlightSkeleton />
      </div>
    );
  }

  const currentLeague = leagues?.[currentLeagueIndex];
  const topScorerData = topScorer?.[0];

  return (
    <div className="space-y-6">
      {/* Live Matches */}
      <MatchesList
        title="Live Matches"
        matches={liveMatches || []}
        isLive={true}
      />

      {/* Ad after live matches */}
      <AdBanner variant="sidebar" showClose={false} page="home-sidebar" />

      {/* Upcoming Matches */}
      <MatchesList title="Upcoming Fixtures" matches={upcomingMatches || []} />

      {/* Standings Table */}
      {currentLeague && (
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 overflow-hidden rounded-2xl">
          <div className="py-3 px-4 border-b border-white/5 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevLeague}
                className="h-6 w-6 text-zinc-400 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-bold text-zinc-200">
                {currentLeague.name_en}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextLeague}
                className="h-6 w-6 text-zinc-400 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-zinc-500">
              {currentLeagueIndex + 1} / {leagues?.length || 0}
            </div>
          </div>

          <div className="px-4 py-2 bg-zinc-900/20 border-b border-white/5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-hidden min-w-0">
              <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="text-[11px] font-medium text-zinc-400 truncate uppercase tracking-wider">
                Season
              </span>
            </div>
            <SeasonSelector
              value={selectedSeason}
              onValueChange={setSelectedSeason}
              showAll={true}
              className="h-8 w-32 border-none bg-transparent hover:bg-white/5"
            />
          </div>
          <StandingsTable
            standings={standings || []}
            showViewAllButton={true}
          />
        </div>
      )}

      {/* Ad after standings */}
      <AdBanner variant="sidebar" showClose={false} page="home-sidebar" />

      {/* Recent Matches */}
      <MatchesList title="Recent Results" matches={recentMatches || []} />

      {/* Top Scorer */}
      {topScorerData && <PlayerSpotlight player={topScorerData} />}
    </div>
  );
}

export default function RightColumn() {
  return (
    <Suspense fallback={<div className="space-y-6">Loading...</div>}>
      <RightColumnContent />
    </Suspense>
  );
}
