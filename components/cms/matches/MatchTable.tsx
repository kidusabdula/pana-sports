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
import { useMatches, useDeleteMatch } from "@/lib/hooks/cms/useMatches";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Calendar,
  ChevronDown,
  MapPin,
  Users,
  Trophy,
  Play,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Settings,
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

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    scheduled: {
      label: "Scheduled",
      icon: Calendar,
      variant: "secondary" as const,
    },
    live: { label: "Live", icon: Play, variant: "destructive" as const },
    completed: {
      label: "Completed",
      icon: CheckCircle,
      variant: "default" as const,
    },
    postponed: { label: "Postponed", icon: Clock, variant: "outline" as const },
    cancelled: {
      label: "Cancelled",
      icon: XCircle,
      variant: "destructive" as const,
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

export default function MatchTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLeague, setFilterLeague] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { data: matches, isLoading, error } = useMatches();
  const deleteMatchMutation = useDeleteMatch();

  const filteredMatches =
    matches?.filter((match) => {
      const matchesSearch =
        match.home_team?.name_en
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        match.away_team?.name_en
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        match.league?.name_en.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLeague =
        filterLeague === "all" || match.league?.id === filterLeague;

      const matchesStatus =
        filterStatus === "all" || match.status === filterStatus;

      return matchesSearch && matchesLeague && matchesStatus;
    }) || [];

  const handleDelete = async (
    id: string,
    homeTeam: string,
    awayTeam: string
  ) => {
    const promise = deleteMatchMutation.mutateAsync(id);

    toast.promise(promise, {
      loading: `Deleting match "${homeTeam} vs ${awayTeam}"...`,
      success: `Match deleted successfully`,
      error: (error) => {
        return error instanceof Error
          ? error.message
          : "Failed to delete match";
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
            <Calendar className="h-5 w-5" />
            <span>
              Error loading matches:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </span>
          </div>
        </CardContent>
      </Card>
    );

  // Extract unique leagues for filter
  const leagues = [
    { value: "all", label: "All Leagues" },
    ...(matches?.map((match) => ({
      value: match.league?.id || "",
      label: match.league?.name_en || "No League",
    })) || []),
  ];

  const statuses = [
    { value: "all", label: "All Statuses" },
    { value: "scheduled", label: "Scheduled" },
    { value: "live", label: "Live" },
    { value: "completed", label: "Completed" },
    { value: "postponed", label: "Postponed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Matches
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {matches?.length || 0}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-gradient-to-br from-red-500/5 to-red-500/10 border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Live Now
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {matches?.filter((m) => m.status === "live").length || 0}
                </p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-full">
                <Play className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completed
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {matches?.filter((m) => m.status === "completed").length || 0}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Featured
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {matches?.filter((m) => m.is_featured).length || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-full">
                <Trophy className="h-6 w-6 text-blue-500" />
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
                Matches ({matches?.length || 0})
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
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-9 w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Link href="/cms/matches/create">
                <Button size="sm" className="h-9 gap-2 rounded-lg shadow-sm">
                  <Plus className="h-4 w-4" />
                  Add Match
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
                  Match
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  League
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Date & Time
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Score
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Venue
                </TableHead>
                <TableHead className="text-right font-medium text-muted-foreground text-xs uppercase tracking-wider pr-6">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMatches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <Calendar className="h-12 w-12 text-muted-foreground/20" />
                      <p className="text-muted-foreground">No matches found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMatches.map((match) => (
                  <TableRow
                    key={match.id}
                    className="hover:bg-muted/30 transition-colors border-b border-border/40"
                  >
                    <TableCell className="pl-6">
                      <input
                        type="checkbox"
                        className="rounded border-muted-foreground/30 text-primary focus:ring-primary"
                      />
                    </TableCell>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {match.home_team?.logo_url && (
                            <img
                              src={match.home_team.logo_url}
                              alt={match.home_team.name_en}
                              className="h-6 w-6 object-contain"
                            />
                          )}
                          <span className="font-medium text-sm text-foreground">
                            {match.home_team?.name_en}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-sm">
                          vs
                        </span>
                        <div className="flex items-center gap-2">
                          {match.away_team?.logo_url && (
                            <img
                              src={match.away_team.logo_url}
                              alt={match.away_team.name_en}
                              className="h-6 w-6 object-contain"
                            />
                          )}
                          <span className="font-medium text-sm text-foreground">
                            {match.away_team?.name_en}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted/20">
                        {match.league?.name_en || "No League"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="text-sm text-foreground block">
                          {format(new Date(match.date), "MMM dd, yyyy")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(match.date), "HH:mm")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={match.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">
                          {match.score_home}
                        </span>
                        <span className="text-muted-foreground">-</span>
                        <span className="font-bold text-sm text-foreground">
                          {match.score_away}
                        </span>
                        {match.status === "live" && (
                          <Badge variant="outline" className="text-xs">
                            {match.minute}'
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {match.venue?.name_en || "TBD"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/cms/matches/${match.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/cms/matches/${match.id}/control`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                            title="Control Match"
                          >
                            <Settings className="h-4 w-4" />
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
                              <AlertDialogTitle>Delete Match</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;
                                {match.home_team?.name_en} vs{" "}
                                {match.away_team?.name_en}&quot;? This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete(
                                    match.id,
                                    match.home_team?.name_en || "",
                                    match.away_team?.name_en || ""
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
            <span>matches per page</span>
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
