"use client";

import {
  useCup,
  useCupEditions,
  useCreateCupEdition,
  useDeleteCupEdition,
} from "@/lib/hooks/cms/useCups";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Loader2,
  Trophy,
  Settings,
  ChevronLeft,
  Calendar,
  Users,
  Trophy as TrophyIcon,
  Trash2,
  ChevronRight,
  Settings2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CupEditionForm } from "@/components/cms/cups/CupEditionForm";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CupEditionCreate } from "@/lib/schemas/cup";

export default function CupDetailPage() {
  const params = useParams();
  const id = params.id as string;
  // const router = useRouter(); // Removed unused router

  const { data: cup, isLoading: cupLoading, error: cupError } = useCup(id);
  const { data: editions, isLoading: editionsLoading } = useCupEditions(id);
  const { mutate: createEdition, isPending: isCreating } =
    useCreateCupEdition();
  const { mutate: deleteEdition } = useDeleteCupEdition();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreateEdition = (data: CupEditionCreate) => {
    createEdition(data, {
      onSuccess: () => {
        toast.success("Cup Edition launched successfully");
        setIsCreateOpen(false);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleDeleteEdition = (editionId: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to remove the ${name} edition? All group data and bracket configurations will be lost.`
      )
    ) {
      deleteEdition(editionId, {
        onSuccess: () => toast.success("Edition removed"),
        onError: (err) => toast.error(err.message),
      });
    }
  };

  if (cupLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-vh-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">
          Assembling competition dashboard...
        </p>
      </div>
    );
  }

  if (cupError || !cup) {
    return (
      <div className="flex flex-col items-center justify-center min-vh-[400px] text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Competition Not Found
        </h2>
        <Button asChild variant="link" className="text-primary">
          <Link href="/cms/cups">Return to Cups</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 pb-12">
      {/* Header Section */}
      <div className="relative rounded-3xl overflow-hidden border border-border bg-card backdrop-blur-xl p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row gap-8 items-start">
          {/* Logo container */}
          <div className="shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-muted border border-border p-4 flex items-center justify-center group relative overflow-hidden shadow-2xl">
            {cup.logo_url ? (
              <Image
                src={cup.logo_url}
                alt={cup.name_en}
                fill
                className="object-contain p-4"
              />
            ) : (
              <TrophyIcon className="h-20 w-20 text-muted-foreground/20" />
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-8 rounded-full bg-muted hover:bg-muted text-muted-foreground"
              >
                <Link href="/cms/cups">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to All
                </Link>
              </Button>
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 capitalize px-3 py-1"
              >
                {cup.cup_type.replace("_", " ")}
              </Badge>
            </div>

            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase italic">
                {cup.name_en}
              </h1>
              <p className="text-xl text-muted-foreground font-amharic font-medium">
                {cup.name_am}
              </p>
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border border-border text-primary shadow-inner">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    Founded
                  </p>
                  <p className="text-foreground font-bold">
                    {cup.founded_year || "Legacy"}
                  </p>
                </div>
              </div>

              {cup.current_holder && (
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-muted overflow-hidden border border-border p-1.5 flex items-center justify-center shadow-inner">
                    {cup.current_holder.logo_url ? (
                      <Image
                        src={cup.current_holder.logo_url}
                        alt={cup.current_holder.name_en}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    ) : (
                      <TrophyIcon className="h-5 w-5 text-muted-foreground/30" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                      Title Holder
                    </p>
                    <p className="text-foreground font-bold">
                      {cup.current_holder.name_en}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex md:flex-col gap-2 w-full md:w-auto">
            <Button
              asChild
              variant="outline"
              className="flex-1 bg-background border-border hover:bg-muted hover:text-foreground border-b-4 hover:border-b-2 active:border-b-0 transition-all"
            >
              <Link href={`/cms/cups/${id}/edit`}>
                <Settings2 className="h-4 w-4 mr-2" />
                Configure Cup
              </Link>
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 shadow-lg shadow-primary/20 border-b-4 border-primary-dark hover:border-b-2 active:border-b-0 transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  Launch Edition
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background border-border text-foreground max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold tracking-tight">
                    New Cup Edition
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-sm">
                    Start a new quest for the {cup.name_en} trophy. Choose the
                    season and basic competition format.
                  </DialogDescription>
                </DialogHeader>
                <CupEditionForm
                  cupId={id}
                  onSubmit={handleCreateEdition}
                  isPending={isCreating}
                  onCancel={() => setIsCreateOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editions Side List */}
        <Card className="lg:col-span-2 bg-muted/10 border-border p-1">
          <CardHeader className="px-6 pt-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight italic uppercase">
                Competition History
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Every recorded instance of this cup.
              </CardDescription>
            </div>
            <div className="h-10 w-10 bg-muted rounded-xl border border-border flex items-center justify-center text-muted-foreground">
              <Trophy className="h-5 w-5 opacity-40" />
            </div>
          </CardHeader>
          <CardContent className="px-3 pb-6 space-y-2 mt-4">
            {editionsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin mb-2" />
                <p className="text-xs font-bold uppercase tracking-tighter">
                  Locating historical data...
                </p>
              </div>
            ) : !editions || editions.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <Calendar className="h-16 w-16 text-muted-foreground/20 mx-auto opacity-20" />
                <p className="text-muted-foreground italic max-w-xs mx-auto">
                  This competition hasn&apos;t started its journey yet. Launch
                  the first edition to begin.
                </p>
              </div>
            ) : (
              editions.map((edition) => (
                <div
                  key={edition.id}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border hover:border-muted-foreground/30 hover:bg-muted/50 transition-all duration-300"
                >
                  <div className="h-14 w-14 rounded-xl bg-muted flex flex-col items-center justify-center border border-border border-r-4 border-r-primary overflow-hidden shadow-lg">
                    <span className="text-[10px] font-black italic text-zinc-500 uppercase leading-none">
                      {edition.season?.name.split("/")[0]}
                    </span>
                    <span className="text-lg font-black italic text-foreground leading-none">
                      V2
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-lg font-bold text-foreground truncate italic group-hover:text-primary transition-colors">
                        {edition.name}
                      </h4>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] h-5 capitalize tracking-tighter font-bold",
                          edition.status === "ongoing"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : edition.status === "completed"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                        )}
                      >
                        {edition.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-tighter">
                      <div className="flex items-center gap-1.5 bg-muted px-2 py-0.5 rounded-md border border-border">
                        <Users className="h-3 w-3 text-primary" />
                        {edition.total_teams} Contenders
                      </div>
                      {edition.has_group_stage && (
                        <div className="flex items-center gap-1.5 bg-muted px-2 py-0.5 rounded-md border border-border">
                          <Settings className="h-3 w-3 text-amber-500" />
                          {edition.groups_count} Groups
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-muted-foreground hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl"
                      onClick={() =>
                        handleDeleteEdition(edition.id, edition.name)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-10 rounded-xl border-border bg-background hover:bg-muted group-hover:border-muted-foreground/50 px-4"
                    >
                      <Link href={`/cms/cup-editions/${edition.id}`}>
                        Manage
                        <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Info Column */}
        <div className="space-y-6">
          <Card className="bg-muted/10 border-border shadow-md overflow-hidden">
            <div className="h-1 bg-primary/40" />
            <CardHeader>
              <CardTitle className="text-xl font-bold tracking-tight italic uppercase">
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  {cup.description_en ||
                    "No English description provided for this cup."}
                </p>
                <p className="text-sm text-muted-foreground/80 leading-relaxed font-amharic">
                  {cup.description_am || "ለዚህ ውድድር የአማርኛ መግለጫ አልተሰጠም።"}
                </p>
              </div>

              <div className="pt-6 border-t border-zinc-800 grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-2xl border border-border shadow-inner">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mb-1">
                    Total Editions
                  </p>
                  <p className="text-2xl font-black italic text-foreground">
                    {editions?.length || 0}
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-2xl border border-border shadow-inner">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mb-1">
                    Status
                  </p>
                  <p
                    className={cn(
                      "text-lg font-black italic uppercase",
                      cup.is_active ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {cup.is_active ? "ACTIVE" : "INACTIVE"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions / Tips */}
          <div className="rounded-3xl bg-primary/5 border border-primary/10 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-primary" />
              <h3 className="font-black italic uppercase tracking-tighter text-foreground">
                Management Tip
              </h3>
            </div>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              When launching a new edition, you can define if it has a group
              stage beforehand. Knockout rounds can be generated dynamically
              within the edition dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
