"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [currentAd, setCurrentAd] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // TODO: Replace with useAds hook when API is ready
  const ads = [
    { id: 1, image: "/ad1.jpg", alt: "Advertisement 1" },
    { id: 2, image: "/ad2.png", alt: "Advertisement 2" },
    { id: 3, image: "/ad3.jpg", alt: "Advertisement 3" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  const nextAd = () => setCurrentAd((prev) => (prev + 1) % ads.length);
  const prevAd = () =>
    setCurrentAd((prev) => (prev - 1 + ads.length) % ads.length);

  if (!isVisible) return null;

  // Variant-based styling
  const variantStyles = {
    full: "w-full h-24 md:h-32",
    sidebar: "w-full h-48 md:h-64",
    inline: "w-full h-20 md:h-24",
  };

  const containerHeight = height || variantStyles[variant];

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
            <Image
              src={ads[currentAd].image}
              alt={ads[currentAd].alt}
              fill
              className="object-cover"
              priority={currentAd === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        {showControls && (
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
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {ads.map((_, idx) => (
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
