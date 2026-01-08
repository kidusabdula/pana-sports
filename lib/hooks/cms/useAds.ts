import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdCampaign, AdImage, DbAdCampaign, DbAdImage } from "@/lib/schemas/ad";

// Campaigns Hooks
export function useAdCampaigns() {
  return useQuery<DbAdCampaign[]>({
    queryKey: ["cms", "ad-campaigns"],
    queryFn: async () => {
      const res = await fetch("/api/cms/ads/campaigns");
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      return res.json();
    },
  });
}

export function useAdCampaign(id: string) {
  return useQuery<DbAdCampaign | null>({
    queryKey: ["cms", "ad-campaigns", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`/api/cms/ads/campaigns/${id}`);
      if (!res.ok) throw new Error("Failed to fetch campaign details");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateAdCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AdCampaign) => {
      const res = await fetch("/api/cms/ads/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create campaign");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "ad-campaigns"] });
      toast.success("Campaign created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateAdCampaign(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<AdCampaign>) => {
      const res = await fetch(`/api/cms/ads/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update campaign");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "ad-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["cms", "ad-campaigns", id] });
      toast.success("Campaign updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteAdCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cms/ads/campaigns/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete campaign");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "ad-campaigns"] });
      toast.success("Campaign deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Ad Images Hooks
export function useAdImages(campaignId?: string) {
  return useQuery<DbAdImage[]>({
    queryKey: ["cms", "ad-images", { campaignId }],
    queryFn: async () => {
      const url = campaignId
        ? `/api/cms/ads?campaignId=${campaignId}`
        : "/api/cms/ads";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch ad images");
      return res.json();
    },
  });
}

export function useCreateAdImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AdImage) => {
      const res = await fetch("/api/cms/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || errorData.message || "Failed to create ad image"
        );
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cms", "ad-images"] });
      if (variables.campaign_id) {
        queryClient.invalidateQueries({
          queryKey: ["cms", "ad-campaigns", variables.campaign_id],
        });
      }
      toast.success("Ad image uploaded successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateAdImage(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<AdImage>) => {
      const res = await fetch(`/api/cms/ads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update ad image");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cms", "ad-images"] });
      if (data.campaign_id) {
        queryClient.invalidateQueries({
          queryKey: ["cms", "ad-campaigns", data.campaign_id],
        });
      }
      toast.success("Ad image updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteAdImage(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId?: string) => {
      const res = await fetch(`/api/cms/ads/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete ad image");
      // Return campaignId to pass it to onSuccess
      return { ...(await res.json()), campaignId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cms", "ad-images"] });
      if (data.campaignId) {
        queryClient.invalidateQueries({
          queryKey: ["cms", "ad-campaigns", data.campaignId],
        });
      }
      toast.success("Ad image deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
