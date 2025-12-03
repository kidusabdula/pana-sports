"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Search, ArrowRight, MapPin, Calendar, Zap, Trophy, Star } from "lucide-react";
import { useLeagueTeams } from "@/lib/hooks/public/useLeagues";
import { useHomeNews } from "@/lib/hooks/public/useNews";
import { transformNewsList } from "@/lib/utils/transformers";
import NewsCard from "@/components/news/NewsCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  const filteredTeams = teams ? teams.filter(team => 
    team.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.name_am.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Get top teams (first 3)
  const topTeams = filteredTeams.slice(0, 3);

  // Handle team click
  const handleTeamClick = (teamId: string) => {
    router.push(`/teams/${teamId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Controls */}
      <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <CardHeader className="pb-3 border-b border-white/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Teams
            </CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-zinc-800/50 border-zinc-700/50 text-white"
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Featured Teams */}
      {topTeams.length > 0 && (
        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Featured Teams
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              {topTeams.map((team) => (
                <div
                  key={team.id}
                  className="flex flex-col items-center p-4 rounded-lg bg-zinc-800/20 border border-zinc-700/50 hover:bg-zinc-800/30 transition-colors cursor-pointer"
                  onClick={() => handleTeamClick(team.id)}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center mb-4">
                    <Image
                      src={team.logo_url || ''}
                      alt={team.name_en || ''}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-white text-center">{team.name_en}</h3>
                  <p className="text-sm text-zinc-400 text-center mb-2">{team.name_am}</p>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <MapPin className="h-4 w-4" />
                    {team.city || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Teams Grid */}
      <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            All Teams
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTeams.length === 0 ? (
            <div className="p-8 text-center text-zinc-400">
              {searchTerm ? "No teams found matching your search" : "No teams available"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {filteredTeams.map((team) => (
                <div
                  key={team.id}
                  className="flex flex-col bg-zinc-800/20 border border-zinc-700/50 rounded-lg overflow-hidden hover:bg-zinc-800/30 transition-colors cursor-pointer"
                  onClick={() => handleTeamClick(team.id)}
                >
                  <div className="p-6 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center mb-4">
                      <Image
                        src={team.logo_url || ''}
                        alt={team.name_en || ''}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-white text-center">{team.name_en}</h3>
                    <p className="text-sm text-zinc-400 text-center mb-4">{team.name_am}</p>
                    <div className="space-y-2 w-full">
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Calendar className="h-4 w-4" />
                        Founded: {team.founded || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <MapPin className="h-4 w-4" />
                        {team.city || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto p-4 pt-0">
                    <Button variant="ghost" size="sm" className="w-full text-zinc-400 hover:text-white justify-end">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Latest News Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Latest News
          </h2>
          <Link href="/news">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white"
            >
              View All News
            </Button>
          </Link>
        </div>

        {isNewsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-zinc-900/40 rounded-2xl animate-pulse border border-white/5"
              ></div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item, idx) => (
              <NewsCard key={item.id} news={item} index={idx} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-400 bg-zinc-900/40 rounded-2xl border border-white/5">
            No news available
          </div>
        )}
      </div>
    </div>
  );
}