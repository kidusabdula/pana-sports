"use client";

import { useCups } from "@/lib/hooks/public/useCups";
import { Cup } from "@/lib/types/cup";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  MapPin,
  Calendar,
  Crown,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function CupCard({ cup }: { cup: Cup }) {
  return (
    <Link href={`/cups/${cup.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
        {/* Header with logo */}
        <div className="relative aspect-[16/10] bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.05)_0%,transparent_50%)]" />
          {cup.logo_url ? (
            <Image
              src={cup.logo_url}
              alt={cup.name_en}
              width={120}
              height={120}
              className="object-contain transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <Trophy className="h-20 w-20 text-amber-500/20 group-hover:text-amber-500/40 transition-colors" />
          )}

          {/* Cup Type Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                cup.cup_type === "knockout"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/20"
                  : cup.cup_type === "group_knockout"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                  : "bg-purple-500/20 text-purple-400 border border-purple-500/20"
              }`}
            >
              {cup.cup_type.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors tracking-tight">
              {cup.name_en}
            </h3>
            <p className="text-zinc-500 text-sm font-medium">{cup.name_am}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>{cup.country}</span>
            </div>
            {cup.founded_year && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Est. {cup.founded_year}</span>
              </div>
            )}
          </div>

          {/* Current Holder */}
          {cup.current_holder && (
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Holder
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-300">
                  {cup.current_holder.name_en}
                </span>
                {cup.current_holder.logo_url && (
                  <div className="relative h-6 w-6 rounded-full overflow-hidden border border-zinc-700">
                    <Image
                      src={cup.current_holder.logo_url}
                      alt={cup.current_holder.name_en}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* View Button */}
          <div className="pt-2">
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-800/50 rounded-lg group-hover:bg-primary/10 transition-colors">
              <span className="text-sm font-medium text-zinc-400 group-hover:text-primary">
                View Competition
              </span>
              <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CupsListPage() {
  const { data: cups, isLoading, error } = useCups();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-zinc-500 font-medium">
            Loading cup competitions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Trophy className="h-16 w-16 text-zinc-800 mx-auto" />
          <h2 className="text-xl font-bold text-white">Failed to load cups</h2>
          <p className="text-zinc-500">{error.message}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-zinc-900/80 to-zinc-950 border border-amber-500/10 p-8 md:p-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Trophy className="h-8 w-8 text-amber-400" />
              </div>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-full border border-amber-500/20">
                Cup Competitions
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-white mb-3">
              Ethiopian <span className="text-amber-400">Cups</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl font-medium">
              Explore Ethiopia's prestigious football cup tournaments. From
              knockout glory to group stage drama, witness the battles for
              silverware.
            </p>
          </div>
        </div>

        {/* Cups Grid */}
        {cups && cups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cups.map((cup) => (
              <CupCard key={cup.id} cup={cup} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Trophy className="h-20 w-20 text-zinc-800 mb-6" />
            <h2 className="text-2xl font-bold text-zinc-500 mb-2">
              No Cup Competitions Yet
            </h2>
            <p className="text-zinc-600 max-w-md">
              Cup competitions will be displayed here once they are available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
