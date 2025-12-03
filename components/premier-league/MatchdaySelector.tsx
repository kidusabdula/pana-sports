// components/premier-league/MatchdaySelector.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchdaySelectorProps {
  matchdays: number[];
  currentMatchday: number | null;
  onMatchdayChange: (matchday: number) => void;
}

export default function MatchdaySelector({ 
  matchdays, 
  currentMatchday, 
  onMatchdayChange 
}: MatchdaySelectorProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-zinc-800/40 rounded-lg">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onMatchdayChange(matchdays[matchdays.indexOf(currentMatchday || 0) - 1] || 0)}
        disabled={!currentMatchday || matchdays.indexOf(currentMatchday || 0) === 0}
        className="text-zinc-400 hover:text-white disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2">
        {matchdays.map((day) => (
          <Button
            key={day}
            variant={currentMatchday === day ? "default" : "ghost"}
            size="sm"
            onClick={() => onMatchdayChange(day)}
            className={cn(
              "text-xs",
              currentMatchday === day 
                ? "bg-primary text-white" 
                : "text-zinc-400 hover:text-white"
            )}
          >
            {day}
          </Button>
        ))}
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onMatchdayChange(matchdays[matchdays.indexOf(currentMatchday || 0) + 1] || 0)}
        disabled={!currentMatchday || matchdays.indexOf(currentMatchday || 0) === matchdays.length - 1}
        className="text-zinc-400 hover:text-white disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}