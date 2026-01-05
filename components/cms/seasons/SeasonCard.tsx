// components/cms/seasons/SeasonCard.tsx
"use client";

import { Season } from "@/lib/schemas/season";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeasonStatusBadge } from "./SeasonStatusBadge";
import {
  CalendarDays,
  Users,
  Trophy,
  ExternalLink,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useSetCurrentSeason } from "@/lib/hooks/cms/useSeasons";

interface SeasonCardProps {
  season: Season & { team_count?: number; match_count?: number };
}

export function SeasonCard({ season }: SeasonCardProps) {
  const setCurrentMutation = useSetCurrentSeason();

  const handleSetCurrent = (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to set ${season.name} as the current season?`
      )
    ) {
      setCurrentMutation.mutate(season.id);
    }
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-300 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <SeasonStatusBadge
            isCurrent={season.is_current}
            isArchived={season.is_archived}
          />
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            {season.slug}
          </div>
        </div>
        <CardTitle className="text-xl group-hover:text-blue-500 transition-colors">
          {season.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <Users className="h-3 w-3" />
              Teams
            </div>
            <div className="text-lg font-bold">{season.team_count ?? 0}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <Trophy className="h-3 w-3" />
              Matches
            </div>
            <div className="text-lg font-bold">{season.match_count ?? 0}</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-dashed flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Start: {format(new Date(season.start_date), "MMM d, yyyy")}
            </span>
            <span>End: {format(new Date(season.end_date), "MMM d, yyyy")}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
          <Link href={`/cms/seasons/${season.id}`}>
            <Settings2 className="h-3.5 w-3.5 mr-1.5" />
            Manage
          </Link>
        </Button>

        {!season.is_current && !season.is_archived && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-blue-500 hover:text-blue-600 hover:bg-blue-50"
            onClick={handleSetCurrent}
            disabled={setCurrentMutation.isPending}
          >
            {setCurrentMutation.isPending ? "Setting..." : "Set Current"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
