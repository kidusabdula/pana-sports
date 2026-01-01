// components/cms/matches/match-control/components/tabs/ControlTab.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Goal,
  Flag,
  XCircle,
  CreditCard,
  UserMinus,
  Zap,
  Minus,
  Eye,
} from "lucide-react";
import { TeamPlayerSelector } from "../shared/TeamPlayerSelector";
import type { Player } from "../../types";
import { Match } from "@/lib/schemas/match";

interface ControlTabProps {
  match: Match;
  selectedTeam: string;
  selectedPlayer: string;
  eventDescription: string;
  homeTeamPlayers: Player[];
  awayTeamPlayers: Player[];
  isEventPending: boolean;
  isControlPending: boolean;
  onTeamChange: (teamId: string) => void;
  onPlayerChange: (playerId: string) => void;
  onDescriptionChange: (description: string) => void;
  onAddGoal: () => void;
  onAddOwnGoal: () => void;
  onAddPenaltyGoal: () => void;
  onAddMissedPenalty: () => void;
  onAddYellowCard: () => void;
  onAddRedCard: () => void;
  onAddSecondYellow: () => void;
  onOpenSubstitution: () => void;
  onAddCorner: () => void;
  onAddFreeKick: () => void;
  onAddOffside: () => void;
  onOpenVARDialog: () => void;
}

export function ControlTab({
  match,
  selectedTeam,
  selectedPlayer,
  eventDescription,
  homeTeamPlayers,
  awayTeamPlayers,
  isEventPending,
  isControlPending,
  onTeamChange,
  onPlayerChange,
  onDescriptionChange,
  onAddGoal,
  onAddOwnGoal,
  onAddPenaltyGoal,
  onAddMissedPenalty,
  onAddYellowCard,
  onAddRedCard,
  onAddSecondYellow,
  onOpenSubstitution,
  onAddCorner,
  onAddFreeKick,
  onAddOffside,
  onOpenVARDialog,
}: ControlTabProps) {
  const isPending = isEventPending || isControlPending;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Team and Player Selection */}
        <TeamPlayerSelector
          match={match}
          selectedTeam={selectedTeam}
          selectedPlayer={selectedPlayer}
          eventDescription={eventDescription}
          homeTeamPlayers={homeTeamPlayers}
          awayTeamPlayers={awayTeamPlayers}
          onTeamChange={onTeamChange}
          onPlayerChange={onPlayerChange}
          onDescriptionChange={onDescriptionChange}
        />

        {/* Event Buttons */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {/* Goal Events */}
            <Button onClick={onAddGoal} className="gap-2" disabled={isPending}>
              <Goal className="h-4 w-4" />
              {isEventPending ? "Adding..." : "Goal"}
            </Button>
            <Button
              onClick={onAddOwnGoal}
              variant="outline"
              className="gap-2"
              disabled={isPending}
            >
              <Goal className="h-4 w-4" />
              Own Goal
            </Button>

            {/* Penalty Events */}
            <Button
              onClick={onAddPenaltyGoal}
              variant="outline"
              className="gap-2"
              disabled={isPending}
            >
              <Flag className="h-4 w-4" />
              Penalty Goal
            </Button>
            <Button
              onClick={onAddMissedPenalty}
              variant="outline"
              className="gap-2"
              disabled={isPending}
            >
              <XCircle className="h-4 w-4" />
              Missed Penalty
            </Button>

            {/* Card Events */}
            <Button
              onClick={onAddYellowCard}
              variant="outline"
              className="gap-2 border-yellow-500/50 hover:border-yellow-500"
              disabled={isPending}
            >
              <CreditCard className="h-4 w-4 text-yellow-500" />
              Yellow Card
            </Button>
            <Button
              onClick={onAddSecondYellow}
              variant="outline"
              className="gap-2 border-yellow-600/50 hover:border-yellow-600"
              disabled={isPending}
            >
              <CreditCard className="h-4 w-4 text-yellow-600" />
              2nd Yellow
            </Button>
            <Button
              onClick={onAddRedCard}
              variant="outline"
              className="gap-2 border-red-500/50 hover:border-red-500"
              disabled={isPending}
            >
              <XCircle className="h-4 w-4 text-red-500" />
              Red Card
            </Button>

            {/* Other Events */}
            <Button
              onClick={onOpenSubstitution}
              variant="outline"
              className="gap-2"
              disabled={isPending}
            >
              <UserMinus className="h-4 w-4" />
              Substitution
            </Button>
            <Button
              onClick={onAddCorner}
              variant="outline"
              className="gap-2"
              disabled={isPending}
            >
              <Flag className="h-4 w-4" />
              Corner
            </Button>
            <Button
              onClick={onAddFreeKick}
              variant="outline"
              className="gap-2"
              disabled={isPending}
            >
              <Zap className="h-4 w-4" />
              Free Kick
            </Button>
            <Button
              onClick={onAddOffside}
              variant="outline"
              className="gap-2"
              disabled={isPending}
            >
              <Minus className="h-4 w-4" />
              Offside
            </Button>
            <Button
              onClick={onOpenVARDialog}
              variant="outline"
              className="gap-2"
              disabled={isPending}
            >
              <Eye className="h-4 w-4" />
              VAR Check
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
