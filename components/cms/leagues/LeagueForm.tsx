"use client";

import { useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createLeagueInputSchema,
  updateLeagueInputSchema,
  League,
  CreateLeague,
  UpdateLeague,
} from "@/lib/schemas/league";
import { useCreateLeague, useUpdateLeague } from "@/lib/hooks/useLeagues";
import { Trophy, Globe, Hash, Tag, Save, X } from "lucide-react";

// Utility function to generate slug from text
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

interface LeagueFormProps {
  league?: League;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function LeagueForm({
  league,
  onSuccess,
  onCancel,
}: LeagueFormProps) {
  const isEditing = !!league;

  const form = useForm<CreateLeague | UpdateLeague>({
    resolver: zodResolver(
      isEditing ? updateLeagueInputSchema : createLeagueInputSchema
    ),
    defaultValues: {
      slug: league?.slug || "",
      name_en: league?.name_en || "",
      name_am: league?.name_am || "",
      category: league?.category || "",
    },
  });

  // Watch name_en to auto-generate slug when creating
  const nameEnValue = form.watch("name_en");

  useEffect(() => {
    if (!isEditing && nameEnValue) {
      const slug = slugify(nameEnValue);
      form.setValue("slug", slug);
    }
  }, [nameEnValue, isEditing, form]);

  const createLeagueMutation = useCreateLeague();
  const updateLeagueMutation = useUpdateLeague();

  const onSubmit = async (data: CreateLeague | UpdateLeague) => {
    const promise =
      isEditing && league
        ? updateLeagueMutation.mutateAsync({
            id: league.id,
            updates: data,
          })
        : createLeagueMutation.mutateAsync(data as CreateLeague);

    toast.promise(promise, {
      loading: isEditing ? "Updating league..." : "Creating league...",
      success: (data) => {
        return isEditing
          ? `League "${data.name_en}" updated successfully`
          : `League "${data.name_en}" created successfully`;
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
      // Although Sonner persists, this feels smoother
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
            {isEditing ? "Edit League" : "Create New League"}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-md mx-auto">
            {isEditing
              ? "Update the league information below."
              : "Fill in the details to create a new league."}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Form Card */}
      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-8">
              <Tabs defaultValue="english" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-lg">
                  <TabsTrigger
                    value="english"
                    className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    English
                  </TabsTrigger>
                  <TabsTrigger
                    value="amharic"
                    className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Amharic
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="english" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <Trophy className="h-4 w-4 text-primary" />
                            League Name (English)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Premier League"
                              {...field}
                              className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            The official name of the league in English
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <Tag className="h-4 w-4 text-primary" />
                            Category
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Football"
                              {...field}
                              className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            The sport category for this league
                          </FormDescription>
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
                        <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                          <Hash className="h-4 w-4 text-primary" />
                          Slug
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="league-slug"
                            {...field}
                            className="h-11 bg-muted/50 border-input focus:border-primary transition-colors font-mono text-sm rounded-lg"
                          />
                        </FormControl>
                        <FormDescription>
                          Unique identifier for the league (auto-generated from
                          name)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="amharic" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name_am"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                          <Globe className="h-4 w-4 text-primary" />
                          League Name (Amharic)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ፕሪሚየር ሊግ"
                            {...field}
                            className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                          />
                        </FormControl>
                        <FormDescription>
                          The official name of the league in Amharic
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                      {isEditing ? "Update League" : "Create League"}
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
