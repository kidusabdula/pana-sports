import { useQuery } from "@tanstack/react-query";
import { Season } from "@/lib/schemas/season";

export function useSeasons() {
  return useQuery<Season[]>({
    queryKey: ["seasons"],
    queryFn: async () => {
      const res = await fetch("/api/public/seasons");
      if (!res.ok) throw new Error("Failed to fetch seasons");
      return res.json();
    },
  });
}

export function useCurrentSeason() {
  return useQuery<Season>({
    queryKey: ["seasons", "current"],
    queryFn: async () => {
      const res = await fetch("/api/public/seasons/current");
      if (!res.ok) {
        //ts
        if (res.status === 404) return null as any;
        throw new Error("Failed to fetch current season");
      }
      return res.json();
    },
  });
}

export function useSeason(id: string) {
  return useQuery<Season>({
    queryKey: ["seasons", id],
    queryFn: async () => {
      const res = await fetch(`/api/public/seasons/${id}`);
      if (!res.ok) throw new Error("Failed to fetch season");
      return res.json();
    },
    enabled: !!id,
  });
}
