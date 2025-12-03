// components/premier-league/TeamCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Team } from "@/lib/hooks/public/useLeagues";

interface TeamCardProps {
  team: Team;
  className?: string;
}

export default function TeamCard({ team, className }: TeamCardProps) {
  return (
    <Card className={cn("bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden hover:bg-zinc-800/30 transition-colors", className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={team.logo_url || ''}
              alt={team.name_en}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">{team.name_en}</h3>
            <div className="flex items-center gap-2 text-zinc-400">
              <MapPin className="h-4 w-4" />
              <span>{team.city || 'N/A'}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-zinc-500" />
            <span className="text-sm text-zinc-500">Founded</span>
          </div>
          <p className="text-white">{team.founded_year || 'N/A'}</p>
        </div>
      </CardContent>
    </Card>
  );
}