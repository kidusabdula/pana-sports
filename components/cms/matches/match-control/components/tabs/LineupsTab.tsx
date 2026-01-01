// components/cms/matches/match-control/components/tabs/LineupsTab.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Save } from "lucide-react";
import { FORMATIONS } from "../../constants";
import type { Player } from "../../types";
import { Match } from "@/lib/schemas/match";
import { MatchLineup } from "@/lib/schemas/matchLineup";

interface LineupsTabProps {
  match: Match;
  homeLineup: MatchLineup[];
  awayLineup: MatchLineup[];
  homeFormation: string;
  awayFormation: string;
  homeTeamPlayers: Player[];
  awayTeamPlayers: Player[];
  onHomeLineupChange: React.Dispatch<React.SetStateAction<MatchLineup[]>>;
  onAwayLineupChange: React.Dispatch<React.SetStateAction<MatchLineup[]>>;
  onHomeFormationChange: (formation: string) => void;
  onAwayFormationChange: (formation: string) => void;
  onSaveLineups: () => void;
  onClearLineups: () => void;
  lineupDialogOpen: boolean;
  onLineupDialogChange: (open: boolean) => void;
}

export function LineupsTab({
  match,
  homeLineup,
  awayLineup,
  homeFormation,
  awayFormation,
  homeTeamPlayers,
  awayTeamPlayers,
  onHomeLineupChange,
  onAwayLineupChange,
  onHomeFormationChange,
  onAwayFormationChange,
  onSaveLineups,
  onClearLineups,
  lineupDialogOpen,
  onLineupDialogChange,
}: LineupsTabProps) {
  const handlePlayerToggle = (
    player: Player,
    teamId: string,
    isHome: boolean
  ) => {
    const lineup = isHome ? homeLineup : awayLineup;
    const setLineup = isHome ? onHomeLineupChange : onAwayLineupChange;

    const isSelected = lineup.some((l) => l.player_id === player.id);

    if (isSelected) {
      setLineup((prev) => prev.filter((l) => l.player_id !== player.id));
    } else {
      setLineup((prev) => [
        ...prev,
        {
          match_id: match.id,
          team_id: teamId,
          player_id: player.id,
          is_starting: true,
          position: player.position_en,
          jersey_number: player.jersey_number,
        } as MatchLineup,
      ]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Match Lineups</h3>
        <Dialog open={lineupDialogOpen} onOpenChange={onLineupDialogChange}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Users className="h-4 w-4" />
              Manage Lineups
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] sm:max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manage Match Lineups</DialogTitle>
              <DialogDescription>
                Set starting lineups and substitutes for both teams. Select
                players and choose formations.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              {/* Home Team Lineup */}
              <TeamLineupEditor
                teamName={match.home_team?.name_en || "Home Team"}
                players={homeTeamPlayers}
                lineup={homeLineup}
                formation={homeFormation}
                matchId={match.id}
                teamId={match.home_team_id}
                onFormationChange={onHomeFormationChange}
                onPlayerToggle={(player) =>
                  handlePlayerToggle(player, match.home_team_id, true)
                }
              />

              {/* Away Team Lineup */}
              <TeamLineupEditor
                teamName={match.away_team?.name_en || "Away Team"}
                players={awayTeamPlayers}
                lineup={awayLineup}
                formation={awayFormation}
                matchId={match.id}
                teamId={match.away_team_id}
                onFormationChange={onAwayFormationChange}
                onPlayerToggle={(player) =>
                  handlePlayerToggle(player, match.away_team_id, false)
                }
              />
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={onClearLineups}>
                Clear All
              </Button>
              <Button onClick={onSaveLineups} className="gap-2">
                <Save className="h-4 w-4" />
                Save Lineups
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Display Current Lineups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TeamLineupDisplay
          teamName={match.home_team?.name_en || "Home Team"}
          lineup={homeLineup.filter((l) => l.is_starting)}
          formation={homeFormation}
        />
        <TeamLineupDisplay
          teamName={match.away_team?.name_en || "Away Team"}
          lineup={awayLineup.filter((l) => l.is_starting)}
          formation={awayFormation}
        />
      </div>
    </div>
  );
}

// Team Lineup Editor Component
interface TeamLineupEditorProps {
  teamName: string;
  players: Player[];
  lineup: MatchLineup[];
  formation: string;
  matchId: string;
  teamId: string;
  onFormationChange: (formation: string) => void;
  onPlayerToggle: (player: Player) => void;
}

function TeamLineupEditor({
  teamName,
  players,
  lineup,
  formation,
  onFormationChange,
  onPlayerToggle,
}: TeamLineupEditorProps) {
  const selectedCount = lineup.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">{teamName}</h4>
          <p className="text-sm text-muted-foreground">
            {selectedCount}/11 selected
          </p>
        </div>
        <Select value={formation} onValueChange={onFormationChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Formation" />
          </SelectTrigger>
          <SelectContent>
            {FORMATIONS.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
        {players.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No players available for this team
          </p>
        ) : (
          players.map((player) => {
            const isSelected = lineup.some((l) => l.player_id === player.id);
            return (
              <div
                key={player.id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted/50 transition-colors ${
                  isSelected ? "bg-primary/10 border border-primary/30" : ""
                }`}
                onClick={() => onPlayerToggle(player)}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  className="cursor-pointer"
                />
                <span className="font-mono text-sm w-8 text-center">
                  {player.jersey_number || "-"}
                </span>
                <span className="truncate flex-1">{player.name_en}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {player.position_en || "N/A"}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Team Lineup Display Component
interface TeamLineupDisplayProps {
  teamName: string;
  lineup: MatchLineup[];
  formation: string;
}

function TeamLineupDisplay({
  teamName,
  lineup,
  formation,
}: TeamLineupDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{teamName}</h4>
        <Badge variant="outline">{formation}</Badge>
      </div>
      <div className="space-y-2">
        {lineup.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg">
            No lineup set
          </p>
        ) : (
          lineup.map((lineupItem) => (
            <div
              key={lineupItem.id || lineupItem.player_id}
              className="flex items-center gap-2 p-2 rounded-lg border"
            >
              <span className="font-medium font-mono w-8 text-center">
                {lineupItem.jersey_number || "-"}
              </span>
              <span className="truncate flex-1">
                {lineupItem.player?.name_en || "Unknown Player"}
              </span>
              <Badge variant="outline" className="shrink-0">
                {lineupItem.position || "N/A"}
              </Badge>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
