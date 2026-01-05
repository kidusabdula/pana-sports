// app/cms/seasons/[id]/page.tsx
"use client";

import {
  useAdminSeason,
  useUpdateSeason,
  useDeleteSeason,
} from "@/lib/hooks/cms/useSeasons";
import { SeasonForm } from "@/components/cms/seasons/SeasonForm";
import { SeasonTeamManager } from "@/components/cms/seasons/SeasonTeamManager";
import { SeasonPlayerManager } from "@/components/cms/seasons/SeasonPlayerManager";
import { SeasonStats } from "@/components/cms/seasons/SeasonStats";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  Trash2,
  Loader2,
  LayoutDashboard,
  Users,
  UserCog,
  Settings,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function SeasonDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: season, isLoading, error } = useAdminSeason(id);
  const updateMutation = useUpdateSeason();
  const deleteMutation = useDeleteSeason();

  const handleUpdate = (data: any) => {
    updateMutation.mutate({ id, data });
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this season? This action cannot be undone and only works if there are no matches."
      )
    ) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          router.push("/cms/seasons");
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">
          Loading season details...
        </p>
      </div>
    );
  }

  if (error || !season) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <h2 className="text-2xl font-bold text-destructive">
          Season Not Found
        </h2>
        <p className="text-muted-foreground">
          The season you are looking for does not exist or has been deleted.
        </p>
        <Button asChild variant="outline">
          <Link href="/cms/seasons">Back to Seasons</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="hover:bg-muted"
          >
            <Link href="/cms/seasons">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{season.name}</h1>
            <p className="text-muted-foreground">
              Manage teams, players, and settings for this season.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!season.is_archived && (
            <Button
              variant="outline"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Season
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 w-full md:w-auto h-auto grid grid-cols-2 md:inline-flex">
          <TabsTrigger
            value="overview"
            className="flex items-center gap-2 py-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2 py-2">
            <Users className="h-4 w-4" />
            Teams
          </TabsTrigger>
          <TabsTrigger value="players" className="flex items-center gap-2 py-2">
            <UserCog className="h-4 w-4" />
            Players
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="flex items-center gap-2 py-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="space-y-6 focus-visible:outline-none focus-visible:ring-0"
        >
          <SeasonStats
            teamCount={season.team_count ?? 0}
            matchCount={season.match_count ?? 0}
            isCurrent={season.is_current}
            isArchived={season.is_archived}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 shadow-sm">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Season Description
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1">
                      English
                    </h4>
                    <p className="text-sm leading-relaxed">
                      {season.description_en || "No description provided."}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1">
                      Amharic
                    </h4>
                    <p className="text-sm leading-relaxed text-right" dir="rtl">
                      {season.description_am || "መግለጫ አልተሰጠም።"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href={`/cms/matches?seasonId=${id}`}>
                      <Trophy className="h-4 w-4 mr-2 text-primary" />
                      View Matches
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href={`/cms/standings?seasonId=${id}`}>
                      <LayoutDashboard className="h-4 w-4 mr-2 text-primary" />
                      View Standings
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent
          value="teams"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          <SeasonTeamManager seasonId={id} />
        </TabsContent>

        <TabsContent
          value="players"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          <SeasonPlayerManager seasonId={id} />
        </TabsContent>

        <TabsContent
          value="settings"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          <Card className="shadow-sm border-border/50">
            <CardContent className="pt-6">
              <SeasonForm
                initialData={season as any}
                onSubmit={handleUpdate}
                isLoading={updateMutation.isPending}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
