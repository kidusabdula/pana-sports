// components/shared/LeagueStandings.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Trophy, TrendingUp, TrendingDown } from 'lucide-react';

export default function LeagueStandings() {
  const [currentLeagueIndex, setCurrentLeagueIndex] = useState(0);
  
  const leagues = [
    {
      name: "Premier League",
      teams: [
        { team: 'Saint George', played: 10, goalDiff: 12, points: 28, position: 1, trend: 'up' },
        { team: 'Fasil Kenema', played: 10, goalDiff: 8, points: 25, position: 2, trend: 'up' },
        { team: 'Mekelle 70 Enderta', played: 10, goalDiff: 5, points: 23, position: 3, trend: 'down' },
        { team: 'Dire Dawa City', played: 10, goalDiff: 3, points: 20, position: 4, trend: 'up' },
        { team: 'Hadiya Hossana', played: 10, goalDiff: 2, points: 18, position: 5, trend: 'down' },
      ]
    },
    {
      name: "Higher League",
      teams: [
        { team: 'Ethiopia Bunna', played: 10, goalDiff: 7, points: 22, position: 1, trend: 'up' },
        { team: 'Jimma Aba Jifar', played: 10, goalDiff: 5, points: 20, position: 2, trend: 'up' },
        { team: 'Welwalo Adigrat', played: 10, goalDiff: 3, points: 18, position: 3, trend: 'down' },
        { team: 'Arba Minch Ketema', played: 10, goalDiff: 2, points: 16, position: 4, trend: 'up' },
        { team: 'Shashemene City', played: 10, goalDiff: 1, points: 14, position: 5, trend: 'down' },
      ]
    },
    {
      name: "League One",
      teams: [
        { team: 'Wolkite Ketema', played: 10, goalDiff: 9, points: 24, position: 1, trend: 'up' },
        { team: 'Bahir Dar Kenema', played: 10, goalDiff: 6, points: 21, position: 2, trend: 'up' },
        { team: 'Wolaitta Dicha', played: 10, goalDiff: 4, points: 19, position: 3, trend: 'down' },
        { team: 'Sebeta City', played: 10, goalDiff: 2, points: 17, position: 4, trend: 'up' },
        { team: 'Mekelle 70 Enderta B', played: 10, goalDiff: 1, points: 15, position: 5, trend: 'down' },
      ]
    }
  ];

  const currentLeague = leagues[currentLeagueIndex];

  const handlePreviousLeague = () => {
    setCurrentLeagueIndex((prev) => (prev === 0 ? leagues.length - 1 : prev - 1));
  };

  const handleNextLeague = () => {
    setCurrentLeagueIndex((prev) => (prev === leagues.length - 1 ? 0 : prev + 1));
  };

  return (
    <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-pana-gradient flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            League Standings
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary" 
              onClick={handlePreviousLeague}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary" 
              onClick={handleNextLeague}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">{currentLeague.name}</div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="bg-zinc-800/30 rounded-lg p-2">
          <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground mb-1">
            <div>Pos</div>
            <div>Team</div>
            <div className="text-center">GD</div>
            <div className="text-center">Pts</div>
          </div>
          
          {currentLeague.teams.map((team) => (
            <div key={team.position} className="grid grid-cols-4 gap-2 text-xs py-1.5 border-b border-zinc-700/30 last:border-0">
              <div className="flex items-center gap-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  team.position === 1 ? 'bg-primary/30' : 'bg-zinc-700/50'
                }`}>
                  {team.position}
                </div>
                {team.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
              </div>
              <div className="truncate">{team.team}</div>
              <div className="text-center">{team.goalDiff > 0 ? '+' : ''}{team.goalDiff}</div>
              <div className="text-center font-medium">{team.points}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-1 mt-2">
          {leagues.map((_, index) => (
            <div 
              key={index}
              className={`h-1.5 w-1.5 rounded-full ${
                index === currentLeagueIndex ? 'bg-primary' : 'bg-zinc-700'
              }`}
            />
          ))}
        </div>

        <Button variant="outline" className="w-full bg-zinc-800/30 border-zinc-700/30 hover:bg-zinc-800/50">
          View Full Table
        </Button>
      </CardContent>
    </Card>
  );
}