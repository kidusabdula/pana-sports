// components/ethiopian/EthiopianCupPage.tsx
"use client";

import { useState } from "react";
import {
  useLeagues,
  useLeagueMatches,
  useLeagueStandings,
  useLeagueTeams,
} from "@/lib/hooks/public/useLeagues";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Trophy, Flame, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Suspense } from "react";
import CompetitionHeader from "@/components/shared/CompetitionHeader";

// Import tab components from the shared location
import OverviewTab from "@/components/shared/tabs/OverviewTab";
import MatchesTab from "@/components/shared/tabs/MatchesTab";
import TableTab from "@/components/shared/tabs/TableTab";
import TeamsTab from "@/components/shared/tabs/TeamsTab";

function EthiopianCupPageContent() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSeasonId, setSelectedSeasonId] = useState<
    string | undefined
  >();

  // Fetch all leagues to find the Ethiopian Cup
  const {
    data: leagues,
    isLoading: leaguesLoading,
    error: leaguesError,
  } = useLeagues();

  const league = leagues?.find((l) => l.slug === "ethiopian-cup");
  const ethiopianCupId = league?.id || "";

  const { data: matches, isLoading: matchesLoading } = useLeagueMatches(
    ethiopianCupId,
    { limit: 10, season_id: selectedSeasonId }
  );

  const { data: standings, isLoading: standingsLoading } = useLeagueStandings(
    ethiopianCupId,
    { limit: 10, season_id: selectedSeasonId }
  );

  const { isLoading: teamsLoading } = useLeagueTeams(ethiopianCupId, {
    season_id: selectedSeasonId,
  });

  // Handle loading state
  const isLoading =
    leaguesLoading || matchesLoading || standingsLoading || teamsLoading;

  // Handle error state
  if (leaguesError) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Error loading Ethiopian Cup data
          </h2>
          <p className="text-zinc-400 mb-6">Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Handle case where league data is not available
  if (!league) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ethiopian Cup Not Found
          </h2>
          <p className="text-zinc-400 mb-6">
            The Ethiopian Cup data is currently unavailable.
          </p>
          <Button onClick={() => (window.location.href = "/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Get live matches count
  const liveMatchesCount =
    matches?.filter((match) => match.status === "live").length || 0;

  // Get top team from standings
  const topTeam = standings?.[0];

  const handleSeasonChange = (seasonId: string) => {
    setSelectedSeasonId(seasonId);
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "matches", label: "Matches" },
    { id: "table", label: "Standings" },
    { id: "teams", label: "Teams" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-3 sm:px-4 py-6 space-y-6">
        <CompetitionHeader
          name={league.name_en}
          nameAm={league.name_am}
          logo={league.logo_url}
          country="Ethiopia"
          competitionType="cup"
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSeasonChange={handleSeasonChange}
          currentSeasonId={selectedSeasonId}
          showSeasonToggle={true}
        />

        {/* Quick Stats Cards - Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Top Team Card */}
          {topTeam ? (
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700 shrink-0 bg-zinc-800 flex items-center justify-center">
                  <Image
                    src={topTeam.team?.logo_url || ""}
                    alt={topTeam.team?.name_en || ""}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-primary font-bold uppercase tracking-wider flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    1st Place
                  </div>
                  <div className="text-sm font-bold text-white truncate">
                    {topTeam.team?.name_en}
                  </div>
                </div>
                <div className="text-right bg-zinc-800/50 px-2 py-1 rounded">
                  <div className="text-sm font-bold text-white">
                    {topTeam.points}
                  </div>
                  <div className="text-[9px] text-zinc-500 uppercase">PTS</div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
              <CardContent className="p-3 flex items-center justify-center text-zinc-500 text-xs h-full">
                No standings data
              </CardContent>
            </Card>
          )}

          {/* Live Matches Card */}
          <Card
            className="bg-zinc-900/40 backdrop-blur-xl border-red-500/20 overflow-hidden cursor-pointer hover:bg-zinc-800/40 transition-colors"
            onClick={() => setActiveTab("matches")}
          >
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                  <Flame className="h-4 w-4 text-red-500" />
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20"></span>
                </div>
                <div>
                  <div className="text-xs text-red-400 font-bold uppercase tracking-wider">
                    Live Now
                  </div>
                  <div className="text-sm font-bold text-white">
                    {liveMatchesCount} Matches
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-600" />
            </CardContent>
          </Card>

          {/* Next Match Card */}
          <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
            <CardContent className="p-0">
              {matches && matches.length > 0 ? (
                (() => {
                  const nextMatch =
                    matches.find(
                      (m) => m.status === "upcoming" || m.status === "scheduled"
                    ) || matches[0];
                  return (
                    <div className="p-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-zinc-700 shrink-0">
                          <Image
                            src={nextMatch.home_team?.logo_url || ""}
                            alt={nextMatch.home_team?.name_en || ""}
                            width={24}
                            height={24}
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-medium text-white truncate">
                          {nextMatch.home_team?.name_en}
                        </span>
                      </div>

                      <div className="flex flex-col items-center shrink-0 px-2">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase">
                          VS
                        </span>
                        <span className="text-[9px] text-zinc-400">
                          {new Date(nextMatch.date).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                        <span className="text-xs font-medium text-white truncate text-right">
                          {nextMatch.away_team?.name_en}
                        </span>
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-zinc-700 shrink-0">
                          <Image
                            src={nextMatch.away_team?.logo_url || ""}
                            alt={nextMatch.away_team?.name_en || ""}
                            width={24}
                            height={24}
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="p-3 text-center text-zinc-500 text-xs">
                  No upcoming matches
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tab Contents */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="overview" className="mt-0">
            <OverviewTab
              league={league}
              matches={matches || []}
              standings={standings || []}
            />
          </TabsContent>

          <TabsContent value="matches" className="mt-0">
            <MatchesTab leagueId={ethiopianCupId} seasonId={selectedSeasonId} />
          </TabsContent>

          <TabsContent value="table" className="mt-0">
            <TableTab standings={standings || []} isLoading={false} />
          </TabsContent>

          <TabsContent value="teams" className="mt-0">
            <TeamsTab leagueId={ethiopianCupId} seasonId={selectedSeasonId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function EthiopianCupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <EthiopianCupPageContent />
    </Suspense>
  );
}
