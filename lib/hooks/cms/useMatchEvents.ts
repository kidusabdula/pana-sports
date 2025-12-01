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
        yellow: "Yellow card issued",
        red: "Red card issued",
        sub: "Substitution made",
        half_time: "Half time recorded",
        second_half: "Second half started",
        match_end: "Match ended",
        match_start: "Match started",
        own_goal: "Own goal recorded",
        penalty: "Penalty recorded",
        var_check: "VAR check initiated",
        var_goal: "VAR goal confirmed",
        var_no_goal: "VAR goal disallowed",
        corner: "Corner kick",
        free_kick: "Free kick",
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
