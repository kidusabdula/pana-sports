// components/premier-league/TeamsTab.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar, Trophy, TrendingUp, Users, Star, ChevronRight, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TeamsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  // Mock data for Ethiopian Premier League teams
  const teams = [
    {
      id: 1,
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
      drawn: 4,
      lost: 2,
      gf: 24,
      ga: 12,
      gd: 12,
      form: ["W", "W", "D", "W", "W"],
      topScorer: "Getaneh Kebede",
      topScorerGoals: 8,
      colors: ["#FF0000", "#FFFFFF"],
      logo: "/placeholder.svg"
    },
    {
      id: 2,
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
      drawn: 4,
      lost: 3,
      gf: 19,
      ga: 11,
      gd: 8,
      form: ["W", "D", "W", "L", "W"],
      topScorer: "Shimeles Bekele",
      topScorerGoals: 7,
      colors: ["#008000", "#FFFFFF"],
      logo: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Mekelle 70 Enderta SC",
      shortName: "MKE",
      founded: 2007,
      city: "Mekelle",
      stadium: "Mekelle Stadium",
      capacity: 15000,
      position: 3,
      points: 23,
      played: 10,
      won: 7,
      drawn: 2,
      lost: 4,
      gf: 18,
      ga: 13,
      gd: 5,
      form: ["L", "W", "W", "D", "W"],
      topScorer: "Abel Yalew",
      topScorerGoals: 6,
      colors: ["#0000FF", "#FFFFFF"],
      logo: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Dire Dawa City SC",
      shortName: "DDC",
      founded: 2012,
      city: "Dire Dawa",
      stadium: "Dire Dawa Stadium",
      capacity: 18000,
      position: 4,
      points: 20,
      played: 10,
      won: 6,
      drawn: 2,
      lost: 5,
      gf: 16,
      ga: 13,
      gd: 3,
      form: ["D", "W", "L", "W", "D"],
      topScorer: "Dawit Fekadu",
      topScorerGoals: 5,
      colors: ["#800080", "#FFFFFF"],
      logo: "/placeholder.svg"
    },
    {
      id: 5,
      name: "Hadiya Hossana SC",
      shortName: "HHS",
      founded: 2005,
      city: "Hosaena",
      stadium: "Hossaena Stadium",
      capacity: 10000,
      position: 5,
      points: 18,
      played: 10,
      won: 5,
      drawn: 3,
      lost: 5,
      gf: 14,
      ga: 12,
      gd: 2,
      form: ["W", "L", "D", "W", "L"],
      topScorer: "Salhadin Seid",
      topScorerGoals: 5,
      colors: ["#FFA500", "#000000"],
      logo: "/placeholder.svg"
    },
    {
      id: 6,
      name: "Bahir Dar Kenema SC",
      shortName: "BDK",
      founded: 2018,
      city: "Bahir Dar",
      stadium: "Bahir Dar Stadium",
      capacity: 60000,
      position: 6,
      points: 16,
      played: 10,
      won: 4,
      drawn: 4,
      lost: 6,
      gf: 15,
      ga: 16,
      gd: -1,
      form: ["L", "D", "L", "W", "D"],
      topScorer: "Mesfin Tadesse",
      topScorerGoals: 4,
      colors: ["#000080", "#FFFFFF"],
      logo: "/placeholder.svg"
    },
    {
      id: 7,
      name: "Wolaitta Dicha SC",
      shortName: "WDS",
      founded: 2009,
      city: "Sodo",
      stadium: "Wolaitta Sodo Stadium",
      capacity: 30000,
      position: 7,
      points: 14,
      played: 10,
      won: 4,
      drawn: 2,
      lost: 7,
      gf: 13,
      ga: 16,
      gd: -3,
      form: ["D", "L", "W", "L", "D"],
      topScorer: "Yonatan Kebede",
      topScorerGoals: 4,
      colors: ["#008080", "#FFFFFF"],
      logo: "/placeholder.svg"
    },
    {
      id: 8,
      name: "Sebeta City SC",
      shortName: "SCC",
      founded: 2019,
      city: "Sebeta",
      stadium: "Sebeta Stadium",
      capacity: 12000,
      position: 8,
      points: 12,
      played: 10,
      won: 3,
      drawn: 3,
      lost: 7,
      gf: 11,
      ga: 16,
      gd: -5,
      form: ["L", "D", "L", "L", "W"],
      topScorer: "Abebe Animaw",
      topScorerGoals: 3,
      colors: ["#FF0000", "#000000"],
      logo: "/placeholder.svg"
    },
    {
      id: 9,
      name: "Ethiopia Bunna SC",
      shortName: "EBS",
      founded: 1945,
      city: "Addis Ababa",
      stadium: "Mekanesa Yesus Stadium",
      capacity: 30000,
      position: 9,
      points: 10,
      played: 10,
      won: 2,
      drawn: 4,
      lost: 6,
      gf: 9,
      ga: 16,
      gd: -7,
      form: ["L", "L", "D", "L", "W"],
      topScorer: "Sisay Girma",
      topScorerGoals: 3,
      colors: ["#FFFF00", "#000000"],
      logo: "/placeholder.svg"
    },
    {
      id: 10,
      name: "Jimma Aba Jifar SC",
      shortName: "JAJ",
      founded: 2015,
      city: "Jimma",
      stadium: "Jimma Stadium",
      capacity: 15000,
      position: 10,
      points: 8,
      played: 10,
      won: 2,
      drawn: 2,
      lost: 8,
      gf: 8,
      ga: 17,
      gd: -9,
      form: ["L", "W", "L", "L", "D"],
      topScorer: "Abduljelil Hassen",
      topScorerGoals: 2,
      colors: ["#000000", "#FFFFFF"],
      logo: "/placeholder.svg"
    },
    {
      id: 11,
      name: "Welwalo Adigrat University SC",
      shortName: "WAU",
      founded: 2015,
      city: "Adigrat",
      stadium: "Adigrat Stadium",
      capacity: 10000,
      position: 11,
      points: 6,
      played: 10,
      won: 1,
      drawn: 3,
      lost: 7,
      gf: 7,
      ga: 18,
      gd: -11,
      form: ["L", "L", "D", "L", "L"],
      topScorer: "Mekonnen Bekele",
      topScorerGoals: 2,
      colors: ["#008000", "#FF0000"],
      logo: "/placeholder.svg"
    },
    {
      id: 12,
      name: "Arba Minch Ketema SC",
      shortName: "AMK",
      founded: 2015,
      city: "Arba Minch",
      stadium: "Arba Minch Stadium",
      capacity: 12000,
      position: 12,
      points: 5,
      played: 10,
      won: 1,
      drawn: 2,
      lost: 8,
      gf: 6,
      ga: 19,
      gd: -13,
      form: ["L", "L", "L", "D", "W"],
      topScorer: "Biruk Wondimu",
      topScorerGoals: 1,
      colors: ["#0000FF", "#FFFF00"],
      logo: "/placeholder.svg"
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

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-zinc-800/40 border-zinc-700/50 focus-visible:ring-primary/50"
        />
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30 overflow-hidden group hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-zinc-700/50 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: team.colors[0] }}>
                    <span className="text-white font-bold text-sm">{team.shortName}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{team.city}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{team.points}</div>
                  <div className="text-xs text-muted-foreground">pts</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* League Position */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-zinc-700/50 border-zinc-600/50">
                    Position {team.position}
                  </Badge>
                  {team.position <= 3 && (
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      <Trophy className="h-3 w-3 mr-1" />
                      Top 3
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className={cn(
                    "h-4 w-4",
                    team.gd > 0 ? "text-green-500" : team.gd < 0 ? "text-red-500" : "text-gray-500"
                  )} />
                  <span className={cn(
                    "text-sm font-medium",
                    team.gd > 0 ? "text-green-500" : team.gd < 0 ? "text-red-500" : "text-gray-500"
                  )}>
                    {team.gd > 0 ? "+" : ""}{team.gd}
                  </span>
                </div>
              </div>

              {/* Team Stats */}
              <div className="grid grid-cols-5 gap-1 text-center text-xs">
                <div className="bg-zinc-800/30 rounded p-1">
                  <div className="font-medium">{team.played}</div>
                  <div className="text-muted-foreground">P</div>
                </div>
                <div className="bg-zinc-800/30 rounded p-1">
                  <div className="font-medium">{team.won}</div>
                  <div className="text-muted-foreground">W</div>
                </div>
                <div className="bg-zinc-800/30 rounded p-1">
                  <div className="font-medium">{team.drawn}</div>
                  <div className="text-muted-foreground">D</div>
                </div>
                <div className="bg-zinc-800/30 rounded p-1">
                  <div className="font-medium">{team.lost}</div>
                  <div className="text-muted-foreground">L</div>
                </div>
                <div className="bg-zinc-800/30 rounded p-1">
                  <div className="font-medium">{team.gf}:{team.ga}</div>
                  <div className="text-muted-foreground">GD</div>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Form</span>
                  <div className="flex gap-1">
                    {team.form.map((result, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white",
                          getFormColor(result)
                        )}
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Scorer */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="text-muted-foreground">Top Scorer:</span>
                </div>
                <span className="font-medium">{team.topScorer} ({team.topScorerGoals})</span>
              </div>

              {/* View Details Button */}
              <Button
                variant="outline"
                className="w-full bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50 group"
                onClick={() => setSelectedTeam(team.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
                <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Details Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-zinc-800/90 border-zinc-700/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {(() => {
              const team = teams.find(t => t.id === selectedTeam);
              if (!team) return null;

              return (
                <>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: team.colors[0] }}>
                          <span className="text-white font-bold text-xl">{team.shortName}</span>
                        </div>
                        <div>
                          <CardTitle className="text-xl">{team.name}</CardTitle>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{team.city}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedTeam(null)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Stadium Info */}
                    <div className="bg-zinc-800/30 rounded-lg p-4">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Stadium Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Stadium</div>
                          <div className="font-medium">{team.stadium}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Capacity</div>
                          <div className="font-medium">{team.capacity.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Founded</div>
                          <div className="font-medium">{team.founded}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">League Position</div>
                          <div className="font-medium">{team.position}</div>
                        </div>
                      </div>
                    </div>

                    {/* Season Stats */}
                    <div className="bg-zinc-800/30 rounded-lg p-4">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Season Statistics
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{team.points}</div>
                          <div className="text-sm text-muted-foreground">Points</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{team.won}</div>
                          <div className="text-sm text-muted-foreground">Wins</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{team.gf}</div>
                          <div className="text-sm text-muted-foreground">Goals For</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{team.ga}</div>
                          <div className="text-sm text-muted-foreground">Goals Against</div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Form */}
                    <div className="bg-zinc-800/30 rounded-lg p-4">
                      <h3 className="font-medium mb-3">Recent Form</h3>
                      <div className="flex gap-2">
                        {team.form.map((result, index) => (
                          <div
                            key={index}
                            className={cn(
                              "flex-1 h-10 rounded flex items-center justify-center text-sm font-bold text-white",
                              getFormColor(result)
                            )}
                          >
                            {result}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Scorers */}
                    <div className="bg-zinc-800/30 rounded-lg p-4">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Top Scorer
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{team.topScorer}</div>
                          <div className="text-sm text-muted-foreground">Forward</div>
                        </div>
                        <div className="text-2xl font-bold">{team.topScorerGoals}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button className="flex-1 btn-pana">
                        Follow Team
                      </Button>
                      <Button variant="outline" className="flex-1 bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50">
                        View Full Profile
                      </Button>
                    </div>
                  </CardContent>
                </>
              );
            })()}
          </Card>
        </div>
      )}
    </div>
  );
}