// components/premier-league/MatchesSection.tsx
"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  Star, 
  Play,
  MapPin,
  Trophy,
  Eye,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MatchesSection() {
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const matchViews = [
    { id: 'upcoming', label: 'Upcoming', icon: Calendar, color: 'text-blue-400' },
    { id: 'recent', label: 'Recent', icon: Clock, color: 'text-green-400' },
    { id: 'highlights', label: 'Highlights', icon: TrendingUp, color: 'text-purple-400' },
    { id: 'popular', label: 'Popular', icon: Star, color: 'text-yellow-400' }
  ];

  const currentView = matchViews[currentViewIndex];

  // Sample match data
  const upcomingMatches = [
    {
      id: 1,
      homeTeam: { 
        name: 'Saint George', 
        logo: '/api/placeholder/100/100', 
        shortName: 'STG',
        form: 'W-W-D-W-L'
      },
      awayTeam: { 
        name: 'Fasil Kenema', 
        logo: '/api/placeholder/100/100', 
        shortName: 'FSK',
        form: 'D-W-L-W-W'
      },
      date: 'Oct 22, 2025',
      time: '3:00 PM',
      venue: 'Addis Ababa Stadium',
      league: 'Premier League',
      isLive: false,
      isFeatured: true,
      viewers: 12500,
      importance: 'Derby'
    },
    {
      id: 2,
      homeTeam: { 
        name: 'Mekelle 70 Enderta', 
        logo: '/api/placeholder/100/100', 
        shortName: 'MEK',
        form: 'W-L-W-D-W'
      },
      awayTeam: { 
        name: 'Dire Dawa City', 
        logo: '/api/placeholder/100/100', 
        shortName: 'DDC',
        form: 'L-D-W-L-D'
      },
      date: 'Oct 22, 2025',
      time: '5:30 PM',
      venue: 'Mekelle Stadium',
      league: 'Premier League',
      isLive: false,
      isFeatured: false,
      viewers: 8500
    },
    {
      id: 3,
      homeTeam: { 
        name: 'Hadiya Hossana', 
        logo: '/api/placeholder/100/100', 
        shortName: 'HAD',
        form: 'D-D-W-L-W'
      },
      awayTeam: { 
        name: 'Bahir Dar Kenema', 
        logo: '/api/placeholder/100/100', 
        shortName: 'BDK',
        form: 'W-W-L-D-L'
      },
      date: 'Oct 23, 2025',
      time: '2:00 PM',
      venue: 'Hossana Stadium',
      league: 'Premier League',
      isLive: false,
      isFeatured: false,
      viewers: 7200
    }
  ];

  const recentMatches = [
    {
      id: 4,
      homeTeam: { 
        name: 'Saint George', 
        logo: '/api/placeholder/100/100', 
        shortName: 'STG',
        form: 'W-W-D-W-L'
      },
      awayTeam: { 
        name: 'Wolaitta Dicha', 
        logo: '/api/placeholder/100/100', 
        shortName: 'WOD',
        form: 'L-D-W-L-W'
      },
      date: 'Oct 18, 2025',
      time: '3:00 PM',
      venue: 'Addis Ababa Stadium',
      league: 'Premier League',
      homeScore: 2,
      awayScore: 1,
      isLive: false,
      isFeatured: true,
      viewers: 14200,
      matchEvents: ['⚽ 23\' Saladin', '🟨 45\' Tekeste', '⚽ 67\' Getaneh', '🟨 78\' Abebe']
    },
    {
      id: 5,
      homeTeam: { 
        name: 'Fasil Kenema', 
        logo: '/api/placeholder/100/100', 
        shortName: 'FSK',
        form: 'D-W-L-W-W'
      },
      awayTeam: { 
        name: 'Sebeta City', 
        logo: '/api/placeholder/100/100', 
        shortName: 'SEC',
        form: 'W-L-D-L-D'
      },
      date: 'Oct 17, 2025',
      time: '4:00 PM',
      venue: 'Bahir Dar Stadium',
      league: 'Premier League',
      homeScore: 1,
      awayScore: 1,
      isLive: false,
      isFeatured: false,
      viewers: 9800
    }
  ];

  const highlightMatches = [
    {
      id: 7,
      homeTeam: { 
        name: 'Saint George', 
        logo: '/api/placeholder/100/100', 
        shortName: 'STG' 
      },
      awayTeam: { 
        name: 'Fasil Kenema', 
        logo: '/api/placeholder/100/100', 
        shortName: 'FSK' 
      },
      date: 'Oct 18, 2025',
      time: '3:00 PM',
      venue: 'Addis Ababa Stadium',
      league: 'Premier League',
      homeScore: 2,
      awayScore: 1,
      isLive: false,
      isFeatured: true,
      highlightVideo: '/api/placeholder/320/180',
      videoDuration: '4:23',
      views: '12.4K'
    },
    {
      id: 8,
      homeTeam: { 
        name: 'Mekelle 70 Enderta', 
        logo: '/api/placeholder/100/100', 
        shortName: 'MEK' 
      },
      awayTeam: { 
        name: 'Dire Dawa City', 
        logo: '/api/placeholder/100/100', 
        shortName: 'DDC' 
      },
      date: 'Oct 15, 2025',
      time: '5:00 PM',
      venue: 'Mekelle Stadium',
      league: 'Premier League',
      homeScore: 2,
      awayScore: 2,
      isLive: false,
      isFeatured: true,
      highlightVideo: '/api/placeholder/320/180',
      videoDuration: '3:45',
      views: '8.7K'
    }
  ];

  const popularMatches = [
    {
      id: 9,
      homeTeam: { 
        name: 'Saint George', 
        logo: '/api/placeholder/100/100', 
        shortName: 'STG' 
      },
      awayTeam: { 
        name: 'Mekelle 70 Enderta', 
        logo: '/api/placeholder/100/100', 
        shortName: 'MEK' 
      },
      date: 'Oct 22, 2025',
      time: '3:00 PM',
      venue: 'Addis Ababa Stadium',
      league: 'Premier League',
      isLive: false,
      isFeatured: true,
      popularity: 98,
      trending: true
    },
    {
      id: 10,
      homeTeam: { 
        name: 'Fasil Kenema', 
        logo: '/api/placeholder/100/100', 
        shortName: 'FSK' 
      },
      awayTeam: { 
        name: 'Dire Dawa City', 
        logo: '/api/placeholder/100/100', 
        shortName: 'DDC' 
      },
      date: 'Oct 22, 2025',
      time: '5:30 PM',
      venue: 'Bahir Dar Stadium',
      league: 'Premier League',
      isLive: false,
      isFeatured: true,
      popularity: 92
    }
  ];

  const getMatchesForView = () => {
    switch (currentView.id) {
      case 'upcoming':
        return upcomingMatches;
      case 'recent':
        return recentMatches;
      case 'highlights':
        return highlightMatches;
      case 'popular':
        return popularMatches;
      default:
        return upcomingMatches;
    }
  };

  const toggleFavorite = (matchId: number) => {
    setFavorites(prev => 
      prev.includes(matchId) 
        ? prev.filter(id => id !== matchId)
        : [...prev, matchId]
    );
  };

  const handlePreviousView = () => {
    setCurrentViewIndex((prev) => (prev === 0 ? matchViews.length - 1 : prev - 1));
  };

  const handleNextView = () => {
    setCurrentViewIndex((prev) => (prev === matchViews.length - 1 ? 0 : prev + 1));
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MatchCard = ({ match, viewType }: { match: any; viewType: string }) => {
    const IconComponent = currentView.icon;
    const isFavorite = favorites.includes(match.id);
    
    return (
      <Card className="group relative bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 hover:scale-[1.02]">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardContent className="p-6 relative z-10">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-xl bg-gradient-to-br from-background to-secondary/30 border border-border/50",
                currentView.color
              )}>
                <IconComponent className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground/90">{currentView.label}</span>
                  {match.importance && (
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                      {match.importance}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {match.date} • {match.time}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {match.isFeatured && (
                <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-lg shadow-primary/20">
                  Featured
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-lg transition-all duration-300",
                  isFavorite 
                    ? "text-red-500 bg-red-500/10 hover:bg-red-500/20" 
                    : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                )}
                onClick={() => toggleFavorite(match.id)}
              >
                <Heart className={cn("h-4 w-4 transition-all", isFavorite && "fill-current")} />
              </Button>
            </div>
          </div>
          
          {/* Video Highlight Section */}
          {viewType === 'highlights' && match.highlightVideo && (
            <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 group/video">
              <img 
                src={match.highlightVideo} 
                alt="Match highlight" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover/video:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div className="text-white text-sm font-medium">
                  Highlights • {match.videoDuration}
                </div>
                <div className="flex items-center gap-1 text-white/80 text-xs">
                  <Eye className="h-3 w-3" />
                  {match.views}
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
                <Button className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 rounded-full px-6 py-3 shadow-2xl">
                  <Play className="h-5 w-5 mr-2" />
                  Play Highlights
                </Button>
              </div>
            </div>
          )}
          
          {/* Teams & Score Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              {/* Home Team */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/40 to-secondary/10 border border-border/30 flex items-center justify-center mb-2 shadow-lg">
                  <span className="text-lg font-black bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {match.homeTeam.shortName}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground/90 leading-tight">
                  {match.homeTeam.name}
                </span>
                {match.homeTeam.form && (
                  <div className="flex gap-1 mt-1">
                    {match.homeTeam.form.split('-').map((result: string, index: number) => (
                      <div
                        key={index}
                        className={cn(
                          "w-2 h-2 rounded-full",
                          result === 'W' && "bg-green-500",
                          result === 'D' && "bg-yellow-500",
                          result === 'L' && "bg-red-500"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Score/VS Section */}
              <div className="flex flex-col items-center mx-4">
                {match.homeScore !== undefined ? (
                  <>
                    <div className="text-3xl font-black bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                      {match.homeScore} - {match.awayScore}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Full Time</div>
                  </>
                ) : (
                  <>
                    <div className="text-xl font-black bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-1">
                      VS
                    </div>
                    <div className="text-xs text-muted-foreground">Upcoming</div>
                  </>
                )}
                {match.isLive && (
                  <Badge variant="destructive" className="mt-2 animate-pulse px-2 py-1 text-xs">
                    LIVE
                  </Badge>
                )}
              </div>
              
              {/* Away Team */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/40 to-secondary/10 border border-border/30 flex items-center justify-center mb-2 shadow-lg">
                  <span className="text-lg font-black bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {match.awayTeam.shortName}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground/90 leading-tight">
                  {match.awayTeam.name}
                </span>
                {match.awayTeam.form && (
                  <div className="flex gap-1 mt-1">
                    {match.awayTeam.form.split('-').map((result: string, index: number) => (
                      <div
                        key={index}
                        className={cn(
                          "w-2 h-2 rounded-full",
                          result === 'W' && "bg-green-500",
                          result === 'D' && "bg-yellow-500",
                          result === 'L' && "bg-red-500"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Match Events */}
            {match.matchEvents && (
              <div className="bg-secondary/20 rounded-lg p-3 mt-3">
                <div className="text-xs text-muted-foreground font-medium mb-2">Match Events</div>
                <div className="space-y-1">
                  {match.matchEvents.slice(0, 3).map((event: string, index: number) => (
                    <div key={index} className="text-xs text-foreground/80">
                      {event}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Footer Section */}
          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {match.venue}
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                {match.league}
              </div>
            </div>
            
            {match.viewers && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                {match.viewers.toLocaleString()}
              </div>
            )}
            
            {viewType === 'popular' && (
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-yellow-500" />
                <span className="text-yellow-500 font-semibold">{match.popularity}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
            Premier League Matches
          </h2>
          <p className="text-muted-foreground mt-2">
            Stay updated with the latest Ethiopian Premier League action
          </p>
        </div>
        
        {/* Enhanced View Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-secondary/20 backdrop-blur-sm rounded-2xl p-1 border border-border/30">
            {matchViews.map((view, index) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => setCurrentViewIndex(index)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                    index === currentViewIndex 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {view.label}
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-xl bg-background/50 border-border/50 hover:bg-secondary/40 hover:border-primary/30 transition-all duration-300"
              onClick={handlePreviousView}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-xl bg-background/50 border-border/50 hover:bg-secondary/40 hover:border-primary/30 transition-all duration-300"
              onClick={handleNextView}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Enhanced Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {getMatchesForView().map((match) => (
          <MatchCard key={match.id} match={match} viewType={currentView.id} />
        ))}
      </div>
      
      {/* Enhanced View All Button */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          className="bg-gradient-to-r from-background/80 to-secondary/20 border-border/50 hover:border-primary/30 hover:bg-primary/10 hover:scale-105 transition-all duration-300 px-8 py-3 rounded-2xl font-semibold group"
        >
          View All Matches
          <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}