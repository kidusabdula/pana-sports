// components/cms/matches/match-control/components/dialogs/EventEditDialog.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, AlertTriangle, User, Users } from "lucide-react";
import { MatchEvent, UpdateMatchEvent } from "@/lib/schemas/matchEvent";
import { Match } from "@/lib/schemas/match";

interface Player {
  id: string;
  name_en: string;
  name_am?: string | null;
  jersey_number?: number | null;
}

interface EventEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: MatchEvent | null;
  match: Match;
  homeTeamPlayers: Player[];
  awayTeamPlayers: Player[];
  onUpdate: (eventId: string, updates: UpdateMatchEvent) => void;
  onDelete: (eventId: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

// Event types that can be edited
const editableEventTypes = [
  { value: "goal", label: "Goal" },
  { value: "own_goal", label: "Own Goal" },
  { value: "penalty_goal", label: "Penalty Goal" },
  { value: "penalty_miss", label: "Penalty Missed" },
  { value: "yellow", label: "Yellow Card" },
  { value: "second_yellow", label: "Second Yellow" },
  { value: "red", label: "Red Card" },
  { value: "sub", label: "Substitution" },
  { value: "corner", label: "Corner" },
  { value: "free_kick", label: "Free Kick" },
  { value: "offside", label: "Offside" },
  { value: "var_check", label: "VAR Check" },
  { value: "var_goal", label: "VAR Goal Confirmed" },
  { value: "var_no_goal", label: "VAR Goal Disallowed" },
  { value: "injury_time", label: "Injury Time" },
];

// System events that shouldn't be editable
const systemEventTypes = [
  "match_start",
  "match_end",
  "match_pause",
  "match_resume",
  "half_time",
  "second_half",
  "extra_time_start",
  "extra_time_end",
  "penalty_shootout_start",
  "penalty_shootout_end",
];

export function EventEditDialog({
  open,
  onOpenChange,
  event,
  match,
  homeTeamPlayers,
  awayTeamPlayers,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: EventEditDialogProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [eventType, setEventType] = useState(event?.type || "");
  const [minute, setMinute] = useState(event?.minute || 0);
  const [teamId, setTeamId] = useState(event?.team_id || "none");
  const [playerId, setPlayerId] = useState(event?.player_id || "none");
  const [descriptionEn, setDescriptionEn] = useState(
    event?.description_en || ""
  );
  const [descriptionAm, setDescriptionAm] = useState(
    event?.description_am || ""
  );

  // Substitution fields
  const [subbedInPlayerId, setSubbedInPlayerId] = useState(
    event?.subbed_in_player_id || "none"
  );
  const [subbedOutPlayerId, setSubbedOutPlayerId] = useState(
    event?.subbed_out_player_id || "none"
  );

  // Reset form when event changes
  useEffect(() => {
    if (event) {
      setEventType(event.type);
      setMinute(event.minute);
      setTeamId(event.team_id || "none");
      setPlayerId(event.player_id || "none");
      setDescriptionEn(event.description_en || "");
      setDescriptionAm(event.description_am || "");
      setSubbedInPlayerId(event.subbed_in_player_id || "none");
      setSubbedOutPlayerId(event.subbed_out_player_id || "none");
    }
  }, [event]);

  // Get players for selected team
  const getPlayersForTeam = () => {
    if (teamId === match.home_team_id) return homeTeamPlayers;
    if (teamId === match.away_team_id) return awayTeamPlayers;
    return [];
  };

  const isSystemEvent = event ? systemEventTypes.includes(event.type) : false;
  const isSubstitution = eventType === "sub";

  const handleSubmit = () => {
    if (!event) return;

    const updates: UpdateMatchEvent = {
      type: eventType as UpdateMatchEvent["type"],
      minute,
      team_id: teamId === "none" ? null : teamId,
      player_id: playerId === "none" ? null : playerId,
      description_en: descriptionEn || null,
      description_am: descriptionAm || null,
    };

    if (isSubstitution) {
      updates.subbed_in_player_id =
        subbedInPlayerId === "none" ? null : subbedInPlayerId;
      updates.subbed_out_player_id =
        subbedOutPlayerId === "none" ? null : subbedOutPlayerId;
    }

    onUpdate(event.id, updates);
  };

  const handleDelete = () => {
    if (!event) return;
    onDelete(event.id);
    setShowDeleteConfirm(false);
    onOpenChange(false);
  };

  if (!event) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Edit Event
              <Badge variant="outline" className="ml-2">
                {event.minute}&apos;
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {isSystemEvent
                ? "System events can only be deleted, not modified."
                : "Update the event details. Team and player selections are optional."}
            </DialogDescription>
          </DialogHeader>

          {isSystemEvent ? (
            <div className="py-6">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">System Event</p>
                  <p className="text-sm text-muted-foreground">
                    This is a system-generated event and cannot be edited. You
                    can only delete it if needed.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {/* Event Type */}
              <div className="space-y-2">
                <Label htmlFor="event-type">Event Type</Label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger id="event-type">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {editableEventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Minute */}
              <div className="space-y-2">
                <Label htmlFor="minute">Minute</Label>
                <Input
                  id="minute"
                  type="number"
                  min={0}
                  max={120}
                  value={minute}
                  onChange={(e) => setMinute(Number(e.target.value))}
                />
              </div>

              {/* Team Selection */}
              <div className="space-y-2">
                <Label htmlFor="team" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team
                  <Badge variant="secondary" className="text-xs">
                    Optional
                  </Badge>
                </Label>
                <Select
                  value={teamId}
                  onValueChange={(value) => {
                    setTeamId(value);
                    setPlayerId("none"); // Reset player when team changes
                  }}
                >
                  <SelectTrigger id="team">
                    <SelectValue placeholder="Select team (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No team selected</SelectItem>
                    <SelectItem value={match.home_team_id}>
                      {match.home_team?.name_en || "Home Team"}
                    </SelectItem>
                    <SelectItem value={match.away_team_id}>
                      {match.away_team?.name_en || "Away Team"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Player Selection */}
              {!isSubstitution && (
                <div className="space-y-2">
                  <Label htmlFor="player" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Player
                    <Badge variant="secondary" className="text-xs">
                      Optional
                    </Badge>
                  </Label>
                  <Select
                    value={playerId}
                    onValueChange={setPlayerId}
                    disabled={teamId === "none"}
                  >
                    <SelectTrigger id="player">
                      <SelectValue
                        placeholder={
                          teamId === "none"
                            ? "Select team first"
                            : "Select player (optional)"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No player selected</SelectItem>
                      {getPlayersForTeam().map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.jersey_number
                            ? `#${player.jersey_number} `
                            : ""}
                          {player.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Substitution Players */}
              {isSubstitution && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="subOut" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-red-400" />
                      Player Out
                      <Badge variant="secondary" className="text-xs">
                        Optional
                      </Badge>
                    </Label>
                    <Select
                      value={subbedOutPlayerId}
                      onValueChange={setSubbedOutPlayerId}
                      disabled={teamId === "none"}
                    >
                      <SelectTrigger id="subOut">
                        <SelectValue
                          placeholder={
                            teamId === "none"
                              ? "Select team first"
                              : "Select player coming off"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No player selected</SelectItem>
                        {getPlayersForTeam().map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.jersey_number
                              ? `#${player.jersey_number} `
                              : ""}
                            {player.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subIn" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-400" />
                      Player In
                      <Badge variant="secondary" className="text-xs">
                        Optional
                      </Badge>
                    </Label>
                    <Select
                      value={subbedInPlayerId}
                      onValueChange={setSubbedInPlayerId}
                      disabled={teamId === "none"}
                    >
                      <SelectTrigger id="subIn">
                        <SelectValue
                          placeholder={
                            teamId === "none"
                              ? "Select team first"
                              : "Select player coming on"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No player selected</SelectItem>
                        {getPlayersForTeam().map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.jersey_number
                              ? `#${player.jersey_number} `
                              : ""}
                            {player.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (English)</Label>
                <Textarea
                  id="description"
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Optional event description..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description-am">Description (Amharic)</Label>
                <Textarea
                  id="description-am"
                  value={descriptionAm}
                  onChange={(e) => setDescriptionAm(e.target.value)}
                  placeholder="Optional event description in Amharic..."
                  rows={2}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isUpdating || isDeleting}
              className="gap-2 sm:mr-auto"
            >
              <Trash2 className="h-4 w-4" />
              Delete Event
            </Button>

            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            {!isSystemEvent && (
              <Button
                onClick={handleSubmit}
                disabled={isUpdating || isDeleting}
              >
                {isUpdating && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be
              undone.
              {event?.type === "goal" && (
                <span className="block mt-2 text-yellow-600 font-medium">
                  Note: Deleting a goal event will NOT automatically update the
                  match score.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
