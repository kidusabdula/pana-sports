// components/premier-league/PremierLeaguePage.tsx
"use client";

import { useState } from "react";
import {
  useLeague,
  useLeagueMatches,
  useLeagueStandings,
  useLeagueTeams,
} from "@/lib/hooks/public/useLeagues";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Calendar,
  ChevronLeft,
  Users,
  Trophy,
  Activity,
  Menu,
  Bell,
  Search,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Suspense } from "react";
import Link from "next/link";

// Import tab components from shared location
import OverviewTab from "@/components/shared/tabs/OverviewTab";
import MatchesTab from "@/components/shared/tabs/MatchesTab";
import TableTab from "@/components/shared/tabs/TableTab";
import TeamsTab from "@/components/shared/tabs/TeamsTab";

interface PremierLeaguePageContentProps {
  leagueId: string;
}

function PremierLeaguePageContent({ leagueId }: PremierLeaguePageContentProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use the provided leagueId to fetch the specific league
  const {
    data: league,
    isLoading: leagueLoading,
    error: leagueError,
  } = useLeague(leagueId);

  const { data: matches, isLoading: matchesLoading } = useLeagueMatches(
    leagueId,
    { limit: 10 }
  );

  const { data: standings, isLoading: standingsLoading } = useLeagueStandings(
    leagueId,
    { limit: 10 }
  );

  const { data: teams, isLoading: teamsLoading } = useLeagueTeams(leagueId);

  // Handle loading state
  const isLoading =
    leagueLoading || matchesLoading || standingsLoading || teamsLoading;

  // Handle error state
  if (leagueError) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Error loading Premier League data
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
            Premier League Not Found
          </h2>
          <p className="text-zinc-400 mb-6">
            The Premier League data is currently unavailable.
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Enhanced Premium Header */}
      <header className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between py-3">
            {/* Left Section */}
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="hidden sm:inline ml-1">Back</span>
                </Button>
              </Link>

              <div className="hidden md:flex items-center gap-2 ml-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center">
                  <Image
                    src={league?.logo_url || ""}
                    alt={league?.name_en || ""}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">
                    {league?.name_en}
                  </h1>
                  <p className="text-xs text-zinc-400">
                    {new Date().getFullYear()}/{new Date().getFullYear() + 1}
                  </p>
                </div>
              </div>
            </div>

            {/* Center Section - Desktop Only */}
            <div className="hidden lg:flex items-center gap-1 bg-zinc-800/40 backdrop-blur-sm border border-white/5 p-1 rounded-xl">
              <Button
                variant={activeTab === "overview" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("overview")}
                className={cn(
                  "text-xs font-medium transition-all",
                  activeTab === "overview"
                    ? "bg-zinc-800 text-white shadow-lg"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <Activity className="h-4 w-4 mr-1" />
                Overview
              </Button>
              <Button
                variant={activeTab === "matches" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("matches")}
                className={cn(
                  "text-xs font-medium transition-all",
                  activeTab === "matches"
                    ? "bg-zinc-800 text-white shadow-lg"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Matches
              </Button>
              <Button
                variant={activeTab === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("table")}
                className={cn(
                  "text-xs font-medium transition-all",
                  activeTab === "table"
                    ? "bg-zinc-800 text-white shadow-lg"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <Trophy className="h-4 w-4 mr-1" />
                Table
              </Button>
              <Button
                variant={activeTab === "teams" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("teams")}
                className={cn(
                  "text-xs font-medium transition-all",
                  activeTab === "teams"
                    ? "bg-zinc-800 text-white shadow-lg"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <Users className="h-4 w-4 mr-1" />
                Teams
              </Button>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-zinc-800/50 py-3">
              <div className="flex flex-col gap-1">
                <Button
                  variant={activeTab === "overview" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab("overview");
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "justify-start font-medium transition-all",
                    activeTab === "overview"
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Overview
                </Button>
                <Button
                  variant={activeTab === "matches" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab("matches");
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "justify-start font-medium transition-all",
                    activeTab === "matches"
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Matches
                </Button>
                <Button
                  variant={activeTab === "table" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab("table");
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "justify-start font-medium transition-all",
                    activeTab === "table"
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Table
                </Button>
                <Button
                  variant={activeTab === "teams" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab("teams");
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "justify-start font-medium transition-all",
                    activeTab === "teams"
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Teams
                </Button>
              </div>
            </div>
          )}

          {/* League Info Bar - Mobile Only */}
          <div className="md:hidden border-t border-zinc-800/50 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center">
              <Image
                src={league?.logo_url || ""}
                alt={league?.name_en || ""}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-white">
                {league?.name_en}
              </h2>
              <p className="text-xs text-zinc-400">
                {new Date().getFullYear()}/{new Date().getFullYear() + 1} •{" "}
                {teams?.length || 0} Teams
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* League Info Hero Card - Desktop Only */}
        <div className="hidden md:block">
          <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
            <CardHeader className="pb-3 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center">
                    <Image
                      src={league?.logo_url || ""}
                      alt={league?.name_en || ""}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      {league?.name_en}
                    </h1>
                    <p className="text-zinc-400">
                      Season {new Date().getFullYear()}/
                      {new Date().getFullYear() + 1}
                    </p>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Follow League
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-800/30 rounded-lg p-3 border border-white/5">
                  <p className="text-sm text-zinc-500 mb-1">Category</p>
                  <p className="text-white font-medium">
                    {league?.category || "N/A"}
                  </p>
                </div>
                <div className="bg-zinc-800/30 rounded-lg p-3 border border-white/5">
                  <p className="text-sm text-zinc-500 mb-1">Founded</p>
                  <p className="text-white font-medium">
                    {league?.founded_year || "N/A"}
                  </p>
                </div>
                <div className="bg-zinc-800/30 rounded-lg p-3 border border-white/5">
                  <p className="text-sm text-zinc-500 mb-1">Teams</p>
                  <p className="text-white font-medium">{teams?.length || 0}</p>
                </div>
                <div className="bg-zinc-800/30 rounded-lg p-3 border border-white/5">
                  <p className="text-sm text-zinc-500 mb-1">Live Matches</p>
                  <p className="text-white font-medium">{liveMatchesCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Team Card */}
          {topTeam && (
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Top Team
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex items-center gap-3 p-4 hover:bg-zinc-800/30 transition-colors">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-700">
                    <Image
                      src={topTeam.team?.logo_url || ""}
                      alt={topTeam.team?.name_en || ""}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {topTeam.team?.name_en}
                    </div>
                    <div className="text-zinc-400 text-sm flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {topTeam.team?.city || "N/A"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {topTeam.points}
                    </div>
                    <div className="text-xs text-zinc-500">PTS</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Live Matches Card */}
          <Card className="bg-zinc-900/40 backdrop-blur-xl border-red-500/20 overflow-hidden">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </div>
                Live Matches
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4">
                <div className="text-3xl font-bold text-white text-center">
                  {liveMatchesCount}
                </div>
                <div className="text-sm text-zinc-400 text-center">
                  matches in progress
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={() => setActiveTab("matches")}
                >
                  View Live Matches
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Match Card */}
          <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Next Match
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {matches && matches.length > 0 ? (
                <div className="p-4">
                  {(() => {
                    const nextMatch =
                      matches.find(
                        (m) =>
                          m.status === "upcoming" || m.status === "scheduled"
                      ) || matches[0];
                    return (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700">
                              <Image
                                src={nextMatch.home_team?.logo_url || ""}
                                alt={nextMatch.home_team?.name_en || ""}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            </div>
                            <span className="text-white text-sm truncate max-w-[100px]">
                              {nextMatch.home_team?.name_en}
                            </span>
                          </div>
                          <span className="text-zinc-400 text-xs">VS</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white text-sm truncate max-w-[100px]">
                              {nextMatch.away_team?.name_en}
                            </span>
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700">
                              <Image
                                src={nextMatch.away_team?.logo_url || ""}
                                alt={nextMatch.away_team?.name_en || ""}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-zinc-400 text-center">
                          {new Date(nextMatch.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3 border-white/10 text-zinc-400 hover:bg-zinc-800/50"
                          onClick={() => setActiveTab("matches")}
                        >
                          View All Matches
                        </Button>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="p-4 text-center text-zinc-400">
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
            <MatchesTab leagueId={leagueId} />
          </TabsContent>

          <TabsContent value="table" className="mt-0">
            <TableTab leagueId={leagueId} />
          </TabsContent>

          <TabsContent value="teams" className="mt-0">
            <TeamsTab leagueId={leagueId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface PremierLeaguePageProps {
  leagueId: string;
}

export default function PremierLeaguePage({
  leagueId,
}: PremierLeaguePageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <PremierLeaguePageContent leagueId={leagueId} />
    </Suspense>
  );
}
