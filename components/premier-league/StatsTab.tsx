// components/premier-league/StatsTab.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  TrendingUp, 
  Filter, 
  Download, 
  User, 
  Target, 
  Users, 
  ChevronDown,
  Star,
  Activity,
  Shield,
  Flag,
  Eye
} from 'lucide-react';
// import { cn } from '@/lib/utils';

interface PlayerStats {
  rank: number;
  name: string;
  team: string;
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

  // Sample player stats data
  const playerStats: {
    goals: GoalScorer[];
    assists: Assister[];
    rating: PlayerRating[];
  } = {
    goals: [
      { rank: 1, name: "Getaneh Kebede", team: "Saint George", goals: 12, matches: 10, assists: 3, shots: 35, accuracy: "34%" },
      { rank: 2, name: "Shimeles Bekele", team: "Fasil Kenema", goals: 10, matches: 10, assists: 5, shots: 28, accuracy: "36%" },
      { rank: 3, name: "Abel Yalew", team: "Mekelle 70 Enderta", goals: 9, matches: 10, assists: 4, shots: 25, accuracy: "36%" },
      { rank: 4, name: "Dawit Fekadu", team: "Dire Dawa City", goals: 8, matches: 10, assists: 2, shots: 22, accuracy: "36%" },
      { rank: 5, name: "Salhadin Seid", team: "Hadiya Hossana", goals: 7, matches: 10, assists: 6, shots: 20, accuracy: "35%" },
      { rank: 6, name: "Mesfin Tadesse", team: "Bahir Dar Kenema", goals: 6, matches: 10, assists: 3, shots: 18, accuracy: "33%" },
      { rank: 7, name: "Yonatan Kebede", team: "Wolaitta Dicha", goals: 5, matches: 10, assists: 2, shots: 16, accuracy: "31%" },
      { rank: 8, name: "Abebe Animaw", team: "Sebeta City", goals: 5, matches: 10, assists: 4, shots: 15, accuracy: "33%" },
    ],
    assists: [
      { rank: 1, name: "Salhadin Seid", team: "Hadiya Hossana", assists: 8, matches: 10, goals: 7, keyPasses: 45, passAccuracy: "78%" },
      { rank: 2, name: "Shimeles Bekele", team: "Fasil Kenema", assists: 7, matches: 10, goals: 10, keyPasses: 42, passAccuracy: "75%" },
      { rank: 3, name: "Tekle Welday", team: "Saint George", assists: 6, matches: 10, goals: 3, keyPasses: 38, passAccuracy: "80%" },
      { rank: 4, name: "Abel Yalew", team: "Mekelle 70 Enderta", assists: 5, matches: 10, goals: 9, keyPasses: 35, passAccuracy: "77%" },
      { rank: 5, name: "Getaneh Kebede", team: "Saint George", assists: 5, matches: 10, goals: 12, keyPasses: 32, passAccuracy: "76%" },
      { rank: 6, name: "Dawit Fekadu", team: "Dire Dawa City", assists: 4, matches: 10, goals: 8, keyPasses: 30, passAccuracy: "74%" },
      { rank: 7, name: "Mesfin Tadesse", team: "Bahir Dar Kenema", assists: 4, matches: 10, goals: 6, keyPasses: 28, passAccuracy: "73%" },
      { rank: 8, name: "Abebe Animaw", team: "Sebeta City", assists: 4, matches: 10, goals: 5, keyPasses: 26, passAccuracy: "75%" },
    ],
    rating: [
      { rank: 1, name: "Tekle Welday", team: "Saint George", rating: 8.5, matches: 10, mom: 4, avgRating: 8.2 },
      { rank: 2, name: "Samuel Aregawi", team: "Fasil Kenema", rating: 8.2, matches: 10, mom: 3, avgRating: 7.9 },
      { rank: 3, name: "Yared Bayeh", team: "Mekelle 70 Enderta", rating: 7.9, matches: 10, mom: 2, avgRating: 7.6 },
      { rank: 4, name: "Mekonnen Kassa", team: "Dire Dawa City", rating: 7.7, matches: 10, mom: 2, avgRating: 7.4 },
      { rank: 5, name: "Abduljelil Hassen", team: "Hadiya Hossana", rating: 7.6, matches: 10, mom: 1, avgRating: 7.3 },
      { rank: 6, name: "Biruk Wondimu", team: "Bahir Dar Kenema", rating: 7.5, matches: 10, mom: 1, avgRating: 7.2 },
      { rank: 7, name: "Dawit Fekadu", team: "Dire Dawa City", rating: 7.4, matches: 10, mom: 1, avgRating: 7.1 },
      { rank: 8, name: "Salhadin Seid", team: "Hadiya Hossana", rating: 7.3, matches: 10, mom: 0, avgRating: 7.0 },
    ]
  };

