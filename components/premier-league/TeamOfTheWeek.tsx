"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Trophy, TrendingUp, Users, Calendar, Target, Shield, Activity } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function TeamOfTheWeek() {
  const [activeTab, setActiveTab] = useState("team");

  // Enhanced team of week data with actual team logo
  const teamOfWeek = {
    id: 94787,
    name: "Saint George",
    logo: "https://img.sofascore.com/api/v1/team/94787/image",
    shortName: "STG",
    founded: "1935",
    stadium: "Addis Ababa Stadium",
    capacity: "35,000",
    manager: "Wubetu Abate",
    captain: "Getaneh Kebede",
    website: "saintgeorgefc.com",
    weekNumber: 11,
    reason: "Impressive 3-0 victory against title rivals Fasil Kenema, extending their lead at top of table",
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
      { 
        id: 1381823,
        name: "Getaneh Kebede", 
        position: "Forward", 
        rating: 8.5, 
        goals: 8,
        avatar: "https://img.sofascore.com/api/v1/player/1381823/image"
      },
      { 
        id: 1139235,
        name: "Samuel Aregawi", 
        position: "Goalkeeper", 
        rating: 8.2, 
        cleanSheets: 4,
        avatar: "https://img.sofascore.com/api/v1/player/1139235/image"
      },
      { 
        id: 1014936,
        name: "Tekle Welday", 
        position: "Midfielder", 
        rating: 8.0, 
        assists: 5,
        avatar: "https://img.sofascore.com/api/v1/player/1014936/image"
      }
    ]
  };

  return (
    <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden h-full">
      <CardHeader className="pb-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Team of Week
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
            Round {teamOfWeek.weekNumber}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-800/40 border-white/5 p-1 h-auto rounded-xl">
            <TabsTrigger 
              value="team" 
              className="data-[state=active]:bg-zinc-800 text-white data-[state=active]:shadow-lg"
            >
              <Users className="h-4 w-4 mr-2" />
              Team Info
            </TabsTrigger>
            <TabsTrigger 
              value="players" 
              className="data-[state=active]:bg-zinc-800 text-white data-[state=active]:shadow-lg"
            >
              <Star className="h-4 w-4 mr-2" />
              Key Players
            </TabsTrigger>
          </TabsList>
          
          {/* Team Info Tab */}
          <TabsContent value="team" className="mt-4 space-y-4">
            {/* Enhanced Team Header */}
            <div className="flex items-center gap-4 p-4 bg-zinc-800/40 rounded-xl border border-white/5">
              <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/10">
                <Image
                  src={teamOfWeek.logo}
                  alt={teamOfWeek.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{teamOfWeek.name}</h3>
                <p className="text-sm text-zinc-400">Founded in {teamOfWeek.founded}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-zinc-800/50 border-white/10 text-zinc-300">
                    {teamOfWeek.stadium}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Enhanced Team Description */}
            <div className="p-4 bg-zinc-800/40 rounded-xl border border-white/5">
              <h4 className="text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Why they&apos;re team of the week
              </h4>
              <p className="text-sm text-zinc-300">{teamOfWeek.reason}</p>
            </div>
            
            {/* Enhanced Team Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-zinc-800/40 rounded-xl border border-white/5 hover:bg-zinc-800/60 transition-colors">
                <div className="text-2xl font-bold text-primary">{teamOfWeek.stats.wins}</div>
                <div className="text-xs text-zinc-400">Wins</div>
              </div>
              <div className="p-3 bg-zinc-800/40 rounded-xl border border-white/5 hover:bg-zinc-800/60 transition-colors">
                <div className="text-2xl font-bold text-primary">{teamOfWeek.stats.goalsFor}</div>
                <div className="text-xs text-zinc-400">Goals For</div>
              </div>
              <div className="p-3 bg-zinc-800/40 rounded-xl border border-white/5 hover:bg-zinc-800/60 transition-colors">
                <div className="text-2xl font-bold text-primary">{teamOfWeek.stats.cleanSheets}</div>
                <div className="text-xs text-zinc-400">Clean Sheets</div>
              </div>
              <div className="p-3 bg-zinc-800/40 rounded-xl border border-white/5 hover:bg-zinc-800/60 transition-colors">
                <div className="text-2xl font-bold text-primary">{teamOfWeek.stats.possession}</div>
                <div className="text-xs text-zinc-400">Avg. Possession</div>
              </div>
            </div>
            
            {/* Enhanced Team Details */}
            <div className="space-y-2 p-4 bg-zinc-800/40 rounded-xl border border-white/5">
              <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Team Details
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Stadium</span>
                  <span className="text-zinc-300">{teamOfWeek.stadium}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Capacity</span>
                  <span className="text-zinc-300">{teamOfWeek.capacity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Manager</span>
                  <span className="text-zinc-300">{teamOfWeek.manager}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Captain</span>
                  <span className="text-zinc-300">{teamOfWeek.captain}</span>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full bg-zinc-800/40 border-white/5 hover:bg-zinc-800/60 text-zinc-300 hover:text-white">
              View Full Profile
            </Button>
          </TabsContent>
          
          {/* Enhanced Key Players Tab */}
          <TabsContent value="players" className="mt-4 space-y-4">
            {teamOfWeek.keyPlayers.map((player, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-zinc-800/40 rounded-xl border border-white/5 hover:bg-zinc-800/60 transition-colors">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/10">
                  <Image
                    src={player.avatar}
                    alt={player.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">{player.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-primary" />
                      <span className="text-sm font-medium text-primary">{player.rating}</span>
                    </div>
                  </div>
                  <div className="text-sm text-zinc-400">{player.position}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-zinc-500" />
                      <span className="text-xs text-zinc-500">
                        {player.goals ? `${player.goals} goals` : `${player.cleanSheets} clean sheets`}
                      </span>
                    </div>
                    {player.assists && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-zinc-500" />
                        <span className="text-xs text-zinc-500">{player.assists} assists</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full bg-zinc-800/40 border-white/5 hover:bg-zinc-800/60 text-zinc-300 hover:text-white">
              View Full Squad
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}