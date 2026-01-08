"use client";

import { useState } from "react";
import {
  useCup,
  useCupEdition,
  useCupMatches,
} from "@/lib/hooks/public/useCups";
import { CupEdition } from "@/lib/types/cup";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  Users,
  Crown,
  Loader2,
  AlertTriangle,
  LayoutGrid,
  Brackets,
  Swords,
  Medal,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CompetitionHeader from "@/components/shared/CompetitionHeader";
import CupGroupStage from "@/components/cups/CupGroupStage";
import CupBracket from "@/components/cups/CupBracket";
import CupMatchesList from "@/components/cups/CupMatchesList";

interface CupDetailPageProps {
  slug: string;
}

export default function CupDetailPage({ slug }: CupDetailPageProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedEditionId, setSelectedEditionId] = useState<string | null>(
    null
  );

  const { data: cup, isLoading: cupLoading, error: cupError } = useCup(slug);

  // Use selected edition or current edition
  const editionId = selectedEditionId || cup?.current_edition?.id || "";
  const { data: edition, isLoading: editionLoading } = useCupEdition(editionId);
  const { data: matchesData, isLoading: matchesLoading } =
    useCupMatches(editionId);

  const isLoading = cupLoading || editionLoading;

  // Error state
  if (cupError) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Cup Not Found</h2>
          <p className="text-zinc-500">{cupError.message}</p>
          <Button asChild>
            <Link href="/cups">View All Cups</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-zinc-500 font-medium">Loading competition...</p>
        </div>
      </div>
    );
  }

  if (!cup) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Trophy className="h-16 w-16 text-zinc-800 mx-auto" />
          <h2 className="text-2xl font-bold text-zinc-500">Cup not found</h2>
          <Button asChild variant="outline">
            <Link href="/cups">Back to Cups</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentEdition = edition || cup.current_edition;
  const matches = matchesData?.matches || [];

  // Tabs configuration
  const tabs = [
    { id: "overview", label: "Overview" },
    ...(currentEdition?.has_group_stage
      ? [{ id: "groups", label: "Groups" }]
      : []),
    { id: "bracket", label: "Bracket" },
    { id: "matches", label: "Matches" },
  ];

  const handleEditionChange = (editionId: string) => {
    setSelectedEditionId(editionId);
    setActiveTab("overview");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-3 sm:px-4 py-6 space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/5 via-zinc-900/80 to-zinc-950 border border-zinc-800 p-6 md:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32" />

          <div className="relative flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-zinc-900/80 border border-zinc-800 p-4 flex items-center justify-center shadow-2xl">
              {cup.logo_url ? (
                <Image
                  src={cup.logo_url}
                  alt={cup.name_en}
                  width={96}
                  height={96}
                  className="object-contain"
                />
              ) : (
                <Trophy className="h-12 w-12 text-amber-500/40" />
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
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
                {currentEdition && (
                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                      currentEdition.status === "ongoing"
                        ? "bg-green-500/20 text-green-400 border border-green-500/20"
                        : currentEdition.status === "completed"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                        : "bg-zinc-500/20 text-zinc-400 border border-zinc-500/20"
                    }`}
                  >
                    {currentEdition.status}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                  {cup.name_en}
                </h1>
                <p className="text-zinc-500 text-lg font-medium">
                  {cup.name_am}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{cup.country}</span>
                </div>
                {cup.founded_year && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Established {cup.founded_year}</span>
                  </div>
                )}
                {cup.current_holder && (
                  <div className="flex items-center gap-1.5">
                    <Crown className="h-4 w-4 text-amber-500" />
                    <span>Holder: {cup.current_holder.name_en}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Edition Selector */}
            {cup.editions && cup.editions.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {currentEdition?.name || "Select Edition"}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-zinc-900 border-zinc-800 text-white"
                >
                  {cup.editions.map((ed) => (
                    <DropdownMenuItem
                      key={ed.id}
                      onClick={() => handleEditionChange(ed.id)}
                      className="cursor-pointer"
                    >
                      {ed.name}
                      {ed.status === "ongoing" && (
                        <span className="ml-2 text-green-400 text-[10px] uppercase font-bold">
                          Live
                        </span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Edition Stats */}
        {currentEdition && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
              <Users className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {currentEdition.total_teams}
              </p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">
                Teams
              </p>
            </div>
            {currentEdition.has_group_stage && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
                <LayoutGrid className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {currentEdition.groups_count}
                </p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">
                  Groups
                </p>
              </div>
            )}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
              <Swords className="h-5 w-5 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{matches.length}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">
                Matches
              </p>
            </div>
            {currentEdition.winner && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-400" />
                  <span className="text-xs text-amber-400 uppercase tracking-wider font-bold">
                    Champion
                  </span>
                </div>
                <p className="text-lg font-bold text-white text-center mt-1">
                  {currentEdition.winner.name_en}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1 h-auto gap-1 flex-wrap">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2.5 font-bold uppercase tracking-tight text-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recent/Upcoming Matches */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Swords className="h-5 w-5 text-primary" />
                    Recent Matches
                  </h3>
                  <CupMatchesList matches={matches.slice(0, 5)} />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Cup Description */}
                {cup.description_en && (
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      About
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {cup.description_en}
                    </p>
                    {cup.description_am && (
                      <p className="text-sm text-zinc-500 leading-relaxed mt-3 font-amharic">
                        {cup.description_am}
                      </p>
                    )}
                  </div>
                )}

                {/* Previous Winners */}
                {cup.editions &&
                  cup.editions.filter((e) => e.winner).length > 0 && (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Medal className="h-5 w-5 text-amber-500" />
                        Roll of Honor
                      </h3>
                      <div className="space-y-3">
                        {cup.editions
                          .filter((e) => e.winner)
                          .slice(0, 5)
                          .map((ed) => (
                            <div
                              key={ed.id}
                              className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
                            >
                              <span className="text-sm text-zinc-400">
                                {ed.season?.name || ed.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-white">
                                  {ed.winner?.name_en}
                                </span>
                                {ed.winner?.logo_url && (
                                  <div className="relative h-5 w-5 rounded-full overflow-hidden border border-zinc-700">
                                    <Image
                                      src={ed.winner.logo_url}
                                      alt={ed.winner.name_en}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </TabsContent>

          {currentEdition?.has_group_stage && (
            <TabsContent value="groups" className="mt-6">
              <CupGroupStage groups={edition?.groups || []} />
            </TabsContent>
          )}

          <TabsContent value="bracket" className="mt-6">
            <CupBracket editionId={editionId} />
          </TabsContent>

          <TabsContent value="matches" className="mt-6">
            <CupMatchesList matches={matches} showAll />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
