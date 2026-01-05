// lib/hooks/cms/useMatchEvents.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MatchEvent,
  CreateMatchEvent,
  UpdateMatchEvent,
} from "@/lib/schemas/matchEvent";
import { toast } from "sonner";

// API helper functions
async function fetchMatchEvents(matchId: string) {
  const res = await fetch(`/api/matches/${matchId}/events`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch match events");
  }
  return res.json() as Promise<MatchEvent[]>;
}

async function createMatchEvent(matchId: string, newEvent: CreateMatchEvent) {
  const res = await fetch(`/api/matches/${matchId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newEvent),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create match event");
  }

  return res.json() as Promise<MatchEvent>;
}

async function updateMatchEvent(eventId: string, updates: UpdateMatchEvent) {
  const res = await fetch(`/api/match-events/${eventId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update match event");
  }

  return res.json() as Promise<MatchEvent>;
}

async function deleteMatchEvent(eventId: string) {
  const res = await fetch(`/api/match-events/${eventId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete match event");
  }

  return res.json() as Promise<{
    success: boolean;
    deleted_event_id: string;
    match_id: string;
    event_type: string;
  }>;
}

// Event type labels for toasts
const eventLabels: Record<string, string> = {
  goal: "Goal",
  own_goal: "Own goal",
  penalty: "Penalty",
  penalty_goal: "Penalty goal",
  penalty_miss: "Missed penalty",
  yellow: "Yellow card",
  second_yellow: "Second yellow",
  red: "Red card",
  sub: "Substitution",
  assist: "Assist",
  half_time: "Half time",
  second_half: "Second half",
  match_start: "Match start",
  match_end: "Match end",
  match_pause: "Match pause",
  match_resume: "Match resume",
  extra_time_start: "Extra time start",
  extra_time_end: "Extra time end",
  penalty_shootout_start: "Penalty shootout start",
  penalty_shootout_end: "Penalty shootout end",
  penalty_shootout_scored: "Penalty scored",
  penalty_shootout_missed: "Penalty missed",
  var_check: "VAR check",
  var_goal: "VAR goal confirmed",
  var_no_goal: "VAR goal disallowed",
  corner: "Corner",
  free_kick: "Free kick",
  offside: "Offside",
  injury_time: "Injury time",
};

// React Query hooks
export function useMatchEvents(matchId: string) {
  return useQuery({
    queryKey: ["matches", matchId, "events"],
    queryFn: () => fetchMatchEvents(matchId),
    enabled: !!matchId,
  });
}

export function useCreateMatchEvent(matchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newEvent: CreateMatchEvent) =>
      createMatchEvent(matchId, newEvent),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["matches", matchId, "events"],
      });

      const label = eventLabels[data.type] || "Event";
      toast.success(`${label} recorded`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create event"
      );
    },
  });
}

export function useUpdateMatchEvent(matchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      updates,
    }: {
      eventId: string;
      updates: UpdateMatchEvent;
    }) => updateMatchEvent(eventId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["matches", matchId, "events"],
      });

      const label = eventLabels[data.type] || "Event";
      toast.success(`${label} updated successfully`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update event"
      );
    },
  });
}

export function useDeleteMatchEvent(matchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => deleteMatchEvent(eventId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["matches", matchId, "events"],
      });

      const label = eventLabels[data.event_type] || "Event";
      toast.success(`${label} deleted`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete event"
      );
    },
  });
}
