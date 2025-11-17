// components/premier-league/MatchesTab.tsx
"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Filter, ChevronLeft, ChevronRight, Eye, Users, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MatchesTab() {
  const [activeTab, setActiveTab] = useState("fixtures");
  const [currentMatchday, setCurrentMatchday] = useState(11);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Sample match data
  const recentMatches = [
    {
      id: 1,
      homeTeam: { name: "Saint George", logo: "/api/placeholder/60/60", shortName: "STG" },
      awayTeam: { name: "Fasil Kenema", logo: "/api/placeholder/60/60", shortName: "FAK" },
      homeScore: 3,
      awayScore: 0,
      date: "2025-10-15",
      time: "15:00",
      status: "FT",
      venue: "Addis Ababa Stadium",
      matchday: 11,
      attendance: "25,000",
      highlights: true
    },
    {
      id: 2,
      homeTeam: { name: "Mekelle 70 Enderta", logo: "/api/placeholder/60/60", shortName: "MEK" },
      awayTeam: { name: "Dire Dawa City", logo: "/api/placeholder/60/60", shortName: "DDC" },
      homeScore: 2,
      awayScore: 1,
      date: "2025-10-15",
      time: "15:00",
      status: "FT",
      venue: "Mekelle Stadium",
      matchday: 11,
      attendance: "18,000",
      highlights: true
    },
    {
      id: 3,
      homeTeam: { name: "Hadiya Hossana", logo: "/api/placeholder/60/60", shortName: "HAD" },
      awayTeam: { name: "Bahir Dar Kenema", logo: "/api/placeholder/60/60", shortName: "BDK" },
      homeScore: 1,
      awayScore: 2,
      date: "2025-10-15",
      time: "15:00",
      status: "FT",
      venue: "Hossana Stadium",
      matchday: 11,
      attendance: "12,000",
      highlights: false
    },
    {
      id: 4,
      homeTeam: { name: "Wolaitta Dicha", logo: "/api/placeholder/60/60", shortName: "WOL" },
      awayTeam: { name: "Sebeta City", logo: "/api/placeholder/60/60", shortName: "SEB" },
      homeScore: 0,
      awayScore: 0,
      date: "2025-10-15",
      time: "15:00",
      status: "FT",
      venue: "Wolaitta Stadium",
      matchday: 11,
      attendance: "8,000",
      highlights: false
    }
  ];

  const upcomingMatches = [
    {
      id: 5,
      homeTeam: { name: "Ethiopia Bunna", logo: "/api/placeholder/60/60", shortName: "ETH" },
      awayTeam: { name: "Jimma Aba Jifar", logo: "/api/placeholder/60/60", shortName: "JIM" },
      homeScore: null,
      awayScore: null,
      date: "2025-10-22",
      time: "15:00",
      status: "UPCOMING",
      venue: "Addis Ababa Stadium",
      matchday: 12,
      broadcast: "ETV Sports"
    },
    {
      id: 6,
      homeTeam: { name: "Welwalo Adigrat", logo: "/api/placeholder/60/60", shortName: "WEL" },
      awayTeam: { name: "Arba Minch Ketema", logo: "/api/placeholder/60/60", shortName: "ARB" },
      homeScore: null,
      awayScore: null,
      date: "2025-10-22",
      time: "15:00",
      status: "UPCOMING",
      venue: "Adigrat Stadium",
      matchday: 12,
      broadcast: "ETV Sports"
    },
    {
      id: 7,
      homeTeam: { name: "Sidama", logo: "/api/placeholder/60/60", shortName: "SID" },
      awayTeam: { name: "Mekelle", logo: "/api/placeholder/60/60", shortName: "MEK" },
      homeScore: null,
      awayScore: null,
      date: "2025-10-25",
      time: "16:00",
      status: "UPCOMING",
      venue: "Hawassa Stadium",
      matchday: 12,
      broadcast: "Fana TV"
    },
    {
      id: 8,
      homeTeam: { name: "Saint George", logo: "/api/placeholder/60/60", shortName: "STG" },
      awayTeam: { name: "Wolaitta Dicha", logo: "/api/placeholder/60/60", shortName: "WOL" },
      homeScore: null,
      awayScore: null,
      date: "2025-10-25",
      time: "16:00",
      status: "UPCOMING",
      venue: "Addis Ababa Stadium",
      matchday: 12,
      broadcast: "ETV Sports"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FT": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "LIVE": return "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse";
      case "UPCOMING": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-zinc-700/30 text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleMatchdayChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentMatchday(prev => Math.max(1, prev - 1));
    } else {
      setCurrentMatchday(prev => Math.min(30, prev + 1));
    }
  };

  return (
    <div className="space-y-6">
      {/* Matchday Navigation */}
      <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60"
                onClick={() => handleMatchdayChange('prev')}
                disabled={currentMatchday === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">Matchday {currentMatchday}</div>
                <div className="text-xs text-muted-foreground">Season 2025/2026</div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                className="bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60"
                onClick={() => handleMatchdayChange('next')}
                disabled={currentMatchday === 30}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select 
                className="bg-zinc-800/40 border-zinc-700/50 rounded-lg px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="all">All Matches</option>
                <option value="home">Home Only</option>
                <option value="away">Away Only</option>
                <option value="live">Live Only</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matches Content */}
      <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30">
        <CardHeader className="pb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-800/30 border-zinc-700/50 p-1 h-auto">
              <TabsTrigger 
                value="fixtures" 
                className="data-[state=active]:bg-zinc-700/50"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Fixtures
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                className="data-[state=active]:bg-zinc-700/50"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Results
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Fixtures Tab */}
            <TabsContent value="fixtures" className="mt-0">
              <div className="space-y-4 p-4">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="bg-zinc-800/30 rounded-lg p-4 hover:bg-zinc-800/40 transition-colors">
                    <div className="grid grid-cols-[1fr_2fr_1fr] items-center justify-between">
                      {/* Date and Time */}
                      <div className="flex flex-col items-center pr-4 border-r border-zinc-700/50">
                        <div className="text-xs text-muted-foreground">
                          {formatDate(match.date)}
                        </div>
                        <div className="text-lg font-bold text-foreground">
                          {match.time}
                        </div>
                        <Badge variant="outline" className={cn("mt-1", getStatusColor(match.status))}>
                          {match.status}
                        </Badge>
                      </div>
                      
                      {/* Match Teams */}
                      <div className="flex-1 flex items-center justify-between px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-700/50 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{match.homeTeam.shortName}</span>
                          </div>
                          <span className="font-medium text-foreground">{match.homeTeam.name}</span>
                        </div>
                        
                        <div className="text-2xl font-bold text-primary">VS</div>
                        
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-foreground">{match.awayTeam.name}</span>
                          <div className="w-10 h-10 bg-zinc-700/50 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{match.awayTeam.shortName}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Match Info */}
                      <div className="flex flex-col items-center pl-4 border-l border-zinc-700/50">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{match.venue}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Matchday {match.matchday}
                        </div>
                        {match.broadcast && (
                          <div className="text-xs text-primary mt-1">
                            {match.broadcast}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Results Tab */}
            <TabsContent value="results" className="mt-0">
              <div className="space-y-4 p-4">
                {recentMatches.map((match) => (
                  <div key={match.id} className="bg-zinc-800/30 rounded-lg p-4 hover:bg-zinc-800/40 transition-colors">
                    <div className="grid grid-cols-[1fr_2fr_1fr] items-center justify-between">
                      {/* Date and Time */}
                      <div className="flex flex-col items-center pr-4 border-r border-zinc-700/50">
                        <div className="text-xs text-muted-foreground">
                          {formatDate(match.date)}
                        </div>
                        <div className="text-lg font-bold text-foreground">
                          {match.time}
                        </div>
                        <Badge variant="outline" className={cn("mt-1", getStatusColor(match.status))}>
                          {match.status}
                        </Badge>
                      </div>
                      
                      {/* Match Teams and Score */}
                      <div className="flex-1 flex items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-700/50 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{match.homeTeam.shortName}</span>
                          </div>
                          <span className="font-medium text-foreground text-center">{match.homeTeam.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-center">
                          <div className="text-3xl font-bold text-foreground text-center">
                            {match.homeScore}
                          </div>
                          <div className="text-xl text-muted-foreground">-</div>
                          <div className="text-3xl font-bold text-foreground">
                            {match.awayScore}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-foreground">{match.awayTeam.name}</span>
                          <div className="w-10 h-10 bg-zinc-700/50 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{match.awayTeam.shortName}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Match Info */}
                      <div className="flex flex-col items-center pl-4 border-l border-zinc-700/50">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{match.venue}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Matchday {match.matchday}
                        </div>
                        {match.attendance && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Users className="h-3 w-3" />
                            <span>{match.attendance}</span>
                          </div>
                        )}
                        {match.highlights && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mt-2 bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Highlights
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Load More Button */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          className="bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60"
        >
          Load More Matches
        </Button>
      </div>
    </div>
  );
}