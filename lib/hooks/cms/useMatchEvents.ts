// lib/hooks/cms/useMatchEvents.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MatchEvent, CreateMatchEvent } from "@/lib/schemas/matchEvent";
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

      // Add success toast based on event type
      const eventLabels = {
        goal: "Goal recorded",
        own_goal: "Own goal recorded",
        penalty: "Penalty recorded",
        penalty_goal: "Penalty goal scored",
        penalty_miss: "Penalty missed",
        yellow: "Yellow card issued",
        second_yellow: "Second yellow card issued",
        red: "Red card issued",
        sub: "Substitution made",
        assist: "Assist recorded",
        half_time: "Half time recorded",
        second_half: "Second half started",
        match_start: "Match started",
        match_end: "Match ended",
        match_pause: "Match paused",
        match_resume: "Match resumed",
        extra_time_start: "Extra time started",
        extra_time_end: "Extra time ended",
        penalty_shootout_start: "Penalty shootout started",
        penalty_shootout_end: "Penalty shootout ended",
        penalty_shootout_scored: "Penalty scored in shootout",
        penalty_shootout_missed: "Penalty missed in shootout",
        var_check: "VAR check initiated",
        var_goal: "VAR goal confirmed",
        var_no_goal: "VAR goal disallowed",
        corner: "Corner kick recorded",
        free_kick: "Free kick recorded",
        offside: "Offside called",
        injury_time: "Injury time added",
      };

      const label =
        eventLabels[data.type as keyof typeof eventLabels] || "Event recorded";
      toast.success(label);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create event"
      );
    },
  });
}
