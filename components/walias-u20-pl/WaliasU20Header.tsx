"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Calendar,
  BarChart3,
  TrendingUp,
  ChevronRight,
  Shield,
  Star,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MatchesSection from "../premier-league/MatchesSection";
import TeamsTable from "../premier-league/TeamsTable";
import TeamOfTheWeek from "../premier-league/TeamOfTheWeek";
import NewsSection from "../premier-league/NewsSection";
import MatchesTab from "../premier-league/MatchesTab";
import LeagueTableTab from "../premier-league/LeagueTableTab";
import StatsTab from "../premier-league/StatsTab";

export default function WaliasU20Header() {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample Walias U-20 PL data
  const leagueInfo = {
    name: "Walias U-20 PL",
    season: "2025/2026",
    teams: 10,
    matchesPlayed: 40,
    totalMatches: 80,
    status: "In Progress",
    currentRound: "Round of 8",
    defendingChampion: "Sidama City",
    topScorer: "Mekonen Getachew",
    goals: 10,
    bestYoungPlayer: "Samuel Alemu",
  };

  return (
    <div className="space-y-6">
      {/* League Info Card */}
      <Card className="backdrop-blur-sm border-zinc-700/30 overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/api/placeholder/800/400')] opacity-10 mix-blend-overlay" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-zinc-700/50 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                      {leagueInfo.name}
                    </h1>
                    <p className="text-muted-foreground">
                      Season {leagueInfo.season}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-green-400 border-green-500/30"
                  >
                    {leagueInfo.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {leagueInfo.matchesPlayed} of {leagueInfo.totalMatches}{" "}
                    matches played
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <Button className="btn-pana">Follow League</Button>
                <Button
                  variant="outline"
                  className="bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60"
                >
                  <ChevronRight className="h-4 w-4 mr-1" />
                  View All Stats
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* League Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Round</p>
              <p className="text-lg font-semibold">Round of 8</p>
            </div>
            <Trophy className="h-8 w-8 text-primary/70" />
          </CardContent>
        </Card>

        <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Defending Champion
              </p>
              <p className="text-lg font-semibold">Sidama City</p>
            </div>
            <Shield className="h-8 w-8 text-primary/70" />
          </CardContent>
        </Card>

        <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Top Scorer</p>
              <p className="text-lg font-semibold">
                {leagueInfo.topScorer} ({leagueInfo.goals})
              </p>
            </div>
            <Star className="h-8 w-8 text-primary/70" />
          </CardContent>
        </Card>

        <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Best Young Player</p>
              <p className="text-lg font-semibold">
                {leagueInfo.bestYoungPlayer}
              </p>
            </div>
            <User className="h-8 w-8 text-primary/70" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-zinc-800/30 border-zinc-700/50 p-1 h-auto items-center">
          <TabsTrigger
            value="overview"
            className={cn(
              "flex flex-col items-center gap-1 py-3 data-[state=active]:bg-zinc-700/50",
              "text-xs md:text-sm"
            )}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="matches"
            className={cn(
              "flex flex-col items-center gap-1 py-3 data-[state=active]:bg-zinc-700/50",
              "text-xs md:text-sm"
            )}
          >
            <Calendar className="h-4 w-4" />
            <span>Matches</span>
          </TabsTrigger>
          <TabsTrigger
            value="table"
            className={cn(
              "flex flex-col items-center gap-1 py-3 data-[state=active]:bg-zinc-700/50",
              "text-xs md:text-sm"
            )}
          >
            <Trophy className="h-4 w-4" />
            <span>Table</span>
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className={cn(
              "flex flex-col items-center gap-1 py-3 data-[state=active]:bg-zinc-700/50",
              "text-xs md:text-sm"
            )}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Stats</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* First Row: Matches Section */}
          <MatchesSection leagueSlug="walias-u20-pl" />

          {/* Second Row: Teams Table and Team of the Week */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Teams Table - Takes 2 columns (65%) */}
            <div className="lg:col-span-2">
              <TeamsTable leagueSlug="walias-u20-pl" />
            </div>

            {/* Team of the Week - Takes 1 column (35%) */}
            <div className="lg:col-span-1">
              <TeamOfTheWeek />
            </div>
          </div>

          {/* Third Row: News Section */}
          <NewsSection leagueSlug="walias-u20-pl" />
        </TabsContent>

        <TabsContent value="matches" className="mt-6">
          <MatchesTab leagueSlug="walias-u20-pl" />
        </TabsContent>

        <TabsContent value="table" className="mt-6">
          <LeagueTableTab leagueSlug="walias-u20-pl" />
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <div className="text-center text-muted-foreground py-8">
            <h2 className="text-2xl font-bold mb-4">Teams</h2>
            <p className="text-lg mb-2">Teams: {leagueInfo.teams}</p>
            <p className="text-lg mb-2">
              Matches Played: {leagueInfo.matchesPlayed}/
              {leagueInfo.totalMatches}
            </p>
            <p className="text-lg">Current Round: Round of 8</p>
            <p className="text-lg mb-4">Defending Champion: Sidama City</p>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <StatsTab />
        </TabsContent>

        <TabsContent value="news" className="mt-6">
          <div className="text-center text-muted-foreground py-8">
            <p>News content coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
