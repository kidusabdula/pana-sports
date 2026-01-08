import { useQuery } from "@tanstack/react-query";
import { Cup, CupEdition, CupGroup } from "@/lib/types/cup";

interface CupWithEditions extends Cup {
  editions: CupEdition[];
  current_edition: CupEdition | null;
}

interface CupEditionWithGroups extends CupEdition {
  groups: CupGroup[];
}

interface CupMatchesResponse {
  matches: any[];
  by_round: Record<string, any[]>;
}

// Fetch all active cups
export function useCups() {
  return useQuery<Cup[]>({
    queryKey: ["public", "cups"],
    queryFn: async () => {
      const res = await fetch("/api/public/cups");
      if (!res.ok) throw new Error("Failed to fetch cups");
      return res.json();
    },
  });
}

// Fetch single cup by slug with editions
export function useCup(slug: string) {
  return useQuery<CupWithEditions>({
    queryKey: ["public", "cups", slug],
    queryFn: async () => {
      const res = await fetch(`/api/public/cups/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch cup");
      return res.json();
    },
    enabled: !!slug,
  });
}

// Fetch cup edition with groups
export function useCupEdition(id: string) {
  return useQuery<CupEditionWithGroups>({
    queryKey: ["public", "cup-editions", id],
    queryFn: async () => {
      const res = await fetch(`/api/public/cup-editions/${id}`);
      if (!res.ok) throw new Error("Failed to fetch cup edition");
      return res.json();
    },
    enabled: !!id,
  });
}

// Fetch cup edition matches
export function useCupMatches(
  editionId: string,
  options?: { round?: string; status?: string }
) {
  return useQuery<CupMatchesResponse>({
    queryKey: ["public", "cup-editions", editionId, "matches", options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.round) params.set("round", options.round);
      if (options?.status) params.set("status", options.status);

      const res = await fetch(
        `/api/public/cup-editions/${editionId}/matches?${params}`
      );
      if (!res.ok) throw new Error("Failed to fetch cup matches");
      return res.json();
    },
    enabled: !!editionId,
  });
}

// Fetch knockout bracket for cup edition
export function useCupBracket(editionId: string) {
  return useQuery({
    queryKey: ["public", "cup-editions", editionId, "bracket"],
    queryFn: async () => {
      const res = await fetch(`/api/public/cup-editions/${editionId}/bracket`);
      if (!res.ok) throw new Error("Failed to fetch bracket");
      return res.json();
    },
    enabled: !!editionId,
  });
}
