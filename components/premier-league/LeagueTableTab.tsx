// components/premier-league/LeagueTableTab.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, TrendingUp, TrendingDown, Eye, Filter, Download, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LeagueTableTab() {
  const [activeTab, setActiveTab] = useState("full-table");
  const [selectedSeason, setSelectedSeason] = useState("2025/2026");
  const [showFilters, setShowFilters] = useState(false);
  const [sortColumn, setSortColumn] = useState('position');
  const [sortDirection, setSortDirection] = useState('asc');

  // Sample teams data
  const teams = [
    { 
      position: 1, 
      team: 'Saint George', 
      played: 10, 
      won: 8, 
      drawn: 1, 
      lost: 1, 
      goalsFor: 22, 
      goalsAgainst: 8, 
      goalDifference: 14, 
      points: 25,
      form: ['W', 'W', 'D', 'W', 'W'],
      trend: 'up',
      homePlayed: 5,
      homeWon: 4,
      homeDrawn: 1,
      homeLost: 0,
      awayPlayed: 5,
      awayWon: 4,
      awayDrawn: 0,
      awayLost: 1
    },
    { 
      position: 2, 
      team: 'Fasil Kenema', 
      played: 10, 
      won: 7, 
      drawn: 2, 
      lost: 1, 
      goalsFor: 18, 
      goalsAgainst: 9, 
      goalDifference: 9, 
      points: 23,
      form: ['W', 'D', 'W', 'W', 'L'],
      trend: 'up',
      homePlayed: 5,
      homeWon: 3,
      homeDrawn: 1,
      homeLost: 1,
      awayPlayed: 5,
      awayWon: 4,
      awayDrawn: 1,
      awayLost: 0
    },
    { 
      position: 3, 
      team: 'Mekelle 70 Enderta', 
      played: 10, 
      won: 6, 
      drawn: 3, 
      lost: 1, 
      goalsFor: 16, 
      goalsAgainst: 10, 
      goalDifference: 6, 
      points: 21,
      form: ['W', 'W', 'D', 'D', 'W'],
      trend: 'up',
      homePlayed: 5,
      homeWon: 4,
      homeDrawn: 1,
      homeLost: 0,
      awayPlayed: 5,
      awayWon: 2,
      awayDrawn: 2,
      awayLost: 1
    },
    { 
      position: 4, 
      team: 'Dire Dawa City', 
      played: 10, 
      won: 6, 
      drawn: 1, 
      lost: 3, 
      goalsFor: 14, 
      goalsAgainst: 11, 
      goalDifference: 3, 
      points: 19,
      form: ['L', 'W', 'W', 'L', 'W'],
      trend: 'down',
      homePlayed: 5,
      homeWon: 3,
      homeDrawn: 0,
      homeLost: 2,
      awayPlayed: 5,
      awayWon: 3,
      awayDrawn: 1,
      awayLost: 1
    },
    { 
      position: 5, 
      team: 'Hadiya Hossana', 
      played: 10, 
      won: 5, 
      drawn: 2, 
      lost: 3, 
      goalsFor: 13, 
      goalsAgainst: 12, 
      goalDifference: 1, 
      points: 17,
      form: ['D', 'L', 'W', 'W', 'L'],
      trend: 'down',
      homePlayed: 5,
      homeWon: 2,
      homeDrawn: 1,
      homeLost: 2,
      awayPlayed: 5,
      awayWon: 3,
      awayDrawn: 1,
      awayLost: 1
    },
    { 
      position: 6, 
      team: 'Bahir Dar Kenema', 
      played: 10, 
      won: 4, 
      drawn: 3, 
      lost: 3, 
      goalsFor: 12, 
      goalsAgainst: 11, 
      goalDifference: 1, 
      points: 15,
      form: ['W', 'L', 'D', 'W', 'L'],
      trend: 'up',
      homePlayed: 5,
      homeWon: 2,
      homeDrawn: 2,
      homeLost: 1,
      awayPlayed: 5,
      awayWon: 2,
      awayDrawn: 1,
      awayLost: 2
    },
    { 
      position: 7, 
      team: 'Wolaitta Dicha', 
      played: 10, 
      won: 4, 
      drawn: 2, 
      lost: 4, 
      goalsFor: 11, 
      goalsAgainst: 13, 
      goalDifference: -2, 
      points: 14,
      form: ['L', 'D', 'L', 'W', 'D'],
      trend: 'down',
      homePlayed: 5,
      homeWon: 2,
      homeDrawn: 1,
      homeLost: 2,
      awayPlayed: 5,
      awayWon: 2,
      awayDrawn: 1,
      awayLost: 2
    },
    { 
      position: 8, 
      team: 'Sebeta City', 
      played: 10, 
      won: 3, 
      drawn: 3, 
      lost: 4, 
      goalsFor: 10, 
      goalsAgainst: 14, 
      goalDifference: -4, 
      points: 12,
      form: ['D', 'W', 'L', 'D', 'L'],
      trend: 'down',
      homePlayed: 5,
      homeWon: 1,
      homeDrawn: 2,
      homeLost: 2,
      awayPlayed: 5,
      awayWon: 2,
      awayDrawn: 1,
      awayLost: 2
    },
    { 
      position: 9, 
      team: 'Ethiopia Bunna', 
      played: 10, 
      won: 3, 
      drawn: 2, 
      lost: 5, 
      goalsFor: 9, 
      goalsAgainst: 15, 
      goalDifference: -6, 
      points: 11,
      form: ['L', 'L', 'W', 'D', 'W'],
      trend: 'up',
      homePlayed: 5,
      homeWon: 2,
      homeDrawn: 1,
      homeLost: 2,
      awayPlayed: 5,
      awayWon: 1,
      awayDrawn: 1,
      awayLost: 3
    },
    { 
      position: 10, 
      team: 'Jimma Aba Jifar', 
      played: 10, 
      won: 2, 
      drawn: 3, 
      lost: 5, 
      goalsFor: 8, 
      goalsAgainst: 13, 
      goalDifference: -5, 
      points: 9,
      form: ['L', 'D', 'W', 'L', 'L'],
      trend: 'down',
      homePlayed: 5,
      homeWon: 1,
      homeDrawn: 2,
      homeLost: 2,
      awayPlayed: 5,
      awayWon: 1,
      awayDrawn: 1,
      awayLost: 3
    },
    { 
      position: 11, 
      team: 'Welwalo Adigrat', 
      played: 10, 
      won: 1, 
      drawn: 3, 
      lost: 6, 
      goalsFor: 7, 
      goalsAgainst: 16, 
      goalDifference: -9, 
      points: 6,
      form: ['L', 'W', 'D', 'L', 'D'],
      trend: 'up',
      homePlayed: 5,
      homeWon: 1,
      homeDrawn: 1,
      homeLost: 3,
      awayPlayed: 5,
      awayWon: 0,
      awayDrawn: 2,
      awayLost: 3
    },
    { 
      position: 12, 
      team: 'Arba Minch Ketema', 
      played: 10, 
      won: 1, 
      drawn: 2, 
      lost: 7, 
      goalsFor: 6, 
      goalsAgainst: 18, 
      goalDifference: -12, 
      points: 5,
      form: ['L', 'D', 'L', 'W', 'L'],
      trend: 'down',
      homePlayed: 5,
      homeWon: 1,
      homeDrawn: 1,
      homeLost: 3,
      awayPlayed: 5,
      awayWon: 0,
      awayDrawn: 1,
      awayLost: 4
    }
  ];

  const seasons = [
    { value: "2025/2026", label: "2025/2026" },
    { value: "2024/2025", label: "2024/2025" },
    { value: "2023/2024", label: "2023/2024" },
    { value: "2022/2023", label: "2022/2023" }
  ];

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedTeams = [...teams].sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a];
    const bValue = b[sortColumn as keyof typeof b];
    
    if (typeof aValue === 'string') {
      return sortDirection === 'asc' 
        ? (aValue as string).localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue as string);
    }
    
    if (typeof aValue === 'number') {
      return sortDirection === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }
    
    return 0;
  });

  const getFormColor = (result: string) => {
    switch (result) {
      case 'W': return 'bg-green-500/20 text-green-400';
      case 'D': return 'bg-yellow-500/20 text-yellow-400';
      case 'L': return 'bg-red-500/20 text-red-400';
      default: return 'bg-zinc-700/50 text-muted-foreground';
    }
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-primary font-bold';
    if (position >= 10) return 'text-red-400';
    return 'text-foreground';
  };

  const getPositionBadgeColor = (position: number) => {
    if (position <= 3) return 'bg-primary/30 text-primary';
    if (position >= 10) return 'bg-red-900/20 text-red-400';
    return 'bg-zinc-700/50';
  };

  return (
    <div className="space-y-6">
      {/* Table Controls */}
      <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Left Controls */}
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
            
            {/* Right Controls */}
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
                  <label className="text-sm font-medium text-foreground mb-2 block">Team Type</label>
                  <select className="w-full bg-zinc-800/40 border-zinc-700/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="all">All Teams</option>
                    <option value="home">Home Teams Only</option>
                    <option value="away">Away Teams Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Form Period</label>
                  <select className="w-full bg-zinc-800/40 border-zinc-700/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="5">Last 5 Games</option>
                    <option value="3">Last 3 Games</option>
                    <option value="1">Last Game</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Competition</label>
                  <select className="w-full bg-zinc-800/40 border-zinc-700/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="all">All Competitions</option>
                    <option value="league">League Only</option>
                    <option value="cup">Cup Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table Content */}
      <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30">
        <CardHeader className="pb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-zinc-800/30 border-zinc-700/50 p-1 h-auto">
              <TabsTrigger 
                value="full-table" 
                className="data-[state=active]:bg-zinc-700/50"
              >
                Full Table
              </TabsTrigger>
              <TabsTrigger 
                value="home" 
                className="data-[state=active]:bg-zinc-700/50"
              >
                Home Table
              </TabsTrigger>
              <TabsTrigger 
                value="away" 
                className="data-[state=active]:bg-zinc-700/50"
              >
                Away Table
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Full Table Tab */}
            <TabsContent value="full-table" className="mt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-zinc-800/40">
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-zinc-700/50 transition-colors"
                        onClick={() => handleSort('position')}
                      >
                        <div className="flex items-center gap-1">
                          Pos
                          {sortColumn === 'position' && (
                            sortDirection === 'asc' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-zinc-700/50 transition-colors"
                        onClick={() => handleSort('team')}
                      >
                        <div className="flex items-center gap-1">
                          Team
                          {sortColumn === 'team' && (
                            sortDirection === 'asc' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-center">P</TableHead>
                      <TableHead className="text-center">W</TableHead>
                      <TableHead className="text-center">D</TableHead>
                      <TableHead className="text-center">L</TableHead>
                      <TableHead className="text-center">GF</TableHead>
                      <TableHead className="text-center">GA</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-zinc-700/50 transition-colors text-center"
                        onClick={() => handleSort('goalDifference')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          GD
                          {sortColumn === 'goalDifference' && (
                            sortDirection === 'asc' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-zinc-700/50 transition-colors text-center"
                        onClick={() => handleSort('points')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          Pts
                          {sortColumn === 'points' && (
                            sortDirection === 'asc' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-center">Form</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTeams.map((team) => (
                      <TableRow key={team.position} className="hover:bg-zinc-800/30 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getPositionBadgeColor(team.position)}`}>
                              {team.position}
                            </div>
                            {team.trend === 'up' ? (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{team.team}</TableCell>
                        <TableCell className="text-center">{team.played}</TableCell>
                        <TableCell className="text-center">{team.won}</TableCell>
                        <TableCell className="text-center">{team.drawn}</TableCell>
                        <TableCell className="text-center">{team.lost}</TableCell>
                        <TableCell className="text-center">{team.goalsFor}</TableCell>
                        <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                        <TableCell className={`text-center font-medium ${getPositionColor(team.position)}`}>
                          {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                        </TableCell>
                        <TableCell className={`text-center font-bold ${getPositionColor(team.position)}`}>
                          {team.points}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            {team.form.map((result, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className={`w-6 h-6 p-0 flex items-center justify-center text-xs ${getFormColor(result)}`}
                              >
                                {result}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Home Table Tab */}
            <TabsContent value="home" className="mt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-zinc-800/40">
                    <TableRow>
                      <TableHead>Pos</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-center">P</TableHead>
                      <TableHead className="text-center">W</TableHead>
                      <TableHead className="text-center">D</TableHead>
                      <TableHead className="text-center">L</TableHead>
                      <TableHead className="text-center">GF</TableHead>
                      <TableHead className="text-center">GA</TableHead>
                      <TableHead className="text-center">GD</TableHead>
                      <TableHead className="text-center">Pts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTeams.map((team) => (
                      <TableRow key={team.position} className="hover:bg-zinc-800/30 transition-colors">
                        <TableCell className="font-medium">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getPositionBadgeColor(team.position)}`}>
                            {team.position}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{team.team}</TableCell>
                        <TableCell className="text-center">{team.homePlayed}</TableCell>
                        <TableCell className="text-center">{team.homeWon}</TableCell>
                        <TableCell className="text-center">{team.homeDrawn}</TableCell>
                        <TableCell className="text-center">{team.homeLost}</TableCell>
                        <TableCell className="text-center">{team.goalsFor}</TableCell>
                        <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                        <TableCell className="text-center font-medium">
                          {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {team.points}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Away Table Tab */}
            <TabsContent value="away" className="mt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-zinc-800/40">
                    <TableRow>
                      <TableHead>Pos</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-center">P</TableHead>
                      <TableHead className="text-center">W</TableHead>
                      <TableHead className="text-center">D</TableHead>
                      <TableHead className="text-center">L</TableHead>
                      <TableHead className="text-center">GF</TableHead>
                      <TableHead className="text-center">GA</TableHead>
                      <TableHead className="text-center">GD</TableHead>
                      <TableHead className="text-center">Pts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTeams.map((team) => (
                      <TableRow key={team.position} className="hover:bg-zinc-800/30 transition-colors">
                        <TableCell className="font-medium">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getPositionBadgeColor(team.position)}`}>
                            {team.position}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{team.team}</TableCell>
                        <TableCell className="text-center">{team.awayPlayed}</TableCell>
                        <TableCell className="text-center">{team.awayWon}</TableCell>
                        <TableCell className="text-center">{team.awayDrawn}</TableCell>
                        <TableCell className="text-center">{team.awayLost}</TableCell>
                        <TableCell className="text-center">{team.goalsFor}</TableCell>
                        <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                        <TableCell className="text-center font-medium">
                          {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {team.points}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary/30 rounded-full"></div>
              <span className="text-muted-foreground">Champions League</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500/20 rounded-full"></div>
              <span className="text-muted-foreground">Win</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500/20 rounded-full"></div>
              <span className="text-muted-foreground">Draw</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500/20 rounded-full"></div>
              <span className="text-muted-foreground">Loss</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-900/20 rounded-full"></div>
              <span className="text-muted-foreground">Relegation Zone</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}