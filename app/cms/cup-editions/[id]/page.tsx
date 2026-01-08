"use client";

import { useCupEdition, useUpdateCupEdition } from "@/lib/hooks/cms/useCups";
import { useParams } from "next/navigation";
import { CupEdition } from "@/lib/types/cup";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Loader2,
  Trophy,
  Calendar,
  Users,
  AlertTriangle,
  Brackets,
  LayoutGrid,
  Swords,
  Medal,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CupGroupManager } from "@/components/cms/cups/CupGroupManager";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function CupEditionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: edition, isLoading, error } = useCupEdition(id);
  const { mutate: updateEdition } = useUpdateCupEdition();

  const [status, setStatus] = useState<string | undefined>(undefined);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    updateEdition(
      { id, data: { status: newStatus as CupEdition["status"] } },
      {
        onSuccess: () => toast.success("Status updated"),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">
          Loading edition details...
        </p>
      </div>
    );
  }

  if (error || !edition) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Edition Not Found
        </h2>
        <Button asChild variant="link" className="text-primary">
          <Link href="/cms/cups">Return to Cups</Link>
        </Button>
      </div>
    );
  }

  const currentStatus = status || edition.status;

  return (
    <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 pb-12">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden border border-border bg-card backdrop-blur-xl p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row gap-6 items-start">
          {/* Cup Logo */}
          <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-muted border border-border p-3 flex items-center justify-center shadow-2xl overflow-hidden relative">
            {edition.cup?.logo_url ? (
              <Image
                src={edition.cup.logo_url}
                alt={edition.cup.name_en}
                fill
                className="object-contain p-3"
              />
            ) : (
              <Trophy className="h-12 w-12 text-amber-500/30" />
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-8 rounded-full bg-muted hover:bg-muted text-muted-foreground"
              >
                <Link
                  href={
                    edition.cup ? `/cms/cups/${edition.cup_id}` : "/cms/cups"
                  }
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {edition.cup?.name_en || "Back"}
                </Link>
              </Button>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase italic">
              {edition.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full border border-border">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-foreground font-medium">
                  {edition.season?.name || "No Season"}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full border border-border">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-foreground font-medium">
                  {edition.total_teams} Teams
                </span>
              </div>
              {edition.has_group_stage && (
                <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                  <LayoutGrid className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-300 font-medium">
                    {edition.groups_count} Groups
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status Selector */}
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <Select value={currentStatus} onValueChange={handleStatusChange}>
              <SelectTrigger
                className={cn(
                  "w-full md:w-48 h-12 border-2 font-bold uppercase tracking-wider",
                  currentStatus === "ongoing"
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : currentStatus === "completed"
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                    : currentStatus === "cancelled"
                    ? "bg-red-500/10 border-red-500/30 text-red-500"
                    : "bg-muted border-border text-muted-foreground"
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground">
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs
        defaultValue={edition.has_group_stage ? "groups" : "bracket"}
        className="space-y-6"
      >
        <TabsList className="bg-muted border border-border p-1.5 h-auto gap-1">
          {edition.has_group_stage && (
            <TabsTrigger
              value="groups"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2.5 font-bold uppercase tracking-tight text-sm"
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Groups
            </TabsTrigger>
          )}
          <TabsTrigger
            value="bracket"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2.5 font-bold uppercase tracking-tight text-sm"
          >
            <Brackets className="h-4 w-4 mr-2" />
            Bracket
          </TabsTrigger>
          <TabsTrigger
            value="matches"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2.5 font-bold uppercase tracking-tight text-sm"
          >
            <Swords className="h-4 w-4 mr-2" />
            Matches
          </TabsTrigger>
          <TabsTrigger
            value="results"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2.5 font-bold uppercase tracking-tight text-sm"
          >
            <Medal className="h-4 w-4 mr-2" />
            Results
          </TabsTrigger>
        </TabsList>

        {edition.has_group_stage && (
          <TabsContent value="groups" className="space-y-6">
            <CupGroupManager editionId={id} />
          </TabsContent>
        )}

        <TabsContent value="bracket" className="space-y-6">
          <Card className="bg-card border-border shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold uppercase italic tracking-tight">
                <Brackets className="h-5 w-5 text-primary" />
                Knockout Bracket
              </CardTitle>
              <CardDescription>
                Manage the knockout rounds and progression for this cup edition.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-12 text-center">
              <Brackets className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-10" />
              <p className="text-muted-foreground italic max-w-sm mx-auto">
                Knockout bracket visualization will be implemented in the next
                phase. You can manage cup matches from the Matches tab.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matches" className="space-y-6">
          <Card className="bg-card border-border shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-bold uppercase italic tracking-tight">
                  <Swords className="h-5 w-5 text-primary" />
                  Cup Matches
                </CardTitle>
                <CardDescription>
                  All matches for this cup edition.
                </CardDescription>
              </div>
              <Button asChild>
                <Link href={`/cms/matches/create?cup_edition_id=${id}`}>
                  Add Cup Match
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="py-12 text-center">
              <Swords className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-10" />
              <p className="text-muted-foreground italic max-w-sm mx-auto">
                Cup matches will appear here. Use the match management system to
                create matches linked to this cup edition.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Winner Card */}
            <Card className="bg-card border-border overflow-hidden shadow-xl">
              <div className="h-1 bg-linear-to-r from-amber-500 to-yellow-400" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold uppercase tracking-tight">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Champion
                </CardTitle>
              </CardHeader>
              <CardContent>
                {edition.winner ? (
                  <div className="flex items-center gap-4 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 group">
                    <div className="h-16 w-16 rounded-xl bg-muted p-2 flex items-center justify-center border border-border shadow-lg">
                      {edition.winner.logo_url ? (
                        <Image
                          src={edition.winner.logo_url}
                          alt={edition.winner.name_en}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      ) : (
                        <Trophy className="h-8 w-8 text-amber-500/50" />
                      )}
                    </div>
                    <div>
                      <p className="text-xl font-black text-foreground italic uppercase">
                        {edition.winner.name_en}
                      </p>
                      <p className="text-sm text-muted-foreground font-medium">
                        {edition.winner.name_am}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
                    <Trophy className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-20" />
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                      Champion undecided
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Runner-up Card */}
            <Card className="bg-card border-border overflow-hidden shadow-xl">
              <div className="h-1 bg-linear-to-r from-zinc-400 to-zinc-300" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold uppercase tracking-tight">
                  <Medal className="h-5 w-5 text-zinc-400" />
                  Runner-up
                </CardTitle>
              </CardHeader>
              <CardContent>
                {edition.runner_up ? (
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl border border-border">
                    <div className="h-16 w-16 rounded-xl bg-muted p-2 flex items-center justify-center border border-border shadow-lg">
                      {edition.runner_up.logo_url ? (
                        <Image
                          src={edition.runner_up.logo_url}
                          alt={edition.runner_up.name_en}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      ) : (
                        <Medal className="h-8 w-8 text-zinc-500/50" />
                      )}
                    </div>
                    <div>
                      <p className="text-xl font-black text-foreground italic uppercase">
                        {edition.runner_up.name_en}
                      </p>
                      <p className="text-sm text-muted-foreground font-medium">
                        {edition.runner_up.name_am}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
                    <Medal className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-20" />
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                      Runner-up undecided
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
