// components/premier-league/MatchesSection.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Heart,
  Filter,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Team = {
  name: string;
  logo: string;
  shortName: string;
  form?: string;
};

type Match = {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  time?: string;
  venue: string;
  league: string;
  isLive: boolean;
  isFeatured: boolean;
  homeScore?: number;
  awayScore?: number;
  viewers?: number;
  importance?: string;
  matchEvents?: string[];
  highlightVideo?: string;
  videoDuration?: string;
  views?: string;
  popularity?: number;
  trending?: boolean;
};

export default function MatchesSection() {
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);

  const matchViews = [
    {
      id: "upcoming",
      label: "Upcoming",
      icon: Calendar,
      color: "text-blue-400",
    },
    { id: "recent", label: "Recent", icon: Clock, color: "text-green-400" },
    {
      id: "highlights",
      label: "Highlights",
      icon: TrendingUp,
      color: "text-purple-400",
    },
    { id: "popular", label: "Popular", icon: Star, color: "text-yellow-400" },
  ];

  const currentView = matchViews[currentViewIndex];

  // Sample match data
  const upcomingMatches: Match[] = [
    {
      id: 1,
      homeTeam: {
        name: "Saint George",
        logo: "/api/placeholder/100/100",
        shortName: "STG",
        form: "W-W-D-W-L",
      },
      awayTeam: {
        name: "Fasil Kenema",
        logo: "/api/placeholder/100/100",
        shortName: "FSK",
        form: "D-W-L-W-W",
      },
      date: "Oct 22, 2025",
      time: "3:00 PM",
      venue: "Addis Ababa Stadium",
      league: "Premier League",
      isLive: false,
      isFeatured: true,
      viewers: 12500,
      importance: "Derby",
    },
    {
      id: 2,
      homeTeam: {
        name: "Mekelle 70 Enderta",
        logo: "/api/placeholder/100/100",
        shortName: "MEK",
        form: "W-L-W-D-W",
      },
      awayTeam: {
        name: "Dire Dawa City",
        logo: "/api/placeholder/100/100",
        shortName: "DDC",
        form: "L-D-W-L-D",
      },
      date: "Oct 22, 2025",
      time: "5:30 PM",
      venue: "Mekelle Stadium",
      league: "Premier League",
      isLive: false,
      isFeatured: false,
      viewers: 8500,
    },
    {
      id: 3,
      homeTeam: {
        name: "Hadiya Hossana",
        logo: "/api/placeholder/100/100",
        shortName: "HAD",
        form: "D-D-W-L-W",
      },
      awayTeam: {
        name: "Bahir Dar Kenema",
        logo: "/api/placeholder/100/100",
        shortName: "BDK",
        form: "W-W-L-D-L",
      },
      date: "Oct 23, 2025",
      time: "2:00 PM",
      venue: "Hossana Stadium",
      league: "Premier League",
      isLive: false,
      isFeatured: false,
      viewers: 7200,
    },
  ];

  const recentMatches: Match[] = [
    {
      id: 4,
      homeTeam: {
        name: "Saint George",
        logo: "/api/placeholder/100/100",
        shortName: "STG",
        form: "W-W-D-W-L",
      },
      awayTeam: {
        name: "Wolaitta Dicha",
        logo: "/api/placeholder/100/100",
        shortName: "WOD",
        form: "L-D-W-L-W",
      },
      date: "Oct 18, 2025",
      time: "3:00 PM",
      venue: "Addis Ababa Stadium",
      league: "Premier League",
      homeScore: 2,
      awayScore: 1,
      isLive: false,
      isFeatured: true,
      viewers: 14200,
      matchEvents: [
        "⚽ 23' Saladin",
        "🟨 45' Tekeste",
        "⚽ 67' Getaneh",
        "🟨 78' Abebe",
      ],
    },
    {
      id: 5,
      homeTeam: {
        name: "Fasil Kenema",
        logo: "/api/placeholder/100/100",
        shortName: "FSK",
        form: "D-W-L-W-W",
      },
      awayTeam: {
        name: "Sebeta City",
        logo: "/api/placeholder/100/100",
        shortName: "SEC",
        form: "W-L-D-L-D",
      },
      date: "Oct 17, 2025",
      time: "4:00 PM",
      venue: "Bahir Dar Stadium",
      league: "Premier League",
      homeScore: 1,
      awayScore: 1,
      isLive: false,
      isFeatured: false,
      viewers: 9800,
    },
  ];

  const highlightMatches: Match[] = [
    {
      id: 7,
      homeTeam: {
        name: "Saint George",
        logo: "/api/placeholder/100/100",
        shortName: "STG",
      },
      awayTeam: {
        name: "Fasil Kenema",
        logo: "/api/placeholder/100/100",
        shortName: "FSK",
      },
      date: "Oct 18, 2025",
      time: "3:00 PM",
      venue: "Addis Ababa Stadium",
      league: "Premier League",
      homeScore: 2,
      awayScore: 1,
      isLive: false,
      isFeatured: true,
      highlightVideo: "/api/placeholder/320/180",
      videoDuration: "4:23",
      views: "12.4K",
    },
    {
      id: 8,
      homeTeam: {
        name: "Mekelle 70 Enderta",
        logo: "/api/placeholder/100/100",
        shortName: "MEK",
      },
      awayTeam: {
        name: "Dire Dawa City",
        logo: "/api/placeholder/100/100",
        shortName: "DDC",
      },
      date: "Oct 15, 2025",
      time: "5:00 PM",
      venue: "Mekelle Stadium",
      league: "Premier League",
      homeScore: 2,
      awayScore: 2,
      isLive: false,
      isFeatured: true,
      highlightVideo: "/api/placeholder/320/180",
      videoDuration: "3:45",
      views: "8.7K",
    },
  ];

  const popularMatches: Match[] = [
    {
      id: 9,
      homeTeam: {
        name: "Saint George",
        logo: "/api/placeholder/100/100",
        shortName: "STG",
      },
      awayTeam: {
        name: "Mekelle 70 Enderta",
        logo: "/api/placeholder/100/100",
        shortName: "MEK",
      },
      date: "Oct 22, 2025",
      time: "3:00 PM",
      venue: "Addis Ababa Stadium",
      league: "Premier League",
      isLive: false,
      isFeatured: true,
      popularity: 98,
      trending: true,
    },
    {
      id: 10,
      homeTeam: {
        name: "Fasil Kenema",
        logo: "/api/placeholder/100/100",
        shortName: "FSK",
      },
      awayTeam: {
        name: "Dire Dawa City",
        logo: "/api/placeholder/100/100",
        shortName: "DDC",
      },
      date: "Oct 22, 2025",
      time: "5:30 PM",
      venue: "Bahir Dar Stadium",
      league: "Premier League",
      isLive: false,
      isFeatured: true,
      popularity: 92,
    },
  ];

  const getMatchesForView = () => {
    switch (currentView.id) {
      case "upcoming":
        return upcomingMatches;
      case "recent":
        return recentMatches;
      case "highlights":
        return highlightMatches;
      case "popular":
        return popularMatches;
      default:
        return upcomingMatches;
    }
  };

  const toggleFavorite = (matchId: number) => {
    setFavorites((prev) =>
      prev.includes(matchId)
        ? prev.filter((id) => id !== matchId)
        : [...prev, matchId]
    );
  };

  const handlePreviousView = () => {
    setCurrentViewIndex((prev) =>
      prev === 0 ? matchViews.length - 1 : prev - 1
    );
  };

  const handleNextView = () => {
    setCurrentViewIndex((prev) =>
      prev === matchViews.length - 1 ? 0 : prev + 1
    );
  };

  // Get form result color
  const getFormColor = (result: string) => {
    switch (result) {
      case "W":
        return "bg-green-500";
      case "D":
        return "bg-yellow-500";
      case "L":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
            Premier League Matches
          </h2>
          <p className="text-muted-foreground mt-1 sm:mt-2">
            Stay updated with the latest Ethiopian Premier League action
          </p>
        </div>

        {/* Enhanced View Navigation - Mobile Optimized */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-zinc-800/30 backdrop-blur-sm rounded-2xl p-1 border border-zinc-700/50">
            {matchViews.map((view, index) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => setCurrentViewIndex(index)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                    index === currentViewIndex
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-zinc-700/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{view.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile View Selector */}
          <div className="sm:hidden flex items-center bg-zinc-800/30 backdrop-blur-sm rounded-full p-1 border border-zinc-700/50">
            <select
              value={currentView.id}
              onChange={(e) => {
                const index = matchViews.findIndex(
                  (v) => v.id === e.target.value
                );
                if (index !== -1) setCurrentViewIndex(index);
              }}
              className="bg-transparent text-sm font-medium outline-none appearance-none"
            >
              {matchViews.map((view) => (
                <option key={view.id} value={view.id}>
                  {view.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60 transition-all duration-300"
              onClick={handlePreviousView}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60 transition-all duration-300"
              onClick={handleNextView}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Matches Grid - Mobile First */}
      <div className="space-y-4 sm:space-y-6">
        {getMatchesForView().map((match) => (
          <div
            key={match.id}
            className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 group"
          >
            {/* Match Card Header - Mobile Optimized */}
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "p-2 rounded-xl bg-linear-to-br from-secondary/30 to-secondary/10 border border-secondary/50",
                      currentView.color
                    )}
                  >
                    {(() => {
                      const IconComponent = currentView.icon;
                      return <IconComponent className="h-4 w-4" />;
                    })()}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-sm font-semibold text-foreground/90">
                      {currentView.label}
                    </span>
                    {match.importance && (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs"
                      >
                        {match.importance}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {match.date}
                      {match.time && ` • ${match.time}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {match.isFeatured && (
                    <Badge className="bg-linear-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-lg shadow-primary/20 text-xs">
                      Featured
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-xl transition-all duration-300",
                      favorites.includes(match.id)
                        ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
                        : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    )}
                    onClick={() => toggleFavorite(match.id)}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-all",
                        favorites.includes(match.id) && "fill-current"
                      )}
                    />
                  </Button>
                </div>
              </div>

              {/* Video Highlight Section - Mobile Optimized */}
              {currentView.id === "highlights" && match.highlightVideo && (
                <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden mb-4 group/video">
                  <img
                    src={match.highlightVideo}
                    alt="Match highlight"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/video:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
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

              {/* Teams & Score Section - Mobile Optimized */}
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Home Team */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-700/50 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-xs sm:text-sm font-bold">
                        {match.homeTeam.shortName}
                      </span>
                    </div>
                    <span className="text-sm sm:text-base font-medium text-center">
                      {match.homeTeam.name}
                    </span>
                    {match.homeTeam.form && (
                      <div className="flex gap-1 mt-1">
                        {match.homeTeam.form
                          .split("-")
                          .map((result: string, index: number) => (
                            <div
                              key={index}
                              className={cn(
                                "w-2 h-2 sm:w-3 sm:h-3 rounded-full",
                                getFormColor(result)
                              )}
                            />
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Score/VS Section */}
                  <div className="flex flex-col items-center justify-center gap-2 px-4">
                    {match.homeScore !== undefined ? (
                      <>
                        <div className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                          {match.homeScore} - {match.awayScore}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Full Time
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-xl sm:text-2xl font-bold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                          VS
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Upcoming
                        </div>
                      </>
                    )}
                    {match.isLive && (
                      <Badge
                        variant="destructive"
                        className="mt-2 animate-pulse px-2 py-1 text-xs"
                      >
                        LIVE
                      </Badge>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-700/50 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-xs sm:text-sm font-bold">
                        {match.awayTeam.shortName}
                      </span>
                    </div>
                    <span className="text-sm sm:text-base font-medium text-center">
                      {match.awayTeam.name}
                    </span>
                    {match.awayTeam.form && (
                      <div className="flex gap-1 mt-1">
                        {match.awayTeam.form
                          .split("-")
                          .map((result: string, index: number) => (
                            <div
                              key={index}
                              className={cn(
                                "w-2 h-2 sm:w-3 sm:h-3 rounded-full",
                                getFormColor(result)
                              )}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Match Events - Mobile Optimized */}
                {match.matchEvents && (
                  <div className="bg-zinc-800/30 rounded-xl p-3 sm:p-4 mt-3">
                    <div className="text-xs text-muted-foreground font-medium mb-2">
                      Match Events
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
                      {match.matchEvents.map((event: string, index: number) => (
                        <div key={index} className="text-xs text-foreground/80">
                          {event}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Section - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-zinc-700/30 gap-3 sm:gap-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{match.venue}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    <span>{match.league}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {match.viewers && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{match.viewers.toLocaleString()}</span>
                    </div>
                  )}

                  {currentView.id === "popular" && match.popularity && (
                    <div className="flex items-center gap-1 text-xs">
                      <TrendingUp className="h-3 w-3 text-yellow-500" />
                      <span className="text-yellow-500 font-semibold">
                        {match.popularity}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced View All Button - Mobile Optimized */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="bg-linear-to-r from-zinc-800/40 to-zinc-800/20 border-zinc-700/50 hover:border-primary/30 hover:bg-primary/10 hover:scale-105 transition-all duration-300 px-6 sm:px-8 py-3 rounded-2xl font-semibold group"
        >
          View All Matches
          <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>

      {/* Match Detail Modal - Mobile Optimized */}
      {selectedMatch &&
        (() => {
          const match = [
            ...upcomingMatches,
            ...recentMatches,
            ...highlightMatches,
            ...popularMatches,
          ].find((m) => m.id === selectedMatch);
          if (!match) return null;

          return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-zinc-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header - Mobile Optimized */}
                <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-xl bg-linear-to-br from-secondary/30 to-secondary/10 border border-secondary/50",
                        currentView.color
                      )}
                    >
                      {(() => {
                        const IconComponent = currentView.icon;
                        return <IconComponent className="h-4 w-4" />;
                      })()}
                    </div>
                    <h3 className="text-lg font-semibold">{`${currentView.label} Match Details`}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedMatch(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Modal Content - Mobile Optimized */}
                <div className="p-4 sm:p-6">
                  {/* Match Header */}
                  <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-zinc-700/50 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold">
                          {match.homeTeam.shortName}
                        </span>
                      </div>
                      <div className="text-2xl font-bold">
                        {match.homeScore !== undefined
                          ? `${match.homeScore} - ${match.awayScore}`
                          : "VS"}
                      </div>
                      <div className="w-16 h-16 bg-zinc-700/50 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold">
                          {match.awayTeam.shortName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {match.isLive && (
                        <Badge
                          variant="destructive"
                          className="animate-pulse px-3 py-1"
                        >
                          LIVE
                        </Badge>
                      )}
                      {match.isFeatured && (
                        <Badge className="bg-linear-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-lg">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Match Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Match Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Date
                          </span>
                          <span className="text-sm font-medium">
                            {match.date}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Time
                          </span>
                          <span className="text-sm font-medium">
                            {match.time ?? "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Venue
                          </span>
                          <span className="text-sm font-medium">
                            {match.venue}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            League
                          </span>
                          <span className="text-sm font-medium">
                            {match.league}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Teams
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-zinc-700/50 rounded-xl flex items-center justify-center">
                              <span className="text-xs font-bold">
                                {match.homeTeam.shortName}
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              {match.homeTeam.name}
                            </span>
                          </div>
                          {match.homeScore !== undefined && (
                            <span className="text-lg font-bold">
                              {match.homeScore}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-zinc-700/50 rounded-xl flex items-center justify-center">
                              <span className="text-xs font-bold">
                                {match.awayTeam.shortName}
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              {match.awayTeam.name}
                            </span>
                          </div>
                          {match.awayScore !== undefined && (
                            <span className="text-lg font-bold">
                              {match.awayScore}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Events */}
                  {match.matchEvents && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        Match Events
                      </h4>
                      <div className="bg-zinc-800/30 rounded-xl p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {match.matchEvents.map(
                            (event: string, index: number) => (
                              <div
                                key={index}
                                className="text-sm text-foreground/80"
                              >
                                {event}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Video Highlight */}
                  {currentView.id === "highlights" && match.highlightVideo && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        Match Highlights
                      </h4>
                      <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden">
                        <img
                          src={match.highlightVideo}
                          alt="Match highlight"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <div className="text-white text-sm font-medium">
                            Duration: {match.videoDuration ?? "-"}
                          </div>
                          <div className="flex items-center gap-1 text-white/80 text-xs">
                            <Eye className="h-3 w-3" />
                            {match.views ?? "0"} Views
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1 btn-pana">
                      {match.homeScore !== undefined
                        ? "View Full Match Report"
                        : "Set Reminder"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60"
                    >
                      {match.homeScore !== undefined
                        ? "View Match Statistics"
                        : "Add to Calendar"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
