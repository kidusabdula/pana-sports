// components/cms/matches/match-control/components/tabs/VARTab.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { EventIcon } from "../shared/EventIcon";
import { MatchEvent } from "@/lib/schemas/matchEvent";

interface VARTabProps {
  events: MatchEvent[] | undefined;
  onOpenVARDialog: () => void;
}

export function VARTab({ events, onOpenVARDialog }: VARTabProps) {
  const varEvents = events?.filter((e) => e.type.startsWith("var")) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">VAR Control</h3>
        <Button
          onClick={onOpenVARDialog}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          Initiate VAR Check
        </Button>
      </div>

      {/* VAR Info Card */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
          About VAR
        </h4>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Video Assistant Referee (VAR) checks are used for reviewing potential
          goals, penalty decisions, red cards, and cases of mistaken identity.
          Use this panel to record VAR events and decisions.
        </p>
      </div>

      {/* VAR Events List */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-muted-foreground">
          VAR Event History
        </h4>
        {varEvents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border rounded-lg">
            No VAR events recorded
          </div>
        ) : (
          varEvents.map((event) => (
            <VAREventItem key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  );
}

interface VAREventItemProps {
  event: MatchEvent;
}

function VAREventItem({ event }: VAREventItemProps) {
  const isPositive = event.type === "var_goal";
  const isNegative = event.type === "var_no_goal";

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border ${
        isPositive
          ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
          : isNegative
          ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
          : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
      }`}
    >
      <div className="text-sm font-medium text-muted-foreground w-12 shrink-0">
        {event.minute}'
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {event.type === "var_check" && (
            <Eye className="h-4 w-4 text-blue-600 shrink-0" />
          )}
          {event.type === "var_goal" && (
            <Eye className="h-4 w-4 text-green-600 shrink-0" />
          )}
          {event.type === "var_no_goal" && (
            <EyeOff className="h-4 w-4 text-red-600 shrink-0" />
          )}
          <span className="font-medium truncate">{event.description_en}</span>
        </div>
      </div>
    </div>
  );
}
