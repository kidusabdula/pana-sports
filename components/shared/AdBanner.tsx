"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePublicAds } from "@/lib/hooks/public/useAds";

interface AdBannerProps {
  variant?: "full" | "sidebar" | "inline";
  height?: string;
  showControls?: boolean;
  showClose?: boolean;
  className?: string;
  page?: string; // For tracking which page the ad is on
}

export default function AdBanner({
  variant = "full",
  height,
  showControls = true,
  showClose = true,
  className,
  page = "home",
}: AdBannerProps) {
  const { data: ads } = usePublicAds(page, variant);
  const [currentAd, setCurrentAd] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (ads && ads.length > 0) {
      const adId = ads[currentAd].id;
      fetch("/api/public/ads/track", {
        method: "POST",
        body: JSON.stringify({
          adImageId: adId,
          eventType: "impression",
          pageUrl: window.location.pathname,
        }),
      }).catch(console.error);

      const interval = setInterval(() => {
        setCurrentAd((prev) => (prev + 1) % ads.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [ads, currentAd]);

  const handleAdClick = (adId: string) => {
    fetch("/api/public/ads/track", {
      method: "POST",
      body: JSON.stringify({
        adImageId: adId,
        eventType: "click",
        pageUrl: window.location.pathname,
      }),
    }).catch(console.error);
  };

  const nextAd = () => ads && setCurrentAd((prev) => (prev + 1) % ads.length);
  const prevAd = () =>
    ads && setCurrentAd((prev) => (prev - 1 + ads.length) % ads.length);

  if (!isVisible || !ads || ads.length === 0) return null;

  // Variant-based styling
  const variantStyles = {
    full: "w-full h-24 md:h-32",
    sidebar: "w-full h-48 md:h-64",
    inline: "w-full h-20 md:h-24",
  };

  const containerHeight = height || variantStyles[variant];

  // Determine which image to use based on variant
  // For sidebar/small placements, use small image; for full/inline use large
  const getAdImage = (ad: {
    image?: string;
    imageLarge?: string;
    imageSmall?: string;
  }) => {
    if (variant === "sidebar") {
      // Prefer small image for sidebar, fallback to large then legacy
      return ad.imageSmall || ad.imageLarge || ad.image || "";
    }
    // For full and inline, prefer large image
    return ad.imageLarge || ad.image || "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "relative bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden",
        className
      )}
    >
      <div className={cn("relative", containerHeight)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAd}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Link
              href={ads[currentAd].link || "#"}
              target="_blank"
              className="block w-full h-full"
              onClick={() => handleAdClick(ads[currentAd].id)}
            >
              <Image
                src={getAdImage(ads[currentAd])}
                alt={ads[currentAd].alt || "Advertisement"}
                fill
                className="object-cover"
                priority={currentAd === 0}
              />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        {showControls && ads.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={prevAd}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 border border-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextAd}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 border border-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Indicators */}
        {ads.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {ads.map((_ad, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentAd(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === currentAd
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-white/30 hover:bg-white/50"
                )}
              />
            ))}
          </div>
        )}

        {/* Close */}
        {showClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/50 hover:bg-black/70 text-zinc-400 hover:text-white"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
