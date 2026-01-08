"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cupCreateSchema, CupCreate, CupUpdate } from "@/lib/schemas/cup";
import { Cup } from "@/lib/types/cup";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTeams } from "@/lib/hooks/cms/useTeams";
import { Loader2, Save, Trophy, Globe, History, Layout } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CupFormProps {
  initialData?: Cup;
  onSubmit: (data: CupCreate) => void;
  isPending: boolean;
}

export function CupForm({ initialData, onSubmit, isPending }: CupFormProps) {
  const { data: teams, isLoading: teamsLoading } = useTeams();

  const form = useForm<CupCreate>({
    resolver: zodResolver(cupCreateSchema),
    defaultValues: initialData
      ? {
          slug: initialData.slug,
          name_en: initialData.name_en,
          name_am: initialData.name_am,
          description_en: initialData.description_en || "",
          description_am: initialData.description_am || "",
          logo_url: initialData.logo_url || "",
          cup_type: initialData.cup_type,
          country: initialData.country,
          founded_year: initialData.founded_year || undefined,
          current_holder_team_id:
            initialData.current_holder_team_id || undefined,
          is_active: initialData.is_active,
        }
      : {
          slug: "",
          name_en: "",
          name_am: "",
          description_en: "",
          description_am: "",
          logo_url: "",
          cup_type: "knockout",
          country: "Ethiopia",
          is_active: true,
        },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-5xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-card backdrop-blur-sm shadow-xl">
              <CardContent className="pt-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="bg-muted border border-border mb-6 p-1">
                    <TabsTrigger
                      value="basic"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      Basic Info
                    </TabsTrigger>
                    <TabsTrigger
                      value="details"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Descriptions
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-semibold">
                              Name (English)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Ethiopian Cup"
                                className="bg-background border-border"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="name_am"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-semibold">
                              Name (Amharic)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. የኢትዮጵያ ዋንጫ"
                                className="bg-background border-border"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-semibold">
                            Slug
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. ethiopian-cup"
                              className="bg-background border-border font-mono text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-muted-foreground">
                            The unique URL-friendly name. Recommended: Lowercase
                            with hyphens.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="cup_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-semibold">
                              Competition Type
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-background border-border">
                                  <SelectValue placeholder="Select cup type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-background border-border text-foreground">
                                <SelectItem value="knockout">
                                  Pure Knockout
                                </SelectItem>
                                <SelectItem value="group_knockout">
                                  Group + Knockout
                                </SelectItem>
                                <SelectItem value="league_cup">
                                  League Cup
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="logo_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-semibold">
                              Logo URL
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://..."
                                className="bg-background border-border"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="description_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-semibold">
                            Description (English)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter English description..."
                              className="bg-background border-border min-h-[120px]"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description_am"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-semibold">
                            Description (Amharic)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="የውድድሩን መግለጫ እዚህ ያስገቡ..."
                              className="bg-background border-border min-h-[120px]"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-border bg-card backdrop-blur-sm shadow-xl">
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase mb-4 tracking-wider">
                  <Layout className="h-4 w-4" />
                  Publishing
                </div>

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border border-border p-4 bg-muted/30">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base text-foreground font-semibold">
                          Active Status
                        </FormLabel>
                        <FormDescription className="text-muted-foreground text-xs text-balance">
                          Whether this cup is visible to everyone.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm uppercase tracking-wider">
                    <History className="h-4 w-4" />
                    Archive Details
                  </div>

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold">
                          Country
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-background border-border"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="founded_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold">
                          Founded Year
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="bg-background border-border"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="current_holder_team_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold">
                          Current Holder
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || undefined}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background border-border text-foreground">
                              <SelectValue
                                placeholder={
                                  teamsLoading
                                    ? "Loading teams..."
                                    : "Select winner"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background border-border text-foreground max-h-60">
                            {teams?.map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name_en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full shadow-lg shadow-primary/20 h-12 text-base font-bold"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  {initialData ? "Apply Changes" : "Create Competition"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
