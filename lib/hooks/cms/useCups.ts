import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Cup, CupEdition, CupGroup } from "@/lib/types/cup";
import {
  CupCreate,
  CupUpdate,
  CupEditionCreate,
  CupEditionUpdate,
} from "@/lib/schemas/cup";

// Query keys
export const cupKeys = {
  all: ["cms", "cups"] as const,
  list: () => [...cupKeys.all, "list"] as const,
  detail: (id: string) => [...cupKeys.all, "detail", id] as const,
  editions: (cupId: string) => [...cupKeys.all, cupId, "editions"] as const,
  edition: (editionId: string) =>
    [...cupKeys.all, "edition", editionId] as const,
  groups: (editionId: string) =>
    [...cupKeys.all, "edition", editionId, "groups"] as const,
  matches: (editionId: string) =>
    [...cupKeys.all, "edition", editionId, "matches"] as const,
  bracket: (editionId: string) =>
    [...cupKeys.all, "edition", editionId, "bracket"] as const,
};

// Fetch all cups
export function useCups() {
  return useQuery<Cup[]>({
    queryKey: cupKeys.list(),
    queryFn: async () => {
      const res = await fetch("/api/cms/cups");
      if (!res.ok) throw new Error("Failed to fetch cups");
      return res.json();
    },
  });
}

// Fetch single cup
export function useCup(id: string) {
  return useQuery<Cup>({
    queryKey: cupKeys.detail(id),
    queryFn: async () => {
      const res = await fetch(`/api/cms/cups/${id}`);
      if (!res.ok) throw new Error("Failed to fetch cup");
      return res.json();
    },
    enabled: !!id,
  });
}

// Create cup
export function useCreateCup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CupCreate) => {
      const res = await fetch("/api/cms/cups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create cup");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cupKeys.all });
    },
  });
}

// Update cup
export function useUpdateCup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CupUpdate }) => {
      const res = await fetch(`/api/cms/cups/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update cup");
      }
      return res.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: cupKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: cupKeys.list() });
    },
  });
}

// Delete cup
export function useDeleteCup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cms/cups/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete cup");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cupKeys.all });
    },
  });
}

// ========== Cup Editions ==========

// Fetch editions for a cup
export function useCupEditions(cupId: string) {
  return useQuery<CupEdition[]>({
    queryKey: cupKeys.editions(cupId),
    queryFn: async () => {
      const res = await fetch(`/api/cms/cups/${cupId}/editions`);
      if (!res.ok) throw new Error("Failed to fetch cup editions");
      return res.json();
    },
    enabled: !!cupId,
  });
}

// Fetch single edition
export function useCupEdition(editionId: string) {
  return useQuery<CupEdition>({
    queryKey: cupKeys.edition(editionId),
    queryFn: async () => {
      const res = await fetch(`/api/cms/cup-editions/${editionId}`);
      if (!res.ok) throw new Error("Failed to fetch cup edition");
      return res.json();
    },
    enabled: !!editionId,
  });
}

// Create edition
export function useCreateCupEdition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CupEditionCreate) => {
      const res = await fetch("/api/cms/cup-editions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create cup edition");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: cupKeys.editions(variables.cup_id),
      });
    },
  });
}

// Update edition
export function useUpdateCupEdition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CupEditionUpdate;
    }) => {
      const res = await fetch(`/api/cms/cup-editions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update cup edition");
      }
      return res.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: cupKeys.edition(id) });
    },
  });
}

// Delete edition
export function useDeleteCupEdition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cms/cup-editions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete cup edition");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cupKeys.all });
    },
  });
}

// ========== Cup Groups ==========

// Fetch groups for an edition
export function useCupGroups(editionId: string) {
  return useQuery<CupGroup[]>({
    queryKey: cupKeys.groups(editionId),
    queryFn: async () => {
      const res = await fetch(`/api/cms/cup-editions/${editionId}/groups`);
      if (!res.ok) throw new Error("Failed to fetch cup groups");
      return res.json();
    },
    enabled: !!editionId,
  });
}

// Create group
export function useCreateCupGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { cup_edition_id: string; name: string }) => {
      const res = await fetch(
        `/api/cms/cup-editions/${data.cup_edition_id}/groups`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: data.name }),
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create group");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: cupKeys.groups(variables.cup_edition_id),
      });
    },
  });
}

// Add team to group
export function useAddTeamToGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      cup_group_id: string;
      team_id: string;
      cup_edition_id: string;
    }) => {
      const res = await fetch(
        `/api/cms/cup-groups/${data.cup_group_id}/teams`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ team_id: data.team_id }),
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add team to group");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: cupKeys.groups(variables.cup_edition_id),
      });
    },
  });
}

// Remove team from group
export function useRemoveTeamFromGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      cup_group_id: string;
      team_id: string;
      cup_edition_id: string;
    }) => {
      const res = await fetch(
        `/api/cms/cup-groups/${data.cup_group_id}/teams/${data.team_id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to remove team from group");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: cupKeys.groups(variables.cup_edition_id),
      });
    },
  });
}
