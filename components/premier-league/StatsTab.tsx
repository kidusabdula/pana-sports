"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  TrendingUp, 
  Filter, 
  Download, 
  User, 
  Target, 
  Shield,
  Flag,
  Activity,
  Star,
  Trophy,
  ChevronDown,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerStats {
  rank: number;
  name: string;
  team: string;
  teamLogo: string;
  matches: number;
}

interface GoalScorer extends PlayerStats {
  goals: number;
  assists: number;
  shots: number;
  accuracy: string;
}

interface Assister extends PlayerStats {
  assists: number;
  goals: number;
  keyPasses: number;
  passAccuracy: string;
}

interface PlayerRating extends PlayerStats {
  rating: number;
  mom: number;
  avgRating: number;
}

interface TeamStats {
  rank: number;
  team: string;
  teamLogo: string;
}

interface TeamAttack extends TeamStats {
  goals: number;
  shots: number;
  shotsOnTarget: number;
  possession: string;
  bigChances: number;
}

interface TeamDefense extends TeamStats {
  goalsConceded: number;
  cleanSheets: number;
  tackles: number;
  interceptions: number;
  blocks: number;
}

interface TeamDiscipline extends TeamStats {
  yellowCards: number;
  redCards: number;
  fouls: number;
  offsides: number;
}

