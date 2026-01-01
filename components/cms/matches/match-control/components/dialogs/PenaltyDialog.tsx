// components/cms/matches/match-control/components/dialogs/PenaltyDialog.tsx
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
import { Flag } from "lucide-react";
import { Match } from "@/lib/schemas/match";

interface PenaltyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match: Match;
  penaltyTeam: string;
  penaltyResult: string;
  onTeamChange: (teamId: string) => void;
  onResultChange: (result: string) => void;
  onSubmit: () => void;
}

export function PenaltyDialog({
  open,
  onOpenChange,
  match,
  penaltyTeam,
  penaltyResult,
  onTeamChange,
  onResultChange,
  onSubmit,
}: PenaltyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Penalty Shootout</DialogTitle>
          <DialogDescription>
            Record a penalty shootout attempt result.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="penaltyTeam">Team</Label>
            <Select value={penaltyTeam} onValueChange={onTeamChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={match.home_team_id}>
                  {match.home_team?.name_en}
                </SelectItem>
                <SelectItem value={match.away_team_id}>
                  {match.away_team?.name_en}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="penaltyResult">Result</Label>
            <Select value={penaltyResult} onValueChange={onResultChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scored">Scored ✓</SelectItem>
                <SelectItem value="missed">Missed ✗</SelectItem>
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
            disabled={!penaltyTeam || !penaltyResult}
          >
            <Flag className="h-4 w-4" />
            Record Penalty
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
