// components/cms/matches/match-control/components/shared/TeamPlayerSelector.tsx
"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Player } from "../../types";
import { Match } from "@/lib/schemas/match";

interface TeamPlayerSelectorProps {
  match: Match;
  selectedTeam: string;
  selectedPlayer: string;
  eventDescription: string;
  homeTeamPlayers: Player[];
  awayTeamPlayers: Player[];
  onTeamChange: (teamId: string) => void;
  onPlayerChange: (playerId: string) => void;
  onDescriptionChange: (description: string) => void;
  showDescription?: boolean;
}

export function TeamPlayerSelector({
  match,
  selectedTeam,
  selectedPlayer,
  eventDescription,
  homeTeamPlayers,
  awayTeamPlayers,
  onTeamChange,
  onPlayerChange,
  onDescriptionChange,
  showDescription = true,
}: TeamPlayerSelectorProps) {
  const activePlayers =
    selectedTeam === match.home_team_id
      ? homeTeamPlayers
      : selectedTeam === match.away_team_id
      ? awayTeamPlayers
      : [...homeTeamPlayers, ...awayTeamPlayers];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="team">Team</Label>
        <Select value={selectedTeam} onValueChange={onTeamChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select team (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None (Optional)</SelectItem>
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
        <Label htmlFor="player">Player</Label>
        <Select value={selectedPlayer} onValueChange={onPlayerChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select player (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None (Optional)</SelectItem>
            {activePlayers.map((player) => (
              <SelectItem key={player.id} value={player.id}>
                {player.jersey_number ? `${player.jersey_number} - ` : ""}
                {player.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showDescription && (
        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            id="description"
            value={eventDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Event description"
          />
        </div>
      )}
    </div>
  );
}
