// components/cms/matches/match-control/MatchControlPanel.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useMatchControlState } from "./hooks/useMatchControlState";
import { MatchStatusCard } from "./components/MatchStatusCard";
import {
  ControlTab,
  EventsTab,
  LineupsTab,
  DetailsTab,
  VARTab,
} from "./components/tabs";
import {
  SubstitutionDialog,
  VARDialog,
  PenaltyDialog,
} from "./components/dialogs";
import type { MatchControlPanelProps } from "./types";

export default function MatchControlPanel({ match }: MatchControlPanelProps) {
  const state = useMatchControlState({ match });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Match Status Card */}
      <MatchStatusCard
        match={match}
        currentMatch={state.currentMatch}
        localScoreHome={state.localScoreHome}
        localScoreAway={state.localScoreAway}
        matchMinute={state.matchMinute}
        matchSecond={state.matchSecond}
        isClockRunning={state.isClockRunning}
        isExtraTime={state.isExtraTime}
        isPenaltyShootout={state.isPenaltyShootout}
        isAnyFetching={state.isAnyFetching}
        formatTime={state.formatTime}
        onStartMatch={state.startMatch}
        onPauseMatch={state.pauseMatch}
        onResumeMatch={state.resumeMatch}
        onHalfTime={state.halfTime}
        onSecondHalf={state.secondHalf}
        onStartExtraTime={state.startExtraTime}
        onEndExtraTime={state.endExtraTime}
        onStartPenaltyShootout={state.startPenaltyShootout}
        onEndPenaltyShootout={state.endPenaltyShootout}
        onFullTime={state.fullTime}
        onRestartMatch={state.restartMatch}
        onRefresh={state.refreshAllData}
        onUpdateMinute={state.updateMinute}
        onAddInjuryTime={state.addInjuryTime}
        onOpenPenaltyDialog={() => state.setPenaltyDialogOpen(true)}
        setMatchMinute={state.setMatchMinute}
      />

      {/* Main Control Panel */}
      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <CardHeader className="px-4 sm:px-6 py-4">
          <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
            Match Control Panel
          </CardTitle>
          <CardDescription>
            Manage events, lineups, and match details
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Tabs value={state.activeTab} onValueChange={state.setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="control">Control</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="lineups">Lineups</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="var">VAR</TabsTrigger>
            </TabsList>

            {/* Control Tab */}
            <TabsContent value="control" className="space-y-4 sm:space-y-6">
              <ControlTab
                match={match}
                selectedTeam={state.selectedTeam}
                selectedPlayer={state.selectedPlayer}
                eventDescription={state.eventDescription}
                homeTeamPlayers={state.homeTeamPlayers}
                awayTeamPlayers={state.awayTeamPlayers}
                isEventPending={state.isEventPending}
                isControlPending={state.isControlPending}
                onTeamChange={state.setSelectedTeam}
                onPlayerChange={state.setSelectedPlayer}
                onDescriptionChange={state.setEventDescription}
                onAddGoal={state.addGoal}
                onAddOwnGoal={state.addOwnGoal}
                onAddPenaltyGoal={state.addPenaltyGoal}
                onAddMissedPenalty={state.addMissedPenalty}
                onAddYellowCard={state.addYellowCard}
                onAddRedCard={state.addRedCard}
                onAddSecondYellow={state.addSecondYellow}
                onOpenSubstitution={() => state.setIsSubstitutionOpen(true)}
                onAddCorner={state.addCorner}
                onAddFreeKick={state.addFreeKick}
                onAddOffside={state.addOffside}
                onOpenVARDialog={() => state.setVarDialogOpen(true)}
              />
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-4">
              <EventsTab
                match={match}
                events={state.events}
                isLoading={state.isEventsLoading}
                homeTeamPlayers={state.homeTeamPlayers}
                awayTeamPlayers={state.awayTeamPlayers}
                onRefresh={state.refetchEvents}
                onUpdateEvent={(eventId, updates) =>
                  state.handleUpdateEvent({ eventId, updates })
                }
                onDeleteEvent={state.handleDeleteEvent}
                isUpdating={state.isUpdatingEvent}
                isDeleting={state.isDeletingEvent}
              />
            </TabsContent>

            {/* Lineups Tab */}
            <TabsContent value="lineups" className="space-y-4">
              <LineupsTab
                match={match}
                homeLineup={state.homeLineup}
                awayLineup={state.awayLineup}
                homeFormation={state.homeFormation}
                awayFormation={state.awayFormation}
                homeTeamPlayers={state.homeTeamPlayers}
                awayTeamPlayers={state.awayTeamPlayers}
                onHomeLineupChange={state.setHomeLineup}
                onAwayLineupChange={state.setAwayLineup}
                onHomeFormationChange={state.setHomeFormation}
                onAwayFormationChange={state.setAwayFormation}
                onSaveLineups={state.saveLineups}
                onClearLineups={state.clearLineups}
                lineupDialogOpen={state.lineupDialogOpen}
                onLineupDialogChange={state.setLineupDialogOpen}
              />
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <DetailsTab
                match={match}
                matchRound={state.matchRound}
                homeFormation={state.homeFormation}
                awayFormation={state.awayFormation}
                coachHome={state.coachHome}
                coachAway={state.coachAway}
                assistantReferee1={state.assistantReferee1}
                assistantReferee2={state.assistantReferee2}
                assistantReferee3={state.assistantReferee3}
                fourthOfficial={state.fourthOfficial}
                matchCommissioner={state.matchCommissioner}
                weather={state.weather}
                temperature={state.temperature}
                humidity={state.humidity}
                wind={state.wind}
                surface={state.surface}
                isPending={state.isControlPending}
                onMatchRoundChange={state.setMatchRound}
                onHomeFormationChange={state.setHomeFormation}
                onAwayFormationChange={state.setAwayFormation}
                onCoachHomeChange={state.setCoachHome}
                onCoachAwayChange={state.setCoachAway}
                onAssistantReferee1Change={state.setAssistantReferee1}
                onAssistantReferee2Change={state.setAssistantReferee2}
                onAssistantReferee3Change={state.setAssistantReferee3}
                onFourthOfficialChange={state.setFourthOfficial}
                onMatchCommissionerChange={state.setMatchCommissioner}
                onWeatherChange={state.setWeather}
                onTemperatureChange={state.setTemperature}
                onHumidityChange={state.setHumidity}
                onWindChange={state.setWind}
                onSurfaceChange={state.setSurface}
                onSaveDetails={state.saveMatchDetails}
              />
            </TabsContent>

            {/* VAR Tab */}
            <TabsContent value="var" className="space-y-4">
              <VARTab
                events={state.events}
                onOpenVARDialog={() => state.setVarDialogOpen(true)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <SubstitutionDialog
        open={state.isSubstitutionOpen}
        onOpenChange={state.setIsSubstitutionOpen}
        match={match}
        selectedTeam={state.selectedTeam}
        homeTeamPlayers={state.homeTeamPlayers}
        awayTeamPlayers={state.awayTeamPlayers}
        selectedSubInPlayer={state.selectedSubInPlayer}
        selectedSubOutPlayer={state.selectedSubOutPlayer}
        onSubInChange={state.setSelectedSubInPlayer}
        onSubOutChange={state.setSelectedSubOutPlayer}
        onSubmit={state.addSubstitution}
      />

      <VARDialog
        open={state.varDialogOpen}
        onOpenChange={state.setVarDialogOpen}
        varType={state.varType}
        onVarTypeChange={state.setVarType}
        onSubmit={state.addVarCheck}
      />

      <PenaltyDialog
        open={state.penaltyDialogOpen}
        onOpenChange={state.setPenaltyDialogOpen}
        match={match}
        penaltyTeam={state.penaltyTeam}
        penaltyResult={state.penaltyResult}
        onTeamChange={state.setPenaltyTeam}
        onResultChange={state.setPenaltyResult}
        onSubmit={state.addPenaltyShootoutResult}
      />
    </div>
  );
}
