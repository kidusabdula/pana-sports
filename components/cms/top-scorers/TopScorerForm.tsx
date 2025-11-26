"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  createTopScorerInputSchema,
  updateTopScorerInputSchema,
  TopScorer,
  CreateTopScorer,
  UpdateTopScorer,
} from "@/lib/schemas/topScorer";
import { useCreateTopScorer, useUpdateTopScorer } from "@/lib/hooks/useTopScorers";
import {
  Trophy,
  Shield,
  Hash,
  Save,
  X,
  Target,
  TrendingUp,
} from "lucide-react";
import { useLeagues } from "@/lib/hooks/useLeagues";
import { usePlayers } from "@/lib/hooks/usePlayers";
import { useTeams } from "@/lib/hooks/useTeams";

interface TopScorerFormProps {
  topScorer?: TopScorer;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TopScorerForm({ topScorer, onSuccess, onCancel }: TopScorerFormProps) {
  const isEditing = !!topScorer;
  
  // Fetch leagues and players for dropdowns
  const { data: leagues } = useLeagues();
  const { data: players } = usePlayers();
  const { data: teams } = useTeams();

  const form = useForm<CreateTopScorer | UpdateTopScorer>({
    resolver: zodResolver(isEditing ? updateTopScorerInputSchema : createTopScorerInputSchema),
    defaultValues: {
      league_slug: topScorer?.league_slug || "",
      player_slug: topScorer?.player_slug || "",
      team_slug: topScorer?.team_slug || "",
      goals: topScorer?.goals || 0,
      assists: topScorer?.assists || 0,
    },
  });

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
              ? "Update top scorer information below."
              : "Add a player to the top scorers list."}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Form Card */}
      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="league_slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                        <Trophy className="h-4 w-4 text-primary" />
                        League
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                            <SelectValue placeholder="Select a league" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {leagues?.map((league) => (
                            <SelectItem key={league.slug} value={league.slug}>
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
                  name="player_slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                        <Shield className="h-4 w-4 text-primary" />
                        Player
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                            <SelectValue placeholder="Select a player" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {players?.map((player) => (
                            <SelectItem key={player.slug} value={player.slug}>
                              {player.name_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The player to add to top scorers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="team_slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                        <Shield className="h-4 w-4 text-primary" />
                        Team
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                            <SelectValue placeholder="Select a team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teams?.map((team) => (
                            <SelectItem key={team.slug} value={team.slug}>
                              {team.name_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The team this player belongs to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                        />
                      </FormControl>
                      <FormDescription>
                        Number of goals scored
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
                      <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Assists
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                        />
                      </FormControl>
                      <FormDescription>
                        Number of assists (optional)
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