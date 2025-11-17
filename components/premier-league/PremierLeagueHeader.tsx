// components/premier-league/PremierLeagueHeader.tsx
"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, BarChart3, Users, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import MatchesSection from './MatchesSection';
import TeamsTable from './TeamsTable';
import TeamOfTheWeek from './TeamOfTheWeek';
import NewsSection from './NewsSection';
import MatchesTab from './MatchesTab';
import LeagueTableTab from './LeagueTableTab';
import StatsTab from './StatsTab'; // Import new StatsTab component

export default function PremierLeagueHeader() {
  const t = useTranslations('premierLeague');
  const [activeTab, setActiveTab] = useState("overview");

  // Sample league data
  const leagueInfo = {
    name: "Ethiopian Premier League",
    season: "2025/2026",
    teams: 16,
    matchesPlayed: 120,
    totalMatches: 240,
    status: "In Progress"
  };

  return (
    <div className="space-y-6">
      {/* League Info Card */}
      <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30 overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0  opacity-10 mix-blend-overlay" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-zinc-700/50 rounded-xl flex items-center justify-center shadow-lg">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">{leagueInfo.name}</h1>
                    <p className="text-muted-foreground">Season {leagueInfo.season}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    {leagueInfo.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {leagueInfo.matchesPlayed} of {leagueInfo.totalMatches} matches played
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <Button className="btn-pana">
                  Follow League
                </Button>
                <Button variant="outline" className="bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  View All Stats
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-zinc-800/30 border-zinc-700/50 p-1 h-auto items-center flex ">
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
        <TabsContent value="overview" className="mt-6 space-y-6 items-center">
          {/* First Row: Matches Section */}
          <MatchesSection />
          
          {/* Second Row: Teams Table and Team of the Week */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Teams Table - Takes 2 columns (65%) */}
            <div className="lg:col-span-2">
              <TeamsTable />
            </div>
            
            {/* Team of the Week - Takes 1 column (35%) */}
            <div className="lg:col-span-1">
              <TeamOfTheWeek />
            </div>
          </div>
          
          {/* Third Row: News Section */}
          <NewsSection />
        </TabsContent>
        
        <TabsContent value="matches" className="mt-6">
          <MatchesTab />
        </TabsContent>
        
        <TabsContent value="table" className="mt-6">
          <LeagueTableTab />
        </TabsContent>
        
        <TabsContent value="stats" className="mt-6">
          <StatsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}