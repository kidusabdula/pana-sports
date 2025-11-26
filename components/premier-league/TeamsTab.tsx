// components/premier-league/TeamsTab.tsx
"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTeamsByLeagueSlug } from '@/lib/data/teams';
import { getStandingsByLeagueSlug } from '@/lib/data/standings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar, Trophy, TrendingUp, Users, Star, ChevronRight, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TeamsTab({ initialTeams = [], initialStandings = [], leagueSlug = 'premier-league' }: { initialTeams?: any[]; initialStandings?: any[]; leagueSlug?: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const teamsQuery = useQuery({ queryKey: ['teams', leagueSlug], queryFn: () => getTeamsByLeagueSlug(leagueSlug), initialData: initialTeams })
  const standingsQuery = useQuery({ queryKey: ['standings', leagueSlug], queryFn: () => getStandingsByLeagueSlug(leagueSlug), initialData: initialStandings })
  
  const teams = (teamsQuery.data || []).map((t: any) => {
    const s = (standingsQuery.data || []).find((st: any) => st.team_slug === t.slug)
    return {
      id: t.slug,
      name: t.name_en,
      shortName: t.short_name_en || t.slug,
      founded: t.founded || '',
      city: t.stadium_en ? t.stadium_en.split(' ').pop() : '', // Extract city from stadium name if available
      stadium: t.stadium_en || '',
      capacity: '',
      position: s?.rank || '',
      points: s?.points || 0,
      played: s?.played || 0,
      won: s?.won || 0,
      drawn: s?.drawn || 0,
      lost: s?.lost || 0,
      gf: s?.goals_for || 0,
      ga: s?.goals_against || 0,
      gd: s?.gd || 0,
      form: ['W', 'D', 'L', 'W', 'D'], // Mock form data for now
      topScorer: 'TBD', // Will need to fetch from top scorers API
      topScorerGoals: 0,
      colors: ["#1f2937", "#111827"],
      logo: t.logo_url || '/placeholder.svg',
    }
  })

  // Filter teams based on search term
  const filteredTeams = teams.filter((team: any) =>
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

  // Loading state
  if (teamsQuery.isLoading || standingsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Error state
  if (teamsQuery.error || standingsQuery.error) {
    const error = teamsQuery.error || standingsQuery.error
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-destructive">
            <Users className="h-5 w-5" />
            <span>
              Error loading teams:{" "}
              {error instanceof Error 
                ? error.message 
                : "Unknown error"}
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Empty state
  if (teams.length === 0) {
    return (
      <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30">
        <CardContent className="p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No teams found</h3>
          <p className="text-muted-foreground">No teams available for this league.</p>
        </CardContent>
      </Card>
    )
  }

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
        {filteredTeams.map((team: any) => (
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
                    {team.form.map((result: string, index: number) => (
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
              const team = teams.find((t: any) => t.id === selectedTeam);
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
                          <div className="font-medium">{team.capacity ? team.capacity.toLocaleString() : 'N/A'}</div>
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