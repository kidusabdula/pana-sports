"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import SeasonToggle from "@/components/shared/SeasonToggle";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export interface CompetitionTab {
  id: string;
  label: string;
  href?: string;
}

interface CompetitionHeaderProps {
  name: string;
  nameAm?: string;
  logo?: string;
  country?: string;
  competitionType?: "league" | "cup";
  tabs: CompetitionTab[];
  activeTab: string;
  onTabChange?: (tabId: string) => void;
  onSeasonChange?: (seasonId: string) => void;
  currentSeasonId?: string;
  showSeasonToggle?: boolean;
  className?: string;
}

export default function CompetitionHeader({
  name,
  nameAm,
  logo,
  country = "Ethiopia",
  competitionType = "league",
  tabs,
  activeTab,
  onTabChange,
  onSeasonChange,
  currentSeasonId,
  showSeasonToggle = true,
  className,
}: CompetitionHeaderProps) {
  const router = useRouter();

  const handleSeasonChange = (seasonId: string) => {
    onSeasonChange?.(seasonId);
  };

  return (
    <div className={cn("relative z-30", className)}>
      {/* Dynamic Background with Gradient Spots - Adds "Life" */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-50 mix-blend-screen" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Sticky Header Container */}
      <div className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-2 pt-3 pb-0">
            {/* Top Bar: Grid Layout for better Mobile control */}
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-4 min-h-[56px]">
              {/* Left: Back Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="h-9 w-9 md:h-10 md:w-10 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full shrink-0 -ml-2 md:ml-0"
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
              </Button>

              {/* Center: Competition Info */}
              <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                {logo && (
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center overflow-hidden border border-white/10 shadow-lg shrink-0">
                    <Image
                      src={logo}
                      alt={name}
                      width={48}
                      height={48}
                      className="object-contain p-1.5 md:p-2"
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                    <Badge className="bg-primary/20 text-primary border-primary/20 text-[9px] md:text-[10px] px-1.5 py-0 md:px-2 md:py-0.5 uppercase tracking-wider font-bold h-4 md:h-auto">
                      {competitionType === "cup" ? "Cup" : "League"}
                    </Badge>
                    {/* Mobile-only Country Text */}
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide truncate">
                      {country}
                    </span>
                  </div>
                  <h1 className="text-lg md:text-2xl font-black text-white tracking-tight leading-none truncate">
                    {name}
                  </h1>
                </div>
              </div>

              {/* Right: Season Toggle */}
              <div className="flex items-center">
                {showSeasonToggle && onSeasonChange && (
                  <SeasonToggle
                    currentSeasonId={currentSeasonId}
                    onSeasonChange={handleSeasonChange}
                    className="h-8 px-2.5 text-xs md:h-10 md:px-4 md:text-sm bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300 rounded-lg md:rounded-md"
                  />
                )}
              </div>
            </div>

            {/* Tabs - Scrollable Row */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pt-1 md:pt-2 pb-0">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const TabWrapper = tab.href ? Link : "button";

                return (
                  <TabWrapper
                    key={tab.id}
                    href={tab.href || "#"}
                    onClick={() => !tab.href && onTabChange?.(tab.id)}
                    className={cn(
                      "relative px-4 md:px-6 py-3 md:py-3.5 text-sm font-medium whitespace-nowrap transition-all duration-300",
                      isActive
                        ? "text-primary"
                        : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="competitionActiveTab"
                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(var(--primary),0.5)]"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </TabWrapper>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
