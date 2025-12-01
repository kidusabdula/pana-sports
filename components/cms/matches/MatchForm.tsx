"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createMatchInputSchema,
  updateMatchInputSchema,
  Match,
  CreateMatch,
  UpdateMatch,
} from "@/lib/schemas/match";
import { useCreateMatch, useUpdateMatch } from "@/lib/hooks/cms/useMatches";
import { useTeams } from "@/lib/hooks/cms/useTeams";
import { useLeagues } from "@/lib/hooks/cms/useLeagues";
import { useVenues } from "@/lib/hooks/cms/useVenues";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Save,
  X,
  Clock,
  Star,
} from "lucide-react";

interface MatchFormProps {
  match?: Match;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function MatchForm({
  match,
  onSuccess,
  onCancel,
}: MatchFormProps) {
  const isEditing = !!match;

  const form = useForm<CreateMatch | UpdateMatch>({
    resolver: zodResolver(
      isEditing ? updateMatchInputSchema : createMatchInputSchema
    ),
    defaultValues: {
      league_id: match?.league_id || "",
      home_team_id: match?.home_team_id || "",
      away_team_id: match?.away_team_id || "",
      date: match?.date ? new Date(match.date).toISOString().slice(0, 16) : "",
      status: match?.status || "scheduled",
      score_home: match?.score_home || 0,
      score_away: match?.score_away || 0,
      minute: match?.minute || 0,
      venue_id: match?.venue_id || "",
      attendance: match?.attendance || undefined,
      referee: match?.referee || "",
      match_day: match?.match_day || undefined,
      season: match?.season || "",
      is_featured: match?.is_featured || false,
    },
  });

  const { data: teams } = useTeams();
  const { data: leagues } = useLeagues();
  const { data: venues } = useVenues();

  const createMatchMutation = useCreateMatch();
  const updateMatchMutation = useUpdateMatch();

  const selectedLeague = useWatch({ control: form.control, name: "league_id" });
  const selectedHomeTeam = useWatch({
    control: form.control,
    name: "home_team_id",
  });
  const selectedAwayTeam = useWatch({
    control: form.control,
    name: "away_team_id",
  });

  // Filter teams by selected league
  const filteredTeams =
    teams?.filter((team) => team.league_id === selectedLeague) || [];

  const onSubmit = async (data: CreateMatch | UpdateMatch) => {
    const promise =
      isEditing && match
        ? updateMatchMutation.mutateAsync({
            id: match.id,
            updates: data,
          })
        : createMatchMutation.mutateAsync(data as CreateMatch);

    toast.promise(promise, {
      loading: isEditing ? "Updating match..." : "Creating match...",
      success: (data) => {
        return isEditing
          ? `Match updated successfully`
          : `Match created successfully`;
      },
      error: (error) => {
        return error instanceof Error
          ? error.message
          : "An unexpected error occurred";
      },
    });

    try {
      await promise;
      // Small delay to ensure the toast is visible before redirecting
      setTimeout(() => {
        onSuccess?.();
      }, 500);
    } catch (error) {
      // Error is handled by toast.promise
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <CardHeader className="text-center py-8 bg-muted/20">
          <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {isEditing ? "Edit Match" : "Create New Match"}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-md mx-auto">
            {isEditing
              ? "Update match information below."
              : "Fill in the details to schedule a new match."}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Form Card */}
      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-8 space-y-6">
              {/* Basic Match Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="league_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                          <Trophy className="h-4 w-4 text-primary" />
                          League
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Reset team selections when league changes
                            form.setValue("home_team_id", "");
                            form.setValue("away_team_id", "");
                          }}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                            <SelectValue placeholder="Select a league" />
                          </SelectTrigger>
                          <SelectContent>
                            {leagues?.map((league) => (
                              <SelectItem key={league.id} value={league.id}>
                                {league.name_en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The league this match belongs to
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                          <Calendar className="h-4 w-4 text-primary" />
                          Date & Time
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                          />
                        </FormControl>
                        <FormDescription>
                          The scheduled date and time for the match
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="home_team_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                          <Users className="h-4 w-4 text-primary" />
                          Home Team
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                          disabled={!selectedLeague}
                        >
                          <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                            <SelectValue
                              placeholder={
                                selectedLeague
                                  ? "Select home team"
                                  : "Select league first"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredTeams.map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name_en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The home team for this match
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="away_team_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                          <Users className="h-4 w-4 text-primary" />
                          Away Team
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                          disabled={!selectedLeague}
                        >
                          <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                            <SelectValue
                              placeholder={
                                selectedLeague
                                  ? "Select away team"
                                  : "Select league first"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredTeams
                              .filter((team) => team.id !== selectedHomeTeam)
                              .map((team) => (
                                <SelectItem key={team.id} value={team.id}>
                                  {team.name_en}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The away team for this match
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Match Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Match Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-foreground">
                          Status
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="live">Live</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="postponed">Postponed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Current status of the match
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="venue_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          Venue
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                            <SelectValue placeholder="Select a venue" />
                          </SelectTrigger>
                          <SelectContent>
                            {venues?.map((venue) => (
                              <SelectItem key={venue.id} value={venue.id}>
                                {venue.name_en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The venue where the match will be played
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="referee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-foreground">
                          Referee
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Referee name"
                            {...field}
                            className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                          />
                        </FormControl>
                        <FormDescription>
                          The referee for this match
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="season"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-foreground">
                          Season
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="2023/2024"
                            {...field}
                            className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                          />
                        </FormControl>
                        <FormDescription>
                          The season this match belongs to
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Score Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Score Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="score_home"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-foreground">
                          Home Score
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? 0 : Number(value));
                            }}
                            className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                          />
                        </FormControl>
                        <FormDescription>Home team score</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="score_away"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-foreground">
                          Away Score
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? 0 : Number(value));
                            }}
                            className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                          />
                        </FormControl>
                        <FormDescription>Away team score</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-foreground">
                          Minute
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? 0 : Number(value));
                            }}
                            className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                          />
                        </FormControl>
                        <FormDescription>
                          Current minute (for live matches)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Additional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="attendance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-foreground">
                          Attendance
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === "" ? undefined : Number(value)
                              );
                            }}
                            className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                          />
                        </FormControl>
                        <FormDescription>Number of attendees</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="match_day"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-foreground">
                          Match Day
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === "" ? undefined : Number(value)
                              );
                            }}
                            className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                          />
                        </FormControl>
                        <FormDescription>
                          Match day number in the league
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 rounded-lg border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-muted-foreground/30 text-primary focus:ring-primary"
                        />
                      </FormControl>
                      <FormLabel className="font-medium text-foreground">
                        Featured Match
                      </FormLabel>
                      <FormDescription>
                        Mark this match as featured
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter className="bg-muted/20 px-8 py-6 border-t border-border/50">
              <div className="flex justify-between w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="h-11 px-6 hover:bg-muted transition-colors rounded-lg"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="h-11 px-6 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isEditing ? "Update Match" : "Create Match"}
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