  // Sample team stats data
  const teamStats: {
    attack: TeamAttack[];
    defense: TeamDefense[];
    discipline: TeamDiscipline[];
  } = {
    attack: [
      { rank: 1, team: "Saint George", goals: 28, shots: 120, shotsOnTarget: 65, possession: "58%", bigChances: 24 },
      { rank: 2, team: "Fasil Kenema", goals: 22, shots: 105, shotsOnTarget: 55, possession: "54%", bigChances: 20 },
      { rank: 3, team: "Mekelle 70 Enderta", goals: 20, shots: 98, shotsOnTarget: 48, possession: "52%", bigChances: 18 },
      { rank: 4, team: "Dire Dawa City", goals: 18, shots: 92, shotsOnTarget: 42, possession: "50%", bigChances: 16 },
      { rank: 5, team: "Hadiya Hossana", goals: 16, shots: 85, shotsOnTarget: 38, possession: "48%", bigChances: 14 },
      { rank: 6, team: "Bahir Dar Kenema", goals: 15, shots: 80, shotsOnTarget: 35, possession: "46%", bigChances: 12 },
      { rank: 7, team: "Wolaitta Dicha", goals: 14, shots: 75, shotsOnTarget: 32, possession: "44%", bigChances: 11 },
      { rank: 8, team: "Sebeta City", goals: 12, shots: 70, shotsOnTarget: 28, possession: "42%", bigChances: 10 },
    ],
    defense: [
      { rank: 1, team: "Saint George", goalsConceded: 8, cleanSheets: 4, tackles: 120, interceptions: 85, blocks: 45 },
      { rank: 2, team: "Fasil Kenema", goalsConceded: 10, cleanSheets: 3, tackles: 110, interceptions: 78, blocks: 40 },
      { rank: 3, team: "Mekelle 70 Enderta", goalsConceded: 12, cleanSheets: 2, tackles: 105, interceptions: 72, blocks: 38 },
      { rank: 4, team: "Dire Dawa City", goalsConceded: 14, cleanSheets: 2, tackles: 98, interceptions: 68, blocks: 35 },
      { rank: 5, team: "Hadiya Hossana", goalsConceded: 15, cleanSheets: 1, tackles: 92, interceptions: 65, blocks: 32 },
      { rank: 6, team: "Bahir Dar Kenema", goalsConceded: 16, cleanSheets: 1, tackles: 85, interceptions: 60, blocks: 30 },
      { rank: 7, team: "Wolaitta Dicha", goalsConceded: 18, cleanSheets: 0, tackles: 80, interceptions: 55, blocks: 28 },
      { rank: 8, team: "Sebeta City", goalsConceded: 20, cleanSheets: 0, tackles: 75, interceptions: 50, blocks: 25 },
    ],
    discipline: [
      { rank: 1, team: "Saint George", yellowCards: 12, redCards: 0, fouls: 85, offsides: 20 },
      { rank: 2, team: "Fasil Kenema", yellowCards: 15, redCards: 1, fouls: 92, offsides: 25 },
      { rank: 3, team: "Mekelle 70 Enderta", yellowCards: 18, redCards: 1, fouls: 98, offsides: 22 },
      { rank: 4, team: "Dire Dawa City", yellowCards: 20, redCards: 2, fouls: 105, offsides: 28 },
      { rank: 5, team: "Hadiya Hossana", yellowCards: 22, redCards: 2, fouls: 110, offsides: 30 },
      { rank: 6, team: "Bahir Dar Kenema", yellowCards: 25, redCards: 3, fouls: 118, offsides: 32 },
      { rank: 7, team: "Wolaitta Dicha", yellowCards: 28, redCards: 3, fouls: 125, offsides: 35 },
      { rank: 8, team: "Sebeta City", yellowCards: 30, redCards: 4, fouls: 132, offsides: 38 },
    ]
  };

