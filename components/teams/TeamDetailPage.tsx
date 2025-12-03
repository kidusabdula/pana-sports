"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Calendar,
  MapPin,
  Globe,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Shield,
  ChevronRight,
  Goal,
  Square,
  Triangle,
  Circle,
} from "lucide-react";
import { useTeamDetail } from "@/lib/hooks/public/useTeamDetail";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface TeamDetailPageProps {
  teamId: string;
}

export default function TeamDetailPage({ teamId }: TeamDetailPageProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  const { data: team, isLoading, error } = useTeamDetail(teamId);

  // Combine and sort recent matches
  const recentMatches = useMemo(() => {
    if (!team) return [];

    const allMatches = [
      ...(team.home_matches || []).map((m) => ({
        ...m,
        isHome: true as const,
      })),
      ...(team.away_matches || []).map((m) => ({
        ...m,
        isHome: false as const,
      })),
    ];

    return allMatches
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [team]);

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Error loading team data
          </h2>
          <p className="text-zinc-400 mb-6">Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Handle case where team data is not available
  if (!team) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Team Not Found</h2>
          <p className="text-zinc-400 mb-6">
            The team you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Get status color based on match status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "live":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "upcoming":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
    }
  };

  // Get event icon based on event type
  const getEventIcon = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case "goal":
        return <Goal className="h-3 w-3 text-green-400" />;
      case "yellow_card":
        return <Square className="h-3 w-3 text-yellow-400" />;
      case "red_card":
        return <Square className="h-3 w-3 text-red-400" />;
      case "substitution":
        return <Triangle className="h-3 w-3 text-blue-400" />;
      default:
        return <Circle className="h-3 w-3 text-zinc-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white"
            onClick={() => router.back()}
          >
            <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Team Info Hero Card */}
        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
          <CardHeader className="pb-3 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center">
                  <Image
                    src={team?.logo_url || ""}
                    alt={team?.name_en || ""}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {team?.name_en}
                  </h1>
                  <p className="text-zinc-400">{team?.name_am}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className="bg-zinc-800/50 text-zinc-300 border-zinc-700/50"
                    >
                      {team?.league?.name_en}
                    </Badge>
                    {team?.is_active && (
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-400 border-green-500/30"
                      >
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Team Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-sm text-zinc-500">Founded</p>
                      <p className="text-white font-medium">
                        {team?.founded || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-sm text-zinc-500">Stadium</p>
                      <p className="text-white font-medium">
                        {team?.stadium_en || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-sm text-zinc-500">Website</p>
                      {team?.website_url ? (
                        <a
                          href={team.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Visit Website
                        </a>
                      ) : (
                        <p className="text-white font-medium">N/A</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Season Performance
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-sm text-zinc-500">League Position</p>
                      <p className="text-white font-medium">
                        #{team?.standing?.rank || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-sm text-zinc-500">Points</p>
                      <p className="text-white font-medium">
                        {team?.standing?.points || "0"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-sm text-zinc-500">Goal Difference</p>
                      <p className="text-white font-medium">
                        {team?.standing?.gd > 0 ? "+" : ""}
                        {team?.standing?.gd || "0"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-zinc-800/40 backdrop-blur-sm border border-white/5 p-1 rounded-xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-zinc-800 text-white data-[state=active]:shadow-lg"
            >
              <Shield className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="players"
              className="data-[state=active]:bg-zinc-800 text-white data-[state=active]:shadow-lg"
            >
              <Users className="h-4 w-4 mr-2" />
              Players
            </TabsTrigger>
            <TabsTrigger
              value="matches"
              className="data-[state=active]:bg-zinc-800 text-white data-[state=active]:shadow-lg"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Matches
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-lg text-white">
                  Team Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-zinc-300">
                    {team?.description_en || "No description available."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Matches */}
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Recent Matches
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {recentMatches.length > 0 ? (
                  <div className="space-y-1">
                    {recentMatches.map((match) => {
                      const homeTeam = match.isHome
                        ? {
                            id: team.id,
                            name_en: team.name_en,
                            name_am: team.name_am,
                            slug: team.slug,
                            logo_url: team.logo_url,
                          }
                        : match.home_team;
                      const awayTeam = match.isHome
                        ? match.away_team
                        : {
                            id: team.id,
                            name_en: team.name_en,
                            name_am: team.name_am,
                            slug: team.slug,
                            logo_url: team.logo_url,
                          };

                      return (
                        <div key={match.id} className="flex flex-col">
                          <div className="flex items-center justify-between p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700">
                                <Image
                                  src={homeTeam?.logo_url || ""}
                                  alt={homeTeam?.name_en || ""}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="text-white font-medium">
                                  {homeTeam?.name_en}
                                </div>
                                <div className="text-zinc-400 text-sm flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {match.venue?.city || "N/A"}
                                </div>
                              </div>
                            </div>
                            <div className="text-center px-4">
                              <div className="text-lg font-bold text-white">
                                {match.score_home} - {match.score_away}
                              </div>
                              <div className="flex items-center justify-center gap-2 mt-1">
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium border",
                                    getStatusColor(match.status)
                                  )}
                                >
                                  {match.status}
                                </span>
                                {match.status === "live" && (
                                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {match.minute}&apos;
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-zinc-500 mt-1">
                                {formatDate(match.date)}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 flex-1 justify-end">
                              <div className="flex-1 text-right">
                                <div className="text-white font-medium">
                                  {awayTeam?.name_en}
                                </div>
                              </div>
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700">
                                <Image
                                  src={awayTeam?.logo_url || ""}
                                  alt={awayTeam?.name_en || ""}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-zinc-400">
                    No recent matches available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Players Tab */}
          <TabsContent value="players" className="mt-6">
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Squad ({team?.players?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {team?.players && team.players.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="text-left p-3 text-zinc-400 font-medium">
                            Number
                          </th>
                          <th className="text-left p-3 text-zinc-400 font-medium">
                            Name
                          </th>
                          <th className="text-left p-3 text-zinc-400 font-medium">
                            Position
                          </th>
                          <th className="text-left p-3 text-zinc-400 font-medium">
                            Age
                          </th>
                          <th className="text-left p-3 text-zinc-400 font-medium">
                            Nationality
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {team.players.map((player) => (
                          <tr
                            key={player.id}
                            className="border-b border-zinc-800 hover:bg-zinc-800/30 cursor-pointer transition-colors"
                            onClick={() => router.push(`/players/${player.id}`)}
                          >
                            <td className="p-3 text-white">
                              {player.jersey_number || "N/A"}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                {player.photo_url && (
                                  <Image
                                    src={player.photo_url}
                                    alt={player.name_en}
                                    width={24}
                                    height={24}
                                    className="rounded-full object-cover"
                                  />
                                )}
                                <span className="text-white">
                                  {player.name_en}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-zinc-300">
                              {player.position_en || "N/A"}
                            </td>
                            <td className="p-3 text-zinc-300">
                              {player.dob ? calculateAge(player.dob) : "N/A"}
                            </td>
                            <td className="p-3 text-zinc-300">
                              {player.nationality || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-zinc-400">
                    No players available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches" className="mt-6 space-y-6">
            {/* Home Matches */}
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Home Matches
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {team?.home_matches && team.home_matches.length > 0 ? (
                  <div className="space-y-1">
                    {team.home_matches.slice(0, 5).map((match) => (
                      <div
                        key={match.id}
                        className="flex items-center justify-between p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700">
                            <Image
                              src={team.logo_url || ""}
                              alt={team.name_en || ""}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium">
                              {team.name_en}
                            </div>
                            <div className="text-zinc-400 text-sm flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {match.venue?.city || "N/A"}
                            </div>
                          </div>
                        </div>
                        <div className="text-center px-4">
                          <div className="text-lg font-bold text-white">
                            {match.score_home} - {match.score_away}
                          </div>
                          <div className="flex items-center justify-center gap-2 mt-1">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium border",
                                getStatusColor(match.status)
                              )}
                            >
                              {match.status}
                            </span>
                            {match.status === "live" && (
                              <span className="text-xs text-zinc-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {match.minute}&apos;
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-500 mt-1">
                            {formatDate(match.date)}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-1 justify-end">
                          <div className="flex-1 text-right">
                            <div className="text-white font-medium">
                              {match.away_team?.name_en}
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700">
                            <Image
                              src={match.away_team?.logo_url || ""}
                              alt={match.away_team?.name_en || ""}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-zinc-400">
                    No home matches available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Away Matches */}
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Away Matches
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {team?.away_matches && team.away_matches.length > 0 ? (
                  <div className="space-y-1">
                    {team.away_matches.slice(0, 5).map((match) => (
                      <div
                        key={match.id}
                        className="flex items-center justify-between p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700">
                            <Image
                              src={match.home_team?.logo_url || ""}
                              alt={match.home_team?.name_en || ""}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium">
                              {match.home_team?.name_en}
                            </div>
                          </div>
                        </div>
                        <div className="text-center px-4">
                          <div className="text-lg font-bold text-white">
                            {match.score_home} - {match.score_away}
                          </div>
                          <div className="flex items-center justify-center gap-2 mt-1">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium border",
                                getStatusColor(match.status)
                              )}
                            >
                              {match.status}
                            </span>
                            {match.status === "live" && (
                              <span className="text-xs text-zinc-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {match.minute}&apos;
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-500 mt-1">
                            {formatDate(match.date)}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-1 justify-end">
                          <div className="flex-1 text-right">
                            <div className="text-white font-medium">
                              {team.name_en}
                            </div>
                            <div className="text-zinc-400 text-sm flex items-center gap-1 justify-end">
                              <MapPin className="h-3 w-3" />
                              {match.venue?.city || "N/A"}
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700">
                            <Image
                              src={team.logo_url || ""}
                              alt={team.name_en || ""}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-zinc-400">
                    No away matches available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
