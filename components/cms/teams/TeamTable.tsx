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
import { useTeams, useDeleteTeam } from "@/lib/hooks/useTeams";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Shield,
  Calendar,
  ChevronDown,
  MapPin,
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

export default function TeamTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLeague, setFilterLeague] = useState("all");
  const { data: teams, isLoading, error } = useTeams();
  const deleteTeamMutation = useDeleteTeam();

  const filteredTeams =
    teams?.filter((team) => {
      const matchesSearch =
        team.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (team.name_am?.toLowerCase() ?? "").includes(
          searchTerm.toLowerCase()
        ) ||
        team.slug.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLeague =
        filterLeague === "all" || team.league_slug === filterLeague;

      return matchesSearch && matchesLeague;
    }) || [];

  const handleDelete = async (id: string, name: string) => {
    const promise = deleteTeamMutation.mutateAsync(id);

    toast.promise(promise, {
      loading: `Deleting "${name}"...`,
      success: `Team "${name}" deleted successfully`,
      error: (error) => {
        return error instanceof Error ? error.message : "Failed to delete team";
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
            <Shield className="h-5 w-5" />
            <span>
              Error loading teams:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </span>
          </div>
        </CardContent>
      </Card>
    );

  const leagues = [
    { value: "all", label: "All Leagues" },
    { value: "premier", label: "Premier League" },
    { value: "womens", label: "Women's League" },
    { value: "walias", label: "Walias" },
    { value: "u20", label: "U-20" },
    { value: "cup", label: "Ethiopian Cup" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Teams
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {teams?.length || 0}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active This Month
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {teams?.filter((t) => {
                    const createdAt = new Date(t.created_at);
                    const now = new Date();
                    return (
                      createdAt.getMonth() === now.getMonth() &&
                      createdAt.getFullYear() === now.getFullYear()
                    );
                  }).length || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-full">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  With Stadiums
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {teams?.filter((t) => t.stadium_en).length || 0}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full">
                <MapPin className="h-6 w-6 text-green-500" />
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
                Teams ({teams?.length || 0})
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
                  {leagues.map((league) => (
                    <SelectItem key={league.value} value={league.value}>
                      {league.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Link href="/cms/teams/create">
                <Button size="sm" className="h-9 gap-2 rounded-lg shadow-sm">
                  <Plus className="h-4 w-4" />
                  Add Team
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
                  Team
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  League
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Founded
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Stadium
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
              {filteredTeams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <Shield className="h-12 w-12 text-muted-foreground/20" />
                      <p className="text-muted-foreground">No teams found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeams.map((team) => (
                  <TableRow
                    key={team.id}
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
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          {team.logo_url ? (
                            <img
                              src={team.logo_url}
                              alt={team.name_en}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-primary font-bold text-xs">
                              {team.name_en.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground text-sm">
                            {team.name_en}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {team.name_am || team.slug}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted/20">
                        {team.league_slug || "Unassigned"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground">
                        {team.founded || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground">
                        {team.stadium_en || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(team.created_at), "MMM dd, yyyy")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/cms/teams/${team.id}/edit`}>
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
                              <AlertDialogTitle>Delete Team</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;
                                {team.name_en}&quot;? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete(team.id, team.name_en)
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
                ))
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
            <span>teams per page</span>
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
