"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import SeasonToggle from "@/components/shared/SeasonToggle";
import AdBanner from "@/components/shared/AdBanner";

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
  showAd?: boolean;
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
  showAd = true,
  className,
}: CompetitionHeaderProps) {
  const pathname = usePathname();

  const handleSeasonChange = (seasonId: string) => {
    onSeasonChange?.(seasonId);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Section */}
      <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
        {/* Competition Info */}
        <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {logo && (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden">
                <Image
                  src={logo}
                  alt={name}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {name}
              </h1>
              {nameAm && <p className="text-lg text-zinc-400 mt-1">{nameAm}</p>}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                  {country}
                </span>
                <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded-full capitalize">
                  {competitionType}
                </span>
              </div>
            </div>
          </div>

          {/* Season Toggle */}
          {showSeasonToggle && onSeasonChange && (
            <SeasonToggle
              currentSeasonId={currentSeasonId}
              onSeasonChange={handleSeasonChange}
            />
          )}
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-white/5">
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
                    "relative px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors",
                    isActive ? "text-primary" : "text-zinc-400 hover:text-white"
                  )}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
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

      {/* Ad Banner */}
      {showAd && (
        <AdBanner
          variant="full"
          showClose={false}
          page={`competition-${name}`}
        />
      )}
    </div>
  );
}
