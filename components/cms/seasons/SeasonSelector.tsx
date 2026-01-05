// components/cms/seasons/SeasonSelector.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminSeasons } from "@/lib/hooks/cms/useSeasons";
import { Loader2 } from "lucide-react";

interface SeasonSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  showAll?: boolean;
}

export function SeasonSelector({
  value,
  onValueChange,
  placeholder = "Select season",
  disabled = false,
  required = false,
  showAll = false,
}: SeasonSelectorProps) {
  const { data: seasons, isLoading } = useAdminSeasons();

  if (isLoading) {
    return (
      <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm opacity-50">
        <span className="text-muted-foreground">Loading seasons...</span>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      required={required}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAll && <SelectItem value="all">All Seasons</SelectItem>}
        {seasons?.map((season) => (
          <SelectItem key={season.id} value={season.id}>
            {season.name} {season.is_current ? "(Current)" : ""}
          </SelectItem>
        ))}
        {(!seasons || seasons.length === 0) && (
          <SelectItem value="none" disabled>
            No seasons found
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
