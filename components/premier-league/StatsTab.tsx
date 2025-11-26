// components/premier-league/StatsTab.tsx
"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTopScorersByLeagueSlug } from '@/lib/data/topScorers';
import { getPlayersByLeagueSlug } from '@/lib/data/players';
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

export default function StatsTab({ initialTopScorers = [], initialPlayers = [], leagueSlug = 'premier-league' }: { initialTopScorers?: any[]; initialPlayers?: any[]; leagueSlug?: string }) {
  const [activeTab, setActiveTab] = useState("player-stats");
  const [playerStatType, setPlayerStatType] = useState("goals");
  const [teamStatType, setTeamStatType] = useState("attack");
  const [selectedSeason, setSelectedSeason] = useState("2025/2026");
  const [showFilters, setShowFilters] = useState(false);
  const topScorersQuery = useQuery({ queryKey: ['top-scorers', leagueSlug], queryFn: () => getTopScorersByLeagueSlug(leagueSlug), initialData: initialTopScorers })
  const playersQuery = useQuery({ queryKey: ['players', leagueSlug], queryFn: () => getPlayersByLeagueSlug(leagueSlug), initialData: initialPlayers })

  const topScorers = (topScorersQuery.data || [])
  const players = (playersQuery.data || [])
  const playerStats: { goals: GoalScorer[]; assists: Assister[]; rating: PlayerRating[] } = {
    goals: topScorers.map((t: any, i: number) => ({
      rank: i + 1,
      name: t.player_slug,
      team: t.team_slug,
      goals: t.goals,
      matches: 0,
      assists: t.assists ?? 0,
      shots: 0,
      accuracy: "",
    })),
    assists: players
      .map((p: any) => ({
        rank: 0,
        name: p.name_en,
        team: p.team_slug,
        assists: Number(p.stats?.assists ?? 0),
        matches: 0,
        goals: Number(p.stats?.goals ?? 0),
        keyPasses: Number(p.stats?.key_passes ?? 0),
        passAccuracy: String(p.stats?.pass_accuracy ?? ""),
      }))
      .sort((a: any, b: any) => b.assists - a.assists)
      .map((p: any, i: number) => ({ ...p, rank: i + 1 })),
    rating: players
      .map((p: any) => ({
        rank: 0,
        name: p.name_en,
        team: p.team_slug,
        rating: Number(p.stats?.rating ?? 0),
        matches: 0,
        mom: Number(p.stats?.mom ?? 0),
        avgRating: Number(p.stats?.avg_rating ?? 0),
      }))
      .sort((a: any, b: any) => b.rating - a.rating)
      .map((p: any, i: number) => ({ ...p, rank: i + 1 })),
  }

  const teamAttackMap = topScorers
    .reduce((acc: any, t: any) => {
      acc[t.team_slug] = (acc[t.team_slug] || 0) + Number(t.goals || 0)
      return acc
    }, {})
  const teamIds = Array.from(new Set([ ...Object.keys(teamAttackMap), ...players.map((p: any) => p.team_slug) ]))
  const attackRows: TeamAttack[] = Object.entries(teamAttackMap)
    .map(([team, goals]: any, i: number) => ({ rank: i + 1, team, goals, shots: 0, shotsOnTarget: 0, possession: "", bigChances: 0 }))
    .sort((a, b) => b.goals - a.goals)
    .map((row, i) => ({ ...row, rank: i + 1 }))
  const defenseRows: TeamDefense[] = teamIds.map((team, i) => ({ rank: i + 1, team, goalsConceded: 0, cleanSheets: 0, tackles: 0, interceptions: 0, blocks: 0 }))
  const disciplineRows: TeamDiscipline[] = teamIds.map((team, i) => ({ rank: i + 1, team, yellowCards: 0, redCards: 0, fouls: 0, offsides: 0 }))

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
                      {(teamStatType === 'attack' ? attackRows : teamStatType === 'defense' ? defenseRows : disciplineRows).map((team, index) => (
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