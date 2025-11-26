"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import MatchForm from "@/components/cms/matches/MatchForm";
import { useMatch } from "@/lib/hooks/useMatches";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function EditMatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: match, isLoading, error } = useMatch(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-destructive">
            <Trophy className="h-5 w-5" />
            <span>
              Error loading match:{" "}
              {error instanceof Error ? error.message : "Match not found"}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <MatchForm
        match={match}
        onSuccess={() => router.push("/cms/matches")}
        onCancel={() => router.back()}
      />
    </div>
  );
}
