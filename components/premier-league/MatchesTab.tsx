// components/premier-league/MatchesTab.tsx
"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Users, 
  Trophy,
  X,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MatchesTab() {
  const [activeTab, setActiveTab] = useState("fixtures");
  const [currentMatchday, setCurrentMatchday] = useState(11);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);

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
      highlights: true,
      matchEvents: [
        { minute: 23, team: "home", type: "goal", player: "Saladin" },
        { minute: 45, team: "home", type: "goal", player: "Tekeste" },
        { minute: 67, team: "home", type: "goal", player: "Getaneh" },
        { minute: 78, team: "home", type: "goal", player: "Abebe" }
      ]
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
      highlights: false,
      matchEvents: [
        { minute: 15, team: "away", type: "goal", player: "Samuel" },
        { minute: 58, team: "home", type: "goal", player: "Dawit" },
        { minute: 82, team: "away", type: "goal", player: "Michael" }
      ]
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
      highlights: false,
      matchEvents: [
        { minute: 34, team: "away", type: "goal", player: "Mekonnen" },
        { minute: 67, team: "away", type: "goal", player: "Tadesse" },
        { minute: 78, team: "home", type: "goal", player: "Kassahun" }
      ]
    },
    {
      id: 4,
      homeTeam: { name: "Wolaitta Dicha", logo: "/api/placeholder/60/60", shortName: "WOD" },
      awayTeam: { name: "Sebeta City", logo: "/api/placeholder/60/60", shortName: "SEC" },
      homeScore: 2,
      awayScore: 2,
      date: "2025-10-15",
      time: "15:00",
      status: "FT",
      venue: "Wolaitta Stadium",
      matchday: 11,
      attendance: "8,000",
      highlights: false,
      matchEvents: [
        { minute: 22, team: "home", type: "goal", player: "Yonas" },
        { minute: 58, team: "away", type: "goal", player: "Fikre" }
      ]
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
      awayTeam: { name: "Wolaitta Dicha", logo: "/api/placeholder/60/60", shortName: "WOD" },
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

  // Mobile-optimized Match Card Component
  const MatchCard = ({ match, viewType }: { match: any; viewType: string }) => {
    const isResult = viewType === "results";
    
    return (
      <div className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 group">
        {/* Match Card Header - Mobile Optimized */}
        <div className="p-3 sm:p-4 border-b border-zinc-700/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge className={cn("text-xs", getStatusColor(match.status))}>
                {match.status}
              </Badge>
              <div className="text-xs text-muted-foreground">
                {formatDate(match.date)} • {match.time}
              </div>
            </div>
            
            {match.highlights && (
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 w-8 sm:h-10 sm:w-10 bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60"
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Match Teams & Score - Mobile Optimized */}
        <div className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-700/50 rounded-xl flex items-center justify-center">
                <span className="text-xs sm:text-sm font-bold">{match.homeTeam.shortName}</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-center">{match.homeTeam.name}</span>
            </div>
            
            {/* Score/VS Section */}
            <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
              {isResult ? (
                <>
                  <div className="text-2xl sm:text-3xl font-bold text-center">
                    {match.homeScore}
                  </div>
                  <div className="text-sm text-muted-foreground">-</div>
                  <div className="text-2xl sm:text-3xl font-bold text-center">
                    {match.awayScore}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-lg sm:text-xl font-bold text-primary text-center">VS</div>
                  <div className="text-xs text-muted-foreground text-center">
                    {formatDate(match.date)}
                  </div>
                </>
              )}
            </div>
            
            {/* Away Team */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <span className="text-xs sm:text-sm font-medium text-center">{match.awayTeam.name}</span>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-700/50 rounded-xl flex items-center justify-center">
                <span className="text-xs sm:text-sm font-bold">{match.awayTeam.shortName}</span>
              </div>
            </div>
          </div>
          
          {/* Match Events - Mobile Optimized */}
          {match.matchEvents && (
            <div className="mt-3 sm:mt-4 bg-zinc-800/30 rounded-lg p-2 sm:p-3">
              <div className="text-xs text-muted-foreground font-medium mb-1 sm:mb-2">Match Events</div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
                {match.matchEvents.slice(0, isResult ? 4 : 2).map((event, index) => (
                  <div key={index} className="text-xs text-foreground/80 text-center">
                    <div className={cn(
                      "inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full",
                      event.team === "home" ? "bg-green-500" : "bg-red-500"
                    )}>
                      <span className="text-white font-bold">{event.minute}'</span>
                    </div>
                    <div className="mt-1 text-center text-xs">
                      {event.player}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Match Footer - Mobile Optimized */}
        <div className="p-3 sm:p-4 bg-zinc-800/10 border-t border-zinc-700/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{match.venue}</span>
            </div>
            <div className="text-center">
              Matchday {match.matchday}
            </div>
            {match.broadcast && (
              <div className="text-center sm:text-right">
                {match.broadcast}
              </div>
            )}
            {match.attendance && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{match.attendance}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Matchday Navigation - Mobile Optimized */}
      <div className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30 rounded-xl overflow-hidden">
        <div className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-lg sm:text-2xl font-bold text-foreground">Matchday {currentMatchday}</div>
              <div className="text-xs text-muted-foreground">Season 2025/2026</div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 w-8 sm:h-10 sm:w-10 bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60"
                onClick={() => handleMatchdayChange('prev')}
                disabled={currentMatchday === 1}
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 w-8 sm:h-10 sm:w-10 bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60"
                onClick={() => handleMatchdayChange('next')}
                disabled={currentMatchday === 30}
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Match Tabs - Mobile Optimized */}
      <div className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30 rounded-xl overflow-hidden">
        <div className="p-1 border-b border-zinc-700/30">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-800/30 p-1 h-auto">
              <TabsTrigger 
                value="fixtures" 
                className="data-[state=active]:bg-zinc-700/50 text-xs sm:text-sm py-2 sm:py-3"
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Fixtures</span>
                <span className="sm:hidden">Upcoming</span>
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                className="data-[state=active]:bg-zinc-700/50 text-xs sm:text-sm py-2 sm:py-3"
              >
                <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Results</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Fixtures Tab */}
            <TabsContent value="fixtures" className="mt-0">
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                {upcomingMatches.map((match) => (
                  <MatchCard key={match.id} match={match} viewType="fixtures" />
                ))}
              </div>
            </TabsContent>
            
            {/* Results Tab */}
            <TabsContent value="results" className="mt-0">
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                {recentMatches.map((match) => (
                  <MatchCard key={match.id} match={match} viewType="results" />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Load More Button - Mobile Optimized */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          className="bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium"
        >
          Load More Matches
        </Button>
      </div>
      
      {/* Match Detail Modal - Mobile Optimized */}
      {selectedMatch && (() => {
        const match = [...recentMatches, ...upcomingMatches].find(m => m.id === selectedMatch);
        if (!match) return null;

        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-4 sm:my-8">
              {/* Modal Header - Mobile Optimized */}
              <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between z-10">
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedMatch(null)}
                  className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-10 sm:w-10"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
              
              {/* Modal Content - Mobile Optimized */}
              <div className="p-4 sm:p-6">
                {/* Match Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-zinc-700/50 rounded-xl flex items-center justify-center">
                      <span className="text-sm font-bold">{match.homeTeam.shortName}</span>
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-center">
                      {match.homeScore !== null ? `${match.homeScore} - ${match.awayScore}` : 'VS'}
                    </div>
                    <div className="w-16 h-16 bg-zinc-700/50 rounded-xl flex items-center justify-center">
                      <span className="text-sm font-bold">{match.awayTeam.shortName}</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Badge className={cn("text-sm", getStatusColor(match.status))}>
                      {match.status}
                    </Badge>
                  </div>
                </div>
                
                {/* Match Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">Match Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Date</span>
                        <span className="text-sm font-medium">{formatDate(match.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Time</span>
                        <span className="text-sm font-medium">{match.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Venue</span>
                        <span className="text-sm font-medium">{match.venue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Matchday</span>
                        <span className="text-sm font-medium">{match.matchday}</span>
                      </div>
                      {match.broadcast && (
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Broadcast</span>
                          <span className="text-sm font-medium">{match.broadcast}</span>
                        </div>
                      )}
                      {match.attendance && (
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Attendance</span>
                          <span className="text-sm font-medium">{match.attendance}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {match.matchEvents && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground">Match Events</h4>
                      <div className="bg-zinc-800/30 rounded-xl p-3 sm:p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          {match.matchEvents.map((event, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className={cn(
                                "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full",
                                event.team === "home" ? "bg-green-500" : "bg-red-500"
                              )}>
                                <span className="text-white font-bold">{event.minute}'</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium">{event.player}</div>
                                <div className="text-xs text-muted-foreground">Goal</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Button className="flex-1 btn-pana">
                    {match.homeScore !== null ? 'View Full Match Report' : 'Set Reminder'}
                  </Button>
                  <Button variant="outline" className="flex-1 bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60">
                    {match.homeScore !== null ? 'View Match Statistics' : 'Add to Calendar'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}