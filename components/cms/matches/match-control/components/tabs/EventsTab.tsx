// components/cms/matches/match-control/components/tabs/EventsTab.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Edit2, AlertCircle, CheckCircle2 } from "lucide-react";
import { EventIcon } from "../shared/EventIcon";
import { EventEditDialog } from "../dialogs/EventEditDialog";
import { MatchEvent, UpdateMatchEvent } from "@/lib/schemas/matchEvent";
import { Match } from "@/lib/schemas/match";
import { cn } from "@/lib/utils";

interface Player {
  id: string;
  name_en: string;
  name_am?: string | null;
  jersey_number?: number | null;
}

interface EventsTabProps {
  events: MatchEvent[] | undefined;
  isLoading: boolean;
  match: Match;
  homeTeamPlayers: Player[];
  awayTeamPlayers: Player[];
  onRefresh: () => void;
  onUpdateEvent: (eventId: string, updates: UpdateMatchEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function EventsTab({
  events,
  isLoading,
  match,
  homeTeamPlayers,
  awayTeamPlayers,
  onRefresh,
  onUpdateEvent,
  onDeleteEvent,
  isUpdating,
  isDeleting,
}: EventsTabProps) {
  const [editingEvent, setEditingEvent] = useState<MatchEvent | null>(null);

  const handleEditClick = (event: MatchEvent) => {
    setEditingEvent(event);
  };

  const handleUpdate = (eventId: string, updates: UpdateMatchEvent) => {
    onUpdateEvent(eventId, updates);
    setEditingEvent(null);
  };

  const handleDelete = (eventId: string) => {
    onDeleteEvent(eventId);
    setEditingEvent(null);
  };

  // Count events that need attention (missing player/team for certain event types)
  const eventsNeedingAttention =
    events?.filter((e) => {
      const requiresPlayer = [
        "goal",
        "own_goal",
        "penalty_goal",
        "penalty_miss",
        "yellow",
        "red",
        "second_yellow",
      ].includes(e.type);
      const requiresTeam = [
        "goal",
        "own_goal",
        "penalty_goal",
        "penalty_miss",
        "yellow",
        "red",
        "second_yellow",
        "corner",
        "free_kick",
        "offside",
      ].includes(e.type);

      return (requiresPlayer && !e.player_id) || (requiresTeam && !e.team_id);
    }).length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Match Events</h3>
          {events && events.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {events.length} events
            </Badge>
          )}
          {eventsNeedingAttention > 0 && (
            <Badge variant="destructive" className="text-xs gap-1">
              <AlertCircle className="h-3 w-3" />
              {eventsNeedingAttention} need details
            </Badge>
          )}
        </div>
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
            <EventItem
              key={event.id}
              event={event}
              onEdit={() => handleEditClick(event)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No events recorded yet
        </div>
      )}

      {/* Event Edit Dialog */}
      <EventEditDialog
        open={!!editingEvent}
        onOpenChange={(open) => {
          if (!open) setEditingEvent(null);
        }}
        event={editingEvent}
        match={match}
        homeTeamPlayers={homeTeamPlayers}
        awayTeamPlayers={awayTeamPlayers}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    </div>
  );
}

// Internal EventItem component
interface EventItemProps {
  event: MatchEvent;
  onEdit: () => void;
}

function EventItem({ event, onEdit }: EventItemProps) {
  // Determine if this event needs attention
  const requiresPlayer = [
    "goal",
    "own_goal",
    "penalty_goal",
    "penalty_miss",
    "yellow",
    "red",
    "second_yellow",
  ].includes(event.type);
  const requiresTeam = [
    "goal",
    "own_goal",
    "penalty_goal",
    "penalty_miss",
    "yellow",
    "red",
    "second_yellow",
    "corner",
    "free_kick",
    "offside",
  ].includes(event.type);

  const needsAttention =
    (requiresPlayer && !event.player_id) || (requiresTeam && !event.team_id);

  // Check if this is a system event
  const isSystemEvent = [
    "match_start",
    "match_end",
    "match_pause",
    "match_resume",
    "half_time",
    "second_half",
    "extra_time_start",
    "extra_time_end",
    "penalty_shootout_start",
    "penalty_shootout_end",
  ].includes(event.type);

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 pr-2 rounded-lg border hover:bg-muted/5 transition-colors group",
        needsAttention && "border-yellow-500/50 bg-yellow-500/5",
        isSystemEvent && "bg-muted/30"
      )}
    >
      {/* Minute */}
      <div className="text-sm font-medium text-muted-foreground w-12 shrink-0">
        {event.minute}&apos;
      </div>

      {/* Event Content */}
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

          {/* Status indicators */}
          {needsAttention && (
            <Badge
              variant="outline"
              className="text-xs text-yellow-600 border-yellow-500/50 gap-1 shrink-0"
            >
              <AlertCircle className="h-3 w-3" />
              Needs details
            </Badge>
          )}
          {event.confirmed && (
            <Badge
              variant="outline"
              className="text-xs text-green-600 border-green-500/50 gap-1 shrink-0"
            >
              <CheckCircle2 className="h-3 w-3" />
              Confirmed
            </Badge>
          )}
        </div>

        {event.description_en && (
          <p className="text-sm text-muted-foreground mt-1 truncate">
            {event.description_en}
          </p>
        )}

        {event.type === "sub" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span
              className={cn(
                "truncate",
                event.subbed_out_player
                  ? "text-red-400"
                  : "text-red-400/50 italic"
              )}
            >
              {event.subbed_out_player?.name_en || "No player selected"}
            </span>
            <span>→</span>
            <span
              className={cn(
                "truncate",
                event.subbed_in_player
                  ? "text-green-400"
                  : "text-green-400/50 italic"
              )}
            >
              {event.subbed_in_player?.name_en || "No player selected"}
            </span>
          </div>
        )}
      </div>

      {/* Edit Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        onClick={onEdit}
      >
        <Edit2 className="h-4 w-4" />
        <span className="sr-only">Edit event</span>
      </Button>
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
    goal: "Goal",
    own_goal: "Own Goal",
    penalty_goal: "Penalty Goal",
    penalty_miss: "Penalty Missed",
    yellow: "Yellow Card",
    red: "Red Card",
    second_yellow: "Second Yellow",
    corner: "Corner",
    free_kick: "Free Kick",
    offside: "Offside",
    sub: "Substitution",
    penalty_shootout_scored: "Penalty Scored",
    penalty_shootout_missed: "Penalty Missed",
  };

  return displayNames[type] || "Match Event";
}
