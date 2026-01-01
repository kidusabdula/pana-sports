// components/cms/matches/match-control/components/tabs/EventsTab.tsx
"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { EventIcon } from "../shared/EventIcon";
import { MatchEvent } from "@/lib/schemas/matchEvent";

interface EventsTabProps {
  events: MatchEvent[] | undefined;
  isLoading: boolean;
  onRefresh: () => void;
}

export function EventsTab({ events, isLoading, onRefresh }: EventsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Match Events</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : events && events.length > 0 ? (
        <div className="space-y-2">
          {events.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No events recorded yet
        </div>
      )}
    </div>
  );
}

// Internal EventItem component
interface EventItemProps {
  event: MatchEvent;
}

function EventItem({ event }: EventItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/5 transition-colors">
      <div className="text-sm font-medium text-muted-foreground w-12 shrink-0">
        {event.minute}'
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <EventIcon type={event.type} />

          <span className="font-medium truncate">
            {event.player?.name_en || getEventDisplayName(event.type)}
          </span>

          {event.team?.logo_url && (
            <img
              src={event.team.logo_url}
              alt={event.team.name_en}
              className="h-5 w-5 object-contain shrink-0"
            />
          )}
        </div>

        {event.description_en && (
          <p className="text-sm text-muted-foreground mt-1 truncate">
            {event.description_en}
          </p>
        )}

        {event.type === "sub" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span className="truncate text-red-400">
              {event.subbed_out_player?.name_en}
            </span>
            <span>→</span>
            <span className="truncate text-green-400">
              {event.subbed_in_player?.name_en}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to get human-readable event name for system events
function getEventDisplayName(type: string): string {
  const displayNames: Record<string, string> = {
    match_start: "Match Started",
    match_end: "Match Ended",
    match_pause: "Match Paused",
    match_resume: "Match Resumed",
    half_time: "Half Time",
    second_half: "Second Half",
    extra_time_start: "Extra Time Started",
    extra_time_end: "Extra Time Ended",
    penalty_shootout_start: "Penalty Shootout",
    penalty_shootout_end: "Shootout Ended",
    var_check: "VAR Check",
    var_goal: "VAR: Goal Confirmed",
    var_no_goal: "VAR: Goal Disallowed",
    injury_time: "Injury Time Added",
  };

  return displayNames[type] || "Match Event";
}
