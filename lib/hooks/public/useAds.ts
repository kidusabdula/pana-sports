import { useQuery } from "@tanstack/react-query";

interface PublicAd {
  id: string;
  image: string; // Legacy field for backward compatibility
  imageLarge: string;
  imageSmall: string;
  alt: string;
  link: string;
  sizeType: string;
}

export function usePublicAds(page: string = "home", sizeType: string = "full") {
  return useQuery<PublicAd[]>({
    queryKey: ["public", "ads", { page, sizeType }],
    queryFn: async () => {
      const res = await fetch(
        `/api/public/ads?page=${page}&sizeType=${sizeType}`
      );
      if (!res.ok) throw new Error("Failed to fetch ads");
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
