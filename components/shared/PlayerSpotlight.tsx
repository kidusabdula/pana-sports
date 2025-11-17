// components/shared/PlayerSpotlight.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, Target, Calendar } from 'lucide-react';
import Image from 'next/image';

export default function PlayerSpotlight() {
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
    <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-pana-gradient flex items-center gap-2">
          <Star className="h-4 w-4" />
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
            <h3 className="font-bold text-lg">{player.name}</h3>
            <div className="text-sm text-muted-foreground">{player.team}</div>
            <div className="text-xs text-muted-foreground">{player.position} • {player.age} years</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-800/30 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-primary">
              <Target className="h-3 w-3" />
              <span className="text-lg font-bold">{player.stats.goals}</span>
            </div>
            <div className="text-xs text-muted-foreground">Goals</div>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-primary">
              <TrendingUp className="h-3 w-3" />
              <span className="text-lg font-bold">{player.stats.assists}</span>
            </div>
            <div className="text-xs text-muted-foreground">Assists</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Recent Performance</h4>
          <div className="space-y-2">
            {player.recentPerformance.map((match, index) => (
              <div key={index} className="bg-zinc-800/30 rounded-lg p-2">
                <div className="flex justify-between items-center">
                  <div className="text-xs font-medium">{match.opponent}</div>
                  <div className={`text-xs px-1.5 py-0.5 rounded ${
                    match.result.startsWith('W') ? 'bg-green-900/20 text-green-500' : 
                    match.result.startsWith('D') ? 'bg-yellow-900/20 text-yellow-500' : 
                    'bg-red-900/20 text-red-500'
                  }`}>
                    {match.result}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    <span>{match.goals}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{match.assists}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button variant="outline" className="w-full bg-zinc-800/30 border-zinc-700/30 hover:bg-zinc-800/50">
          View Full Profile
        </Button>
      </CardContent>
    </Card>
  );
}