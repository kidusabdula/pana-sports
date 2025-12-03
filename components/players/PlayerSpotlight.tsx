// components/players/PlayerSpotlight.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Target, Heart, Trophy, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { TopScorer } from "@/lib/hooks/public/useTopScorers";

interface PlayerSpotlightProps {
  player: TopScorer;
}

export default function PlayerSpotlight({ player }: PlayerSpotlightProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden group hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
      <CardHeader className="pb-3 border-b border-white/5">
        <CardTitle className="text-lg bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Player Spotlight
          </div>
          <Badge
            variant="outline"
            className="bg-primary/10 border-primary/30 text-primary text-[10px]"
          >
            TOP SCORER
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/10">
            <Image
              src={player.player.photo_url || ""}
              alt={player.player.name_en}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">
                <Link
                  href={`/players/${player.player.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {player.player.name_en}
                </Link>
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-lg transition-all duration-300",
                  isFavorite
                    ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
                    : "text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
                )}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={cn(
                    "h-4 w-4 transition-all",
                    isFavorite && "fill-current"
                  )}
                />
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 text-sm text-zinc-400">
                <div className="w-4 h-4 rounded-full overflow-hidden">
                  <Image
                    src={player.team.logo_url || ""}
                    alt={player.team.name_en}
                    width={16}
                    height={16}
                    className="object-cover"
                  />
                </div>
                <span>{player.team.name_en}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="secondary"
                className="bg-zinc-800/50 text-zinc-300 border-zinc-700/50 text-xs"
              >
                {player.player.position_en || "Player"}
              </Badge>
              <Badge
                variant="outline"
                className="bg-zinc-800/50 border-zinc-700/50 text-xs text-zinc-400"
              >
                #{player.player.jersey_number || "N/A"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-zinc-800/40 rounded-lg p-3 text-center hover:bg-zinc-800/60 transition-colors border border-white/5">
            <div className="flex items-center justify-center gap-1 text-primary">
              <Target className="h-4 w-4" />
              <span className="text-lg font-bold">{player.goals}</span>
            </div>
            <div className="text-xs text-zinc-400">Goals</div>
          </div>
          <div className="bg-zinc-800/40 rounded-lg p-3 text-center hover:bg-zinc-800/60 transition-colors border border-white/5">
            <div className="flex items-center justify-center gap-1 text-primary">
              <TrendingUp className="h-4 w-4" />
              <span className="text-lg font-bold">{player.assists}</span>
            </div>
            <div className="text-xs text-zinc-400">Assists</div>
          </div>
          <div className="bg-zinc-800/40 rounded-lg p-3 text-center hover:bg-zinc-800/60 transition-colors border border-white/5">
            <div className="flex items-center justify-center gap-1 text-primary">
              <Trophy className="h-4 w-4" />
              <span className="text-lg font-bold">
                {player.goals + player.assists}
              </span>
            </div>
            <div className="text-xs text-zinc-400">Goal Contributions</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/players/${player.player.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full bg-zinc-800/40 border-white/10 hover:bg-zinc-800/60 group"
            >
              <User className="mr-2 h-3 w-3" />
              Full Profile
            </Button>
          </Link>
          <Button className="flex-1 bg-primary hover:bg-primary/90">
            <TrendingUp className="mr-2 h-3 w-3" />
            View Stats
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
