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
    data: topScorer,
    isLoading: isLoadingTopScorer,
    isError: isErrorTopScorer,
  } = useTopScorers({
    limit: 1,
    season_id: selectedSeason === "all" ? undefined : selectedSeason,
  });

  const {
    data: upcomingMatches,
    isLoading: isLoadingUpcoming,
    isError: isErrorUpcoming,
  } = useUpcomingMatches({
    limit: 5,
    season_id: selectedSeason === "all" ? undefined : selectedSeason,
  });

  const {
    data: recentMatches,
    isLoading: isLoadingRecent,
    isError: isErrorRecent,
  } = useRecentMatches({
    limit: 5,
    season_id: selectedSeason === "all" ? undefined : selectedSeason,
  });

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
      {/* Global Season Selection at the top of Right Column */}
      <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-transparent flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-primary/20 rounded-lg">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 leading-none mb-1">
                Content Filter
              </p>
              <h3 className="text-xs font-black text-white uppercase tracking-wider leading-none">
                Select Season
              </h3>
            </div>
          </div>
          <SeasonSelector
            value={selectedSeason}
            onValueChange={setSelectedSeason}
            showAll={true}
            className="h-9 w-36 bg-white/5 border-white/10 hover:bg-white/10 text-xs font-bold rounded-xl"
          />
        </div>
      </div>

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

          {/* Season display removed from here as it's now at the top */}
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
