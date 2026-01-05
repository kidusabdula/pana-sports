// components/cms/seasons/SeasonPlayerManager.tsx
"use client";

import { useState } from "react";
import {
  useSeasonPlayers,
  useAddSeasonPlayer,
  useRemoveSeasonPlayer,
  useSeasonTeams,
} from "@/lib/hooks/cms/useSeasons";
import { usePlayers } from "@/lib/hooks/cms/usePlayers";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2, Loader2, Star, UserPlus } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SeasonPlayerManagerProps {
  seasonId: string;
}

export function SeasonPlayerManager({ seasonId }: SeasonPlayerManagerProps) {
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [jerseyNumber, setJerseyNumber] = useState<string>("");
  const [isCaptain, setIsCaptain] = useState<boolean>(false);

  const { data: seasonTeams } = useSeasonTeams(seasonId);
  const { data: seasonPlayers, isLoading: isPlayersLoading } = useSeasonPlayers(
    seasonId,
    selectedTeam
  );
  const { data: allPlayers } = usePlayers();

  const addPlayerMutation = useAddSeasonPlayer();
  const removePlayerMutation = useRemoveSeasonPlayer();

  const handleRegisterPlayer = () => {
    if (!selectedTeam || !selectedPlayer) return;

    addPlayerMutation.mutate(
      {
        seasonId,
        data: {
          player_id: selectedPlayer,
          team_id: selectedTeam,
          jersey_number: jerseyNumber ? parseInt(jerseyNumber) : undefined,
          is_captain: isCaptain,
          joined_date: new Date().toISOString().split("T")[0],
        },
      },
      {
        onSuccess: () => {
          setSelectedPlayer("");
          setJerseyNumber("");
          setIsCaptain(false);
        },
      }
    );
  };

  const handleUnregisterPlayer = (playerId: string, teamId: string) => {
    if (window.confirm("Are you sure you want to unregister this player?")) {
      removePlayerMutation.mutate({ seasonId, playerId, teamId });
    }
  };

  const isAdding = addPlayerMutation.isPending;

  // Filter out players already registered to this team in this season
  const availablePlayers = allPlayers?.filter(
    (player) => !seasonPlayers?.some((sp) => sp.player_id === player.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/3">
          <Label>Filter by Team</Label>
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger>
              <SelectValue placeholder="Select team to manage players" />
            </SelectTrigger>
            <SelectContent>
              {seasonTeams?.map((st) => (
                <SelectItem key={st.team.id} value={st.team.id}>
                  {st.team.name_en}
                </SelectItem>
              ))}
              {(!seasonTeams || seasonTeams.length === 0) && (
                <SelectItem value="none" disabled>
                  No teams in season
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {selectedTeam && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Badge variant="outline" className="text-blue-500">
              {seasonPlayers?.length || 0} Players Registered
            </Badge>
          </div>
        )}
      </div>

      {selectedTeam ? (
        <>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-500" />
                Register Player to Team
              </CardTitle>
              <CardDescription>
                Add a player to this team's roster for the current season.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2 space-y-2">
                  <Label>Player</Label>
                  <Select
                    value={selectedPlayer}
                    onValueChange={setSelectedPlayer}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Search or select player" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePlayers?.map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name_en} ({player.position_en})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Jersey #</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 10"
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="cursor-pointer" htmlFor="captain-mode">
                      Captain?
                    </Label>
                    <Switch
                      id="captain-mode"
                      checked={isCaptain}
                      onCheckedChange={setIsCaptain}
                    />
                  </div>
                  <Button
                    onClick={handleRegisterPlayer}
                    disabled={!selectedPlayer || isAdding}
                    className="w-full"
                  >
                    {isAdding ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Register
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPlayersLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex items-center justify-center text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Fetching roster...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : seasonPlayers?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <UserPlus className="h-8 w-8 opacity-20" />
                        <p>No players registered for this team yet.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  seasonPlayers?.map((sp) => (
                    <TableRow key={sp.id}>
                      <TableCell className="font-bold">
                        {sp.jersey_number || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {sp.player?.photo_url ? (
                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                              <Image
                                src={sp.player.photo_url}
                                alt={sp.player.name_en}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-xs font-bold text-muted-foreground">
                                {sp.player?.name_en?.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium">
                              {sp.player?.name_en}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {sp.player?.name_am}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="font-normal capitalize"
                        >
                          {sp.player?.position_en?.toLowerCase() || "Player"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {sp.is_captain && (
                          <Badge className="bg-amber-500 text-white flex w-fit items-center gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            Captain
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() =>
                            handleUnregisterPlayer(sp.player_id, sp.team_id)
                          }
                          disabled={removePlayerMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <Card className="border-dashed">
          <CardContent className="h-64 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 rounded-full bg-muted">
              <UserPlus className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <div className="max-w-[300px]">
              <h3 className="font-semibold text-lg">No Team Selected</h3>
              <p className="text-sm text-muted-foreground">
                Please select a team from the dropdown above to view and manage
                its player roster for this season.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
