// components/premier-league/PremierLeagueHeader.tsx
"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, BarChart3, Users, TrendingUp, ChevronRight, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import MatchesSection from './MatchesSection';
import TeamsTable from './TeamsTable';
import TeamOfTheWeek from './TeamOfTheWeek';
import NewsSection from './NewsSection';
import MatchesTab from './MatchesTab';
import LeagueTableTab from './LeagueTableTab';
import StatsTab from './StatsTab';
import TeamsTab from './TeamsTab';

export default function PremierLeagueHeader() {
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
      
      {/* League Info Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-zinc-900 via-zinc-900 to-black p-6 md:p-8 group">
        
        {/* Abstract Background Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-start gap-5">
            {/* Glassy Trophy Icon */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 flex items-center justify-center shadow-2xl backdrop-blur-sm group-hover:scale-105 transition-transform duration-500">
              <Trophy className="h-8 w-8 md:h-10 md:w-10 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                {leagueInfo.name}
              </h1>
              <p className="text-zinc-400 font-medium">Season {leagueInfo.season}</p>
              
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 px-2 py-0.5 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  {leagueInfo.status}
                </Badge>
                <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
                <span className="text-xs text-zinc-500 font-mono">
                  {leagueInfo.matchesPlayed} / {leagueInfo.totalMatches} MATCHES
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button className="flex-1 md:flex-none rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20 transition-all">
              Follow League
            </Button>
            <Button variant="outline" className="flex-1 md:flex-none rounded-full bg-transparent border-zinc-700 hover:bg-white/5 text-zinc-300 transition-all">
              Stats
              <ChevronRight className="h-4 w-4 ml-1 opacity-50" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modern Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-20 z-30 pb-4">
            <TabsList className="w-full grid grid-cols-5 bg-black/40 backdrop-blur-xl border border-white/10 p-1.5 h-auto rounded-2xl shadow-xl">
            {[
                { value: "overview", icon: Activity, label: "Overview" },
                { value: "matches", icon: Calendar, label: "Matches" },
                { value: "table", icon: Trophy, label: "Table" },
                { value: "teams", icon: Users, label: "Teams" },
                { value: "stats", icon: BarChart3, label: "Stats" },
            ].map((tab) => (
                <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                className={cn(
                    "flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all duration-300",
                    "data-[state=active]:bg-zinc-800 data-[state=active]:text-white data-[state=active]:shadow-lg",
                    "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                )}
                >
                <tab.icon className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-[10px] md:text-xs font-medium">{tab.label}</span>
                </TabsTrigger>
            ))}
            </TabsList>
        </div>
        
        {/* Tab Contents */}
        <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* First Row: Matches Section */}
          <MatchesSection />
          
          {/* Second Row: Teams Table and Team of the Week */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Teams Table - Takes 8/12 columns on Desktop */}
            <div className="lg:col-span-8">
              <TeamsTable />
            </div>
            
            {/* Team of the Week - Takes 4/12 columns on Desktop */}
            <div className="lg:col-span-4">
              <TeamOfTheWeek />
            </div>
          </div>
          
          {/* Third Row: News Section */}
          <NewsSection />
        </TabsContent>
        
        <TabsContent value="matches" className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <MatchesTab />
        </TabsContent>
        
        <TabsContent value="table" className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <LeagueTableTab />
        </TabsContent>
        
        <TabsContent value="teams" className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TeamsTab />
        </TabsContent>
        
      </Tabs>
    </div>
  );
}