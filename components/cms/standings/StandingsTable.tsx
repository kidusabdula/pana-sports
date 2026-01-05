"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useStandings, useDeleteStanding } from "@/lib/hooks/cms/useStandings";
import { useLeagues } from "@/lib/hooks/cms/useLeagues";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Trophy,
  TrendingUp,
  ChevronDown,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { SeasonSelector } from "../seasons/SeasonSelector";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StandingsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLeague, setFilterLeague] = useState("all");
  const [filterSeason, setFilterSeason] = useState("all");
  const {
    data: standings,
    isLoading,
    error,
  } = useStandings({
    league_id: filterLeague === "all" ? undefined : filterLeague,
    season: filterSeason === "all" ? undefined : filterSeason,
  });
  const deleteStandingMutation = useDeleteStanding();
  const { data: leagues } = useLeagues();

  const filteredStandings =
    standings?.filter((standing) => {
      const matchesSearch =
        standing.team?.name_en
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (standing.team?.name_am?.toLowerCase() ?? "").includes(
          searchTerm.toLowerCase()
        );

      const matchesLeague =
        filterLeague === "all" || standing.league?.id === filterLeague;

      // Filter by season string (legacy field)
      const matchesSeason =
        filterSeason === "all" || standing.season === filterSeason;

      return matchesSearch && matchesLeague && matchesSeason;
    }) || [];

  const handleDelete = async (id: string, teamName: string) => {
    const promise = deleteStandingMutation.mutateAsync(id);

    toast.promise(promise, {
      loading: `Deleting "${teamName}"...`,
      success: `Standing deleted successfully`,
      error: (error) => {
        return error instanceof Error
          ? error.message
          : "Failed to delete standing";
      },
    });

    try {
      await promise;
    } catch (error) {
      // Error is handled by toast.promise
      console.error(error);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );

  if (error)
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center space-x-2 text-destructive">
            <Trophy className="h-5 w-5" />
            <span>
              Error loading standings:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </span>
          </div>
        </CardContent>
      </Card>
    );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Total Teams
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  {standings?.length || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Current Season
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  {filterSeason === "all" ? "All" : filterSeason}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-500/10 rounded-full">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Active Leagues
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  {new Set(standings?.map((s) => s.league?.id)).size || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-500/10 rounded-full">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Total Goals
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  {standings?.reduce((sum, s) => sum + (s.goals_for || 0), 0) ||
                    0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-500/10 rounded-full">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <CardHeader className="bg-background/50 border-b border-border/50 px-4 sm:px-6 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Standings ({standings?.length || 0})
              </CardTitle>
              <Link href="/cms/standings/create" className="sm:hidden">
                <Button size="sm" className="h-9 gap-2 rounded-lg shadow-sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 bg-background border-input focus:border-primary w-full sm:w-64 rounded-lg transition-all"
                />
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <Select value={filterLeague} onValueChange={setFilterLeague}>
                  <SelectTrigger className="h-9 w-full sm:w-40">
                    <SelectValue placeholder="Filter by league" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Leagues</SelectItem>
                    {leagues?.map((league) => (
                      <SelectItem key={league.id} value={league.id}>
                        {league.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="w-full sm:w-40">
                  <SeasonSelector
                    value={filterSeason}
                    onValueChange={setFilterSeason}
                    showAll={true}
                    placeholder="All Seasons"
                  />
                </div>
                <Link href="/cms/standings/create">
                  <Button size="sm" className="h-9 gap-2 rounded-lg shadow-sm">
                    <Plus className="h-4 w-4" />
                    Add Standing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead className="w-12 pl-6">
                  <input
                    type="checkbox"
                    className="rounded border-muted-foreground/30 text-primary focus:ring-primary"
                  />
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Rank
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Team
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Played
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Won
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Draw
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Lost
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  GF
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  GA
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  GD
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Points
                </TableHead>
                <TableHead className="text-right font-medium text-muted-foreground text-xs uppercase tracking-wider pr-6">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStandings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <Trophy className="h-12 w-12 text-muted-foreground/20" />
                      <p className="text-muted-foreground">
                        No standings found.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStandings.map((standing) => (
                  <TableRow
                    key={standing.id}
                    className="hover:bg-muted/30 transition-colors border-b border-border/40"
                  >
                    <TableCell className="pl-6">
                      <input
                        type="checkbox"
                        className="rounded border-muted-foreground/30 text-primary focus:ring-primary"
                      />
                    </TableCell>
                    <TableCell className="font-bold text-lg text-foreground">
                      {standing.rank}
                    </TableCell>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        {standing.team?.logo_url && (
                          <div className="relative h-8 w-8">
                            <Image
                              src={standing.team.logo_url}
                              alt={standing.team.name_en}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground truncate max-w-[200px]">
                            {standing.team?.name_en}
                          </span>
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {standing.league?.name_en}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground">
                        {standing.played}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground">
                        {standing.won}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground">
                        {standing.draw}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground">
                        {standing.lost}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground">
                        {standing.goals_for}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground">
                        {standing.goals_against}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          standing.gd > 0
                            ? "default"
                            : standing.gd < 0
                            ? "destructive"
                            : "secondary"
                        }
                        className="font-medium"
                      >
                        {standing.gd > 0 ? "+" : ""}
                        {standing.gd}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-foreground">
                      {standing.points}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/cms/standings/${standing.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Standing
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the standing for
                                &quot;
                                {standing.team?.name_en}&quot;? This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="m-0">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete(
                                    standing.id,
                                    standing.team?.name_en || ""
                                  )
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 m-0"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden">
          {filteredStandings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Trophy className="h-12 w-12 text-muted-foreground/20 mb-3" />
              <p className="text-muted-foreground">No standings found.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredStandings.map((standing) => (
                <div
                  key={standing.id}
                  className="p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 shrink-0">
                      <span className="text-lg font-bold text-primary">
                        {standing.rank}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-foreground text-sm truncate">
                            {standing.team?.name_en}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {standing.league?.name_en}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Link href={`/cms/standings/${standing.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Standing
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the standing
                                  for &quot;
                                  {standing.team?.name_en}&quot;? This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                <AlertDialogCancel className="m-0">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDelete(
                                      standing.id,
                                      standing.team?.name_en || ""
                                    )
                                  }
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 m-0"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Played:</span>
                          <span className="font-medium text-foreground">
                            {standing.played}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Points:</span>
                          <span className="font-medium text-foreground">
                            {standing.points}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">W-D-L:</span>
                          <span className="font-medium text-foreground">
                            {standing.won}-{standing.draw}-{standing.lost}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">GD:</span>
                          <Badge
                            variant={
                              standing.gd > 0
                                ? "default"
                                : standing.gd < 0
                                ? "destructive"
                                : "secondary"
                            }
                            className="font-medium text-xs"
                          >
                            {standing.gd > 0 ? "+" : ""}
                            {standing.gd}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Goals:</span>
                          <span className="font-medium text-foreground">
                            {standing.goals_for}-{standing.goals_against}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Season:</span>
                          <span className="font-medium text-foreground">
                            {standing.season}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-border/50 bg-background/50 gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <span>Show</span>
            <Select defaultValue="10">
              <SelectTrigger className="h-8 w-16">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="hidden sm:inline">standings per page</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              disabled
            >
              <span className="sr-only">Previous</span>
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
            <div className="flex items-center gap-1">
              <Button
                variant="default"
                size="sm"
                className="h-8 w-8 rounded-lg p-0"
              >
                1
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-lg p-0 hidden sm:flex"
              >
                2
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-lg p-0 hidden sm:flex"
              >
                3
              </Button>
              <span className="text-muted-foreground px-1 hidden sm:inline">
                ...
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-lg p-0 hidden sm:flex"
              >
                12
              </Button>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              disabled
            >
              <span className="sr-only">Next</span>
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
