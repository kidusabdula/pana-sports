"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSeasons } from "@/lib/hooks/public/useSeasons";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeasonSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showAll?: boolean;
  className?: string;
}

export function SeasonSelector({
  value,
  onValueChange,
  placeholder = "Select season",
  disabled = false,
  showAll = false,
  className,
}: SeasonSelectorProps) {
  const { data: seasons, isLoading } = useSeasons();

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex h-9 items-center justify-between rounded-md border border-white/10 bg-zinc-900/50 px-3 py-2 text-xs opacity-50",
          className
        )}
      >
        <span className="text-zinc-500">Loading seasons...</span>
        <Loader2 className="h-3 w-3 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "h-9 bg-zinc-900/50 border-white/10 text-xs text-zinc-200 focus:ring-primary/20",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border-white/10 text-zinc-200">
        {showAll && (
          <SelectItem value="all" className="text-xs">
            All Seasons
          </SelectItem>
        )}
        {seasons?.map((season) => (
          <SelectItem key={season.id} value={season.id} className="text-xs">
            {season.name} {season.is_current ? "(Current)" : ""}
          </SelectItem>
        ))}
        {(!seasons || seasons.length === 0) && (
          <SelectItem value="none" disabled className="text-xs">
            No seasons found
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
