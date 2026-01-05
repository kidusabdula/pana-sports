// components/cms/seasons/SeasonTeamManager.tsx
"use client";

import { useState } from "react";
import {
  useSeasonTeams,
  useAddSeasonTeam,
  useRemoveSeasonTeam,
} from "@/lib/hooks/cms/useSeasons";
import { useTeams } from "@/lib/hooks/cms/useTeams";
import { useLeagues } from "@/lib/hooks/cms/useLeagues";
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
import { Plus, Trash2, Loader2, Info } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SeasonTeamManagerProps {
  seasonId: string;
}

export function SeasonTeamManager({ seasonId }: SeasonTeamManagerProps) {
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedLeague, setSelectedLeague] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const { data: seasonTeams, isLoading: isTeamsLoading } =
    useSeasonTeams(seasonId);
  const { data: allTeams } = useTeams();
  const { data: allLeagues } = useLeagues();

  const addTeamMutation = useAddSeasonTeam();
  const removeTeamMutation = useRemoveSeasonTeam();

  const handleAddTeam = () => {
    if (!selectedTeam || !selectedLeague) return;

    addTeamMutation.mutate(
      {
        seasonId,
        data: {
          team_id: selectedTeam,
          league_id: selectedLeague,
          notes_en: notes,
        },
      },
      {
        onSuccess: () => {
          setSelectedTeam("");
          setSelectedLeague("");
          setNotes("");
        },
      }
    );
  };

  const handleRemoveTeam = (teamId: string, leagueId: string) => {
    if (
      window.confirm(
        "Are you sure you want to remove this team from the season?"
      )
    ) {
      removeTeamMutation.mutate({ seasonId, teamId, leagueId });
    }
  };

  const isAdding = addTeamMutation.isPending;

  // Filter out teams already in the season to avoid duplicates in the dropdown
  // though the API handles it, it's better UX
  const availableTeams = allTeams?.filter(
    (team) =>
      !seasonTeams?.some(
        (st) => st.team_id === team.id && st.league_id === selectedLeague
      )
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Team to Season</CardTitle>
          <CardDescription>
            Register a team to participate in a specific league for this season.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>League</Label>
              <Select value={selectedLeague} onValueChange={setSelectedLeague}>
                <SelectTrigger>
                  <SelectValue placeholder="Select league" />
                </SelectTrigger>
                <SelectContent>
                  {allLeagues?.map((league) => (
                    <SelectItem key={league.id} value={league.id}>
                      {league.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Team</Label>
              <Select
                value={selectedTeam}
                onValueChange={setSelectedTeam}
                disabled={!selectedLeague}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      selectedLeague ? "Select team" : "Select league first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableTeams?.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleAddTeam}
              disabled={!selectedTeam || !selectedLeague || isAdding}
              className="w-full"
            >
              {isAdding ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add Team
            </Button>
          </div>

          <div className="mt-4 space-y-2">
            <Label>Notes (Optional)</Label>
            <Input
              placeholder="e.g. Promoted from Higher League"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team</TableHead>
              <TableHead>League</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isTeamsLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading teams...
                  </div>
                </TableCell>
              </TableRow>
            ) : seasonTeams?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No teams registered for this season.
                </TableCell>
              </TableRow>
            ) : (
              seasonTeams?.map((st) => (
                <TableRow key={st.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {st.team?.logo_url ? (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                          <Image
                            src={st.team.logo_url}
                            alt={st.team.name_en}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs font-bold text-muted-foreground">
                            {st.team?.name_en?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{st.team?.name_en}</div>
                        <div className="text-xs text-muted-foreground">
                          {st.team?.name_am}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{st.league?.name_en}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {st.is_promoted && (
                        <Badge className="bg-green-500 text-white">
                          Promoted
                        </Badge>
                      )}
                      {st.is_relegated && (
                        <Badge variant="destructive">Relegated</Badge>
                      )}
                      {!st.is_promoted && !st.is_relegated && (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {st.notes_en || (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveTeam(st.team_id, st.league_id)}
                      disabled={removeTeamMutation.isPending}
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

      {!isTeamsLoading && seasonTeams && seasonTeams.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
          <Info className="h-4 w-4 text-blue-500" />
          <span>Total teams: {seasonTeams.length}</span>
        </div>
      )}
    </div>
  );
}