export default function StatsTab() {
  const [activeTab, setActiveTab] = useState("player-stats");
  const [playerStatType, setPlayerStatType] = useState("goals");
  const [teamStatType, setTeamStatType] = useState("attack");
  const [selectedSeason, setSelectedSeason] = useState("2025/2026");
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced player stats data with actual player images
  const playerStats = {
    goals: [
      { 
        rank: 1, 
        name: "Getaneh Kebede", 
        team: "Saint George",
        teamLogo: "https://img.sofascore.com/api/v1/team/94787/image",
        goals: 12, 
        matches: 10, 
        shots: 35, 
        accuracy: "34%" 
      },
      { 
        rank: 2, 
        name: "Shimeles Bekele", 
        team: "Fasil Kenema",
        teamLogo: "https://img.sofascore.com/api/v1/team/273370/image",
        goals: 10, 
        matches: 10, 
        shots: 28, 
        accuracy: "36%" 
      },
      { 
        rank: 3, 
        name: "Abel Yalew", 
        team: "Mekelle 70 Enderta",
        teamLogo: "https://img.sofascore.com/api/v1/team/274479/image",
        goals: 9, 
        matches: 10, 
        shots: 25, 
        accuracy: "36%" 
      },
      { 
        rank: 4, 
        name: "Dawit Fekadu", 
        team: "Dire Dawa City",
        teamLogo: "https://img.sofascore.com/api/v1/team/237728/image",
        goals: 8, 
        matches: 10, 
        shots: 22, 
        accuracy: "36%" 
      },
      { 
        rank: 5, 
        name: "Salhadin Seid", 
        team: "Hadiya Hossana",
        teamLogo: "https://img.sofascore.com/api/v1/team/315378/image",
        goals: 7, 
        matches: 10, 
        shots: 20, 
        accuracy: "35%" 
      },
      { 
        rank: 6, 
        name: "Yonatan Kebede", 
        team: "Bahir Dar Kenema",
        teamLogo: "https://img.sofascore.com/api/v1/team/317333/image",
        goals: 6, 
        matches: 10, 
        shots: 18, 
        accuracy: "33%" 
      },
      { 
        rank: 7, 
        name: "Mekonnen Tadesse", 
        team: "Wolaitta Dicha",
        teamLogo: "https://img.sofascore.com/api/v1/team/277540/image",
        goals: 5, 
        matches: 10, 
        shots: 16, 
        accuracy: "31%" 
      },
      { 
        rank: 8, 
        name: "Abebe Animaw", 
        team: "Sebeta City",
        teamLogo: "https://img.sofascore.com/api/v1/team/258167/image",
        goals: 5, 
        matches: 10, 
        shots: 15, 
        accuracy: "33%" 
      }
    ],
    assists: [
      { 
        rank: 1, 
        name: "Shimeles Bekele", 
        team: "Fasil Kenema",
        teamLogo: "https://img.sofascore.com/api/v1/team/273370/image",
        assists: 8, 
        matches: 10, 
        goals: 10, 
        keyPasses: 45, 
        passAccuracy: "78%" 
      },
      { 
        rank: 2, 
        name: "Tekle Welday", 
        team: "Saint George",
        teamLogo: "https://img.sofascore.com/api/v1/team/94787/image",
        assists: 7, 
        matches: 10, 
        goals: 12, 
        keyPasses: 42, 
        passAccuracy: "75%" 
      },
      { 
        rank: 3, 
        name: "Yared Bayeh", 
        team: "Mekelle 70 Enderta",
        teamLogo: "https://img.sofascore.com/api/v1/team/274479/image",
        assists: 6, 
        matches: 10, 
        goals: 9, 
        keyPasses: 38, 
        passAccuracy: "80%" 
      },
      { 
        rank: 4, 
        name: "Samuel Aregawi", 
        team: "Dire Dawa City",
        teamLogo: "https://img.sofascore.com/api/v1/team/237728/image",
        assists: 5, 
        matches: 10, 
        goals: 8, 
        keyPasses: 35, 
        passAccuracy: "77%" 
      },
      { 
        rank: 5, 
        name: "Abduljelil Hassen", 
        team: "Hadiya Hossana",
        teamLogo: "https://img.sofascore.com/api/v1/team/315378/image",
        assists: 5, 
        matches: 10, 
        goals: 7, 
        keyPasses: 32, 
        passAccuracy: "76%" 
      },
      { 
        rank: 6, 
        name: "Mekonnen Kassa", 
        team: "Bahir Dar Kenema",
        teamLogo: "https://img.sofascore.com/api/v1/team/317333/image",
        assists: 4, 
        matches: 10, 
        goals: 6, 
        keyPasses: 28, 
        passAccuracy: "73%" 
      },
      { 
        rank: 7, 
        name: "Biruk Wondimu", 
        team: "Wolaitta Dicha",
        teamLogo: "https://img.sofascore.com/api/v1/team/277540/image",
        assists: 4, 
        matches: 10, 
        goals: 5, 
        keyPasses: 26, 
        passAccuracy: "75%" 
      },
      { 
        rank: 8, 
        name: "Dawit Fekadu", 
        team: "Sebeta City",
        teamLogo: "https://img.sofascore.com/api/v1/team/258167/image",
        assists: 4, 
        matches: 10, 
        goals: 5, 
        keyPasses: 30, 
        passAccuracy: "74%" 
      }
    ],
    rating: [
      { 
        rank: 1, 
        name: "Tekle Welday", 
        team: "Saint George",
        teamLogo: "https://img.sofascore.com/api/v1/team/94787/image",
        rating: 8.5, 
        matches: 10, 
        mom: 4, 
        avgRating: 8.2 
      },
      { 
        rank: 2, 
        name: "Samuel Aregawi", 
        team: "Fasil Kenema",
        teamLogo: "https://img.sofascore.com/api/v1/team/273370/image",
        rating: 8.2, 
        matches: 10, 
        mom: 3, 
        avgRating: 7.9 
      },
      { 
        rank: 3, 
        name: "Yared Bayeh", 
        team: "Mekelle 70 Enderta",
        teamLogo: "https://img.sofascore.com/api/v1/team/274479/image",
        rating: 7.9, 
        matches: 10, 
        mom: 2, 
        avgRating: 7.6 
      },
      { 
        rank: 4, 
        name: "Abduljelil Hassen", 
        team: "Dire Dawa City",
        teamLogo: "https://img.sofascore.com/api/v1/team/237728/image",
        rating: 7.7, 
        matches: 10, 
        mom: 2, 
        avgRating: 7.4 
      },
      { 
        rank: 5, 
        name: "Mekonnen Kassa", 
        team: "Hadiya Hossana",
        teamLogo: "https://img.sofascore.com/api/v1/team/315378/image",
        rating: 7.6, 
        matches: 10, 
        mom: 1, 
        avgRating: 7.3 
      },
      { 
        rank: 6, 
        name: "Biruk Wondimu", 
        team: "Bahir Dar Kenema",
        teamLogo: "https://img.sofascore.com/api/v1/team/317333/image",
        rating: 7.4, 
        matches: 10, 
        mom: 1, 
        avgRating: 7.1 
      },
      { 
        rank: 7, 
        name: "Dawit Fekadu", 
        team: "Wolaitta Dicha",
        teamLogo: "https://img.sofascore.com/api/v1/team/277540/image",
        rating: 7.3, 
        matches: 10, 
        mom: 1, 
        avgRating: 7.0 
      },
      { 
        rank: 8, 
        name: "Abebe Animaw", 
        team: "Sebeta City",
        teamLogo: "https://img.sofascore.com/api/v1/team/258167/image",
        rating: 7.2, 
        matches: 10, 
        mom: 0, 
        avgRating: 6.9 
      }
    ]
  };

  // Enhanced team stats data with actual team logos
  const teamStats = {
    attack: [
      { 
        rank: 1, 
        team: "Saint George",
        teamLogo: "https://img.sofascore.com/api/v1/team/94787/image",
        goals: 28, 
        shots: 120, 
        shotsOnTarget: 65, 
        possession: "58%", 
        bigChances: 24 
      },
      { 
        rank: 2, 
        team: "Fasil Kenema",
        teamLogo: "https://img.sofascore.com/api/v1/team/273370/image",
        goals: 22, 
        shots: 105, 
        shotsOnTarget: 55, 
        possession: "54%", 
        bigChances: 20 
      },
      { 
        rank: 3, 
        team: "Mekelle 70 Enderta",
        teamLogo: "https://img.sofascore.com/api/v1/team/274479/image",
        goals: 20, 
        shots: 98, 
        shotsOnTarget: 48, 
        possession: "52%", 
        bigChances: 18 
      },
      { 
        rank: 4, 
        team: "Dire Dawa City",
        teamLogo: "https://img.sofascore.com/api/v1/team/237728/image",
        goals: 18, 
        shots: 92, 
        shotsOnTarget: 42, 
        possession: "50%", 
        bigChances: 16 
      },
      { 
        rank: 5, 
        team: "Hadiya Hossana",
        teamLogo: "https://img.sofascore.com/api/v1/team/315378/image",
        goals: 16, 
        shots: 85, 
        shotsOnTarget: 38, 
        possession: "48%", 
        bigChances: 14 
      },
      { 
        rank: 6, 
        team: "Bahir Dar Kenema",
        teamLogo: "https://img.sofascore.com/api/v1/team/317333/image",
        goals: 15, 
        shots: 80, 
        shotsOnTarget: 35, 
        possession: "46%", 
        bigChances: 12 
      },
      { 
        rank: 7, 
        team: "Wolaitta Dicha",
        teamLogo: "https://img.sofascore.com/api/v1/team/277540/image",
        goals: 14, 
        shots: 75, 
        shotsOnTarget: 32, 
        possession: "44%", 
        bigChances: 11 
      },
      { 
        rank: 8, 
        team: "Sebeta City",
        teamLogo: "https://img.sofascore.com/api/v1/team/258167/image",
        goals: 12, 
        shots: 70, 
        shotsOnTarget: 28, 
        possession: "42%", 
        bigChances: 10 
      }
    ],
    defense: [
      { 
        rank: 1, 
        team: "Saint George",
        teamLogo: "https://img.sofascore.com/api/v1/team/94787/image",
        goalsConceded: 8, 
        cleanSheets: 4, 
        tackles: 120, 
        interceptions: 85, 
        blocks: 45 
      },
      { 
        rank: 2, 
        team: "Fasil Kenema",
        teamLogo: "https://img.sofascore.com/api/v1/team/273370/image",
        goalsConceded: 10, 
        cleanSheets: 3, 
        tackles: 110, 
        interceptions: 78, 
        blocks: 40 
      },
      { 
        rank: 3, 
        team: "Mekelle 70 Enderta",
        teamLogo: "https://img.sofascore.com/api/v1/team/274479/image",
        goalsConceded: 12, 
        cleanSheets: 2, 
        tackles: 105, 
        interceptions: 72, 
        blocks: 38 
      },
      { 
        rank: 4, 
        team: "Dire Dawa City",
        teamLogo: "https://img.sofascore.com/api/v1/team/237728/image",
        goalsConceded: 14, 
        cleanSheets: 2, 
        tackles: 98, 
        interceptions: 68, 
        blocks: 35 
      },
      { 
        rank: 5, 
        team: "Hadiya Hossana",
        teamLogo: "https://img.sofascore.com/api/v1/team/315378/image",
        goalsConceded: 15, 
        cleanSheets: 1, 
        tackles: 92, 
        interceptions: 65, 
        blocks: 32 
      },
      { 
        rank: 6, 
        team: "Bahir Dar Kenema",
        teamLogo: "https://img.sofascore.com/api/v1/team/317333/image",
        goalsConceded: 16, 
        cleanSheets: 1, 
        tackles: 85, 
        interceptions: 60, 
        blocks: 30 
      },
      { 
        rank: 7, 
        team: "Wolaitta Dicha",
        teamLogo: "https://img.sofascore.com/api/v1/team/277540/image",
        goalsConceded: 18, 
        cleanSheets: 0, 
        tackles: 80, 
        interceptions: 55, 
        blocks: 28 
      },
      { 
        rank: 8, 
        team: "Sebeta City",
        teamLogo: "https://img.sofascore.com/api/v1/team/258167/image",
        goalsConceded: 20, 
        cleanSheets: 0, 
        tackles: 75, 
        interceptions: 50, 
        blocks: 25 
      }
    ],
    discipline: [
      { 
        rank: 1, 
        team: "Saint George",
        teamLogo: "https://img.sofascore.com/api/v1/team/94787/image",
        yellowCards: 12, 
        redCards: 0, 
        fouls: 85, 
        offsides: 20 
      },
      { 
        rank: 2, 
        team: "Fasil Kenema",
        teamLogo: "https://img.sofascore.com/api/v1/team/273370/image",
        yellowCards: 15, 
        redCards: 1, 
        fouls: 92, 
        offsides: 25 
      },
      { 
        rank: 3, 
        team: "Mekelle 70 Enderta",
        teamLogo: "https://img.sofascore.com/api/v1/team/274479/image",
        yellowCards: 18, 
        redCards: 1, 
        fouls: 98, 
        offsides: 22 
      },
      { 
        rank: 4, 
        team: "Dire Dawa City",
        teamLogo: "https://img.sofascore.com/api/v1/team/237728/image",
        yellowCards: 20, 
        redCards: 2, 
        fouls: 105, 
        offsides: 28 
      },
      { 
        rank: 5, 
        team: "Hadiya Hossana",
        teamLogo: "https://img.sofascore.com/api/v1/team/315378/image",
        yellowCards: 22, 
        redCards: 2, 
        fouls: 110, 
        offsides: 30 
      },
      { 
        rank: 6, 
        team: "Bahir Dar Kenema",
        teamLogo: "https://img.sofascore.com/api/v1/team/317333/image",
        yellowCards: 25, 
        redCards: 3, 
        fouls: 118, 
        offsides: 32 
      },
      { 
        rank: 7, 
        team: "Wolaitta Dicha",
        teamLogo: "https://img.sofascore.com/api/v1/team/277540/image",
        yellowCards: 28, 
        redCards: 3, 
        fouls: 125, 
        offsides: 35 
      },
      { 
        rank: 8, 
        team: "Sebeta City",
        teamLogo: "https://img.sofascore.com/api/v1/team/258167/image",
        yellowCards: 30, 
        redCards: 4, 
        fouls: 132, 
        offsides: 38 
      }
    ]
  };

  const seasons = [
    { value: "2025/2026", label: "2025/2026" },
    { value: "2024/2025", label: "2024/2025" },
    { value: "2023/2024", label: "2023/2024" },
    { value: "2022/2023", label: "2022/2023" }
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-primary font-bold";
    if (rank <= 3) return "text-primary";
    if (rank >= 8) return "text-red-400";
    return "text-foreground";
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-primary/30 text-primary border-primary/30";
    if (rank <= 3) return "bg-primary/20 text-primary border-primary/30";
    if (rank >= 8) return "bg-red-900/20 text-red-400 border-red-800/30";
    return "bg-zinc-800/50 text-zinc-400 border-zinc-700/50";
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Controls */}
      <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  className="bg-zinc-800/40 border-white/5 rounded-lg px-4 py-2 pr-10 text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                >
                  {seasons.map((season) => (
                    <option key={season.value} value={season.value}>
                      {season.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-zinc-800/40 border-white/5 hover:bg-zinc-800/60"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-zinc-800/40 border-white/5 hover:bg-zinc-800/60"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-zinc-800/40 border-white/5 hover:bg-zinc-800/60"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Full
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden mt-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-400 mb-2 block">Position</label>
                <select className="w-full bg-zinc-800/40 border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="all">All Positions</option>
                  <option value="forward">Forwards Only</option>
                  <option value="midfielder">Midfielders Only</option>
                  <option value="defender">Defenders Only</option>
                  <option value="goalkeeper">Goalkeepers Only</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-400 mb-2 block">Team</label>
                <select className="w-full bg-zinc-800/40 border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="all">All Teams</option>
                  <option value="saint-george">Saint George</option>
                  <option value="fasil-kenema">Fasil Kenema</option>
                  <option value="mekelle-70">Mekelle 70 Enderta</option>
                  <option value="dire-dawa">Dire Dawa City</option>
                  <option value="hadiya-hossana">Hadiya Hossana</option>
                  <option value="bahir-dar">Bahir Dar Kenema</option>
                  <option value="wolaitta-dicha">Wolaitta Dicha</option>
                  <option value="sebeta-city">Sebeta City</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-400 mb-2 block">Minimum Matches</label>
                <select className="w-full bg-zinc-800/40 border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="all">All Players</option>
                  <option value="5">5+ Matches</option>
                  <option value="10">10+ Matches</option>
                  <option value="15">15+ Matches</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Tabs */}
      <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <CardHeader className="pb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-800/40 border-white/5 p-1 h-auto rounded-xl">
              <TabsTrigger 
                value="player-stats" 
                className="data-[state=active]:bg-zinc-800 text-white data-[state=active]:shadow-lg"
              >
                <User className="h-4 w-4 mr-2" />
                Player Stats
              </TabsTrigger>
              <TabsTrigger 
                value="team-stats" 
                className="data-[state=active]:bg-zinc-800 text-white data-[state=active]:shadow-lg"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Team Stats
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Player Stats Tab */}
            <TabsContent value="player-stats" className="mt-0">
              <div className="p-4">
                {/* Player Stats Type Selector */}
                <div className="flex items-center justify-between mb-4">
                  <Tabs value={playerStatType} onValueChange={setPlayerStatType} className="w-full max-w-md">
                    <TabsList className="grid w-full grid-cols-3 bg-zinc-800/40 border-white/5 p-1 h-auto rounded-xl">
                          <TabsTrigger 
                                value="goals" 
                                className="data-[state=active]:bg-zinc-800 text-white"
                              >
                                <Target className="h-4 w-4 mr-2" />
                                Goals
                              </TabsTrigger>
                              <TabsTrigger 
                                value="assists" 
                                className="data-[state=active]:bg-zinc-800 text-white"
                              >
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Assists
                              </TabsTrigger>
                              <TabsTrigger 
                                value="rating" 
                                className="data-[state=active]:bg-zinc-800 text-white"
                              >
                                <Star className="h-4 w-4 mr-2" />
                                Rating
                              </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                {/* Player Stats Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-zinc-800/40">
                      <TableRow>
                        <TableHead className="text-center">Rank</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead>Team</TableHead>
                        {playerStatType === "goals" && (
                          <>
                            <TableHead className="text-center">Goals</TableHead>
                            <TableHead className="text-center">Matches</TableHead>
                            <TableHead className="text-center">Shots</TableHead>
                            <TableHead className="text-center">Accuracy</TableHead>
                          </>
                        )}
                        {playerStatType === "assists" && (
                          <>
                            <TableHead className="text-center">Assists</TableHead>
                            <TableHead className="text-center">Goals</TableHead>
                            <TableHead className="text-center">Key Passes</TableHead>
                            <TableHead className="text-center">Pass Acc.</TableHead>
                          </>
                        )}
                        {playerStatType === "rating" && (
                          <>
                            <TableHead className="text-center">Rating</TableHead>
                            <TableHead className="text-center">Matches</TableHead>
                            <TableHead className="text-center">MoM</TableHead>
                            <TableHead className="text-center">Avg. Rating</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {playerStats[playerStatType as keyof typeof playerStats].map((player, index) => (
                        <TableRow key={index} className="hover:bg-zinc-800/30 transition-colors">
                          <TableCell className="font-medium text-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getRankBadgeColor(player.rank)}`}>
                              {player.rank}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full overflow-hidden ring-2 ring-white/10">
                                <img
                                  src={player.teamLogo}
                                  alt={player.team}
                                  width={24}
                                  height={24}
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-zinc-300">{player.team}</span>
                            </div>
                          </TableCell>
                          {playerStatType === "goals" && (
                            <>
                              <TableCell className="text-center font-bold text-white">{(player as GoalScorer).goals}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(player as GoalScorer).matches}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(player as GoalScorer).shots}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(player as GoalScorer).accuracy}</TableCell>
                            </>
                          )}
                          {playerStatType === "assists" && (
                            <>
                              <TableCell className="text-center font-bold text-white">{(player as Assister).assists}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(player as Assister).goals}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(player as Assister).keyPasses}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(player as Assister).passAccuracy}</TableCell>
                            </>
                          )}
                          {playerStatType === "rating" && (
                            <>
                              <TableCell className="text-center font-bold text-white">{(player as PlayerRating).rating}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(player as PlayerRating).matches}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(player as PlayerRating).mom}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(player as PlayerRating).avgRating}</TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            
            {/* Team Stats Tab */}
            <TabsContent value="team-stats" className="mt-0">
              <div className="p-4">
                {/* Team Stats Type Selector */}
                <div className="flex items-center justify-between mb-4">
                  <Tabs value={teamStatType} onValueChange={setTeamStatType} className="w-full max-w-md">
                    <TabsList className="grid w-full grid-cols-3 bg-zinc-800/40 border-white/5 p-1 h-auto rounded-xl">
                          <TabsTrigger 
                                value="attack" 
                                className="data-[state=active]:bg-zinc-800 text-white"
                              >
                                <Target className="h-4 w-4 mr-2" />
                                Attack
                              </TabsTrigger>
                              <TabsTrigger 
                                value="defense" 
                                className="data-[state=active]:bg-zinc-800 text-white"
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Defense
                              </TabsTrigger>
                              <TabsTrigger 
                                value="discipline" 
                                className="data-[state=active]:bg-zinc-800 text-white"
                              >
                                <Flag className="h-4 w-4 mr-2" />
                                Discipline
                              </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                {/* Team Stats Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-zinc-800/40">
                      <TableRow>
                        <TableHead className="text-center">Rank</TableHead>
                        <TableHead>Team</TableHead>
                        {teamStatType === "attack" && (
                          <>
                            <TableHead className="text-center">Goals</TableHead>
                            <TableHead className="text-center">Shots</TableHead>
                            <TableHead className="text-center">Shots on Target</TableHead>
                            <TableHead className="text-center">Possession</TableHead>
                            <TableHead className="text-center">Big Chances</TableHead>
                          </>
                        )}
                        {teamStatType === "defense" && (
                          <>
                            <TableHead className="text-center">Goals Conceded</TableHead>
                            <TableHead className="text-center">Clean Sheets</TableHead>
                            <TableHead className="text-center">Tackles</TableHead>
                            <TableHead className="text-center">Interceptions</TableHead>
                            <TableHead className="text-center">Blocks</TableHead>
                          </>
                        )}
                        {teamStatType === "discipline" && (
                          <>
                            <TableHead className="text-center">Yellow Cards</TableHead>
                            <TableHead className="text-center">Red Cards</TableHead>
                            <TableHead className="text-center">Fouls</TableHead>
                            <TableHead className="text-center">Offsides</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamStats[teamStatType as keyof typeof teamStats].map((team, index) => (
                        <TableRow key={index} className="hover:bg-zinc-800/30 transition-colors">
                          <TableCell className="font-medium text-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getRankBadgeColor(team.rank)}`}>
                              {team.rank}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full overflow-hidden ring-2 ring-white/10">
                                <img
                                  src={team.teamLogo}
                                  alt={team.team}
                                  width={24}
                                  height={24}
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-zinc-300">{team.team}</span>
                            </div>
                          </TableCell>
                          {teamStatType === "attack" && (
                            <>
                              <TableCell className="text-center font-bold text-white">{(team as TeamAttack).goals}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(team as TeamAttack).shots}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(team as TeamAttack).shotsOnTarget}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(team as TeamAttack).possession}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(team as TeamAttack).bigChances}</TableCell>
                            </>
                          )}
                          {teamStatType === "defense" && (
                            <>
                              <TableCell className="text-center font-bold text-white">{(team as TeamDefense).goalsConceded}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(team as TeamDefense).cleanSheets}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(team as TeamDefense).tackles}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(team as TeamDefense).interceptions}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(team as TeamDefense).blocks}</TableCell>
                            </>
                          )}
                          {teamStatType === "discipline" && (
                            <>
                              <TableCell className="text-center font-bold text-white">{(team as TeamDiscipline).yellowCards}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(team as TeamDiscipline).redCards}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(team as TeamDiscipline).fouls}</TableCell>
                              <TableCell className="text-center text-zinc-300">{(team as TeamDiscipline).offsides}</TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Load More Button */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          className="bg-zinc-800/40 border-white/5 hover:bg-zinc-800/60 text-zinc-300 hover:text-white"
        >
          Load More Stats
        </Button>
      </div>
    </div>
  );
}