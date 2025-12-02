"use client";

import { useState, useEffect } from "react";
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
import {
  Trophy,
  Save,
  X,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  createTopScorerInputSchema,
  updateTopScorerInputSchema,
  TopScorer,
  CreateTopScorer,
  UpdateTopScorer,
} from "@/lib/schemas/topScorer";
import { useCreateTopScorer, useUpdateTopScorer } from "@/lib/hooks/cms/useTopScorers";
import { useLeagues } from "@/lib/hooks/cms/useLeagues";
import { useTeams } from "@/lib/hooks/cms/useTeams";

interface TopScorerFormProps {
  topScorer?: TopScorer;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TopScorerForm({ topScorer, onSuccess, onCancel }: TopScorerFormProps) {
  const isEditing = !!topScorer;
  
  const form = useForm<CreateTopScorer | UpdateTopScorer>({
    resolver: zodResolver(
      isEditing ? updateTopScorerInputSchema : createTopScorerInputSchema
    ),
    defaultValues: {
      league_id: topScorer?.league_id || "",
      player_id: topScorer?.player_id || "",
      team_id: topScorer?.team_id || "",
      season: topScorer?.season || "",
      goals: topScorer?.goals || 0,
      assists: topScorer?.assists || 0,
    },
  });

  const { data: leagues } = useLeagues();
  const { data: teams } = useTeams();
  
  const selectedLeagueId = form.watch("league_id");
  const filteredTeams = teams?.filter((team) => team.league_id === selectedLeagueId) || [];

  const createTopScorerMutation = useCreateTopScorer();
  const updateTopScorerMutation = useUpdateTopScorer();

  const onSubmit = async (data: CreateTopScorer | UpdateTopScorer) => {
    const promise =
      isEditing && topScorer
        ? updateTopScorerMutation.mutateAsync({
            id: topScorer.id,
            updates: data,
          })
        : createTopScorerMutation.mutateAsync(data as CreateTopScorer);

    toast.promise(promise, {
      loading: isEditing ? "Updating top scorer..." : "Creating top scorer...",
      success: (data) => {
        return isEditing
          ? `Top scorer updated successfully`
          : `Top scorer created successfully`;
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
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {isEditing ? "Edit Top Scorer" : "Create New Top Scorer"}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-md mx-auto">
            {isEditing
              ? "Update player top scorer statistics below."
              : "Fill in the details to create a new top scorer entry."}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Form Card */}
      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-8 space-y-6">
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
                        onValueChange={field.onChange}
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
                        The league this top scorer belongs to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="team_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Team</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        disabled={!selectedLeagueId}
                      >
                        <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                          <SelectValue placeholder={selectedLeagueId ? "Select a team" : "Select a league first"} />
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
                        The team this top scorer belongs to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="player_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Player</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        disabled={!selectedLeagueId}
                      >
                        <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                          <SelectValue placeholder={selectedLeagueId ? "Select a player" : "Select a league first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredTeams.map((team) => (
                            team.players?.map((player) => (
                              <SelectItem key={player.id} value={player.id}>
                                {player.jersey_number} - {player.name_en}
                              </SelectItem>
                            ))
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The player this top scorer entry belongs to
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
                      <FormLabel className="font-medium text-foreground">Season</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="2023/2024"
                          {...field}
                          className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                        />
                      </FormControl>
                      <FormDescription>
                        The season this top scorer belongs to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                        <Target className="h-4 w-4 text-primary" />
                        Goals
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? undefined : Number(value));
                          }}
                          className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                        />
                      </FormControl>
                      <FormDescription>
                        Total goals scored
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assists"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Assists</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? undefined : Number(value));
                          }}
                          className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                        />
                      </FormControl>
                      <FormDescription>
                        Total assists provided
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
                      {isEditing ? "Update Top Scorer" : "Create Top Scorer"}
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