"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Users,
  Search,
  MapPin,
  Calendar,
  ChevronRight,
  Building2,
  Star,
} from "lucide-react";
import { useLeagueTeams } from "@/lib/hooks/public/useLeagues";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/providers/language-provider";
import AdBanner from "@/components/shared/AdBanner";
import { motion } from "framer-motion";

interface TeamsTabProps {
  leagueId: string;
  seasonId?: string;
}

export default function TeamsTab({ leagueId, seasonId }: TeamsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { t } = useLanguage();

  const { data: teams, isLoading } = useLeagueTeams(leagueId, {
    season_id: seasonId,
  });

  // Filter teams by search term
  const filteredTeams = teams
    ? teams.filter(
        (team) =>
          team.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.name_am.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Get featured teams (first 3)
  const featuredTeams = filteredTeams.slice(0, 3);
  const otherTeams = filteredTeams.slice(3);

  // Handle team click
  const handleTeamClick = (teamSlug: string) => {
    router.push(`/teams/${teamSlug}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">All Teams</h2>
              <p className="text-xs text-zinc-500">
                {filteredTeams.length} teams in competition
              </p>
            </div>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-500 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Featured Teams - Large Cards */}
      {featuredTeams.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-bold text-white">Featured Teams</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleTeamClick(team.slug)}
                className="group cursor-pointer"
              >
                <div className="relative bg-gradient-to-b from-zinc-900/80 to-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative p-6">
                    {/* Large Logo */}
                    <div className="flex justify-center mb-4">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center p-3 group-hover:scale-110 transition-transform duration-300">
                        <Image
                          src={team.logo_url || ""}
                          alt={team.name_en}
                          width={72}
                          height={72}
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* Team Name */}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                        {t(team, "name")}
                      </h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        {team.name_am}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-zinc-800/50 rounded-xl p-3 text-center">
                        <Calendar className="h-4 w-4 text-zinc-400 mx-auto mb-1" />
                        <p className="text-xs text-zinc-500">Founded</p>
                        <p className="text-sm font-bold text-white">
                          {team.founded || "N/A"}
                        </p>
                      </div>
                      <div className="bg-zinc-800/50 rounded-xl p-3 text-center">
                        <Building2 className="h-4 w-4 text-zinc-400 mx-auto mb-1" />
                        <p className="text-xs text-zinc-500">Capacity</p>
                        <p className="text-sm font-bold text-white">
                          {team.capacity?.toLocaleString() || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Stadium */}
                    <div className="flex items-center gap-2 text-sm text-zinc-400 justify-center">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">
                        {team.stadium_en || "N/A"}
                      </span>
                    </div>

                    {/* View Button */}
                    <Button
                      variant="ghost"
                      className="w-full mt-4 text-primary hover:bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all"
                    >
                      View Team
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Ad Banner */}
      <AdBanner variant="full" showClose={false} page="league-teams" />

      {/* All Teams Grid */}
      {otherTeams.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">All Teams</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {otherTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => handleTeamClick(team.slug)}
                className="group cursor-pointer"
              >
                <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-primary/30 hover:bg-zinc-900/80 transition-all duration-200">
                  {/* Logo */}
                  <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                      <Image
                        src={team.logo_url || ""}
                        alt={team.name_en}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Team Info */}
                  <div className="text-center">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                      {t(team, "name")}
                    </h4>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                      {team.name_am}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-2 text-xs text-zinc-500">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">
                        {team.city || "Ethiopia"}
                      </span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex justify-center gap-3 mt-3 pt-3 border-t border-white/5">
                    <div className="text-center">
                      <p className="text-xs text-zinc-500">Est.</p>
                      <p className="text-xs font-bold text-white">
                        {team.founded || "-"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-zinc-500">Stadium</p>
                      <p className="text-xs font-bold text-white truncate max-w-[80px]">
                        {team.stadium_en?.split(" ")[0] || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {filteredTeams.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          {searchTerm ? (
            <p>No teams found matching &quot;{searchTerm}&quot;</p>
          ) : (
            <p>No teams available</p>
          )}
        </div>
      )}

      {/* Bottom Ad Banner */}
      <AdBanner variant="inline" showClose={false} page="league-teams" />
    </div>
  );
}
