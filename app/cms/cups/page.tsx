"use client";

import { useCups } from "@/lib/hooks/cms/useCups";
import { Button } from "@/components/ui/button";
import { CupCard } from "@/components/cms/cups/CupCard";
import { Plus, Loader2, Trophy, Search, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function CupsPage() {
  const { data: cups, isLoading, error, refetch } = useCups();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCups = cups?.filter(
    (cup) =>
      cup.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cup.name_am.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cup.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            Cup Management
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage knockout tournaments, group brackets, and cup competitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className="border-border bg-card"
            title="Refresh"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          <Button asChild className="shadow-lg shadow-primary/20">
            <Link href="/cms/cups/create">
              <Plus className="h-4 w-4 mr-2" />
              Create New Cup
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search cups by name or slug..."
          className="pl-10 max-w-md h-11 bg-card border-border text-foreground focus:ring-primary/20 focus:border-primary/30"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-vh-[400px] text-muted-foreground">
          <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
          <p className="font-medium animate-pulse">
            Fetching competition data...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 text-red-500 bg-red-500/5 rounded-2xl border border-red-500/10">
          <p className="font-bold text-xl mb-2">Error loading cups</p>
          <p className="text-sm opacity-80 mb-6">{error.message}</p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-red-500/20 hover:bg-red-500/10"
          >
            Try Again
          </Button>
        </div>
      ) : filteredCups?.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center border-2 border-dashed border-border rounded-3xl bg-muted/20 p-8">
          <div className="p-6 rounded-full bg-muted mb-6 border border-border shadow-inner">
            <Trophy className="h-14 w-14 text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-2xl font-bold text-white">
            No competitions found
          </h3>
          <p className="mt-2 text-muted-foreground max-w-xs mx-auto">
            {searchQuery
              ? `We couldn't find any cups matching "${searchQuery}".`
              : "Expand your football empire by creating your first knockout tournament or group stage cup."}
          </p>
          {!searchQuery && (
            <Button
              asChild
              className="mt-8 shadow-xl shadow-primary/10"
              size="lg"
            >
              <Link href="/cms/cups/create">
                <Plus className="h-5 w-5 mr-2" />
                Initialize First Cup
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCups?.map((cup) => (
            <CupCard key={cup.id} cup={cup} />
          ))}
        </div>
      )}
    </div>
  );
}