  const seasons = [
    { value: "2025/2026", label: "2025/2026" },
    { value: "2024/2025", label: "2024/2025" },
    { value: "2023/2024", label: "2023/2024" },
    { value: "2022/2023", label: "2022/2023" }
  ];

  // const getPlayerStatIcon = (type: string) => {
  //   switch (type) {
  //     case "goals": return <Target className="h-4 w-4" />;
  //     case "assists": return <TrendingUp className="h-4 w-4" />;
  //     case "rating": return <Star className="h-4 w-4" />;
  //     default: return <Activity className="h-4 w-4" />;
  //   }
  // };

  // const getTeamStatIcon = (type: string) => {
  //   switch (type) {
  //     case "attack": return <Target className="h-4 w-4" />;
  //     case "defense": return <Shield className="h-4 w-4" />;
  //     case "discipline": return <Flag className="h-4 w-4" />;
  //     default: return <Activity className="h-4 w-4" />;
  //   }
  // };

  // const getRankColor = (rank: number) => {
  //   if (rank === 1) return "text-primary font-bold";
  //   if (rank <= 3) return "text-primary";
  //   if (rank >= 8) return "text-red-400";
  //   return "text-foreground";
  // };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-primary/30 text-primary";
    if (rank <= 3) return "bg-primary/20 text-primary";
    if (rank >= 8) return "bg-red-900/20 text-red-400";
    return "bg-zinc-700/50";
  };

  return (
    <div className="space-y-6">
      {/* Stats Controls */}
      <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  className="bg-zinc-800/40 border-zinc-700/50 rounded-lg px-4 py-2 pr-10 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                >
                  {seasons.map((season) => (
                    <option key={season.value} value={season.value}>
                      {season.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                className="bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Full
              </Button>
            </div>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Position</label>
                  <select className="w-full bg-zinc-800/40 border-zinc-700/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="all">All Positions</option>
                    <option value="forward">Forwards Only</option>
                    <option value="midfielder">Midfielders Only</option>
                    <option value="defender">Defenders Only</option>
                    <option value="goalkeeper">Goalkeepers Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Team</label>
                  <select className="w-full bg-zinc-800/40 border-zinc-700/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="all">All Teams</option>
                    <option value="saint-george">Saint George</option>
                    <option value="fasil-kenema">Fasil Kenema</option>
                    <option value="mekelle-70-enderta">Mekelle 70 Enderta</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Minimum Matches</label>
                  <select className="w-full bg-zinc-800/40 border-zinc-700/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="all">All Players</option>
                    <option value="5">5+ Matches</option>
                    <option value="10">10+ Matches</option>
                    <option value="15">15+ Matches</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Content */}
      <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30">
        <CardHeader className="pb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-800/30 border-zinc-700/50 p-1 h-auto">
              <TabsTrigger 
                value="player-stats" 
                className="data-[state=active]:bg-zinc-700/50"
              >
                <User className="h-4 w-4 mr-2" />
                Player Stats
              </TabsTrigger>
              <TabsTrigger 
                value="team-stats" 
                className="data-[state=active]:bg-zinc-700/50"
              >
                <Users className="h-4 w-4 mr-2" />
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
                    <TabsList className="grid w-full grid-cols-3 bg-zinc-800/30 border-zinc-700/50 p-1 h-auto">
                      <TabsTrigger 
                        value="goals" 
                        className="data-[state=active]:bg-zinc-700/50"
                      >
                        <Target className="h-4 w-4 mr-2" />
                        Goals
                      </TabsTrigger>
                      <TabsTrigger 
                        value="assists" 
                        className="data-[state=active]:bg-zinc-700/50"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Assists
                      </TabsTrigger>
                      <TabsTrigger 
                        value="rating" 
                        className="data-[state=active]:bg-zinc-700/50"
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
                          <TableCell className="font-medium">{player.name}</TableCell>
                          <TableCell>{player.team}</TableCell>
                          {playerStatType === "goals" && (
                            <>
                              <TableCell className="text-center font-bold">{(player as GoalScorer).goals}</TableCell>
                              <TableCell className="text-center">{(player as GoalScorer).matches}</TableCell>
                              <TableCell className="text-center">{(player as GoalScorer).shots}</TableCell>
                              <TableCell className="text-center">{(player as GoalScorer).accuracy}</TableCell>
                            </>
                          )}
                          {playerStatType === "assists" && (
                            <>
                              <TableCell className="text-center font-bold">{(player as Assister).assists}</TableCell>
                              <TableCell className="text-center">{(player as Assister).goals}</TableCell>
                              <TableCell className="text-center">{(player as Assister).keyPasses}</TableCell>
                              <TableCell className="text-center">{(player as Assister).passAccuracy}</TableCell>
                            </>
                          )}
                          {playerStatType === "rating" && (
                            <>
                              <TableCell className="text-center font-bold">{(player as PlayerRating).rating}</TableCell>
                              <TableCell className="text-center">{(player as PlayerRating).matches}</TableCell>
                              <TableCell className="text-center">{(player as PlayerRating).mom}</TableCell>
                              <TableCell className="text-center">{(player as PlayerRating).avgRating}</TableCell>
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
                    <TabsList className="grid w-full grid-cols-3 bg-zinc-800/30 border-zinc-700/50 p-1 h-auto">
                      <TabsTrigger 
                        value="attack" 
                        className="data-[state=active]:bg-zinc-700/50"
                      >
                        <Target className="h-4 w-4 mr-2" />
                        Attack
                      </TabsTrigger>
                      <TabsTrigger 
                        value="defense" 
                        className="data-[state=active]:bg-zinc-700/50"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Defense
                      </TabsTrigger>
                      <TabsTrigger 
                        value="discipline" 
                        className="data-[state=active]:bg-zinc-700/50"
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
                          <TableCell className="font-medium">{team.team}</TableCell>
                          {teamStatType === "attack" && (
                            <>
                              <TableCell className="text-center font-bold">{(team as TeamAttack).goals}</TableCell>
                              <TableCell className="text-center">{(team as TeamAttack).shots}</TableCell>
                              <TableCell className="text-center">{(team as TeamAttack).shotsOnTarget}</TableCell>
                              <TableCell className="text-center">{(team as TeamAttack).possession}</TableCell>
                              <TableCell className="text-center">{(team as TeamAttack).bigChances}</TableCell>
                            </>
                          )}
                          {teamStatType === "defense" && (
                            <>
                              <TableCell className="text-center font-bold">{(team as TeamDefense).goalsConceded}</TableCell>
                              <TableCell className="text-center">{(team as TeamDefense).cleanSheets}</TableCell>
                              <TableCell className="text-center">{(team as TeamDefense).tackles}</TableCell>
                              <TableCell className="text-center">{(team as TeamDefense).interceptions}</TableCell>
                              <TableCell className="text-center">{(team as TeamDefense).blocks}</TableCell>
                            </>
                          )}
                          {teamStatType === "discipline" && (
                            <>
                              <TableCell className="text-center font-bold">{(team as TeamDiscipline).yellowCards}</TableCell>
                              <TableCell className="text-center">{(team as TeamDiscipline).redCards}</TableCell>
                              <TableCell className="text-center">{(team as TeamDiscipline).fouls}</TableCell>
                              <TableCell className="text-center">{(team as TeamDiscipline).offsides}</TableCell>
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
          className="bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60"
        >
          Load More Stats
        </Button>
      </div>
    </div>
  );
}