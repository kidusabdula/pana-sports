"use client";

import { useState, useMemo } from "react";
import { useSeasons } from "@/lib/hooks/public/useSeasons";
import { ChevronDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface SeasonToggleProps {
  currentSeasonId?: string;
  onSeasonChange: (seasonId: string) => void;
  className?: string;
}

export default function SeasonToggle({
  currentSeasonId,
  onSeasonChange,
  className,
}: SeasonToggleProps) {
  const { data: seasons, isLoading } = useSeasons();

  // Compute default season without useEffect
  const defaultSeasonId = useMemo(() => {
    if (currentSeasonId) return currentSeasonId;
    return seasons?.find((s) => s.is_current)?.id;
  }, [currentSeasonId, seasons]);

  const [selectedSeason, setSelectedSeason] = useState<string | undefined>(
    currentSeasonId
  );

  // Use computed default if no selection yet
  const activeSeasonId = selectedSeason || defaultSeasonId;

  const handleChange = (seasonId: string) => {
    setSelectedSeason(seasonId);
    onSeasonChange(seasonId);
  };

  const currentSeasonName =
    seasons?.find((s) => s.id === activeSeasonId)?.name || "Select Season";

  if (isLoading) {
    return <div className="h-12 w-40 bg-zinc-800 animate-pulse rounded-xl" />;
  }

  // Show a default placeholder if no seasons configured yet
  if (!seasons || seasons.length === 0) {
    return (
      <Button
        variant="outline"
        disabled
        className={cn(
          "h-12 px-6 text-base font-semibold bg-zinc-900/80 border-zinc-700 cursor-not-allowed",
          className
        )}
      >
        <Calendar className="w-5 h-5 mr-2 text-zinc-500" />
        <span className="text-zinc-400">2024/25</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-12 px-6 text-base font-semibold bg-zinc-900/80 border-primary/30 hover:border-primary hover:bg-zinc-800 transition-all",
            className
          )}
        >
          <Calendar className="w-5 h-5 mr-2 text-primary" />
          <span className="text-white">{currentSeasonName}</span>
          <ChevronDown className="w-4 h-4 ml-2 text-zinc-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-48 bg-zinc-900 border-zinc-800"
      >
        {seasons?.map((season) => (
          <DropdownMenuItem
            key={season.id}
            onClick={() => handleChange(season.id)}
            className={cn(
              "cursor-pointer",
              activeSeasonId === season.id && "bg-primary/10 text-primary"
            )}
          >
            <span className="flex items-center gap-2">
              {season.name}
              {season.is_current && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
