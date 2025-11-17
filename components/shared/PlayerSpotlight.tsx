// components/shared/PlayerSpotlight.tsx
"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Target, Calendar, Heart } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function PlayerSpotlight() {
  const [isFavorite, setIsFavorite] = useState(false);

  const player = {
    name: "Getaneh Kebede",
    team: "Saint George",
    position: "Forward",
    age: 28,
    height: "1.78m",
    nationality: "Ethiopian",
    photo: "/placeholder.svg",
    stats: {
      goals: 8,
      assists: 3,
      matches: 10,
      rating: 8.5
    },
    recentPerformance: [
      { opponent: "Fasil Kenema", goals: 2, assists: 0, result: "W 2-1" },
      { opponent: "Mekelle 70 Enderta", goals: 1, assists: 1, result: "D 2-2" },
      { opponent: "Dire Dawa City", goals: 0, assists: 1, result: "W 1-0" },
    ]
  };

  return (
    <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30 overflow-hidden group hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          Player Spotlight
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <Image
              src={player.photo}
              alt={player.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{player.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-lg transition-all duration-300",
                  isFavorite 
                    ? "text-red-500 bg-red-500/10 hover:bg-red-500/20" 
                    : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                )}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={cn("h-4 w-4 transition-all", isFavorite && "fill-current")} />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">{player.team}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-zinc-700/50 text-zinc-300 border-zinc-600/50 text-xs">
                {player.position}
              </Badge>
              <Badge variant="outline" className="bg-zinc-700/50 border-zinc-600/50 text-xs">
                {player.age} years
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-800/30 rounded-lg p-3 text-center hover:bg-zinc-800/40 transition-colors">
            <div className="flex items-center justify-center gap-1 text-primary">
              <Target className="h-4 w-4" />
              <span className="text-lg font-bold">{player.stats.goals}</span>
            </div>
            <div className="text-xs text-muted-foreground">Goals</div>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-3 text-center hover:bg-zinc-800/40 transition-colors">
            <div className="flex items-center justify-center gap-1 text-primary">
              <TrendingUp className="h-4 w-4" />
              <span className="text-lg font-bold">{player.stats.assists}</span>
            </div>
            <div className="text-xs text-muted-foreground">Assists</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Recent Performance</h4>
          <div className="space-y-2">
            {player.recentPerformance.map((match, index) => (
              <div key={index} className="bg-zinc-800/30 rounded-lg p-3 hover:bg-zinc-800/40 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">{match.opponent}</div>
                  <div className={`text-xs px-1.5 py-0.5 rounded ${
                    match.result.startsWith('W') ? 'bg-green-900/20 text-green-500' : 
                    match.result.startsWith('D') ? 'bg-yellow-900/20 text-yellow-500' : 
                    'bg-red-900/20 text-red-500'
                  }`}>
                    {match.result}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    <span>{match.goals} Goals</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{match.assists} Assists</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button variant="outline" className="w-full bg-zinc-800/30 border-zinc-700/30 hover:bg-zinc-800/50 group">
          View Full Profile
          <TrendingUp className="ml-2 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
}