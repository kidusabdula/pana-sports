"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Trophy,
  Play,
  Clock,
  CheckCircle,
  XCircle,
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
        <CardContent className="p-4 sm:p-6">
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
  const uniqueLeaguesMap = new Map<string, string>();

  matches?.forEach((match) => {
    const id = match.league?.id || "no-league";
    const name = match.league?.name_en || "No League";
    if (!uniqueLeaguesMap.has(id)) {
      uniqueLeaguesMap.set(id, name);
    }
  });

  const leagues = [
    { value: "all", label: "All Leagues" },
    ...Array.from(uniqueLeaguesMap.entries()).map(([value, label]) => ({
      value,
      label,
    })),
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
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Total Matches
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  {matches?.length || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/5 to-red-500/10 border-red-500/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Live Now
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  {matches?.filter((m) => m.status === "live").length || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-red-500/10 rounded-full">
                <Play className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Completed
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  {matches?.filter((m) => m.status === "completed").length || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-500/10 rounded-full">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Featured
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  {matches?.filter((m) => m.is_featured).length || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-500/10 rounded-full">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
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
              <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
                Matches ({matches?.length || 0})
              </CardTitle>
              <Link href="/cms/matches/create" className="sm:hidden">
                <Button size="sm" className="h-9 gap-2 rounded-lg shadow-sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search matches..."
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
                    {leagues.map((league) => (
                      <SelectItem key={league.value} value={league.value}>
                        {league.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-9 w-full sm:w-40">
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
                            <Image
                              src={match.home_team.logo_url}
                              alt={match.home_team.name_en}
                              width={24}
                              height={24}
                              className="h-6 w-6 object-contain"
                            />
                          )}
                          <span className="font-medium text-sm text-foreground truncate max-w-[100px]">
                            {match.home_team?.name_en}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-sm">
                          vs
                        </span>
                        <div className="flex items-center gap-2">
                          {match.away_team?.logo_url && (
                            <Image
                              src={match.away_team.logo_url}
                              alt={match.away_team.name_en}
                              width={24}
                              height={24}
                              className="h-6 w-6 object-contain"
                            />
                          )}
                          <span className="font-medium text-sm text-foreground truncate max-w-[100px]">
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
                            {match.minute}&apos;
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-[120px]">
                          {match.venue?.name_en || "TBD"}
                        </span>
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
                          <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Match</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;
                                {match.home_team?.name_en} vs{" "}
                                {match.away_team?.name_en}&quot;? This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="m-0">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete(
                                    match.id,
                                    match.home_team?.name_en || "",
                                    match.away_team?.name_en || ""
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
          {filteredMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Calendar className="h-12 w-12 text-muted-foreground/20 mb-3" />
              <p className="text-muted-foreground">No matches found.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredMatches.map((match) => (
                <div
                  key={match.id}
                  className="p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-foreground text-sm truncate">
                            {match.home_team?.name_en} vs {match.away_team?.name_en}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusBadge status={match.status} />
                            <Badge variant="outline" className="bg-muted/20">
                              {match.league?.name_en || "No League"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
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
                            <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Match
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {match.home_team?.name_en} vs{" "}
                                  {match.away_team?.name_en}"? This action
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
                                      match.id,
                                      match.home_team?.name_en || "",
                                      match.away_team?.name_en || ""
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
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground whitespace-nowrap">
                            {format(new Date(match.date), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground whitespace-nowrap">
                            {format(new Date(match.date), "HH:mm")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground truncate">
                            {match.venue?.name_en || "TBD"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Trophy className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="font-medium text-foreground">
                            {match.score_home} - {match.score_away}
                          </span>
                          {match.status === "live" && (
                            <Badge variant="outline" className="text-xs">
                              {match.minute}&apos;
                            </Badge>
                          )}
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
            <span className="hidden sm:inline">matches per page</span>
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