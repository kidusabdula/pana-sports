// components/cms/standings/StandingsForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Trophy,
  Save,
  X,
  Calculator,
} from "lucide-react";
import {
  createStandingInputSchema,
  updateStandingInputSchema,
  Standing,
  CreateStanding,
  UpdateStanding,
} from "@/lib/schemas/standing";
import { useCreateStanding, useUpdateStanding } from "@/lib/hooks/cms/useStandings";
import { useLeagues } from "@/lib/hooks/cms/useLeagues";
import { useTeams } from "@/lib/hooks/cms/useTeams";

interface StandingFormProps {
  standing?: Standing;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function StandingForm({ standing, onSuccess, onCancel }: StandingFormProps) {
  const isEditing = !!standing;
  const [activeTab, setActiveTab] = useState("basic");
  
const form = useForm<CreateStanding | UpdateStanding>({
  resolver: zodResolver(
    isEditing ? updateStandingInputSchema : createStandingInputSchema
  ),
  defaultValues: {
    league_id: standing?.league_id || "",
    team_id: standing?.team_id || "",
    season: standing?.season || "",
    played: standing?.played || 0,
    won: standing?.won || 0,
    draw: standing?.draw || 0,
    lost: standing?.lost || 0,
    goals_for: standing?.goals_for || 0,
    goals_against: standing?.goals_against || 0,
    gd: standing?.gd || 0, // Add overall goal difference
    points: standing?.points || 0,
    rank: standing?.rank || 0,
    home_played: standing?.home_played || 0,
    home_won: standing?.home_won || 0,
    home_draw: standing?.home_draw || 0,
    home_lost: standing?.home_lost || 0,
    home_goals_for: standing?.home_goals_for || 0,
    home_goals_against: standing?.home_goals_against || 0,
    home_gd: standing?.home_gd || 0, // Add home goal difference
    away_played: standing?.away_played || 0,
    away_won: standing?.away_won || 0,
    away_draw: standing?.away_draw || 0,
    away_lost: standing?.away_lost || 0,
    away_goals_for: standing?.away_goals_for || 0,
    away_goals_against: standing?.away_goals_against || 0,
    away_gd: standing?.away_gd || 0, // Add away goal difference
  },
});

  const { data: leagues } = useLeagues();
  const { data: teams } = useTeams();
  
  const selectedLeagueId = form.watch("league_id");
  const filteredTeams = teams?.filter((team) => team.league_id === selectedLeagueId) || [];

  const createStandingMutation = useCreateStanding();
  const updateStandingMutation = useUpdateStanding();

  const onSubmit = async (data: CreateStanding | UpdateStanding) => {
    // Remove any undefined values that might cause issues
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );
    
    const promise =
      isEditing && standing
        ? updateStandingMutation.mutateAsync({
            id: standing.id,
            updates: cleanedData,
          })
        : createStandingMutation.mutateAsync(cleanedData as CreateStanding);

    toast.promise(promise, {
      loading: isEditing ? "Updating standing..." : "Creating standing...",
      success: () => {
        return isEditing
          ? `Standing updated successfully`
          : `Standing created successfully`;
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

  // Auto-calculate GD and points based on wins/draws/losses
  const watchedValues = {
    won: form.watch("won"),
    draw: form.watch("draw"),
    lost: form.watch("lost"),
    goals_for: form.watch("goals_for"),
    goals_against: form.watch("goals_against")
  };

  useEffect(() => {
    if (watchedValues.won !== undefined && watchedValues.draw !== undefined && watchedValues.lost !== undefined) {
      const played = (watchedValues.won || 0) + (watchedValues.draw || 0) + (watchedValues.lost || 0);
      const points = (watchedValues.won || 0) * 3 + (watchedValues.draw || 0) * 1;
      
      form.setValue("played", played);
      form.setValue("points", points);
    }
  }, [watchedValues.won, watchedValues.draw, watchedValues.lost, form]);

  // Auto-calculate home/away stats
  const watchedHomeValues = {
    home_won: form.watch("home_won"),
    home_draw: form.watch("home_draw"),
    home_lost: form.watch("home_lost")
  };

  useEffect(() => {
    if (watchedHomeValues.home_won !== undefined && watchedHomeValues.home_draw !== undefined && watchedHomeValues.home_lost !== undefined) {
      const homePlayed = (watchedHomeValues.home_won || 0) + (watchedHomeValues.home_draw || 0) + (watchedHomeValues.home_lost || 0);
      form.setValue("home_played", homePlayed);
    }
  }, [watchedHomeValues.home_won, watchedHomeValues.home_draw, watchedHomeValues.home_lost, form]);

  // Auto-calculate away stats
  const watchedAwayValues = {
    away_won: form.watch("away_won"),
    away_draw: form.watch("away_draw"),
    away_lost: form.watch("away_lost")
  };

  useEffect(() => {
    if (watchedAwayValues.away_won !== undefined && watchedAwayValues.away_draw !== undefined && watchedAwayValues.away_lost !== undefined) {
      const awayPlayed = (watchedAwayValues.away_won || 0) + (watchedAwayValues.away_draw || 0) + (watchedAwayValues.away_lost || 0);
      form.setValue("away_played", awayPlayed);
    }
  }, [watchedAwayValues.away_won, watchedAwayValues.away_draw, watchedAwayValues.away_lost, form]);

  useEffect(() => {
  if (watchedValues.goals_for !== undefined && watchedValues.goals_against !== undefined) {
    const gd = (watchedValues.goals_for || 0) - (watchedValues.goals_against || 0);
    form.setValue("gd", gd);
  }
}, [watchedValues.goals_for, watchedValues.goals_against, form]);

// Calculate home goal difference
const watchedHomeGoalsValues = {
  home_goals_for: form.watch("home_goals_for"),
  home_goals_against: form.watch("home_goals_against")
};

useEffect(() => {
  if (watchedHomeGoalsValues.home_goals_for !== undefined && watchedHomeGoalsValues.home_goals_against !== undefined) {
    const homeGd = (watchedHomeGoalsValues.home_goals_for || 0) - (watchedHomeGoalsValues.home_goals_against || 0);
    form.setValue("home_gd", homeGd);
  }
}, [watchedHomeGoalsValues.home_goals_for, watchedHomeGoalsValues.home_goals_against, form]);

// Calculate away goal difference
const watchedAwayGoalsValues = {
  away_goals_for: form.watch("away_goals_for"),
  away_goals_against: form.watch("away_goals_against")
};

useEffect(() => {
  if (watchedAwayGoalsValues.away_goals_for !== undefined && watchedAwayGoalsValues.away_goals_against !== undefined) {
    const awayGd = (watchedAwayGoalsValues.away_goals_for || 0) - (watchedAwayGoalsValues.away_goals_against || 0);
    form.setValue("away_gd", awayGd);
  }
}, [watchedAwayGoalsValues.away_goals_for, watchedAwayGoalsValues.away_goals_against, form]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <CardHeader className="text-center py-8 bg-muted/20">
          <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {isEditing ? "Edit Standing" : "Create New Standing"}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-md mx-auto">
            {isEditing
              ? "Update team standing information below."
              : "Fill in details to create a new team standing."}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Form Card */}
      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-lg">
                  <TabsTrigger value="basic" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Trophy className="mr-2 h-4 w-4" />
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="detailed" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Calculator className="mr-2 h-4 w-4" />
                    Detailed Stats
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
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
                            The league this standing belongs to
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
                            The team this standing belongs to
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            The season this standing belongs to
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rank"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-foreground">Rank</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1"
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
                            The team&apos;s position in league table
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="detailed" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Overall Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="played"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Played</FormLabel>
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
                              Total matches played
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="points"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Points</FormLabel>
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
                              Total points earned
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="won"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Won</FormLabel>
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
                              Matches won
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="draw"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Draw</FormLabel>
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
                              Matches drawn
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Lost</FormLabel>
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
                              Matches lost
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="goals_for"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Goals For</FormLabel>
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
                        name="goals_against"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Goals Against</FormLabel>
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
                              Total goals conceded
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Home Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="home_played"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Played</FormLabel>
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
                              Home matches played
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="home_won"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Won</FormLabel>
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
                              Home matches won
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="home_draw"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Draw</FormLabel>
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
                              Home matches drawn
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="home_lost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Lost</FormLabel>
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
                              Home matches lost
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="home_goals_for"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Goals For</FormLabel>
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
                              Home goals scored
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="home_goals_against"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Goals Against</FormLabel>
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
                              Home goals conceded
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Away Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="away_played"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Played</FormLabel>
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
                              Away matches played
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="away_won"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Won</FormLabel>
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
                              Away matches won
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="away_draw"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Draw</FormLabel>
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
                              Away matches drawn
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="away_lost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Lost</FormLabel>
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
                              Away matches lost
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="away_goals_for"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Goals For</FormLabel>
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
                              Away goals scored
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="away_goals_against"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-foreground">Goals Against</FormLabel>
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
                              Away goals conceded
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
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
                      {isEditing ? "Update Standing" : "Create Standing"}
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