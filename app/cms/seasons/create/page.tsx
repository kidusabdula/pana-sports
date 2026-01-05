// app/cms/seasons/create/page.tsx
"use client";

import { useCreateSeason } from "@/lib/hooks/cms/useSeasons";
import { SeasonForm } from "@/components/cms/seasons/SeasonForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateSeasonPage() {
  const createMutation = useCreateSeason();
  const router = useRouter();

  const handleSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push("/cms/seasons");
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/cms/seasons">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Season
          </h1>
          <p className="text-muted-foreground">
            Define a new competition year for the system.
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Season Details</CardTitle>
        </CardHeader>
        <CardContent>
          <SeasonForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>

      <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
          Important Note
        </h4>
        <p className="text-xs text-blue-700 dark:text-blue-400">
          Once a season is created, you can add teams and register players under
          the "Manage" tab in the season list. Marking a season as "Current"
          will prioritize its data on the public-facing website.
        </p>
      </div>
    </div>
  );
}
