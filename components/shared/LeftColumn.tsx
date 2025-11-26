"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Trophy,
  BarChart3,
  ChevronRight,
  Clock,
  Star,
  TrendingUp,
  Users,
  Target,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Helper component for a single compact match row
const MatchRow = ({
  match,
  isLive = false,
}: {
  match: any;
  isLive?: boolean;
}) => (
  <div className="group relative flex items-center justify-between py-3 px-1 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
    {/* Time / Status */}
    <div className="w-12 flex flex-col items-center justify-center gap-1">
      {isLive ? (
        <span className="text-[10px] font-bold text-red-500 animate-pulse">
          {match.minute}'
        </span>
      ) : (
        <span className="text-[10px] font-medium text-zinc-500">
          {match.time || match.status || "FT"}
        </span>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4 text-zinc-600 hover:text-yellow-500 p-0"
      >
        <Star className="h-3 w-3" />
      </Button>
    </div>

    {/* Match Info */}
    <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
      {/* Home Team */}
      <div
        className={cn(
          "flex items-center justify-end gap-2 text-right",
          isLive && match.homeScore > match.awayScore
            ? "font-bold text-white"
            : "text-zinc-300"
        )}
      >
        <span className="truncate hidden sm:block">{match.home}</span>
        <span className="sm:hidden">
          {match.home.substring(0, 3).toUpperCase()}
        </span>
        {/* Team Logo */}
        <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={match.homeLogo || "/team-logos/placeholder.svg"}
            alt={match.home}
            width={20}
            height={20}
            className="object-cover"
          />
        </div>
      </div>

      {/* Score */}
      <div className="px-2 py-0.5 bg-zinc-900/50 rounded-md font-mono text-xs font-bold text-white border border-white/5">
        {isLive || match.status === "FT" ? (
          `${match.homeScore} - ${match.awayScore}`
        ) : (
          <span className="text-zinc-500">VS</span>
        )}
      </div>

      {/* Away Team */}
      <div
        className={cn(
          "flex items-center justify-start gap-2 text-left",
          isLive && match.awayScore > match.homeScore
            ? "font-bold text-white"
            : "text-zinc-300"
        )}
      >
        {/* Team Logo */}
        <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={match.awayLogo || "/team-logos/placeholder.svg"}
            alt={match.away}
            width={20}
            height={20}
            className="object-cover"
          />
        </div>
        <span className="truncate hidden sm:block">{match.away}</span>
        <span className="sm:hidden">
          {match.away.substring(0, 3).toUpperCase()}
        </span>
      </div>
    </div>
  </div>
);

// Standings Table Row Component
const StandingRow = ({ team, position }: { team: any; position: number }) => (
  <div className="grid grid-cols-[2rem_1fr_2rem_2rem_2rem_2rem_2rem_2rem_2rem_3rem] gap-1 px-2 py-2 text-xs border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
    <div className="flex items-center justify-center font-bold text-zinc-500">
      {position}
    </div>
    <div className="flex items-center gap-2 font-medium text-zinc-200 truncate">
      {/* Team Logo */}
      <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={team.logo || "/team-logos/placeholder.svg"}
          alt={team.name}
          width={20}
          height={20}
          className="object-cover"
        />
      </div>
      <span className="truncate">{team.name}</span>
    </div>
    <div className="text-center text-zinc-400">{team.played}</div>
    <div className="text-center text-zinc-400">{team.won}</div>
    <div className="text-center text-zinc-400">{team.drawn}</div>
    <div className="text-center text-zinc-400">{team.lost}</div>
    <div className="text-center text-zinc-400">{team.gf}</div>
    <div className="text-center text-zinc-400">{team.ga}</div>
    <div className="text-center text-zinc-400">{team.gd}</div>
    <div className="text-center font-bold text-white">{team.points}</div>
  </div>
);

// Top Scorer Row Component
const TopScorerRow = ({
  player,
  position,
}: {
  player: any;
  position: number;
}) => (
  <div className="flex items-center gap-3 p-2 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
    <div className="w-6 text-center font-bold text-zinc-500 text-xs">
      {position}
    </div>
    {/* Player Avatar */}
    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
      <Image
        src={player.avatar || "/players/placeholder.svg"}
        alt={player.name}
        width={32}
        height={32}
        className="object-cover"
      />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-zinc-200 truncate">
        {player.name}
      </div>
      <div className="flex items-center gap-1 text-xs text-zinc-500 truncate">
        {/* Team Logo */}
        <div className="w-3 h-3 rounded-full overflow-hidden">
          <Image
            src={player.teamLogo || "/team-logos/placeholder.svg"}
            alt={player.team}
            width={12}
            height={12}
            className="object-cover"
          />
        </div>
        <span>{player.team}</span>
      </div>
    </div>
    <div className="text-right">
      <div className="text-sm font-bold text-white">{player.goals}</div>
      <div className="text-xs text-zinc-500">goals</div>
    </div>
  </div>
);

// Stats Card Component
const StatsCard = ({
  title,
  icon: Icon,
  value,
  subtext,
  color = "primary",
}: {
  title: string;
  icon: any;
  value: string | number;
  subtext: string;
  color?: string;
}) => (
  <div className="bg-zinc-900/40 backdrop-blur-md rounded-xl border border-white/5 p-3">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium text-zinc-400">{title}</span>
      <Icon className={`w-4 h-4 text-${color}`} />
    </div>
    <div className={`text-lg font-bold text-${color}`}>{value}</div>
    <div className="text-xs text-zinc-500">{subtext}</div>
  </div>
);

export default function LeftColumn() {
  const [activeTab, setActiveTab] = useState("matches");

  // Mock data for standings with team logo paths
  const standingsData = [
    {
      name: "Saint George",
      played: 10,
      won: 8,
      drawn: 2,
      lost: 0,
      gf: 22,
      ga: 5,
      gd: 17,
      points: 26,
      logo: "https://img.sofascore.com/api/v1/team/94787/image",
    },
    {
      name: "Fasil Kenema",
      played: 10,
      won: 7,
      drawn: 2,
      lost: 1,
      gf: 18,
      ga: 8,
      gd: 10,
      points: 23,
      logo: "https://img.sofascore.com/api/v1/team/273370/image",
    },
    {
      name: "Mekelle 70 Enderta",
      played: 10,
      won: 6,
      drawn: 3,
      lost: 1,
      gf: 16,
      ga: 9,
      gd: 7,
      points: 21,
      logo: "https://img.sofascore.com/api/v1/team/274479/image",
    },
    {
      name: "Dire Dawa City",
      played: 10,
      won: 5,
      drawn: 3,
      lost: 2,
      gf: 14,
      ga: 10,
      gd: 4,
      points: 18,
      logo: "https://img.sofascore.com/api/v1/team/237728/image",
    },
    {
      name: "Bahir Dar Kenema",
      played: 10,
      won: 4,
      drawn: 4,
      lost: 2,
      gf: 12,
      ga: 11,
      gd: 1,
      points: 16,
      logo: "https://img.sofascore.com/api/v1/team/317333/image",
    },
    {
      name: "Wolaitta Dicha",
      played: 10,
      won: 4,
      drawn: 2,
      lost: 4,
      gf: 13,
      ga: 14,
      gd: -1,
      points: 14,
      logo: "https://img.sofascore.com/api/v1/team/277540/image",
    },
    {
      name: "Hawassa Kenema",
      played: 10,
      won: 3,
      drawn: 3,
      lost: 4,
      gf: 10,
      ga: 12,
      gd: -2,
      points: 12,
      logo: "https://img.sofascore.com/api/v1/team/274249/image",
    },
    {
      name: "Sidama Bunna",
      played: 10,
      won: 2,
      drawn: 4,
      lost: 4,
      gf: 9,
      ga: 13,
      gd: -4,
      points: 10,
      logo: "https://img.sofascore.com/api/v1/team/315378/image",
    },
    {
      name: "Ethiopia Bunna",
      played: 10,
      won: 2,
      drawn: 3,
      lost: 5,
      gf: 8,
      ga: 14,
      gd: -6,
      points: 9,
      logo: "https://img.sofascore.com/api/v1/team/241957/image",
    },
    {
      name: "Sebeta City",
      played: 10,
      won: 1,
      drawn: 2,
      lost: 7,
      gf: 7,
      ga: 18,
      gd: -11,
      points: 5,
      logo: "https://img.sofascore.com/api/v1/team/258167/image",
    },
  ];

  // Mock data for top scorers with player avatars and team logos
  const topScorersData = [
    {
      name: "Getaneh Kebede",
      team: "Saint George",
      goals: 12,
      avatar: "https://img.sofascore.com/api/v1/player/1381823/image",
      teamLogo: "https://img.sofascore.com/api/v1/player/1381823/image",
    },
    {
      name: "Shimeles Bekele",
      team: "Fasil Kenema",
      goals: 10,
      avatar: "https://img.sofascore.com/api/v1/player/1139235/image",
      teamLogo: "https://img.sofascore.com/api/v1/player/1139235/image",
    },
    {
      name: "Amanuel Assefa",
      team: "Mekelle 70 Enderta",
      goals: 9,
      avatar: "https://img.sofascore.com/api/v1/player/1381823/image",
      teamLogo: "https://img.sofascore.com/api/v1/player/1381823/image",
    },
    {
      name: "Dawit Fekadu",
      team: "Dire Dawa City",
      goals: 8,
      avatar: "https://img.sofascore.com/api/v1/player/1481979/image",
      teamLogo: "https://img.sofascore.com/api/v1/player/1481979/image",
    },
    {
      name: "Yared Zewdu",
      team: "Bahir Dar Kenema",
      goals: 7,
      avatar: "https://img.sofascore.com/api/v1/player/1014936/image",
      teamLogo: "https://img.sofascore.com/api/v1/player/1014936/image",
    },
  ];

  // Mock data for most assists with player avatars and team logos
  const mostAssistsData = [
    {
      name: "Shimeles Bekele",
      team: "Fasil Kenema",
      assists: 8,
      avatar: "https://img.sofascore.com/api/v1/player/1014936/image",
      teamLogo: "https://img.sofascore.com/api/v1/player/1014936/image",
    },
    {
      name: "Abel Yalew",
      team: "Mekelle 70 Enderta",
      assists: 7,
      avatar: "https://img.sofascore.com/api/v1/player/880606/image",
      teamLogo: "https://img.sofascore.com/api/v1/player/880606/image",
    },
    {
      name: "Samuel Tefera",
      team: "Ethiopia Bunna",
      assists: 6,
      avatar: "https://img.sofascore.com/api/v1/player/880606/image",
      teamLogo: "https://img.sofascore.com/api/v1/player/880606/image",
    },
    {
      name: "Tadesse Girma",
      team: "Wolaitta Dicha",
      assists: 5,
      avatar: "https://img.sofascore.com/api/v1/player/1099589/image",
      teamLogo: "https://img.sofascore.com/api/v1/player/1099589/image",
    },
    {
      name: "Mekonnen Bekele",
      team: "Sidama Bunna",
      assists: 5,
      avatar: "https://img.sofascore.com/api/v1/player/1064117/image",
      teamLogo: "https://img.sofascore.com/api/v1/player/1064117/image",
    },
  ];

  // Mock data for matches with team logos
  const liveMatches = [
    {
      home: "Saint George",
      away: "Fasil Kenema",
      homeScore: 1,
      awayScore: 1,
      minute: "65",
      league: "Premier League",
      homeLogo: "https://img.sofascore.com/api/v1/team/273370/image",
      awayLogo: "https://img.sofascore.com/api/v1/team/94787/image",
    },
    {
      home: "Mekelle 70",
      away: "Dire Dawa",
      homeScore: 2,
      awayScore: 1,
      minute: "42",
      league: "Premier League",
      homeLogo: "https://img.sofascore.com/api/v1/team/94787/image",
      awayLogo: "https://img.sofascore.com/api/v1/team/273370/image",
    },
  ];

  const todayMatches = [
    {
      home: "Sidama Bunna",
      away: "Mekelle",
      time: "15:00",
      league: "Premier League",
      homeLogo: "https://img.sofascore.com/api/v1/team/241957/image",
      awayLogo: "https://img.sofascore.com/api/v1/team/258167/image",
    },
    {
      home: "Wolaitta Dicha",
      away: "Bahir Dar",
      time: "18:00",
      league: "Premier League",
      homeLogo: "https://img.sofascore.com/api/v1/team/274479/image",
      awayLogo: "https://img.sofascore.com/api/v1/team/94787/image",
    },
    {
      home: "Hawassa Kenema",
      away: "Ethiopia Bunna",
      time: "20:00",
      league: "Premier League",
      homeLogo: "https://img.sofascore.com/api/v1/team/315378/image",
      awayLogo: "https://img.sofascore.com/api/v1/team/274249/image",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Aesthetic Section Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
          Match Center
        </h2>
        <Badge
          variant="outline"
          className="border-red-500/20 text-red-400 bg-red-500/10 text-[10px] animate-pulse"
        >
          2 LIVE
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-black/20 border border-white/5 p-1 rounded-xl">
          <TabsTrigger
            value="matches"
            className="text-xs data-[state=active]:bg-zinc-800"
          >
            Matches
          </TabsTrigger>
          <TabsTrigger
            value="standings"
            className="text-xs data-[state=active]:bg-zinc-800"
          >
            Table
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="text-xs data-[state=active]:bg-zinc-800"
          >
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="mt-4 space-y-6">
          {/* Live Matches Group */}
          <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
            <div className="bg-gradient-to-r from-red-900/20 to-transparent px-4 py-2 border-b border-white/5 flex justify-between items-center">
              <span className="text-xs font-bold text-red-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Premier League Live
              </span>
              <ChevronRight className="h-3 w-3 text-red-400/50" />
            </div>
            <div className="px-2">
              {liveMatches.map((match, i) => (
                <MatchRow key={i} isLive={true} match={match} />
              ))}
            </div>
          </div>

          {/* Upcoming / Recent Groups */}
          <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
            <div className="bg-zinc-900/50 px-4 py-2 border-b border-white/5">
              <span className="text-xs font-bold text-zinc-400">Today</span>
            </div>
            <div className="px-2">
              {todayMatches.map((match, i) => (
                <MatchRow key={i} match={match} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="standings" className="mt-4">
          <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
            <div className="bg-zinc-900/50 px-4 py-2 border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400">
                Premier League Table
              </span>
              <Badge
                variant="outline"
                className="text-[10px] py-0 px-1.5 border-zinc-700 text-zinc-400"
              >
                Season 2023/24
              </Badge>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-[2rem_1fr_2rem_2rem_2rem_2rem_2rem_2rem_2rem_3rem] gap-1 px-2 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-white/5">
              <div className="text-center">#</div>
              <div>Team</div>
              <div className="text-center">P</div>
              <div className="text-center">W</div>
              <div className="text-center">D</div>
              <div className="text-center">L</div>
              <div className="text-center">GF</div>
              <div className="text-center">GA</div>
              <div className="text-center">GD</div>
              <div className="text-center">PTS</div>
            </div>

            {/* Table Rows */}
            <div className="max-h-96 overflow-y-auto">
              {standingsData.map((team, i) => (
                <StandingRow key={i} team={team} position={i + 1} />
              ))}
            </div>

            <div className="p-2 border-t border-white/5">
              <Button
                variant="ghost"
                className="w-full text-xs text-primary hover:text-primary/80"
              >
                View Full Table
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-4 space-y-4">
          {/* Stats Overview Cards */}
          <div className="grid grid-cols-2 gap-3">
            <StatsCard
              title="Matches Played"
              icon={Calendar}
              value="95"
              subtext="This season"
            />
            <StatsCard
              title="Goals Scored"
              icon={Target}
              value="247"
              subtext="2.6 per match"
            />
            <StatsCard
              title="Attendance"
              icon={Users}
              value="1.2M"
              subtext="Total this season"
            />
            <StatsCard
              title="Clean Sheets"
              icon={Shield}
              value="42"
              subtext="This season"
            />
          </div>

          {/* Top Scorers */}
          <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
            <div className="bg-zinc-900/50 px-4 py-2 border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 flex items-center gap-2">
                <Trophy className="w-3 h-3 text-yellow-500" />
                Top Scorers
              </span>
              <Badge
                variant="outline"
                className="text-[10px] py-0 px-1.5 border-zinc-700 text-zinc-400"
              >
                Premier League
              </Badge>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {topScorersData.map((player, i) => (
                <TopScorerRow key={i} player={player} position={i + 1} />
              ))}
            </div>
          </div>

          {/* Most Assists */}
          <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
            <div className="bg-zinc-900/50 px-4 py-2 border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-blue-500" />
                Most Assists
              </span>
              <Badge
                variant="outline"
                className="text-[10px] py-0 px-1.5 border-zinc-700 text-zinc-400"
              >
                Premier League
              </Badge>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {mostAssistsData.map((player, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                >
                  <div className="w-6 text-center font-bold text-zinc-500 text-xs">
                    {i + 1}
                  </div>
                  {/* Player Avatar */}
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={player.avatar || "/players/placeholder.svg"}
                      alt={player.name}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-200 truncate">
                      {player.name}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-zinc-500 truncate">
                      {/* Team Logo */}
                      <div className="w-3 h-3 rounded-full overflow-hidden">
                        <Image
                          src={player.teamLogo || "/team-logos/placeholder.svg"}
                          alt={player.team}
                          width={12}
                          height={12}
                          className="object-cover"
                        />
                      </div>
                      <span>{player.team}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">
                      {player.assists}
                    </div>
                    <div className="text-xs text-zinc-500">assists</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
