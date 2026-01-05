// app/cms/seasons/page.tsx
"use client";

import { useAdminSeasons } from "@/lib/hooks/cms/useSeasons";
import { Button } from "@/components/ui/button";
import { SeasonCard } from "@/components/cms/seasons/SeasonCard";
import { Plus, Loader2, CalendarDays, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function SeasonsPage() {
  const { data: seasons, isLoading, error } = useAdminSeasons();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSeasons = seasons?.filter(
    (season) =>
      season.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      season.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Season Management
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your league seasons, teams, and rosters.
          </p>
        </div>

        <Button asChild className="shadow-sm">
          <Link href="/cms/seasons/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Season
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search seasons by name or slug..."
          className="pl-10 max-w-md h-11"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
          <p className="text-sm font-medium">Loading seasons...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-destructive bg-destructive/5 rounded-xl border border-destructive/10">
          <p className="font-semibold text-lg">Failed to load seasons</p>
          <p className="text-sm">Please check your connection and try again.</p>
        </div>
      ) : filteredSeasons?.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center border-2 border-dashed rounded-xl bg-muted/30">
          <div className="p-5 rounded-full bg-muted mb-4">
            <CalendarDays className="h-12 w-12 text-muted-foreground opacity-30" />
          </div>
          <h3 className="text-xl font-bold">No seasons found</h3>
          <p className="mt-2 text-muted-foreground max-w-xs mx-auto">
            {searchQuery
              ? `We couldn't find any seasons matching "${searchQuery}".`
              : "Start by creating your first football season to manage leagues and matches."}
          </p>
          {!searchQuery && (
            <Button asChild className="mt-6 shadow-md" variant="default">
              <Link href="/cms/seasons/create">
                <Plus className="h-4 w-4 mr-2" />
                Create First Season
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSeasons?.map((season) => (
            <SeasonCard key={season.id} season={season} />
          ))}
        </div>
      )}
    </div>
  );
}
