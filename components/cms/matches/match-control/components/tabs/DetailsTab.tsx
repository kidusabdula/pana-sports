// components/cms/matches/match-control/components/tabs/DetailsTab.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import { FORMATIONS, WEATHER_OPTIONS, SURFACE_OPTIONS } from "../../constants";
import { Match } from "@/lib/schemas/match";

interface DetailsTabProps {
  match: Match;
  matchRound: string;
  homeFormation: string;
  awayFormation: string;
  coachHome: string;
  coachAway: string;
  assistantReferee1: string;
  assistantReferee2: string;
  assistantReferee3: string;
  fourthOfficial: string;
  matchCommissioner: string;
  weather: string;
  temperature: string;
  humidity: string;
  wind: string;
  surface: string;
  isPending: boolean;
  onMatchRoundChange: (value: string) => void;
  onHomeFormationChange: (value: string) => void;
  onAwayFormationChange: (value: string) => void;
  onCoachHomeChange: (value: string) => void;
  onCoachAwayChange: (value: string) => void;
  onAssistantReferee1Change: (value: string) => void;
  onAssistantReferee2Change: (value: string) => void;
  onAssistantReferee3Change: (value: string) => void;
  onFourthOfficialChange: (value: string) => void;
  onMatchCommissionerChange: (value: string) => void;
  onWeatherChange: (value: string) => void;
  onTemperatureChange: (value: string) => void;
  onHumidityChange: (value: string) => void;
  onWindChange: (value: string) => void;
  onSurfaceChange: (value: string) => void;
  onSaveDetails: () => void;
}

export function DetailsTab({
  match,
  matchRound,
  homeFormation,
  awayFormation,
  coachHome,
  coachAway,
  assistantReferee1,
  assistantReferee2,
  assistantReferee3,
  fourthOfficial,
  matchCommissioner,
  weather,
  temperature,
  humidity,
  wind,
  surface,
  isPending,
  onMatchRoundChange,
  onHomeFormationChange,
  onAwayFormationChange,
  onCoachHomeChange,
  onCoachAwayChange,
  onAssistantReferee1Change,
  onAssistantReferee2Change,
  onAssistantReferee3Change,
  onFourthOfficialChange,
  onMatchCommissionerChange,
  onWeatherChange,
  onTemperatureChange,
  onHumidityChange,
  onWindChange,
  onSurfaceChange,
  onSaveDetails,
}: DetailsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Match Details</h3>
        <Button
          onClick={onSaveDetails}
          size="sm"
          className="gap-2"
          disabled={isPending}
        >
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save Details"}
        </Button>
      </div>

      {/* Round/Matchday */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="matchRound">Round / Stage</Label>
          <Input
            id="matchRound"
            value={matchRound}
            onChange={(e) => onMatchRoundChange(e.target.value)}
            placeholder="e.g., Quarter-final, Matchday 12"
          />
        </div>
        <div>
          <Label htmlFor="surface">Playing Surface</Label>
          <Select value={surface} onValueChange={onSurfaceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select surface" />
            </SelectTrigger>
            <SelectContent>
              {SURFACE_OPTIONS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Formations */}
      <Separator />
      <h4 className="font-semibold text-sm text-muted-foreground">
        Formations
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="homeFormation">
            {match.home_team?.name_en} Formation
          </Label>
          <Select value={homeFormation} onValueChange={onHomeFormationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select formation" />
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
        <div>
          <Label htmlFor="awayFormation">
            {match.away_team?.name_en} Formation
          </Label>
          <Select value={awayFormation} onValueChange={onAwayFormationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select formation" />
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
      </div>

      {/* Coaches */}
      <Separator />
      <h4 className="font-semibold text-sm text-muted-foreground">Coaches</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="coachHome">{match.home_team?.name_en} Coach</Label>
          <Input
            id="coachHome"
            value={coachHome}
            onChange={(e) => onCoachHomeChange(e.target.value)}
            placeholder="Coach name"
          />
        </div>
        <div>
          <Label htmlFor="coachAway">{match.away_team?.name_en} Coach</Label>
          <Input
            id="coachAway"
            value={coachAway}
            onChange={(e) => onCoachAwayChange(e.target.value)}
            placeholder="Coach name"
          />
        </div>
      </div>

      {/* Match Officials */}
      <Separator />
      <h4 className="font-semibold text-sm text-muted-foreground">
        Match Officials
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="assistantReferee1">Assistant Referee 1</Label>
          <Input
            id="assistantReferee1"
            value={assistantReferee1}
            onChange={(e) => onAssistantReferee1Change(e.target.value)}
            placeholder="Name"
          />
        </div>
        <div>
          <Label htmlFor="assistantReferee2">Assistant Referee 2</Label>
          <Input
            id="assistantReferee2"
            value={assistantReferee2}
            onChange={(e) => onAssistantReferee2Change(e.target.value)}
            placeholder="Name"
          />
        </div>
        <div>
          <Label htmlFor="assistantReferee3">VAR Official</Label>
          <Input
            id="assistantReferee3"
            value={assistantReferee3}
            onChange={(e) => onAssistantReferee3Change(e.target.value)}
            placeholder="Name"
          />
        </div>
        <div>
          <Label htmlFor="fourthOfficial">Fourth Official</Label>
          <Input
            id="fourthOfficial"
            value={fourthOfficial}
            onChange={(e) => onFourthOfficialChange(e.target.value)}
            placeholder="Name"
          />
        </div>
        <div>
          <Label htmlFor="matchCommissioner">Match Commissioner</Label>
          <Input
            id="matchCommissioner"
            value={matchCommissioner}
            onChange={(e) => onMatchCommissionerChange(e.target.value)}
            placeholder="Name"
          />
        </div>
      </div>

      {/* Weather Conditions */}
      <Separator />
      <h4 className="font-semibold text-sm text-muted-foreground">
        Weather Conditions
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="weather">Weather</Label>
          <Select value={weather} onValueChange={onWeatherChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select weather" />
            </SelectTrigger>
            <SelectContent>
              {WEATHER_OPTIONS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="temperature">Temperature</Label>
          <Input
            id="temperature"
            value={temperature}
            onChange={(e) => onTemperatureChange(e.target.value)}
            placeholder="e.g., 24°C"
          />
        </div>
        <div>
          <Label htmlFor="humidity">Humidity</Label>
          <Input
            id="humidity"
            value={humidity}
            onChange={(e) => onHumidityChange(e.target.value)}
            placeholder="e.g., 65%"
          />
        </div>
        <div>
          <Label htmlFor="wind">Wind</Label>
          <Input
            id="wind"
            value={wind}
            onChange={(e) => onWindChange(e.target.value)}
            placeholder="e.g., 12 km/h NW"
          />
        </div>
      </div>
    </div>
  );
}
