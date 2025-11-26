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
  Activity,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Team = {
  id: number;
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

  // Enhanced match data with real team logos
  const upcomingMatches: Match[] = [
    {
      id: 1,
      homeTeam: {
        id: 94787,
        name: "Saint George",
        logo: "https://img.sofascore.com/api/v1/team/94787/image",
        shortName: "STG",
        form: "W-W-D-W-L",
      },
      awayTeam: {
        id: 273370,
        name: "Fasil Kenema",
        logo: "https://img.sofascore.com/api/v1/team/273370/image",
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
        id: 274479,
        name: "Mekelle 70 Enderta",
        logo: "https://img.sofascore.com/api/v1/team/274479/image",
        shortName: "MEK",
        form: "W-L-W-D-W",
      },
      awayTeam: {
        id: 237728,
        name: "Dire Dawa City",
        logo: "https://img.sofascore.com/api/v1/team/237728/image",
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
        id: 315378,
        name: "Hawassa Kenema",
        logo: "https://img.sofascore.com/api/v1/team/315378/image",
        shortName: "HAW",
        form: "D-D-W-L-W",
      },
      awayTeam: {
        id: 317333,
        name: "Bahir Dar Kenema",
        logo: "https://img.sofascore.com/api/v1/team/317333/image",
        shortName: "BDK",
        form: "W-W-L-D-L",
      },
      date: "Oct 23, 2025",
      time: "2:00 PM",
      venue: "Hawassa Stadium",
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
        id: 94787,
        name: "Saint George",
        logo: "https://img.sofascore.com/api/v1/team/94787/image",
        shortName: "STG",
        form: "W-W-D-W-L",
      },
      awayTeam: {
        id: 277540,
        name: "Wolaitta Dicha",
        logo: "https://img.sofascore.com/api/v1/team/277540/image",
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
        "⚽ 23' Getaneh Kebede",
        "🟨 45' Shimeles Bekele",
        "⚽ 67' Amanuel Assefa",
        "🟨 78' Dawit Fekadu",
      ],
    },
    {
      id: 5,
      homeTeam: {
        id: 273370,
        name: "Fasil Kenema",
        logo: "https://img.sofascore.com/api/v1/team/273370/image",
        shortName: "FSK",
        form: "D-W-L-W-W",
      },
      awayTeam: {
        id: 258167,
        name: "Sebeta City",
        logo: "https://img.sofascore.com/api/v1/team/258167/image",
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
        id: 94787,
        name: "Saint George",
        logo: "https://img.sofascore.com/api/v1/team/94787/image",
        shortName: "STG",
      },
      awayTeam: {
        id: 273370,
        name: "Fasil Kenema",
        logo: "https://img.sofascore.com/api/v1/team/273370/image",
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
        id: 274479,
        name: "Mekelle 70 Enderta",
        logo: "https://img.sofascore.com/api/v1/team/274479/image",
        shortName: "MEK",
      },
      awayTeam: {
        id: 237728,
        name: "Dire Dawa City",
        logo: "https://img.sofascore.com/api/v1/team/237728/image",
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
        id: 94787,
        name: "Saint George",
        logo: "https://img.sofascore.com/api/v1/team/94787/image",
        shortName: "STG",
      },
      awayTeam: {
        id: 274479,
        name: "Mekelle 70 Enderta",
        logo: "https://img.sofascore.com/api/v1/team/274479/image",
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
        id: 273370,
        name: "Fasil Kenema",
        logo: "https://img.sofascore.com/api/v1/team/273370/image",
        shortName: "FSK",
      },
      awayTeam: {
        id: 237728,
        name: "Dire Dawa City",
        logo: "https://img.sofascore.com/api/v1/team/237728/image",
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
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Premier League Matches
          </h2>
          <p className="text-zinc-400 mt-1 sm:mt-2">
            Stay updated with the latest Ethiopian Premier League action
          </p>
        </div>

        {/* Enhanced View Navigation - Mobile Optimized */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-1 border border-white/5">
            {matchViews.map((view, index) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => setCurrentViewIndex(index)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                    index === currentViewIndex
                      ? "bg-zinc-800 text-white shadow-lg"
                      : "text-zinc-500 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{view.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile View Selector */}
          <div className="sm:hidden flex items-center bg-zinc-900/40 backdrop-blur-sm rounded-full p-1 border border-white/5">
            <select
              value={currentView.id}
              onChange={(e) => {
                const index = matchViews.findIndex(
                  (v) => v.id === e.target.value
                );
                if (index !== -1) setCurrentViewIndex(index);
              }}
              className="bg-transparent text-sm font-medium outline-none appearance-none text-white"
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
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl bg-zinc-900/40 border-white/5 hover:bg-zinc-800/60 transition-all duration-300"
              onClick={handlePreviousView}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl bg-zinc-900/40 border-white/5 hover:bg-zinc-800/60 transition-all duration-300"
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
          <Card
            key={match.id}
            className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 group"
          >
            {/* Match Card Header - Mobile Optimized */}
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "p-2 rounded-xl bg-zinc-800/40 border border-white/5",
                      currentView.color
                    )}
                  >
                    {(() => {
                      const IconComponent = currentView.icon;
                      return <IconComponent className="h-4 w-4" />;
                    })()}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-sm font-semibold text-white">
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
                  <div className="text-xs text-zinc-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {match.date}
                      {match.time && ` • ${match.time}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {match.isFeatured && (
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
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
                        : "text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
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
            </CardHeader>

            <CardContent className="p-0">
              {/* Video Highlight Section - Mobile Optimized */}
              {currentView.id === "highlights" && match.highlightVideo && (
                <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden mb-4 group/video">
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

              {/* Teams & Score Section - Mobile Optimized */}
              <div className="px-4 pb-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                  {/* Home Team */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-white/10">
                      <Image
                        src={match.homeTeam.logo}
                        alt={match.homeTeam.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm sm:text-base font-medium text-white text-center">
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
                        <div className="text-2xl sm:text-3xl font-bold text-white">
                          {match.homeScore} - {match.awayScore}
                        </div>
                        <div className="text-xs text-zinc-500">
                          Full Time
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-xl sm:text-2xl font-bold text-primary">
                          VS
                        </div>
                        <div className="text-xs text-zinc-500">
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
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-white/10">
                      <Image
                        src={match.awayTeam.logo}
                        alt={match.awayTeam.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm sm:text-base font-medium text-white text-center">
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
                  <div className="bg-zinc-800/40 rounded-xl p-3 sm:p-4 mb-4 border border-white/5">
                    <div className="text-xs text-zinc-500 font-medium mb-2">
                      Match Events
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
                      {match.matchEvents.map((event: string, index: number) => (
                        <div key={index} className="text-xs text-zinc-300">
                          {event}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Section - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-white/5 gap-3 sm:gap-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-zinc-500">
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
                      <div className="flex items-center gap-1 text-xs text-zinc-500">
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced View All Button - Mobile Optimized */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="bg-zinc-900/40 border-white/5 hover:border-primary/30 hover:bg-primary/10 hover:scale-105 transition-all duration-300 px-6 sm:px-8 py-3 rounded-2xl font-semibold group"
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
              <Card className="bg-zinc-900 border-white/5 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header - Mobile Optimized */}
                <CardHeader className="sticky top-0 bg-zinc-900 border-b border-white/5 p-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-xl bg-zinc-800/40 border border-white/5",
                        currentView.color
                      )}
                    >
                      {(() => {
                        const IconComponent = currentView.icon;
                        return <IconComponent className="h-4 w-4" />;
                      })()}
                    </div>
                    <CardTitle className="text-lg font-semibold text-white">{`${currentView.label} Match Details`}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedMatch(null)}
                    className="text-zinc-500 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </CardHeader>

                {/* Modal Content - Mobile Optimized */}
                <CardContent className="p-4 sm:p-6">
                  {/* Match Header */}
                  <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/10">
                        <Image
                          src={match.homeTeam.logo}
                          alt={match.homeTeam.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {match.homeScore !== undefined
                          ? `${match.homeScore} - ${match.awayScore}`
                          : "VS"}
                      </div>
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/10">
                        <Image
                          src={match.awayTeam.logo}
                          alt={match.awayTeam.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
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
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Match Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-zinc-500">
                        Match Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-zinc-500">
                            Date
                          </span>
                          <span className="text-sm font-medium text-white">
                            {match.date}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-zinc-500">
                            Time
                          </span>
                          <span className="text-sm font-medium text-white">
                            {match.time ?? "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-zinc-500">
                            Venue
                          </span>
                          <span className="text-sm font-medium text-white">
                            {match.venue}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-zinc-500">
                            League
                          </span>
                          <span className="text-sm font-medium text-white">
                            {match.league}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-zinc-500">
                        Teams
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <Image
                                src={match.homeTeam.logo}
                                alt={match.homeTeam.name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </div>
                            <span className="text-sm font-medium text-white">
                              {match.homeTeam.name}
                            </span>
                          </div>
                          {match.homeScore !== undefined && (
                            <span className="text-lg font-bold text-white">
                              {match.homeScore}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <Image
                                src={match.awayTeam.logo}
                                alt={match.awayTeam.name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </div>
                            <span className="text-sm font-medium text-white">
                              {match.awayTeam.name}
                            </span>
                          </div>
                          {match.awayScore !== undefined && (
                            <span className="text-lg font-bold text-white">
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
                      <h4 className="text-sm font-medium text-zinc-500 mb-3">
                        Match Events
                      </h4>
                      <div className="bg-zinc-800/40 rounded-xl p-4 border border-white/5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {match.matchEvents.map(
                            (event: string, index: number) => (
                              <div
                                key={index}
                                className="text-sm text-zinc-300"
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
                      <h4 className="text-sm font-medium text-zinc-500 mb-3">
                        Match Highlights
                      </h4>
                      <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden">
                        <img
                          src={match.highlightVideo}
                          alt="Match highlight"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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
                    <Button className="flex-1 bg-primary hover:bg-primary/90">
                      {match.homeScore !== undefined
                        ? "View Full Match Report"
                        : "Set Reminder"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-zinc-800/40 border-white/5 hover:bg-zinc-800/60"
                    >
                      {match.homeScore !== undefined
                        ? "View Match Statistics"
                        : "Add to Calendar"}
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