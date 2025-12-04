"use client";

import { useState } from "react";
import Link from "next/link";
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
import { usePlayers, useDeletePlayer } from "@/lib/hooks/cms/usePlayers";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  User,
  Calendar,
  ChevronDown,
  Shield,
  Hash,
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

export default function PlayerTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterPosition, setFilterPosition] = useState("all");
  const { data: players, isLoading, error } = usePlayers();
  const deletePlayerMutation = useDeletePlayer();

  const filteredPlayers =
    players?.filter((player) => {
      const matchesSearch =
        player.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (player.name_am?.toLowerCase() ?? "").includes(
          searchTerm.toLowerCase()
        ) ||
        player.slug.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTeam =
        filterTeam === "all" || player.teams?.id === filterTeam;

      const matchesPosition =
        filterPosition === "all" || player.position_en === filterPosition;

      return matchesSearch && matchesTeam && matchesPosition;
    }) || [];

  const handleDelete = async (id: string, name: string) => {
    const promise = deletePlayerMutation.mutateAsync(id);

    toast.promise(promise, {
      loading: `Deleting "${name}"...`,
      success: `Player "${name}" deleted successfully`,
      error: (error) => {
        return error instanceof Error
          ? error.message
          : "Failed to delete player";
      },
    });

    try {
      await promise;
    } catch (error) {
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
            <User className="h-5 w-5" />
            <span>
              Error loading players:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </span>
          </div>
        </CardContent>
      </Card>
    );

  const teams = [
    { value: "all", label: "All Teams" },
    ...(players?.map((player) => ({
      value: player.teams?.id || "",
      label: player.teams?.name_en || "No Team",
    })) || []),
  ];

  const positions = [
    { value: "all", label: "All Positions" },
    { value: "Goalkeeper", label: "Goalkeeper" },
    { value: "Defender", label: "Defender" },
    { value: "Midfielder", label: "Midfielder" },
    { value: "Forward", label: "Forward" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Total Players
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  {players?.length || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Active This Month
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  {players?.filter((p) => {
                    const createdAt = new Date(p.created_at);
                    const now = new Date();
                    return (
                      createdAt.getMonth() === now.getMonth() &&
                      createdAt.getFullYear() === now.getFullYear()
                    );
                  }).length || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-500/10 rounded-full">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  With Photos
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  {players?.filter((p) => p.photo_url).length || 0}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-500/10 rounded-full">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
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
                Players ({players?.length || 0})
              </CardTitle>
              <Link href="/cms/players/create" className="sm:hidden">
                <Button size="sm" className="h-9 gap-2 rounded-lg shadow-sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 bg-background border-input focus:border-primary w-full rounded-lg transition-all"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Select value={filterTeam} onValueChange={setFilterTeam}>
                  <SelectTrigger className="h-9 w-full sm:w-40">
                    <SelectValue placeholder="Filter by team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.value} value={team.value}>
                        {team.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filterPosition}
                  onValueChange={setFilterPosition}
                >
                  <SelectTrigger className="h-9 w-full sm:w-40">
                    <SelectValue placeholder="Filter by position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position.value} value={position.value}>
                        {position.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Link
                  href="/cms/players/create"
                  className="hidden sm:block ml-auto"
                >
                  <Button size="sm" className="h-9 gap-2 rounded-lg shadow-sm">
                    <Plus className="h-4 w-4" />
                    Add Player
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
                  Player
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Team
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Position
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Jersey
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Nationality
                </TableHead>
                <TableHead className="text-right font-medium text-muted-foreground text-xs uppercase tracking-wider pr-6">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <User className="h-12 w-12 text-muted-foreground/20" />
                      <p className="text-muted-foreground">No players found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlayers.map((player) => (
                  <TableRow
                    key={player.id}
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
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          {player.photo_url ? (
                            <img
                              src={player.photo_url}
                              alt={player.name_en}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-primary font-bold text-xs">
                              {player.name_en.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-foreground text-sm truncate max-w-[200px]">
                            {player.name_en}
                          </span>
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {player.teams?.name_en || "No Team"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {player.teams?.logo_url && (
                          <img
                            src={player.teams.logo_url}
                            alt={player.teams.name_en}
                            className="h-5 w-5 object-contain shrink-0"
                          />
                        )}
                        <span className="text-sm text-foreground truncate max-w-[150px]">
                          {player.teams?.name_en || "No Team"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted/20">
                        {player.position_en || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground">
                        {player.jersey_number || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground truncate max-w-[120px] block">
                        {player.nationality || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/cms/players/${player.id}/edit`}>
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
                              <AlertDialogTitle>Delete Player</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;
                                {player.name_en}&quot;? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete(player.id, player.name_en)
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

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden">
          {filteredPlayers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <User className="h-12 w-12 text-muted-foreground/20 mb-3" />
              <p className="text-muted-foreground">No players found.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredPlayers.map((player) => (
                <div
                  key={player.id}
                  className="p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {player.photo_url ? (
                        <img
                          src={player.photo_url}
                          alt={player.name_en}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-primary font-bold">
                          {player.name_en.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-foreground text-sm truncate">
                            {player.name_en}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {player.teams?.name_en || "No Team"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Link href={`/cms/players/${player.id}/edit`}>
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
                                  Delete Player
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &quot;
                                  {player.name_en}&quot;? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                <AlertDialogCancel className="m-0">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDelete(player.id, player.name_en)
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
                          <Shield className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">
                            {player.position_en || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Hash className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">
                            {player.jersey_number || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-muted-foreground truncate">
                            {player.nationality || "N/A"}
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
            <span className="hidden sm:inline">players per page</span>
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
