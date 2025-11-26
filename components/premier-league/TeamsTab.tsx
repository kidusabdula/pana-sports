"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar, Trophy, TrendingUp, Users, Star, ChevronRight, Eye, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function TeamsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  // Enhanced teams data with actual team logos
  const teams = [
    {
      id: 94787,
      name: "Saint George SC",
      shortName: "SGE",
      founded: 1935,
      city: "Addis Ababa",
      stadium: "Addis Ababa Stadium",
      capacity: 35000,
      position: 1,
      points: 28,
      played: 10,
      won: 8,
      drawn: 1,
      lost: 1,
      gf: 24,
      ga: 8,
      gd: 16,
      form: ["W", "W", "D", "W", "W", "W"],
      topScorer: "Getaneh Kebede",
      topScorerGoals: 12,
      colors: ["#FF0000", "#FFFFFF"],
      logo: "https://img.sofascore.com/api/v1/team/94787/image"
    },
    {
      id: 273370,
      name: "Fasil Kenema SC",
      shortName: "FKC",
      founded: 2017,
      city: "Bahir Dar",
      stadium: "Bahir Dar Stadium",
      capacity: 60000,
      position: 2,
      points: 25,
      played: 10,
      won: 7,
      drawn: 2,
      lost: 1,
      gf: 18,
      ga: 9,
      gd: 9,
      form: ["W", "D", "W", "L", "W", "W"],
      topScorer: "Shimeles Bekele",
      topScorerGoals: 10,
      colors: ["#008000", "#FFFFFF"],
      logo: "https://img.sofascore.com/api/v1/team/273370/image"
    },
    {
      id: 274479,
      name: "Mekelle 70 Enderta SC",
      shortName: "MKE",
      founded: 2007,
      city: "Mekelle",
      stadium: "Mekelle Stadium",
      capacity: 15000,
      position: 3,
      points: 21,
      played: 10,
      won: 6,
      drawn: 3,
      lost: 1,
      gf: 16,
      ga: 9,
      gd: 7,
      form: ["W", "W", "D", "W", "W"],
      topScorer: "Abel Yalew",
      topScorerGoals: 9,
      colors: ["#008000", "#FFFFFF"],
      logo: "https://img.sofascore.com/api/v1/team/274479/image"
    },
    {
      id: 237728,
      name: "Dire Dawa City SC",
      shortName: "DDC",
      founded: 2012,
      city: "Dire Dawa",
      stadium: "Dire Dawa Stadium",
      capacity: 18000,
      position: 4,
      points: 19,
      played: 10,
      won: 6,
      drawn: 1,
      lost: 3,
      gf: 14,
      ga: 11,
      gd: 3,
      form: ["W", "L", "W", "L", "W"],
      topScorer: "Dawit Fekadu",
      topScorerGoals: 8,
      colors: ["#800080", "#FFFFFF"],
      logo: "https://img.sofascore.com/api/v1/team/237728/image"
    },
    {
      id: 315378,
      name: "Hadiya Hossana SC",
      shortName: "HHS",
      founded: 2005,
      city: "Hosaena",
      stadium: "Hosaena Stadium",
      capacity: 10000,
      position: 5,
      points: 17,
      played: 10,
      won: 5,
      drawn: 2,
      lost: 3,
      gf: 13,
      ga: 12,
      gd: 1,
      form: ["W", "L", "W", "L", "W"],
      topScorer: "Salhadin Seid",
      topScorerGoals: 7,
      colors: ["#008000", "#FFFFFF"],
      logo: "https://img.sofascore.com/api/v1/team/315378/image"
    },
    {
      id: 317333,
      name: "Bahir Dar Kenema SC",
      shortName: "BDK",
      founded: 2018,
      city: "Bahir Dar",
      stadium: "Bahir Dar Stadium",
      capacity: 60000,
      position: 6,
      points: 15,
      played: 10,
      won: 4,
      drawn: 3,
      lost: 3,
      gf: 12,
      ga: 11,
      gd: 1,
      form: ["W", "L", "W", "L", "W"],
      topScorer: "Yonatan Kebede",
      topScorerGoals: 6,
      colors: ["#008000", "#FFFFFF"],
      logo: "https://img.sofascore.com/api/v1/team/317333/image"
    },
    {
      id: 277540,
      name: "Wolaitta Dicha SC",
      shortName: "WDS",
      founded: 2009,
      city: "Wolaitta",
      stadium: "Wolaitta Stadium",
      capacity: 8000,
      position: 7,
      points: 14,
      played: 10,
      won: 4,
      drawn: 2,
      lost: 4,
      gf: 11,
      ga: 13,
      gd: -2,
      form: ["L", "W", "W", "L", "W"],
      topScorer: "Mesfin Tadesse",
      topScorerGoals: 5,
      colors: ["#008000", "#FFFFFF"],
      logo: "https://img.sofascore.com/api/v1/team/277540/image"
    },
    {
      id: 258167,
      name: "Sebeta City SC",
      shortName: "SCC",
      founded: 2015,
      city: "Sebeta",
      stadium: "Sebeta Stadium",
      capacity: 12000,
      position: 8,
      points: 12,
      played: 10,
      won: 3,
      drawn: 3,
      lost: 4,
      gf: 9,
      ga: 14,
      gd: -5,
      form: ["L", "W", "L", "W", "L"],
      topScorer: "Abebe Animaw",
      topScorerGoals: 5,
      colors: ["#0000FF", "#FFFFFF"],
      logo: "https://img.sofascore.com/api/v1/team/258167/image"
    },
    {
      id: 241957,
      name: "Ethiopia Bunna SC",
      shortName: "EBS",
      founded: 1945,
      city: "Addis Ababa",
      stadium: "Addis Ababa Stadium",
      capacity: 30000,
      position: 9,
      points: 11,
      played: 10,
      won: 3,
      drawn: 2,
      lost: 5,
      gf: 8,
      ga: 15,
      gd: -7,
      form: ["L", "W", "L", "W", "L"],
      topScorer: "Sisay Girma",
      topScorerGoals: 4,
      colors: ["#0000FF", "#FFFFFF"],
      logo: "https://img.sofascore.com/api/v1/team/241957/image"
    },
    {
      id: 1014936,
      name: "Jimma Aba Jifar SC",
      shortName: "JAJ",
      founded: 2015,
      city: "Jimma",
      stadium: "Jimma Stadium",
      capacity: 15000,
      position: 10,
      points: 9,
      played: 10,
      won: 2,
      drawn: 3,
      lost: 5,
      gf: 7,
      ga: 13,
      gd: -6,
      form: ["L", "W", "L", "W", "L"],
      topScorer: "Mekonnen Kassa",
      topScorerGoals: 3,
      colors: ["#0000FF", "#FFFFFF"],
      logo: "https://img.sofascore.com/api/v1/team/1014936/image"
    },
    {
      id: 1099589,
      name: "Welwalo Adigrat University SC",
      shortName: "WAU",
      founded: 2015,
      city: "Welwalo",
      stadium: "Welwalo Stadium",
      capacity: 10000,
      position: 11,
      points: 6,
      played: 10,
      won: 1,
      drawn: 3,
      lost: 6,
      gf: 5,
      ga: 15,
      gd: -10,
      form: ["L", "W", "L", "W", "L"],
      topScorer: "Biruk Wondimu",
      topScorerGoals: 2,
      colors: ["#0000FF", "#FFFFFF"],
      logo: "https://img.sofascore.com/api/v1/team/1099589/image"
    },
    {
      id: 1064117,
      name: "Arba Minch Ketema SC",
      shortName: "AMK",
      founded: 2018,
      city: "Arba Minch",
      stadium: "Arba Minch Stadium",
      capacity: 12000,
      position: 12,
      points: 5,
      played: 10,
      won: 1,
      drawn: 2,
      lost: 7,
      gf: 4,
      ga: 16,
      gd: -12,
      form: ["L", "W", "L", "W", "L"],
      topScorer: "Dawit Fekadu",
      topScorerGoals: 2,
      colors: ["#0000FF", "#FFFFFF"],
      logo: "https://img.sofascore.com/api/v1/team/1064117/image"
    }
  ];

  // Filter teams based on search term
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get form result color
  const getFormColor = (result: string) => {
    switch (result) {
      case "W": return "bg-green-500";
      case "D": return "bg-yellow-500";
      case "L": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  // Get position badge color
  const getPositionBadgeColor = (position: number) => {
    if (position === 1) return "bg-primary/30 text-primary border-primary/30";
    if (position <= 3) return "bg-primary/20 text-primary border-primary/30";
    if (position >= 8) return "bg-red-900/20 text-red-400 border-red-800/30";
    return "bg-zinc-800/50 text-zinc-400 border-zinc-700/50";
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 bg-zinc-800/40 border-white/5 rounded-lg px-4 py-3 text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden group hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/10">
                    <Image
                      src={team.logo}
                      alt={team.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">{team.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-zinc-400">
                      <MapPin className="h-3 w-3" />
                      <span>{team.city}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700/50">
                    Position {team.position}
                  </Badge>
                  {team.position <= 3 && (
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 ml-2">
                      <Trophy className="h-3 w-3 mr-1" />
                      Top 3
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {/* League Position */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-white">{team.position}</div>
                <div className="text-sm text-zinc-400">pts</div>
              </div>
              
              {/* Team Name */}
              <div className="text-lg font-medium text-white mb-2">{team.name}</div>
              
              {/* Team Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xs text-zinc-400 mb-1">Played</div>
                  <div className="text-xl font-bold text-white">{team.played}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-zinc-400 mb-1">Won</div>
                  <div className="text-xl font-bold text-white">{team.won}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-zinc-400 mb-1">Drawn</div>
                  <div className="text-xl font-bold text-white">{team.drawn}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-zinc-400 mb-1">Lost</div>
                  <div className="text-xl font-bold text-white">{team.lost}</div>
                </div>
              </div>
              
              {/* Goals For/Against */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xs text-zinc-400 mb-1">Goals For</div>
                  <div className="text-xl font-bold text-white">{team.gf}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-zinc-400 mb-1">Goals Against</div>
                  <div className="text-xl font-bold text-white">{team.ga}</div>
                </div>
              </div>
              
              {/* Goal Difference */}
              <div className="flex items-center justify-center mb-4">
                <div className="text-xs text-zinc-400 mb-1">Goal Difference</div>
                <div className={`text-2xl font-bold ${team.gd > 0 ? "text-green-400" : "text-red-400"}`}>
                  {team.gd > 0 ? "+" : ""}{team.gd}
                </div>
              </div>
              
              {/* Form */}
              <div className="mb-4">
                <div className="text-xs text-zinc-400 mb-2">Recent Form</div>
                <div className="flex gap-1">
                  {team.form.map((result, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getFormColor(result)}`}
                    >
                      {result}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Top Scorer */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-zinc-400">Top Scorer</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="text-sm font-medium text-zinc-400">{team.topScorer}</div>
                    <div className="text-sm text-zinc-400">({team.topScorerGoals} goals)</div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            {/* View Details Button */}
            <div className="p-4 pt-0">
              <Button
                variant="outline"
                className="w-full bg-zinc-800/40 border-white/5 hover:bg-zinc-800/60 text-zinc-300 hover:text-white"
                onClick={() => setSelectedTeam(team.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
                <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Team Details Modal */}
      {selectedTeam && (() => {
        const team = teams.find(t => t.id === selectedTeam);
        if (!team) return null;

        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="bg-zinc-900 border-white/5 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="pb-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/10">
                      <Image
                        src={team.logo}
                        alt={team.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">{team.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-zinc-400">
                        <MapPin className="h-3 w-3" />
                        <span>{team.city}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedTeam(null)}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {/* Stadium Info */}
                <div className="bg-zinc-800/30 rounded-xl p-4 mb-6">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Stadium Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">Name</div>
                      <div className="text-white font-medium">{team.stadium}</div>
                    </div>
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">City</div>
                      <div className="text-white font-medium">{team.city}</div>
                    </div>
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">Capacity</div>
                      <div className="text-white font-medium">{team.capacity.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">Founded</div>
                      <div className="text-white font-medium">{team.founded}</div>
                    </div>
                  </div>
                </div>
                
                {/* Season Stats */}
                <div className="bg-zinc-800/30 rounded-xl p-4 mb-6">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Season Statistics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">League Position</div>
                      <div className="text-2xl font-bold text-white">{team.position}</div>
                    </div>
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">Points</div>
                      <div className="text-2xl font-bold text-white">{team.points}</div>
                    </div>
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">Matches Played</div>
                      <div className="text-2xl font-bold text-white">{team.played}</div>
                    </div>
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">Wins</div>
                      <div className="text-2xl font-bold text-white">{team.won}</div>
                    </div>
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">Draws</div>
                      <div className="text-2xl font-bold text-white">{team.drawn}</div>
                    </div>
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">Losses</div>
                      <div className="text-2xl font-bold text-white">{team.lost}</div>
                    </div>
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">Goals For</div>
                      <div className="text-2xl font-bold text-white">{team.gf}</div>
                    </div>
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">Goals Against</div>
                      <div className="text-2xl font-bold text-white">{team.ga}</div>
                    </div>
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">Goal Difference</div>
                      <div className={`text-2xl font-bold ${team.gd > 0 ? "text-green-400" : "text-red-400"}`}>
                        {team.gd > 0 ? "+" : ""}{team.gd}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Top Scorer */}
                <div className="bg-zinc-800/30 rounded-xl p-4 mb-6">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Top Scorer
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-zinc-400">{team.topScorer}</div>
                    <div className="text-sm text-zinc-400">({team.topScorerGoals} goals)</div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-white">
                    Follow Team
                  </Button>
                  <Button variant="outline" className="flex-1 bg-zinc-800/40 border-white/5 hover:bg-zinc-800/60 text-zinc-300 hover:text-white">
                    View Full Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })()}
    </div>
  );
}