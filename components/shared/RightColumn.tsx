// components/shared/RightColumn.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLiveMatches, useTodayMatches } from "@/lib/hooks/public/useMatches";
import { useTopTeams } from "@/lib/hooks/public/useStandings";
import { useTopScorers } from "@/lib/hooks/public/useTopScorers";
import { transformMatchesList, transformStandingsList, transformTopScorersList } from "@/lib/utils/transformers";
import ErrorState from "@/components/shared/ErrorState";
import MatchesList from "@/components/matches/MatchesList";
import StandingsTable from "@/components/standings/StandingsTable";
import TopScorersList from "@/components/players/TopScorersList";
import PlayerSpotlight from "@/components/players/PlayerSpotlight";
import MatchesListSkeleton from "@/components/shared/Skeletons/MatchesListSkeleton";
import StandingsTableSkeleton from "@/components/shared/Skeletons/StandingsTableSkeleton";
import TopScorersListSkeleton from "@/components/shared/Skeletons/TopScorersListSkeleton";
import PlayerSpotlightSkeleton from "@/components/shared/Skeletons/PlayerSpotlightSkeleton";
import { Suspense } from "react";

function RightColumnContent() {
  const [activeTab, setActiveTab] = useState("matches");

  // Fetch live matches
  const { 
    data: liveMatches, 
    isLoading: isLoadingLive, 
    isError: isErrorLive, 
    refetch: refetchLive 
  } = useLiveMatches();

  // Fetch today's matches
  const { 
    data: todayMatches, 
    isLoading: isLoadingToday, 
    isError: isErrorToday, 
    refetch: refetchToday 
  } = useTodayMatches();

  // Fetch top teams for standings
  const { 
    data: topTeams, 
    isLoading: isLoadingStandings, 
    isError: isErrorStandings, 
    refetch: refetchStandings 
  } = useTopTeams("premier-league", 5);

  // Fetch top scorers
  const { 
    data: topScorers, 
    isLoading: isLoadingTopScorers, 
    isError: isErrorTopScorers, 
    refetch: refetchTopScorers 
  } = useTopScorers("premier-league");

  // Transform data to UI format
  const transformedLiveMatches = liveMatches ? transformMatchesList(liveMatches) : [];
  const transformedTodayMatches = todayMatches ? transformMatchesList(todayMatches) : [];
  const transformedTopTeams = topTeams ? transformStandingsList(topTeams) : [];
  const transformedTopScorers = topScorers ? transformTopScorersList(topScorers) : [];

  // Handle loading states
  const isLoadingMatches = isLoadingLive || isLoadingToday;
  const isLoading = isLoadingMatches || isLoadingStandings || isLoadingTopScorers;

  // Handle error states
  const isErrorMatches = isErrorLive || isErrorToday;
  const isError = isErrorMatches || isErrorStandings || isErrorTopScorers;

  // Handle refetch
  const handleRefetch = () => {
    if (isErrorLive) refetchLive();
    if (isErrorToday) refetchToday();
    if (isErrorStandings) refetchStandings();
    if (isErrorTopScorers) refetchTopScorers();
  };

  // Handle error state
  if (isError) {
    return (
      <div className="space-y-6">
        <ErrorState 
          message="Failed to load match data. Please try again later." 
          onRetry={handleRefetch} 
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

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 bg-black/20 border border-white/5 p-1 rounded-xl">
          <TabsTrigger
            value="matches"
            className="text-xs data-[state=active]:bg-zinc-800"
          >
            Matches
          </TabsTrigger>
          <TabsTrigger
            value="standings"
            className="text-xs data-[state=active]:bg-zinc-800"
          >
            Table
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="mt-4 space-y-6">
          {/* Live Matches */}
          {transformedLiveMatches.length > 0 && (
            <MatchesList
              title="Premier League Live"
              matches={transformedLiveMatches}
              isLive={true}
            />
          )}

          {/* Today's Matches */}
          {transformedTodayMatches.length > 0 && (
            <MatchesList
              title="Today"
              matches={transformedTodayMatches}
            />
          )}

          {transformedLiveMatches.length === 0 && transformedTodayMatches.length === 0 && (
            <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden p-8 text-center">
              <p className="text-zinc-500">No matches scheduled for today</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="standings" className="mt-4">
          <StandingsTable
            title="Premier League Table"
            subtitle="Season 2023/24"
            standings={transformedTopTeams}
          />
        </TabsContent>
      </Tabs>
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