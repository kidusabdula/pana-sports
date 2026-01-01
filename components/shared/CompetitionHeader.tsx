"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import SeasonToggle from "@/components/shared/SeasonToggle";
import { ChevronLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className={cn("", className)}>
      {/* Fixed Sticky Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-b from-zinc-950 via-zinc-950/98 to-zinc-950/95 backdrop-blur-xl pb-2">
        {/* Main Header Bar */}
        <div className="bg-zinc-900/80 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden mx-1">
          {/* Top Section - Competition Info */}
          <div className="px-4 py-4 flex items-center justify-between gap-4">
            {/* Left: Back + Logo + Info */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="h-10 w-10 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-4">
                {logo && (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center overflow-hidden border border-white/10 shadow-lg">
                    <Image
                      src={logo}
                      alt={name}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">
                      {competitionType === "cup" ? "Cup Competition" : "League"}
                    </span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
                    {name}
                  </h1>
                  {nameAm && (
                    <p className="text-sm text-zinc-400 mt-0.5">{nameAm}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Season Toggle + Country Badge */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20 font-medium">
                {country}
              </span>

              {showSeasonToggle && onSeasonChange && (
                <SeasonToggle
                  currentSeasonId={currentSeasonId}
                  onSeasonChange={handleSeasonChange}
                  className="h-10 px-4 text-sm"
                />
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-t border-white/5 bg-black/20">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const TabWrapper = tab.href ? Link : "button";

                return (
                  <TabWrapper
                    key={tab.id}
                    href={tab.href || "#"}
                    onClick={() => !tab.href && onTabChange?.(tab.id)}
                    className={cn(
                      "relative px-6 py-3.5 text-sm font-medium whitespace-nowrap transition-all",
                      isActive
                        ? "text-white"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                    )}
                  >
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="competitionActiveTab"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-primary via-primary to-primary/50 rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
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
