// components/premier-league/PremierLeaguePage.tsx
"use client";

import { useState } from "react";
import {
  useLeague,
  useLeagueMatches,
  useLeagueStandings,
  useLeagueTeams,
} from "@/lib/hooks/public/useLeagues";
import { Card, CardContent } from "@/components/ui/card";
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
  Flame,
  ArrowRight,
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
      {/* Enhanced Premium Header - Compact */}
      <header className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between py-2">
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all h-8 px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1 text-xs">Back</span>
                </Button>
              </Link>

              <div className="hidden md:flex items-center gap-2 ml-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center">
                  <Image
                    src={league?.logo_url || ""}
                    alt={league?.name_en || ""}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white leading-none">
                    {league?.name_en}
                  </h1>
                </div>
              </div>
            </div>

            {/* Center Section - Desktop Only */}
            <div className="hidden lg:flex items-center gap-1 bg-zinc-800/40 backdrop-blur-sm border border-white/5 p-0.5 rounded-lg">
              <Button
                variant={activeTab === "overview" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("overview")}
                className={cn(
                  "text-[10px] font-medium transition-all h-7 px-3",
                  activeTab === "overview"
                    ? "bg-zinc-800 text-white shadow-lg"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <Activity className="h-3.5 w-3.5 mr-1.5" />
                Overview
              </Button>
              <Button
                variant={activeTab === "matches" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("matches")}
                className={cn(
                  "text-[10px] font-medium transition-all h-7 px-3",
                  activeTab === "matches"
                    ? "bg-zinc-800 text-white shadow-lg"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Matches
              </Button>
              <Button
                variant={activeTab === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("table")}
                className={cn(
                  "text-[10px] font-medium transition-all h-7 px-3",
                  activeTab === "table"
                    ? "bg-zinc-800 text-white shadow-lg"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <Trophy className="h-3.5 w-3.5 mr-1.5" />
                Table
              </Button>
              <Button
                variant={activeTab === "teams" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("teams")}
                className={cn(
                  "text-[10px] font-medium transition-all h-7 px-3",
                  activeTab === "teams"
                    ? "bg-zinc-800 text-white shadow-lg"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <Users className="h-3.5 w-3.5 mr-1.5" />
                Teams
              </Button>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all h-8 w-8"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all h-8 w-8"
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all h-8 w-8"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-zinc-800/50 py-2">
              <div className="flex flex-col gap-1">
                <Button
                  variant={activeTab === "overview" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab("overview");
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "justify-start font-medium transition-all h-9",
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
                    "justify-start font-medium transition-all h-9",
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
                    "justify-start font-medium transition-all h-9",
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
                    "justify-start font-medium transition-all h-9",
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
          <div className="md:hidden border-t border-zinc-800/50 py-2 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center">
              <Image
                src={league?.logo_url || ""}
                alt={league?.name_en || ""}
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-bold text-white">
                {league?.name_en}
              </h2>
              <p className="text-[10px] text-zinc-400">
                {new Date().getFullYear()}/{new Date().getFullYear() + 1} •{" "}
                {teams?.length || 0} Teams
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 space-y-4">
        {/* League Info Hero Card - Desktop Only - Compact */}
        <div className="hidden md:block">
          <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center">
                      <Image
                        src={league?.logo_url || ""}
                        alt={league?.name_en || ""}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">
                        {league?.name_en}
                      </h1>
                      <p className="text-xs text-zinc-400">
                        Season {new Date().getFullYear()}/
                        {new Date().getFullYear() + 1}
                      </p>
                    </div>
                  </div>

                  {/* Inline Stats */}
                  <div className="h-8 w-px bg-white/10 mx-2"></div>

                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        Teams
                      </p>
                      <p className="text-sm font-bold text-white">
                        {teams?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        Founded
                      </p>
                      <p className="text-sm font-bold text-white">
                        {league?.founded_year || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        Category
                      </p>
                      <p className="text-sm font-bold text-white">
                        {league?.category || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white h-8 text-xs"
                >
                  Follow League
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

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
            <MatchesTab leagueId={leagueId} />
          </TabsContent>

          <TabsContent value="table" className="mt-0">
            <TableTab standings={standings || []} isLoading={false} />
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
