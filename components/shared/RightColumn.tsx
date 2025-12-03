// components/shared/RightColumn.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLiveMatches, useUpcomingMatches, useRecentMatches } from "@/lib/hooks/public/useMatches";
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
import { Suspense } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function RightColumnContent() {
  const [activeTab, setActiveTab] = useState("matches");
  const [currentLeagueIndex, setCurrentLeagueIndex] = useState(0);
  
  // Fetch data
  const { 
    data: liveMatches, 
    isLoading: isLoadingLive, 
    isError: isErrorLive, 
    refetch: refetchLive 
  } = useLiveMatches();

  const { 
    data: upcomingMatches, 
    isLoading: isLoadingUpcoming, 
    isError: isErrorUpcoming 
  } = useUpcomingMatches({ limit: 5 });

  const { 
    data: recentMatches, 
    isLoading: isLoadingRecent, 
    isError: isErrorRecent 
  } = useRecentMatches({ limit: 5 });

  const { 
    data: topScorer, 
    isLoading: isLoadingTopScorer, 
    isError: isErrorTopScorer 
  } = useTopScorers({ limit: 1 });

  const { 
    data: leagues, 
    isLoading: isLoadingLeagues 
  } = useLeagues();

  const { 
    data: standings, 
    isLoading: isLoadingStandings, 
    isError: isErrorStandings 
  } = useStandings({ 
    league_id: leagues?.[currentLeagueIndex]?.id, 
    limit: 10 
  });

  // Handle loading states
  const isLoadingMatches = isLoadingLive || isLoadingUpcoming || isLoadingRecent;
  const isLoading = isLoadingMatches || isLoadingStandings || isLoadingTopScorer || isLoadingLeagues;

  // Handle error states
  const isErrorMatches = isErrorLive || isErrorUpcoming || isErrorRecent;
  const isError = isErrorMatches || isErrorStandings || isErrorTopScorer;

  // Handle navigation between leagues
  const handlePrevLeague = () => {
    setCurrentLeagueIndex((prev) => (prev > 0 ? prev - 1 : leagues?.length - 1 || 0));
  };

  const handleNextLeague = () => {
    setCurrentLeagueIndex((prev) => (prev < (leagues?.length - 1 || 0) ? prev + 1 : 0));
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
          <MatchesList
            title="Live Matches"
            matches={liveMatches || []}
            isLive={true}
          />

          {/* Upcoming Matches */}
          <MatchesList
            title="Upcoming Fixtures"
            matches={upcomingMatches || []}
          />

          {/* Recent Matches */}
          <MatchesList
            title="Recent Results"
            matches={recentMatches || []}
          />

          {/* Top Scorer */}
          {topScorerData && (
            <PlayerSpotlight player={topScorerData} />
          )}
        </TabsContent>

        <TabsContent value="standings" className="mt-4">
          {currentLeague && (
            <div className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden rounded-2xl">
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
              <StandingsTable
                standings={standings || []}
                showViewAllButton={true}
              />
            </div>
          )}
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