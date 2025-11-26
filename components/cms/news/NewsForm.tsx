"use client";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createNewsInputSchema,
  updateNewsInputSchema,
  News,
  CreateNews,
  UpdateNews,
} from "@/lib/schemas/news";
import { useCreateNews, useUpdateNews } from "@/lib/hooks/useNews";
import { useLeagues } from "@/lib/hooks/useLeagues";
import {
  Newspaper,
  Globe,
  Save,
  X,
  Image as ImageIcon,
  Calendar,
  Tag,
} from "lucide-react";

interface NewsFormProps {
  news?: News;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function NewsForm({ news, onSuccess, onCancel }: NewsFormProps) {
  const isEditing = !!news;
  const { data: leagues } = useLeagues();

  const form = useForm<CreateNews | UpdateNews>({
    resolver: zodResolver(
      isEditing ? updateNewsInputSchema : createNewsInputSchema
    ) as any,
    defaultValues: {
      title_en: news?.title_en || "",
      title_am: news?.title_am || "",
      content_en: news?.content_en || "",
      content_am: news?.content_am || "",
      thumbnail_url: news?.thumbnail_url || "",
      category: news?.category || "",
      league_slug: news?.league_slug || "",
      published_at: news?.published_at || new Date().toISOString(),
    },
  });

  const createNewsMutation = useCreateNews();
  const updateNewsMutation = useUpdateNews();

  const onSubmit = async (data: CreateNews | UpdateNews) => {
    const promise =
      isEditing && news
        ? updateNewsMutation.mutateAsync({
            id: news.id,
            updates: data,
          })
        : createNewsMutation.mutateAsync(data as CreateNews);

    toast.promise(promise, {
      loading: isEditing ? "Updating article..." : "Creating article...",
      success: "Article saved successfully",
      error: (error) => {
        return error instanceof Error
          ? error.message
          : "An unexpected error occurred";
      },
    });

    try {
      await promise;
      setTimeout(() => {
        onSuccess?.();
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <CardHeader className="text-center py-8 bg-muted/20">
          <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
            <Newspaper className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {isEditing ? "Edit Article" : "Create New Article"}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-md mx-auto">
            {isEditing
              ? "Update article information below."
              : "Fill in the details to create a new article."}
          </CardDescription>
        </CardHeader>
      </Card>

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
                  <FormField
                    control={form.control}
                    name="title_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                          <Newspaper className="h-4 w-4 text-primary" />
                          Title (English)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Breaking news title..."
                            {...field}
                            className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                          />
                        </FormControl>
                        <FormDescription>
                          The headline of your article in English
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                          <Newspaper className="h-4 w-4 text-primary" />
                          Content (English)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your article content here..."
                            {...field}
                            value={field.value || ""}
                            className="bg-background border-input focus:border-primary transition-colors rounded-lg min-h-[200px]"
                          />
                        </FormControl>
                        <FormDescription>
                          The full article content in English
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="amharic" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title_am"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                          <Newspaper className="h-4 w-4 text-primary" />
                          Title (Amharic)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="የዜና ርዕስ..."
                            {...field}
                            className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                          />
                        </FormControl>
                        <FormDescription>
                          The headline of your article in Amharic
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content_am"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                          <Newspaper className="h-4 w-4 text-primary" />
                          Content (Amharic)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="የጽሁፍ ይዘት እዚህ ይፃፉ..."
                            {...field}
                            value={field.value || ""}
                            className="bg-background border-input focus:border-primary transition-colors rounded-lg min-h-[200px]"
                          />
                        </FormControl>
                        <FormDescription>
                          The full article content in Amharic
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                        <Tag className="h-4 w-4 text-primary" />
                        Category
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="trending">Trending</SelectItem>
                          <SelectItem value="latest">Latest</SelectItem>
                          <SelectItem value="breaking">Breaking</SelectItem>
                          <SelectItem value="analysis">Analysis</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="league_slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                        <Tag className="h-4 w-4 text-primary" />
                        League (Optional)
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                            <SelectValue placeholder="Select league" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {leagues?.map((league) => (
                            <SelectItem key={league.id} value={league.slug}>
                              {league.name_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormField
                  control={form.control}
                  name="thumbnail_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        Thumbnail URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                          value={field.value || ""}
                          className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="published_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        Publish Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                          onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                          className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                        />
                      </FormControl>
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
                      {isEditing ? "Update Article" : "Publish Article"}
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
