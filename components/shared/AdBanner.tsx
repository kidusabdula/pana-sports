"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AdBanner() {
  const [currentAd, setCurrentAd] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const ads = [
    { id: 1, image: "/ad1.jpeg", alt: "Advertisement 1" },
    { id: 2, image: "/ad2.jpeg", alt: "Advertisement 2" },
    { id: 3, image: "/ad3.jpeg", alt: "Advertisement 3" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 5000); // Change ad every 5 seconds

    return () => clearInterval(interval);
  }, [ads.length]);

  const nextAd = () => {
    setCurrentAd((prev) => (prev + 1) % ads.length);
  };

  const prevAd = () => {
    setCurrentAd((prev) => (prev - 1 + ads.length) % ads.length);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative w-full bg-zinc-900/30 backdrop-blur-md border-b border-white/5"
    >
      <div className="container mx-auto px-4 py-2">
        <div className="relative flex items-center justify-between gap-4 max-w-6xl mx-auto">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevAd}
            className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Ad Container */}
          <div className="flex-1 relative h-50 rounded-xl overflow-hidden">
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
                  className="object-fill"
                  priority={currentAd === 0}
                />
              </motion.div>
            </AnimatePresence>

            {/* Ad Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {ads.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentAd(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentAd
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={nextAd}
            className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 shrink-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 shrink-0 text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
