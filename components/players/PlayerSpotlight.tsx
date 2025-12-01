"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Target, Calendar, Heart, Trophy, User } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function PlayerSpotlight() {
  const [isFavorite, setIsFavorite] = useState(false);

  const player = {
    id: 1381823,
    name: "Getaneh Kebede",
    team: "Saint George",
    position: "Forward",
    age: 28,
    height: "1.78m",
    nationality: "Ethiopian",
    photo: "https://img.sofascore.com/api/v1/player/1381823/image",
    teamLogo: "https://img.sofascore.com/api/v1/team/94787/image",
    stats: {
      goals: 12,
      assists: 3,
      matches: 10,
      rating: 8.5,
      yellowCards: 2,
      redCards: 0
    },
    recentPerformance: [
      { opponent: "Fasil Kenema", opponentLogo: "https://img.sofascore.com/api/v1/team/273370/image", goals: 2, assists: 0, result: "W 2-1", date: "2023-12-10" },
      { opponent: "Mekelle 70 Enderta", opponentLogo: "https://img.sofascore.com/api/v1/team/274479/image", goals: 1, assists: 1, result: "D 2-2", date: "2023-12-03" },
      { opponent: "Dire Dawa City", opponentLogo: "https://img.sofascore.com/api/v1/team/237728/image", goals: 0, assists: 1, result: "W 1-0", date: "2023-11-26" },
    ]
  };

  const getResultColor = (result: string) => {
    if (result.startsWith('W')) return 'bg-green-900/20 text-green-500 border-green-800/30';
    if (result.startsWith('D')) return 'bg-yellow-900/20 text-yellow-500 border-yellow-800/30';
    return 'bg-red-900/20 text-red-500 border-red-800/30';
  };

  return (
    <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden group hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
      <CardHeader className="pb-3 border-b border-white/5">
        <CardTitle className="text-lg bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Player Spotlight
          </div>
          <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary text-[10px]">
            TOP SCORER
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/10">
            <Image
              src={player.photo}
              alt={player.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">{player.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-lg transition-all duration-300",
                  isFavorite 
                    ? "text-red-500 bg-red-500/10 hover:bg-red-500/20" 
                    : "text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
                )}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={cn("h-4 w-4 transition-all", isFavorite && "fill-current")} />
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 text-sm text-zinc-400">
                <div className="w-4 h-4 rounded-full overflow-hidden">
                  <Image
                    src={player.teamLogo}
                    alt={player.team}
                    width={16}
                    height={16}
                    className="object-cover"
                  />
                </div>
                <span>{player.team}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-zinc-800/50 text-zinc-300 border-zinc-700/50 text-xs">
                {player.position}
              </Badge>
              <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700/50 text-xs text-zinc-400">
                {player.age} years
              </Badge>
              <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700/50 text-xs text-zinc-400">
                {player.height}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-zinc-800/40 rounded-lg p-3 text-center hover:bg-zinc-800/60 transition-colors border border-white/5">
            <div className="flex items-center justify-center gap-1 text-primary">
              <Target className="h-4 w-4" />
              <span className="text-lg font-bold">{player.stats.goals}</span>
            </div>
            <div className="text-xs text-zinc-400">Goals</div>
          </div>
          <div className="bg-zinc-800/40 rounded-lg p-3 text-center hover:bg-zinc-800/60 transition-colors border border-white/5">
            <div className="flex items-center justify-center gap-1 text-primary">
              <TrendingUp className="h-4 w-4" />
              <span className="text-lg font-bold">{player.stats.assists}</span>
            </div>
            <div className="text-xs text-zinc-400">Assists</div>
          </div>
          <div className="bg-zinc-800/40 rounded-lg p-3 text-center hover:bg-zinc-800/60 transition-colors border border-white/5">
            <div className="flex items-center justify-center gap-1 text-primary">
              <Trophy className="h-4 w-4" />
              <span className="text-lg font-bold">{player.stats.rating}</span>
            </div>
            <div className="text-xs text-zinc-400">Rating</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            Recent Performance
          </h4>
          <div className="space-y-2">
            {player.recentPerformance.map((match, index) => (
              <div key={index} className="bg-zinc-800/40 rounded-lg p-3 hover:bg-zinc-800/60 transition-colors border border-white/5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full overflow-hidden">
                      <Image
                        src={match.opponentLogo}
                        alt={match.opponent}
                        width={16}
                        height={16}
                        className="object-cover"
                      />
                    </div>
                    <div className="text-sm font-medium text-zinc-200">{match.opponent}</div>
                  </div>
                  <div className={`text-xs px-1.5 py-0.5 rounded border ${getResultColor(match.result)}`}>
                    {match.result}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span>{match.goals} Goals</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{match.assists} Assists</span>
                    </div>
                  </div>
                  <div className="text-xs text-zinc-500">{match.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 bg-zinc-800/40 border-white/10 hover:bg-zinc-800/60 group">
            <User className="mr-2 h-3 w-3" />
            Full Profile
          </Button>
          <Button className="flex-1 bg-primary hover:bg-primary/90">
            <TrendingUp className="mr-2 h-3 w-3" />
            View Stats
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}