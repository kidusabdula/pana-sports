"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, TrendingUp, TrendingDown, Eye, Star, Users, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function TeamsTable() {
  const [sortColumn, setSortColumn] = useState('position');
  const [sortDirection, setSortDirection] = useState('asc');

  // Enhanced teams data with team logos
  const teams = [
    { 
      id: 94787,
      position: 1, 
      team: 'Saint George', 
      logo: "https://img.sofascore.com/api/v1/team/94787/image",
      played: 10, 
      won: 8, 
      drawn: 1, 
      lost: 1, 
      goalsFor: 22, 
      goalsAgainst: 8, 
      goalDifference: 14, 
      points: 25,
      form: ['W', 'W', 'D', 'W', 'W'],
      trend: 'up'
    },
    { 
      id: 273370,
      position: 2, 
      team: 'Fasil Kenema', 
      logo: "https://img.sofascore.com/api/v1/team/273370/image",
      played: 10, 
      won: 7, 
      drawn: 2, 
      lost: 1, 
      goalsFor: 18, 
      goalsAgainst: 9, 
      goalDifference: 9, 
      points: 23,
      form: ['W', 'D', 'W', 'W', 'L'],
      trend: 'up'
    },
    { 
      id: 274479,
      position: 3, 
      team: 'Mekelle 70 Enderta', 
      logo: "https://img.sofascore.com/api/v1/team/274479/image",
      played: 10, 
      won: 6, 
      drawn: 3, 
      lost: 1, 
      goalsFor: 16, 
      goalsAgainst: 10, 
      goalDifference: 6, 
      points: 21,
      form: ['W', 'W', 'D', 'D', 'W'],
      trend: 'up'
    },
    { 
      id: 237728,
      position: 4, 
      team: 'Dire Dawa City', 
      logo: "https://img.sofascore.com/api/v1/team/237728/image",
      played: 10, 
      won: 6, 
      drawn: 1, 
      lost: 3, 
      goalsFor: 14, 
      goalsAgainst: 11, 
      goalDifference: 3, 
      points: 19,
      form: ['L', 'W', 'W', 'L', 'W'],
      trend: 'down'
    },
    { 
      id: 315378,
      position: 5, 
      team: 'Hawassa Kenema', 
      logo: "https://img.sofascore.com/api/v1/team/315378/image",
      played: 10, 
      won: 5, 
      drawn: 2, 
      lost: 3, 
      goalsFor: 13, 
      goalsAgainst: 12, 
      goalDifference: 1, 
      points: 17,
      form: ['D', 'L', 'W', 'W', 'L'],
      trend: 'down'
    },
    { 
      id: 317333,
      position: 6, 
      team: 'Bahir Dar Kenema', 
      logo: "https://img.sofascore.com/api/v1/team/317333/image",
      played: 10, 
      won: 4, 
      drawn: 3, 
      lost: 3, 
      goalsFor: 12, 
      goalsAgainst: 11, 
      goalDifference: 1, 
      points: 15,
      form: ['W', 'L', 'D', 'W', 'L'],
      trend: 'up'
    },
    { 
      id: 277540,
      position: 7, 
      team: 'Wolaitta Dicha', 
      logo: "https://img.sofascore.com/api/v1/team/277540/image",
      played: 10, 
      won: 4, 
      drawn: 2, 
      lost: 4, 
      goalsFor: 11, 
      goalsAgainst: 13, 
      goalDifference: -2, 
      points: 14,
      form: ['L', 'D', 'L', 'W', 'D'],
      trend: 'down'
    },
    { 
      id: 258167,
      position: 8, 
      team: 'Sebeta City', 
      logo: "https://img.sofascore.com/api/v1/team/258167/image",
      played: 10, 
      won: 3, 
      drawn: 3, 
      lost: 4, 
      goalsFor: 10, 
      goalsAgainst: 14, 
      goalDifference: -4, 
      points: 12,
      form: ['D', 'W', 'L', 'D', 'L'],
      trend: 'down'
    },
    { 
      id: 241957,
      position: 9, 
      team: 'Ethiopia Bunna', 
      logo: "https://img.sofascore.com/api/v1/team/241957/image",
      played: 10, 
      won: 3, 
      drawn: 2, 
      lost: 5, 
      goalsFor: 9, 
      goalsAgainst: 15, 
      goalDifference: -6, 
      points: 11,
      form: ['L', 'L', 'W', 'D', 'W'],
      trend: 'up'
    },
    { 
      id: 1014936,
      position: 10, 
      team: 'Jimma Aba Jifar', 
      logo: "https://img.sofascore.com/api/v1/team/1014936/image",
      played: 10, 
      won: 2, 
      drawn: 3, 
      lost: 5, 
      goalsFor: 8, 
      goalsAgainst: 13, 
      goalDifference: -5, 
      points: 9,
      form: ['L', 'D', 'W', 'L', 'L'],
      trend: 'down'
    }
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
      case 'W': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'D': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'L': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50';
    }
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-primary font-bold';
    if (position >= 8) return 'text-red-400';
    return 'text-white';
  };

  const getPositionBadgeColor = (position: number) => {
    if (position <= 3) return 'bg-primary/20 text-primary border-primary/30';
    if (position >= 8) return 'bg-red-900/20 text-red-400 border-red-800/30';
    return 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50';
  };

  return (
    <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden h-full">
      <CardHeader className="pb-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center gap-3">
            <Trophy className="h-5 w-5 text-primary" />
            League Table
          </CardTitle>
          <Button variant="outline" className="bg-zinc-800/40 border-white/5 hover:bg-zinc-800/60 text-zinc-300 hover:text-white">
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
                  className="cursor-pointer hover:bg-zinc-700/50 transition-colors text-zinc-400"
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
                  className="cursor-pointer hover:bg-zinc-700/50 transition-colors text-zinc-400"
                  onClick={() => handleSort('team')}
                >
                  <div className="flex items-center gap-1">
                    Team
                    {sortColumn === 'team' && (
                      sortDirection === 'asc' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-center text-zinc-400">P</TableHead>
                <TableHead className="text-center text-zinc-400">W</TableHead>
                <TableHead className="text-center text-zinc-400">D</TableHead>
                <TableHead className="text-center text-zinc-400">L</TableHead>
                <TableHead className="text-center text-zinc-400">GF</TableHead>
                <TableHead className="text-center text-zinc-400">GA</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-zinc-700/50 transition-colors text-center text-zinc-400"
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
                  className="cursor-pointer hover:bg-zinc-700/50 transition-colors text-center text-zinc-400"
                  onClick={() => handleSort('points')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Pts
                    {sortColumn === 'points' && (
                      sortDirection === 'asc' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-center text-zinc-400">Form</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTeams.map((team) => (
                <TableRow key={team.position} className="hover:bg-zinc-800/30 transition-colors border-b border-white/5 last:border-0">
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
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden ring-2 ring-white/10">
                        <Image
                          src={team.logo}
                          alt={team.team}
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-white">{team.team}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-zinc-300">{team.played}</TableCell>
                  <TableCell className="text-center text-zinc-300">{team.won}</TableCell>
                  <TableCell className="text-center text-zinc-300">{team.drawn}</TableCell>
                  <TableCell className="text-center text-zinc-300">{team.lost}</TableCell>
                  <TableCell className="text-center text-zinc-300">{team.goalsFor}</TableCell>
                  <TableCell className="text-center text-zinc-300">{team.goalsAgainst}</TableCell>
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
                          className={`w-6 h-6 p-0 flex items-center justify-center text-xs border ${getFormColor(result)}`}
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