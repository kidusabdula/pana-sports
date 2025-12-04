"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Search,
  ArrowRight,
  MapPin,
  Calendar,
  Zap,
  Star,
} from "lucide-react";
import { useLeagueTeams } from "@/lib/hooks/public/useLeagues";
import { useHomeNews } from "@/lib/hooks/public/useNews";
import { transformNewsList } from "@/lib/utils/transformers";
import NewsCard from "@/components/news/NewsCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";

interface TeamsTabProps {
  leagueId: string;
}

export default function TeamsTab({ leagueId }: TeamsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const { data: teams, isLoading } = useLeagueTeams(leagueId);

  // Fetch news
  const { data: newsData, isLoading: isNewsLoading } = useHomeNews();
  const news = newsData ? transformNewsList(newsData).slice(0, 3) : [];

  // Filter teams by search term
  const filteredTeams = teams
    ? teams.filter(
        (team) =>
          team.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.name_am.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Get top teams (first 3)
  const topTeams = filteredTeams.slice(0, 3);

  // Handle team click
  const handleTeamClick = (teamId: string) => {
    router.push(`/teams/${teamId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex items-center justify-between bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-lg p-2">
        <div className="flex items-center gap-2 px-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-white">Teams</span>
        </div>
        <div className="relative w-full max-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <Input
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs bg-zinc-800/50 border-zinc-700/50 text-white"
          />
        </div>
      </div>

      {/* Featured Teams */}
      {topTeams.length > 0 && (
        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
          <CardHeader className="py-2 px-3 border-b border-white/5">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              Featured Teams
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3">
              {topTeams.map((team) => (
                <div
                  key={team.id}
                  className="flex flex-col items-center p-3 rounded-lg bg-zinc-800/20 border border-zinc-700/50 hover:bg-zinc-800/30 transition-colors cursor-pointer"
                  onClick={() => handleTeamClick(team.id)}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center mb-2">
                    <Image
                      src={team.logo_url || ""}
                      alt={team.name_en || ""}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-white text-center truncate w-full">
                    {team.name_en}
                  </h3>
                  <p className="text-xs text-zinc-400 text-center mb-1 truncate w-full">
                    {team.name_am}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <MapPin className="h-3 w-3" />
                    {team.stadium_en || "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Teams Grid */}
      <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <CardHeader className="py-2 px-3 border-b border-white/5">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            All Teams
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTeams.length === 0 ? (
            <div className="p-4 text-center text-zinc-400 text-xs">
              {searchTerm
                ? "No teams found matching your search"
                : "No teams available"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-3">
              {filteredTeams.map((team) => (
                <div
                  key={team.id}
                  className="flex flex-col bg-zinc-800/20 border border-zinc-700/50 rounded-lg overflow-hidden hover:bg-zinc-800/30 transition-colors cursor-pointer"
                  onClick={() => handleTeamClick(team.id)}
                >
                  <div className="p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center shrink-0">
                      <Image
                        src={team.logo_url || ""}
                        alt={team.name_en || ""}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-white truncate">
                        {team.name_en}
                      </h3>
                      <p className="text-xs text-zinc-400 truncate">
                        {team.name_am}
                      </p>
                    </div>
                  </div>
                  <div className="px-3 pb-3 pt-0 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Calendar className="h-3 w-3" />
                      Founded: {team.founded || "N/A"}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <MapPin className="h-3 w-3" />
                      {team.stadium_en || "N/A"}
                    </div>
                  </div>
                  <div className="mt-auto px-3 pb-3 pt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-zinc-400 hover:text-white justify-end h-6 text-xs p-0"
                    >
                      View Details
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Latest News Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Latest News
          </h2>
          <Link href="/news">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white h-6 text-xs"
            >
              View All
            </Button>
          </Link>
        </div>

        {isNewsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-zinc-900/40 rounded-xl animate-pulse border border-white/5"
              ></div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {news.map((item, idx) => (
              <NewsCard key={item.id} news={item} index={idx} />
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-zinc-500 text-xs bg-zinc-900/40 rounded-xl border border-white/5">
            No news available
          </div>
        )}
      </div>
    </div>
  );
}
