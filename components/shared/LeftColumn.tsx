"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Trophy, TrendingUp, Clock, Users, Target, Flag, Star, Activity, Award, MapPin, Timer } from 'lucide-react';

export default function LeftColumn() {
  const t = useTranslations('Home');
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="h-full flex flex-col bg-zinc-900/40 backdrop-blur-sm px-10 m-10 rounded-2xl">
      <div className="p-4 border-b border-zinc-800/50">
        <h2 className="text-xl font-bold text-pana-gradient">Ethiopian Football</h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-800/30 mx-4 mt-4 mb-2">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Overview
          </TabsTrigger>
          <TabsTrigger value="matches" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Matches
          </TabsTrigger>
          <TabsTrigger value="standings" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Standings
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0 space-y-4">
            {/* League Leaders Card */}
            <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  League Leaders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Top Teams */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Top Teams</h4>
                  <div className="space-y-2">
                    {[
                      { team: 'Saint George', points: 28, position: 1, trend: 'up', played: 10, won: 8, drawn: 4, lost: 2, gf: 24, ga: 12 },
                      { team: 'Fasil Kenema', points: 25, position: 2, trend: 'up', played: 10, won: 7, drawn: 4, lost: 3, gf: 19, ga: 11 },
                      { team: 'Mekelle 70 Enderta', points: 23, position: 3, trend: 'down', played: 10, won: 7, drawn: 2, lost: 4, gf: 18, ga: 13 },
                      { team: 'Dire Dawa City', points: 20, position: 4, trend: 'up', played: 10, won: 6, drawn: 2, lost: 5, gf: 16, ga: 13 },
                      { team: 'Hadiya Hossana', points: 18, position: 5, trend: 'down', played: 10, won: 5, drawn: 3, lost: 5, gf: 14, ga: 12 },
                      { team: 'Bahir Dar Kenema', points: 16, position: 6, trend: 'up', played: 10, won: 4, drawn: 4, lost: 6, gf: 15, ga: 16 },
                      { team: 'Wolaitta Dicha', points: 14, position: 7, trend: 'down', played: 10, won: 4, drawn: 2, lost: 7, gf: 13, ga: 16 },
                      { team: 'Sebeta City', points: 12, position: 8, trend: 'up', played: 10, won: 3, drawn: 3, lost: 7, gf: 11, ga: 16 },
                    ].map((team) => (
                      <div key={team.position} className="flex justify-between items-center bg-zinc-800/30 rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            team.position === 1 ? 'bg-primary/30' : 'bg-zinc-700/50'
                          }`}>
                            {team.position}
                          </div>
                          <div>
                            <span className="text-sm">{team.team}</span>
                            <div className="text-xs text-muted-foreground">
                              P: {team.played} W: {team.won} D: {team.drawn} L: {team.lost}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{team.points} pts</span>
                          {team.trend === 'up' ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Scorers */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Top Scorers</h4>
                  <div className="space-y-2">
                    {[
                      { player: 'Getaneh Kebede', goals: 8, team: 'Saint George', assists: 3, shots: 24, accuracy: 33 },
                      { player: 'Shimeles Bekele', goals: 7, team: 'Fasil Kenema', assists: 5, shots: 21, accuracy: 33 },
                      { player: 'Abel Yalew', goals: 6, team: 'Mekelle 70 Enderta', assists: 4, shots: 19, accuracy: 32 },
                      { player: 'Dawit Fekadu', goals: 5, team: 'Dire Dawa City', assists: 2, shots: 18, accuracy: 28 },
                      { player: 'Salhadin Seid', goals: 5, team: 'Hadiya Hossana', assists: 6, shots: 22, accuracy: 23 },
                      { player: 'Mesfin Tadesse', goals: 4, team: 'Bahir Dar Kenema', assists: 3, shots: 17, accuracy: 24 },
                      { player: 'Yonatan Kebede', goals: 4, team: 'Wolaitta Dicha', assists: 2, shots: 20, accuracy: 20 },
                      { player: 'Abebe Animaw', goals: 3, team: 'Sebeta City', assists: 4, shots: 15, accuracy: 20 },
                    ].map((player, index) => (
                      <div key={index} className="flex justify-between items-center bg-zinc-800/30 rounded-lg p-2">
                        <div>
                          <div className="text-sm font-medium">{player.player}</div>
                          <div className="text-xs text-muted-foreground">{player.team}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3 text-primary" />
                              <span className="text-sm font-medium">{player.goals}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{player.assists} ast</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="btn-pana w-full">
                  View Full Standings
                </Button>
              </CardContent>
            </Card>

            {/* Player Performance Card */}
            <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Player Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Top Rated Players */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Star className="h-3 w-3" />
                    Top Rated Players
                  </h4>
                  <div className="space-y-2">
                    {[
                      { player: 'Tekle Welday', team: 'Saint George', rating: 8.5, position: 'Midfielder', matches: 10 },
                      { player: 'Samuel Aregawi', team: 'Fasil Kenema', rating: 8.2, position: 'Goalkeeper', matches: 10 },
                      { player: 'Yared Bayeh', team: 'Mekelle 70 Enderta', rating: 7.9, position: 'Defender', matches: 10 },
                      { player: 'Mekonen Bekele', team: 'Dire Dawa City', rating: 7.7, position: 'Midfielder', matches: 9 },
                      { player: 'Abduljelil Hassen', team: 'Hadiya Hossana', rating: 7.6, position: 'Forward', matches: 10 },
                      { player: 'Biruk Wondimu', team: 'Bahir Dar Kenema', rating: 7.5, position: 'Defender', matches: 10 },
                      { player: 'Mekonnen Kassa', team: 'Wolaitta Dicha', rating: 7.4, position: 'Midfielder', matches: 9 },
                      { player: 'Tesfaye Alebachew', team: 'Sebeta City', rating: 7.3, position: 'Forward', matches: 10 },
                    ].map((player, index) => (
                      <div key={index} className="flex justify-between items-center bg-zinc-800/30 rounded-lg p-2">
                        <div>
                          <div className="text-sm font-medium">{player.player}</div>
                          <div className="text-xs text-muted-foreground">{player.team} • {player.position}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm font-medium">{player.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Most Valuable Players */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Award className="h-3 w-3" />
                    Most Valuable Players
                  </h4>
                  <div className="space-y-2">
                    {[
                      { player: 'Getaneh Kebede', team: 'Saint George', value: '$500K', age: 28, position: 'Forward' },
                      { player: 'Shimeles Bekele', team: 'Fasil Kenema', value: '$450K', age: 26, position: 'Midfielder' },
                      { player: 'Abel Yalew', team: 'Mekelle 70 Enderta', value: '$400K', age: 24, position: 'Forward' },
                      { player: 'Samuel Aregawi', team: 'Fasil Kenema', value: '$350K', age: 30, position: 'Goalkeeper' },
                      { player: 'Yared Bayeh', team: 'Mekelle 70 Enderta', value: '$320K', age: 27, position: 'Defender' },
                      { player: 'Dawit Fekadu', team: 'Dire Dawa City', value: '$300K', age: 25, position: 'Midfielder' },
                      { player: 'Salhadin Seid', team: 'Hadiya Hossana', value: '$280K', age: 23, position: 'Forward' },
                      { player: 'Tekle Welday', team: 'Saint George', value: '$260K', age: 29, position: 'Midfielder' },
                    ].map((player, index) => (
                      <div key={index} className="flex justify-between items-center bg-zinc-800/30 rounded-lg p-2">
                        <div>
                          <div className="text-sm font-medium">{player.player}</div>
                          <div className="text-xs text-muted-foreground">{player.team} • {player.position} • {player.age}y</div>
                        </div>
                        <div className="text-sm font-medium text-primary">{player.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="btn-pana w-full">
                  View All Players
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Matches Tab */}
          <TabsContent value="matches" className="mt-0 space-y-4">
            {/* Recent Matches Card */}
            <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Matches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {[
                    { home: 'Ethiopia', away: 'Kenya', homeScore: 2, awayScore: 1, date: 'Oct 15, 2025', league: 'Premier League', status: 'FT', venue: 'Addis Ababa Stadium' },
                    { home: 'Saint George', away: 'Fasil Kenema', homeScore: 1, awayScore: 1, date: 'Oct 12, 2025', league: 'Premier League', status: 'FT', venue: 'Mekelle Stadium' },
                    { home: 'Mekelle 70 Enderta', away: 'Dire Dawa City', homeScore: 3, awayScore: 2, date: 'Oct 10, 2025', league: 'Premier League', status: 'FT', venue: 'Dire Dawa Stadium' },
                    { home: 'Hadiya Hossana', away: 'Bahir Dar Kenema', homeScore: 0, awayScore: 2, date: 'Oct 8, 2025', league: 'Premier League', status: 'FT', venue: 'Hossana Stadium' },
                    { home: 'Wolaitta Dicha', away: 'Sebeta City', homeScore: 2, awayScore: 2, date: 'Oct 5, 2025', league: 'Premier League', status: 'FT', venue: 'Wolaitta Stadium' },
                    { home: 'Ethiopia Bunna', away: 'Jimma Aba Jifar', homeScore: 1, awayScore: 3, date: 'Oct 3, 2025', league: 'Premier League', status: 'FT', venue: 'Jimma Stadium' },
                    { home: 'Welwalo Adigrat', away: 'Arba Minch Ketema', homeScore: 0, awayScore: 1, date: 'Oct 1, 2025', league: 'Premier League', status: 'FT', venue: 'Adigrat Stadium' },
                    { home: 'Sidama', away: 'Mekelle', homeScore: 2, awayScore: 1, date: 'Sep 28, 2025', league: 'Premier League', status: 'FT', venue: 'Hawassa Stadium' },
                  ].map((match, index) => (
                    <div key={index} className="bg-zinc-800/30 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold">
                            {match.home.substring(0, 3).toUpperCase()}
                          </div>
                          <span className="font-medium">{match.home}</span>
                        </div>
                        <div className="text-lg font-bold">
                          {match.homeScore} - {match.awayScore}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{match.away}</span>
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold">
                            {match.away.substring(0, 3).toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{match.venue}</span>
                        </div>
                        <span>{match.date} • {match.status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="btn-pana w-full">
                  View All Recent Matches
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Matches Card */}
            <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Matches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {[
                    { home: 'Sidama', away: 'Mekelle', date: 'Oct 22, 2025', time: '3:00 PM', league: 'Premier League', venue: 'Hawassa Stadium' },
                    { home: 'Saint George', away: 'Wolaitta Dicha', date: 'Oct 25, 2025', time: '4:00 PM', league: 'Premier League', venue: 'Addis Ababa Stadium' },
                    { home: 'Fasil Kenema', away: 'Sebeta City', date: 'Oct 28, 2025', time: '2:00 PM', league: 'Premier League', venue: 'Bahir Dar Stadium' },
                    { home: 'Dire Dawa City', away: 'Hadiya Hossana', date: 'Oct 30, 2025', time: '3:30 PM', league: 'Premier League', venue: 'Dire Dawa Stadium' },
                    { home: 'Bahir Dar Kenema', away: 'Ethiopia Bunna', date: 'Nov 2, 2025', time: '2:30 PM', league: 'Premier League', venue: 'Bahir Dar Stadium' },
                    { home: 'Wolaitta Dicha', away: 'Jimma Aba Jifar', date: 'Nov 5, 2025', time: '3:00 PM', league: 'Premier League', venue: 'Wolaitta Stadium' },
                    { home: 'Sebeta City', away: 'Welwalo Adigrat', date: 'Nov 8, 2025', time: '4:00 PM', league: 'Premier League', venue: 'Sebeta Stadium' },
                    { home: 'Arba Minch Ketema', away: 'Sidama', date: 'Nov 10, 2025', time: '2:00 PM', league: 'Premier League', venue: 'Arba Minch Stadium' },
                  ].map((match, index) => (
                    <div key={index} className="bg-zinc-800/30 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold">
                            {match.home.substring(0, 3).toUpperCase()}
                          </div>
                          <span className="font-medium">{match.home}</span>
                        </div>
                        <div className="text-lg font-bold">VS</div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{match.away}</span>
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold">
                            {match.away.substring(0, 3).toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{match.venue}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          <span>{match.date} • {match.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="btn-pana w-full">
                  View All Upcoming Matches
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Standings Tab */}
          <TabsContent value="standings" className="mt-0 space-y-4">
            {/* Premier League Standings */}
            <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Premier League Standings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-zinc-800/30 rounded-lg p-3">
                  <div className="grid grid-cols-7 gap-2 text-xs font-medium text-muted-foreground mb-2">
                    <div>Pos</div>
                    <div>Team</div>
                    <div className="text-center">P</div>
                    <div className="text-center">W</div>
                    <div className="text-center">D</div>
                    <div className="text-center">GD</div>
                    <div className="text-center">Pts</div>
                  </div>
                  
                  {[
                    { team: 'Saint George', played: 10, won: 8, drawn: 4, lost: 2, goalDiff: 12, points: 28, position: 1 },
                    { team: 'Fasil Kenema', played: 10, won: 7, drawn: 4, lost: 3, goalDiff: 8, points: 25, position: 2 },
                    { team: 'Mekelle 70 Enderta', played: 10, won: 7, drawn: 2, lost: 4, goalDiff: 5, points: 23, position: 3 },
                    { team: 'Dire Dawa City', played: 10, won: 6, drawn: 2, lost: 5, goalDiff: 3, points: 20, position: 4 },
                    { team: 'Hadiya Hossana', played: 10, won: 5, drawn: 3, lost: 5, goalDiff: 2, points: 18, position: 5 },
                    { team: 'Bahir Dar Kenema', played: 10, won: 4, drawn: 4, lost: 6, goalDiff: -1, points: 16, position: 6 },
                    { team: 'Wolaitta Dicha', played: 10, won: 4, drawn: 2, lost: 7, goalDiff: -3, points: 14, position: 7 },
                    { team: 'Sebeta City', played: 10, won: 3, drawn: 3, lost: 7, goalDiff: -5, points: 12, position: 8 },
                    { team: 'Ethiopia Bunna', played: 10, won: 2, drawn: 4, lost: 6, goalDiff: -7, points: 10, position: 9 },
                    { team: 'Jimma Aba Jifar', played: 10, won: 2, drawn: 2, lost: 8, goalDiff: -9, points: 8, position: 10 },
                    { team: 'Welwalo Adigrat', played: 10, won: 1, drawn: 3, lost: 7, goalDiff: -11, points: 6, position: 11 },
                    { team: 'Arba Minch Ketema', played: 10, won: 1, drawn: 2, lost: 8, goalDiff: -13, points: 5, position: 12 },
                  ].map((team) => (
                    <div key={team.position} className="grid grid-cols-7 gap-2 text-xs py-2 border-b border-zinc-700/30 last:border-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        team.position <= 3 ? 'bg-primary/30' : team.position >= 10 ? 'bg-red-900/20' : 'bg-zinc-700/50'
                      }`}>
                        {team.position}
                      </div>
                      <div className="truncate">{team.team}</div>
                      <div className="text-center">{team.played}</div>
                      <div className="text-center">{team.won}</div>
                      <div className="text-center">{team.drawn}</div>
                      <div className="text-center">{team.goalDiff > 0 ? '+' : ''}{team.goalDiff}</div>
                      <div className="text-center font-medium">{team.points}</div>
                    </div>
                  ))}
                </div>

                <Button className="btn-pana w-full">
                  View Full Premier League Table
                </Button>
              </CardContent>
            </Card>

            {/* Higher League Standings */}
            <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Higher League Standings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-zinc-800/30 rounded-lg p-3">
                  <div className="grid grid-cols-7 gap-2 text-xs font-medium text-muted-foreground mb-2">
                    <div>Pos</div>
                    <div>Team</div>
                    <div className="text-center">P</div>
                    <div className="text-center">W</div>
                    <div className="text-center">D</div>
                    <div className="text-center">GD</div>
                    <div className="text-center">Pts</div>
                  </div>
                  
                  {[
                    { team: 'Ethiopia Bunna', played: 10, won: 7, drawn: 4, lost: 3, goalDiff: 7, points: 22, position: 1 },
                    { team: 'Jimma Aba Jifar', played: 10, won: 6, drawn: 4, lost: 3, goalDiff: 5, points: 20, position: 2 },
                    { team: 'Welwalo Adigrat', played: 10, won: 6, drawn: 2, lost: 4, goalDiff: 3, points: 18, position: 3 },
                    { team: 'Arba Minch Ketema', played: 10, won: 5, drawn: 2, lost: 4, goalDiff: 2, points: 16, position: 4 },
                    { team: 'Shashemene City', played: 10, won: 4, drawn: 3, lost: 5, goalDiff: 1, points: 14, position: 5 },
                    { team: 'Hawassa Ketema', played: 10, won: 4, drawn: 2, lost: 6, goalDiff: -1, points: 12, position: 6 },
                    { team: 'Gambela Hossana', played: 10, won: 3, drawn: 3, lost: 6, goalDiff: -3, points: 10, position: 7 },
                    { team: 'Mekelle 70 Enderta B', played: 10, won: 2, drawn: 3, lost: 7, goalDiff: -5, points: 8, position: 8 },
                    { team: 'Adama City', played: 10, won: 2, drawn: 2, lost: 8, goalDiff: -7, points: 6, position: 9 },
                    { team: 'Assosa Kenema', played: 10, won: 1, drawn: 3, lost: 7, goalDiff: -9, points: 4, position: 10 },
                  ].map((team) => (
                    <div key={team.position} className="grid grid-cols-7 gap-2 text-xs py-2 border-b border-zinc-700/30 last:border-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        team.position <= 3 ? 'bg-primary/30' : team.position >= 8 ? 'bg-red-900/20' : 'bg-zinc-700/50'
                      }`}>
                        {team.position}
                      </div>
                      <div className="truncate">{team.team}</div>
                      <div className="text-center">{team.played}</div>
                      <div className="text-center">{team.won}</div>
                      <div className="text-center">{team.drawn}</div>
                      <div className="text-center">{team.goalDiff > 0 ? '+' : ''}{team.goalDiff}</div>
                      <div className="text-center font-medium">{team.points}</div>
                    </div>
                  ))}
                </div>

                <Button className="btn-pana w-full">
                  View Full Higher League Table
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}