// components/cms/matches/match-control/components/dialogs/SubstitutionDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import type { Player } from "../../types";
import { Match } from "@/lib/schemas/match";

interface SubstitutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match: Match;
  selectedTeam: string;
  homeTeamPlayers: Player[];
  awayTeamPlayers: Player[];
  selectedSubInPlayer: string;
  selectedSubOutPlayer: string;
  onSubInChange: (playerId: string) => void;
  onSubOutChange: (playerId: string) => void;
  onSubmit: () => void;
}

export function SubstitutionDialog({
  open,
  onOpenChange,
  match,
  selectedTeam,
  homeTeamPlayers,
  awayTeamPlayers,
  selectedSubInPlayer,
  selectedSubOutPlayer,
  onSubInChange,
  onSubOutChange,
  onSubmit,
}: SubstitutionDialogProps) {
  const activePlayers =
    selectedTeam === match.home_team_id ? homeTeamPlayers : awayTeamPlayers;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Substitution</DialogTitle>
          <DialogDescription>
            Select players to substitute. Make sure you've selected the team
            first.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <Label htmlFor="subOut">Player Out</Label>
            <Select value={selectedSubOutPlayer} onValueChange={onSubOutChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select player out" />
              </SelectTrigger>
              <SelectContent>
                {activePlayers.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.jersey_number ? `${player.jersey_number} - ` : ""}
                    {player.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="subIn">Player In</Label>
            <Select value={selectedSubInPlayer} onValueChange={onSubInChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select player in" />
              </SelectTrigger>
              <SelectContent>
                {activePlayers.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.jersey_number ? `${player.jersey_number} - ` : ""}
                    {player.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            className="gap-2"
            disabled={
              !selectedSubInPlayer || !selectedSubOutPlayer || !selectedTeam
            }
          >
            <UserPlus className="h-4 w-4" />
            Make Substitution
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
