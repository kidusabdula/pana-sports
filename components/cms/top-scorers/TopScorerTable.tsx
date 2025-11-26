"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
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
import { useTopScorers, useDeleteTopScorer } from "@/lib/hooks/useTopScorers";
import { TopScorer } from "@/lib/schemas/topScorer";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Trophy,
  Calendar,
  Filter,
  ChevronDown,
  Target,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
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
import { useLeagues } from "@/lib/hooks/useLeagues";
import { usePlayers } from "@/lib/hooks/usePlayers";
import { useTeams } from "@/lib/hooks/useTeams";

export default function TopScorerTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLeague, setFilterLeague] = useState("all");
  const { data: topScorers, isLoading, error } = useTopScorers();
  const { data: leagues } = useLeagues();
  const { data: players } = usePlayers();
  const { data: teams } = useTeams();
  const deleteTopScorerMutation = useDeleteTopScorer();

  const filteredTopScorers =
    topScorers?.filter((scorer) => {
      const player = players?.find((p) => p.slug === scorer.player_slug);
      const matchesSearch =
        player?.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player?.name_am?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scorer.player_slug?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLeague =
        filterLeague === "all" || scorer.league_slug === filterLeague;

      return matchesSearch && matchesLeague;
    }) || [];

  const handleDelete = async (id: string, playerName: string) => {
    const promise = deleteTopScorerMutation.mutateAsync(id);

    toast.promise(promise, {
      loading: `Deleting "${playerName}"...`,
      success: `Top scorer deleted successfully`,
      error: (error) => {
        return error instanceof Error
          ? error.message
          : "Failed to delete top scorer";
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
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-destructive">
            <Trophy className="h-5 w-5" />
            <span>
              Error loading top scorers:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </span>
          </div>
        </CardContent>
      </Card>
    );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Scorers
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {topScorers?.length || 0}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Goals
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {topScorers?.reduce((sum, scorer) => sum + scorer.goals, 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-full">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Top Scorer
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {topScorers?.length > 0
                    ? Math.max(...topScorers.map((s) => s.goals))
                    : 0}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <CardHeader className="bg-background/50 border-b border-border/50 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                Top Scorers ({topScorers?.length || 0})
              </CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 bg-background border-input focus:border-primary w-64 rounded-lg transition-all"
                />
              </div>
              <Select value={filterLeague} onValueChange={setFilterLeague}>
                <SelectTrigger className="h-9 w-40">
                  <SelectValue placeholder="Filter by league" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leagues</SelectItem>
                  {leagues?.map((league) => (
                    <SelectItem key={league.slug} value={league.slug}>
                      {league.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Link href="/cms/top-scorers/create">
                <Button size="sm" className="h-9 gap-2 rounded-lg shadow-sm">
                  <Plus className="h-4 w-4" />
                  Add Scorer
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
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
                  Player
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Team
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  League
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Goals
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Assists
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Created Date
                </TableHead>
                <TableHead className="text-right font-medium text-muted-foreground text-xs uppercase tracking-wider pr-6">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTopScorers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <Trophy className="h-12 w-12 text-muted-foreground/20" />
                      <p className="text-muted-foreground">
                        No top scorers found.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTopScorers.map((scorer, index) => {
                  const player = players?.find(
                    (p) => p.slug === scorer.player_slug
                  );
                  const team = teams?.find((t) => t.slug === scorer.team_slug);
                  const league = leagues?.find(
                    (l) => l.slug === scorer.league_slug
                  );

                  return (
                    <TableRow
                      key={scorer.id}
                      className="hover:bg-muted/30 transition-colors border-b border-border/40"
                    >
                      <TableCell className="pl-6">
                        <input
                          type="checkbox"
                          className="rounded border-muted-foreground/30 text-primary focus:ring-primary"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                            <span className="font-bold text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground text-sm">
                              {player?.name_en || "Unknown Player"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {player?.name_am || player?.slug}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {team?.logo_url ? (
                            <img
                              src={team.logo_url}
                              alt={team.name_en}
                              className="h-9 w-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-sm">
                              {team?.name_en?.charAt(0) || "T"}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm text-foreground">
                              {team?.name_en || "Unknown Team"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-foreground">
                          {league?.name_en || "Unknown League"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-bold text-lg text-primary">
                        {scorer.goals}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm text-muted-foreground">
                          {scorer.assists || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(scorer.created_at), "MMM dd, yyyy")}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/cms/top-scorers/${scorer.id}/edit`}>
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
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Top Scorer
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this top
                                  scorer record? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDelete(
                                      scorer.id,
                                      player?.name_en || "Unknown Player"
                                    )
                                  }
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Info */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-background/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
            <span>scorers per page</span>
          </div>

          <div className="flex items-center gap-2">
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
                className="h-8 w-8 rounded-lg p-0"
              >
                2
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-lg p-0"
              >
                3
              </Button>
              <span className="text-muted-foreground px-1">...</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-lg p-0"
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
