"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Users,
  Trophy,
  X,
  MapPin,
  Activity,
  Target,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Team = {
  id: number;
  name: string;
  logo: string;
  shortName: string;
};

type MatchEvent = {
  minute: number;
  team: "home" | "away";
  type: "goal" | "card" | "substitution";
  player: string;
};

type Match = {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  time: string;
  status: "FT" | "LIVE" | "UPCOMING";
  venue: string;
  matchday: number;
  attendance?: string;
  highlights?: boolean;
  matchEvents?: MatchEvent[];
  broadcast?: string;
};

export default function MatchesTab() {
  const [activeTab, setActiveTab] = useState("fixtures");
  const [currentMatchday, setCurrentMatchday] = useState(11);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);

  // Enhanced match data with actual team logos
  const recentMatches: Match[] = [
    {
      id: 1,
      homeTeam: { 
        id: 94787,
        name: "Saint George", 
        logo: "https://img.sofascore.com/api/v1/team/94787/image", 
        shortName: "STG" 
      },
      awayTeam: { 
        id: 273370,
        name: "Fasil Kenema", 
        logo: "https://img.sofascore.com/api/v1/team/273370/image", 
        shortName: "FAK" 
      },
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
        { minute: 23, team: "home", type: "goal", player: "Getaneh Kebede" },
        { minute: 45, team: "home", type: "goal", player: "Shimeles Bekele" },
        { minute: 67, team: "home", type: "goal", player: "Amanuel Assefa" },
        { minute: 78, team: "home", type: "goal", player: "Abel Yalew" }
      ]
    },
    {
      id: 2,
      homeTeam: { 
        id: 274479,
        name: "Mekelle 70 Enderta", 
        logo: "https://img.sofascore.com/api/v1/team/274479/image", 
        shortName: "MEK" 
      },
      awayTeam: { 
        id: 237728,
        name: "Dire Dawa City", 
        logo: "https://img.sofascore.com/api/v1/team/237728/image", 
        shortName: "DDC" 
      },
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
      homeTeam: { 
        id: 315378,
        name: "Hawassa Kenema", 
        logo: "https://img.sofascore.com/api/v1/team/315378/image", 
        shortName: "HAW" 
      },
      awayTeam: { 
        id: 317333,
        name: "Bahir Dar Kenema", 
        logo: "https://img.sofascore.com/api/v1/team/317333/image", 
        shortName: "BDK" 
      },
      homeScore: 1,
      awayScore: 2,
      date: "2025-10-15",
      time: "15:00",
      status: "FT",
      venue: "Hawassa Stadium",
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
      homeTeam: { 
        id: 277540,
        name: "Wolaitta Dicha", 
        logo: "https://img.sofascore.com/api/v1/team/277540/image", 
        shortName: "WOD" 
      },
      awayTeam: { 
        id: 258167,
        name: "Sebeta City", 
        logo: "https://img.sofascore.com/api/v1/team/258167/image", 
        shortName: "SEC" 
      },
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

  const upcomingMatches: Match[] = [
    {
      id: 5,
      homeTeam: { 
        id: 241957,
        name: "Ethiopia Bunna", 
        logo: "https://img.sofascore.com/api/v1/team/241957/image", 
        shortName: "ETH" 
      },
      awayTeam: { 
        id: 1014936,
        name: "Jimma Aba Jifar", 
        logo: "https://img.sofascore.com/api/v1/team/1014936/image", 
        shortName: "JIM" 
      },
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
      homeTeam: { 
        id: 1099589,
        name: "Welwalo Adigrat", 
        logo: "https://img.sofascore.com/api/v1/team/1099589/image", 
        shortName: "WEL" 
      },
      awayTeam: { 
        id: 1064117,
        name: "Arba Minch Ketema", 
        logo: "https://img.sofascore.com/api/v1/team/1064117/image", 
        shortName: "ARB" 
      },
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
      homeTeam: { 
        id: 315378,
        name: "Hawassa Kenema", 
        logo: "https://img.sofascore.com/api/v1/team/315378/image", 
        shortName: "HAW" 
      },
      awayTeam: { 
        id: 274479,
        name: "Mekelle 70 Enderta", 
        logo: "https://img.sofascore.com/api/v1/team/274479/image", 
        shortName: "MEK" 
      },
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
      homeTeam: { 
        id: 94787,
        name: "Saint George", 
        logo: "https://img.sofascore.com/api/v1/team/94787/image", 
        shortName: "STG" 
      },
      awayTeam: { 
        id: 277540,
        name: "Wolaitta Dicha", 
        logo: "https://img.sofascore.com/api/v1/team/277540/image", 
        shortName: "WOD" 
      },
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

  const getStatusColor = (status: Match['status']) => {
    switch (status) {
      case "FT": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "LIVE": return "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse";
      case "UPCOMING": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-zinc-800/50 text-zinc-400 border-zinc-700/50";
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

  // Enhanced Match Card Component with actual team logos
  const MatchCard = ({ match, viewType }: { match: Match; viewType: string }) => {
    const isResult = viewType === "results";
    
    return (
      <div className="bg-zinc-900/40 backdrop-blur-xl border-white/5 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 group">
        {/* Match Card Header */}
        <div className="p-3 sm:p-4 border-b border-white/5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge className={cn("text-xs", getStatusColor(match.status))}>
                {match.status}
              </Badge>
              <div className="text-xs text-zinc-500">
                {formatDate(match.date)} • {match.time}
              </div>
            </div>
          
            {match.highlights && (
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 w-8 sm:h-10 sm:w-10 bg-zinc-800/40 border-white/5 hover:bg-zinc-800/60"
                onClick={() => setSelectedMatch(match.id)}
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>
      
        {/* Match Teams & Score */}
        <div className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-white/10">
                <Image
                  src={match.homeTeam.logo}
                  alt={match.homeTeam.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <span className="text-xs sm:text-sm font-medium text-zinc-300 text-center">{match.homeTeam.name}</span>
            </div>
          
            {/* Score/VS Section */}
            <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
              {isResult ? (
                <>
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {match.homeScore}
                  </div>
                  <div className="text-sm text-zinc-500">-</div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {match.awayScore}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-lg sm:text-xl font-bold text-primary">VS</div>
                  <div className="text-xs text-zinc-500 text-center">
                    {formatDate(match.date)}
                  </div>
                </>
              )}
            </div>
          
            {/* Away Team */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <span className="text-xs sm:text-sm font-medium text-zinc-300 text-center">{match.awayTeam.name}</span>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-white/10">
                <Image
                  src={match.awayTeam.logo}
                  alt={match.awayTeam.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        
        {/* Match Events */}
        {match.matchEvents && (
          <div className="mt-3 sm:mt-4 bg-zinc-800/40 rounded-xl p-3 sm:p-4 border border-white/5">
            <div className="text-xs text-zinc-500 font-medium mb-2 sm:mb-3">Match Events</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
              {match.matchEvents.slice(0, isResult ? 4 : 2).map((event: MatchEvent, index: number) => (
                <div key={index} className="text-xs text-zinc-300 text-center">
                  <div className={cn(
                    "inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full",
                    event.team === "home" ? "bg-green-500" : "bg-red-500"
                  )}>
                    <span className="text-white font-bold">{event.minute}&apos;</span>
                  </div>
                  <div className="mt-1 text-center">
                    <div className="text-xs font-medium">{event.player}</div>
                    <div className="text-xs text-zinc-500">
                      {event.type === "goal" ? "Goal" : event.type === "card" ? "Card" : "Substitution"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Match Footer */}
      <div className="p-3 sm:p-4 bg-zinc-800/10 border-t border-white/5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-xs text-zinc-500">
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
      {/* Enhanced Matchday Navigation */}
      <div className="bg-zinc-900/40 backdrop-blur-xl border-white/5 rounded-xl overflow-hidden">
        <div className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-lg sm:text-2xl font-bold text-white">Matchday {currentMatchday}</div>
              <div className="text-xs text-zinc-500">Season 2025/2026</div>
            </div>
          
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 w-8 sm:h-10 sm:w-10 bg-zinc-800/40 border-white/5 hover:bg-zinc-800/60"
                onClick={() => handleMatchdayChange('prev')}
                disabled={currentMatchday === 1}
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 w-8 sm:h-10 sm:w-10 bg-zinc-800/40 border-white/5 hover:bg-zinc-800/60"
                onClick={() => handleMatchdayChange('next')}
                disabled={currentMatchday === 30}
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Match Tabs */}
      <div className="bg-zinc-900/40 backdrop-blur-xl border-white/5 rounded-xl overflow-hidden">
        <div className="p-1 border-b border-white/5">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-800/40 p-1 h-auto rounded-xl">
              <TabsTrigger 
                value="fixtures" 
                className="data-[state=active]:bg-zinc-800 text-white data-[state=active]:shadow-lg"
              >
                <Calendar className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Fixtures</span>
                <span className="sm:hidden">Upcoming</span>
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                className="data-[state=active]:bg-zinc-800 text-white data-[state=active]:shadow-lg"
              >
                <Trophy className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Results</span>
                <span className="sm:hidden">Recent</span>
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

      {/* Enhanced Load More Button */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          className="bg-zinc-800/40 border-white/5 hover:bg-zinc-800/60 text-zinc-300 hover:text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium"
        >
          Load More Matches
        </Button>
      </div>

      {/* Enhanced Match Detail Modal */}
      {selectedMatch && (() => {
        const match = [...recentMatches, ...upcomingMatches].find(m => m.id === selectedMatch);
        if (!match) return null;

        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border-white/5 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-4 sm:my-8">
              {/* Modal Header */}
              <div className="sticky top-0 bg-zinc-900 border-b border-white/5 p-4 flex items-center justify-between z-10">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedMatch(null)}
                  className="text-zinc-500 hover:text-white h-8 w-8 sm:h-10 sm:w-10"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
              
              {/* Modal Content */}
              <div className="p-4 sm:p-6">
                {/* Match Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-2 ring-white/10">
                      <Image
                        src={match.homeTeam.logo}
                        alt={match.homeTeam.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <div className="text-sm sm:text-base font-medium text-zinc-300">{match.homeTeam.name}</div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="text-2xl sm:text-3xl font-bold text-white">
                      {match.homeScore !== null ? `${match.homeScore} - ${match.awayScore}` : 'VS'}
                    </div>
                    <Badge className={cn("text-xs", getStatusColor(match.status))}>
                      {match.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-sm sm:text-base font-medium text-zinc-300">{match.awayTeam.name}</div>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-2 ring-white/10">
                      <Image
                        src={match.awayTeam.logo}
                        alt={match.awayTeam.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Match Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-zinc-400 mb-3">Match Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-zinc-500">Date</span>
                        <span className="text-sm text-zinc-300">{formatDate(match.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-zinc-500">Time</span>
                        <span className="text-sm text-zinc-300">{match.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-zinc-500">Venue</span>
                        <span className="text-sm text-zinc-300">{match.venue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-zinc-500">Matchday</span>
                        <span className="text-sm text-zinc-300">{match.matchday}</span>
                      </div>
                      {match.broadcast && (
                        <div className="flex justify-between">
                          <span className="text-xs text-zinc-500">Broadcast</span>
                          <span className="text-sm text-zinc-300">{match.broadcast}</span>
                        </div>
                      )}
                      {match.attendance && (
                        <div className="flex justify-between">
                          <span className="text-xs text-zinc-500">Attendance</span>
                          <span className="text-sm text-zinc-300">{match.attendance}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {match.matchEvents && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-zinc-400 mb-3">Match Events</h4>
                      <div className="bg-zinc-800/40 rounded-xl p-3 sm:p-4 border border-white/5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          {match.matchEvents.map((event: MatchEvent, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className={cn(
                                "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full",
                                event.team === "home" ? "bg-green-500" : "bg-red-500"
                              )}>
                                <span className="text-white font-bold">{event.minute}&apos;</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-zinc-300">{event.player}</div>
                                <div className="text-xs text-zinc-500">
                                  {event.type === "goal" ? "Goal" : event.type === "card" ? "Card" : "Substitution"}
                                </div>
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
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-white">
                    {match.homeScore !== null ? 'View Full Match Report' : 'Set Reminder'}
                  </Button>
                  <Button variant="outline" className="flex-1 bg-zinc-800/40 border-white/5 hover:bg-zinc-800/60 text-zinc-300 hover:text-white">
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