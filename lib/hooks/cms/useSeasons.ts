// lib/hooks/cms/useSeasons.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Season, SeasonCreate, SeasonUpdate } from "@/lib/schemas/season";
import { toast } from "sonner";

export function useAdminSeasons() {
  return useQuery<Season[]>({
    queryKey: ["admin", "seasons"],
    queryFn: async () => {
      const res = await fetch("/api/cms/seasons");
      if (!res.ok) throw new Error("Failed to fetch seasons");
      return res.json();
    },
  });
}

export function useAdminSeason(id: string) {
  return useQuery<Season & { team_count?: number; match_count?: number }>({
    queryKey: ["admin", "seasons", id],
    queryFn: async () => {
      const res = await fetch(`/api/cms/seasons/${id}`);
      if (!res.ok) throw new Error("Failed to fetch season");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SeasonCreate) => {
      const res = await fetch("/api/cms/seasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create season");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "seasons"] });
      toast.success("Season created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SeasonUpdate }) => {
      const res = await fetch(`/api/cms/seasons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update season");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "seasons"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "seasons", data.id],
      });
      toast.success("Season updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cms/seasons/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete season");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "seasons"] });
      toast.success("Season deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useSetCurrentSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cms/seasons/${id}/set-current`, {
        method: "POST",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to set current season");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "seasons"] });
      queryClient.invalidateQueries({ queryKey: ["seasons", "current"] });
      toast.success("Current season updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

// Season Teams
export function useSeasonTeams(seasonId: string) {
  return useQuery<any[]>({
    queryKey: ["admin", "seasons", seasonId, "teams"],
    queryFn: async () => {
      const res = await fetch(`/api/cms/seasons/${seasonId}/teams`);
      if (!res.ok) throw new Error("Failed to fetch season teams");
      return res.json();
    },
    enabled: !!seasonId,
  });
}

export function useAddSeasonTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ seasonId, data }: { seasonId: string; data: any }) => {
      const res = await fetch(`/api/cms/seasons/${seasonId}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add team to season");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "seasons", variables.seasonId, "teams"],
      });
      toast.success("Team added to season");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useRemoveSeasonTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      seasonId,
      teamId,
      leagueId,
    }: {
      seasonId: string;
      teamId: string;
      leagueId: string;
    }) => {
      const res = await fetch(`/api/cms/seasons/${seasonId}/teams`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team_id: teamId, league_id: leagueId }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to remove team from season");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "seasons", variables.seasonId, "teams"],
      });
      toast.success("Team removed from season");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

// Season Players
export function useSeasonPlayers(seasonId: string, teamId?: string) {
  return useQuery<any[]>({
    queryKey: ["admin", "seasons", seasonId, "players", teamId],
    queryFn: async () => {
      const url = new URL(
        `/api/cms/seasons/${seasonId}/players`,
        window.location.origin
      );
      if (teamId) url.searchParams.append("teamId", teamId);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch season players");
      return res.json();
    },
    enabled: !!seasonId,
  });
}

export function useAddSeasonPlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ seasonId, data }: { seasonId: string; data: any }) => {
      const res = await fetch(`/api/cms/seasons/${seasonId}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to register player for season");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "seasons", variables.seasonId, "players"],
      });
      toast.success("Player registered for season");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useRemoveSeasonPlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      seasonId,
      playerId,
      teamId,
    }: {
      seasonId: string;
      playerId: string;
      teamId: string;
    }) => {
      const res = await fetch(`/api/cms/seasons/${seasonId}/players`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player_id: playerId, team_id: teamId }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to unregister player");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "seasons", variables.seasonId, "players"],
      });
      toast.success("Player removed from season registration");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
