// components/premier-league/TeamOfTheWeek.tsx
"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Trophy, TrendingUp, Users, Calendar } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function TeamOfTheWeek() {
  const [activeTab, setActiveTab] = useState("team");

  // Sample team of the week data
  const teamOfWeek = {
    name: "Saint George",
    logo: "/api/placeholder/100/100",
    shortName: "STG",
    founded: "1935",
    stadium: "Addis Ababa Stadium",
    capacity: "35,000",
    manager: "Wubetu Abate",
    captain: "Getaneh Kebede",
    website: "saintgeorgefc.com",
    weekNumber: 11,
    reason: "Impressive 3-0 victory against title rivals Fasil Kenema, extending their lead at the top of the table",
    stats: {
      matchesPlayed: 10,
      wins: 8,
      draws: 1,
      losses: 1,
      goalsFor: 22,
      goalsAgainst: 8,
      cleanSheets: 4,
      possession: "58%",
      passAccuracy: "82%"
    },
    keyPlayers: [
      { name: "Getaneh Kebede", position: "Forward", rating: 8.5, goals: 8 },
      { name: "Samuel Aregawi", position: "Goalkeeper", rating: 8.2, cleanSheets: 4 },
      { name: "Tekle Welday", position: "Midfielder", rating: 8.0, assists: 5 }
    ]
  };

  return (
    <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Team of the Week
          </CardTitle>
          <Badge variant="secondary" className="bg-zinc-700/50 text-foreground/80">
            Round {teamOfWeek.weekNumber}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-800/30 border-zinc-700/50 p-1 h-auto">
            <TabsTrigger 
              value="team" 
              className="data-[state=active]:bg-zinc-700/50"
            >
              Team Info
            </TabsTrigger>
            <TabsTrigger 
              value="players" 
              className="data-[state=active]:bg-zinc-700/50"
            >
              Key Players
            </TabsTrigger>
          </TabsList>
          
          {/* Team Info Tab */}
          <TabsContent value="team" className="mt-4 space-y-4">
            {/* Team Header */}
            <div className="flex items-center gap-4 p-4 bg-zinc-800/30 rounded-lg">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-zinc-700/50 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{teamOfWeek.shortName}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground">{teamOfWeek.name}</h3>
                <p className="text-sm text-muted-foreground">Founded in {teamOfWeek.founded}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-zinc-700/30 border-zinc-600/50">
                    {teamOfWeek.stadium}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Team Description */}
            <div className="p-4 bg-zinc-800/30 rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-2">Why they&apos;re team of the week</h4>
              <p className="text-sm text-muted-foreground">{teamOfWeek.reason}</p>
            </div>
            
            {/* Team Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-zinc-800/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{teamOfWeek.stats.wins}</div>
                <div className="text-xs text-muted-foreground">Wins</div>
              </div>
              <div className="p-3 bg-zinc-800/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{teamOfWeek.stats.goalsFor}</div>
                <div className="text-xs text-muted-foreground">Goals For</div>
              </div>
              <div className="p-3 bg-zinc-800/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{teamOfWeek.stats.cleanSheets}</div>
                <div className="text-xs text-muted-foreground">Clean Sheets</div>
              </div>
              <div className="p-3 bg-zinc-800/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{teamOfWeek.stats.possession}</div>
                <div className="text-xs text-muted-foreground">Avg. Possession</div>
              </div>
            </div>
            
            {/* Team Details */}
            <div className="space-y-2 p-4 bg-zinc-800/30 rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-3">Team Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Stadium</span>
                  <span>{teamOfWeek.stadium}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Capacity</span>
                  <span>{teamOfWeek.capacity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Manager</span>
                  <span>{teamOfWeek.manager}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Captain</span>
                  <span>{teamOfWeek.captain}</span>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60">
              View Full Profile
            </Button>
          </TabsContent>
          
          {/* Key Players Tab */}
          <TabsContent value="players" className="mt-4 space-y-4">
            {teamOfWeek.keyPlayers.map((player, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-700/50 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{player.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{player.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-primary" />
                      <span className="text-sm font-medium text-primary">{player.rating}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{player.position}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {player.goals ? `${player.goals} goals` : `${player.cleanSheets} clean sheets`}
                      </span>
                    </div>
                    {player.assists && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{player.assists} assists</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60">
              View Full Squad
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}