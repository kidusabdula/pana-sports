// components/premier-league/TeamsTable.tsx
"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStandingsByLeagueSlug } from '@/lib/data/standings';
import { getTeamsByLeagueSlug } from '@/lib/data/teams';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TeamsTable({ initialStandings = [], initialTeams = [], leagueSlug = 'premier-league' }: { initialStandings?: any[]; initialTeams?: any[]; leagueSlug?: string }) {
  const [sortColumn, setSortColumn] = useState('position');
  const [sortDirection, setSortDirection] = useState('asc');
  const standingsQuery = useQuery({ queryKey: ['standings', leagueSlug], queryFn: () => getStandingsByLeagueSlug(leagueSlug), initialData: initialStandings })
  const teamsQuery = useQuery({ queryKey: ['teams', leagueSlug], queryFn: () => getTeamsByLeagueSlug(leagueSlug), initialData: initialTeams })

  const teams = (standingsQuery.data || []).map((s: any) => {
    const t = (teamsQuery.data || []).find((tt: any) => tt.slug === s.team_slug)
    return {
      position: s.rank,
      team: t?.name_en || s.team_slug,
      played: s.played,
      won: s.won,
      drawn: s.drawn,
      lost: s.lost,
      goalsFor: s.goals_for,
      goalsAgainst: s.goals_against,
      goalDifference: s.gd,
      points: s.points,
      form: [],
      trend: 'up',
    }
  })

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
    if (position >= 8) return 'text-red-400';
    return 'text-foreground';
  };

  return (
    <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30 h-full p-6">
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-foreground flex items-center gap-3">
            <Trophy className="h-5 w-5 text-primary" />
            League Table
          </CardTitle>
          <Button variant="outline" className="bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60">
            <Eye className="h-4 w-4 mr-2" />
            View Full Table
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
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
                  className="cursor-pointer hover:bg-zinc-700/50 transition-colors"
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
                  className="cursor-pointer hover:bg-zinc-700/50 transition-colors"
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
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        team.position <= 3 ? 'bg-primary/30' : team.position >= 8 ? 'bg-red-900/20' : 'bg-zinc-700/50'
                      }`}>
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
      </CardContent>
    </Card>
  );
}