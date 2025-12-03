"use client";

import { usePlayerDetail } from "@/lib/hooks/public/usePlayerDetail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Target,
  TrendingUp,
  Award,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
  Activity,
  Globe,
  Shield,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PlayerDetailPageProps {
  playerId: string;
}

export function PlayerDetailPage({ playerId }: PlayerDetailPageProps) {
  const { data: playerData, isLoading, error } = usePlayerDetail(playerId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !playerData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Player Not Found
          </h1>
          <p className="text-zinc-400 mb-6">
            The player you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { player, topScorerStats } = playerData;
  const age = player.dob
    ? Math.floor(
        (new Date().getTime() - new Date(player.dob).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;
  const contractYears = player.contract_until
    ? Math.floor(
        (new Date(player.contract_until).getTime() - new Date().getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
            >
              <Bookmark className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Player Hero Card */}
        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
          <CardHeader className="pb-3 border-b border-white/5">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Player Photo */}
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-white/10 bg-linear-to-br from-white/10 to-transparent">
                  <Image
                    src={player.photo_url || ""}
                    alt={player.name_en}
                    width={160}
                    height={160}
                    className="object-cover"
                  />
                </div>
                {player.jersey_number && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-zinc-900">
                    <span className="text-white font-bold text-sm">
                      {player.jersey_number}
                    </span>
                  </div>
                )}
              </div>

              {/* Player Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {player.name_en}
                </h1>
                <p className="text-zinc-400 mb-4">{player.name_am}</p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                  {player.team && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-zinc-700">
                        <Image
                          src={player.team.logo_url || ""}
                          alt={player.team.name_en}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-zinc-300">
                        {player.team.name_en}
                      </span>
                    </div>
                  )}
                  {player.position_en && (
                    <Badge className="bg-zinc-800/50 text-zinc-300 border-zinc-700/50">
                      {player.position_en}
                    </Badge>
                  )}
                  {age && (
                    <Badge className="bg-zinc-800/50 text-zinc-300 border-zinc-700/50">
                      {age} years
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {player.height_cm && (
                    <Badge className="bg-zinc-800/50 text-zinc-300 border-zinc-700/50">
                      {player.height_cm}cm
                    </Badge>
                  )}
                  {player.weight_kg && (
                    <Badge className="bg-zinc-800/50 text-zinc-300 border-zinc-700/50">
                      {player.weight_kg}kg
                    </Badge>
                  )}
                  {player.nationality && (
                    <Badge className="bg-zinc-800/50 text-zinc-300 border-zinc-700/50">
                      {player.nationality}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-sm text-zinc-500">Date of Birth</p>
                      <p className="text-white font-medium">
                        {player.dob
                          ? format(new Date(player.dob), "MMMM dd, yyyy")
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-sm text-zinc-500">Nationality</p>
                      <p className="text-white font-medium">
                        {player.nationality || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Career Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Career Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-sm text-zinc-500">Contract</p>
                      <p className="text-white font-medium">
                        {contractYears !== null
                          ? contractYears > 0
                            ? `${contractYears} years left (${
                                player.contract_until
                                  ? format(
                                      new Date(player.contract_until),
                                      "yyyy"
                                    )
                                  : "N/A"
                              })`
                            : "Expired"
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-sm text-zinc-500">Market Value</p>
                      <p className="text-white font-medium">
                        {player.market_value || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {player.bio_en && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Biography
                </h3>
                <p className="text-zinc-300 leading-relaxed">{player.bio_en}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Player Stats */}
        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Career Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-800/40 backdrop-blur-sm border border-white/5 p-1 rounded-xl">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-zinc-800 text-white data-[state=active]:shadow-lg"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="seasons"
                  className="data-[state=active]:bg-zinc-800 text-white data-[state=active]:shadow-lg"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Season Stats
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-zinc-800/30 rounded-lg p-6 text-center hover:bg-zinc-800/50 transition-colors border border-white/5">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Target className="h-8 w-8 text-primary" />
                      <span className="text-3xl font-bold text-white">
                        {topScorerStats?.[0]?.goals || 0}
                      </span>
                    </div>
                    <div className="text-sm text-zinc-400">Total Goals</div>
                  </div>
                  <div className="bg-zinc-800/30 rounded-lg p-6 text-center hover:bg-zinc-800/50 transition-colors border border-white/5">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="h-8 w-8 text-primary" />
                      <span className="text-3xl font-bold text-white">
                        {topScorerStats?.[0]?.assists || 0}
                      </span>
                    </div>
                    <div className="text-sm text-zinc-400">Total Assists</div>
                  </div>
                  <div className="bg-zinc-800/30 rounded-lg p-6 text-center hover:bg-zinc-800/50 transition-colors border border-white/5">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Award className="h-8 w-8 text-primary" />
                      <span className="text-3xl font-bold text-white">
                        {(topScorerStats?.[0]?.goals || 0) +
                          (topScorerStats?.[0]?.assists || 0)}
                      </span>
                    </div>
                    <div className="text-sm text-zinc-400">
                      Goal Contributions
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seasons" className="mt-6 p-6">
                <div className="space-y-4">
                  {topScorerStats && topScorerStats.length > 0 ? (
                    <div className="space-y-4">
                      {topScorerStats.map((stat) => (
                        <div
                          key={stat.id}
                          className="bg-zinc-800/30 rounded-lg p-4 hover:bg-zinc-800/50 transition-colors border border-white/5"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {stat.league.logo_url && (
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700">
                                  <Image
                                    src={stat.league.logo_url}
                                    alt={stat.league.name_en}
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                  />
                                </div>
                              )}
                              <div>
                                <h4 className="text-white font-medium">
                                  {stat.league.name_en}
                                </h4>
                                <p className="text-zinc-400 text-sm">
                                  Season {stat.season}
                                </p>
                              </div>
                            </div>
                            {stat.team && (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full overflow-hidden border border-zinc-700">
                                  <Image
                                    src={stat.team.logo_url || ""}
                                    alt={stat.team.name_en}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                  />
                                </div>
                                <span className="text-zinc-300 text-sm">
                                  {stat.team.name_en}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-zinc-900/30 rounded-lg p-3">
                              <div className="text-2xl font-bold text-white">
                                {stat.goals}
                              </div>
                              <div className="text-xs text-zinc-400">Goals</div>
                            </div>
                            <div className="bg-zinc-900/30 rounded-lg p-3">
                              <div className="text-2xl font-bold text-white">
                                {stat.assists}
                              </div>
                              <div className="text-xs text-zinc-400">
                                Assists
                              </div>
                            </div>
                            <div className="bg-zinc-900/30 rounded-lg p-3">
                              <div className="text-2xl font-bold text-white">
                                {stat.goals + stat.assists}
                              </div>
                              <div className="text-xs text-zinc-400">
                                Contributions
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-zinc-400">
                      No statistics available for this player
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1 bg-zinc-800/40 border-white/5 hover:bg-zinc-800/60"
          >
            <User className="mr-2 h-4 w-4" />
            Full Profile
          </Button>
          <Button className="flex-1 bg-primary hover:bg-primary/90">
            <Activity className="mr-2 h-4 w-4" />
            View All Stats
          </Button>
        </div>
      </div>
    </div>
  );
}
