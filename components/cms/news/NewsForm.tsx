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
import { TiptapEditor } from "@/components/ui/tiptap-editor";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import {
  createNewsInputSchema,
  updateNewsInputSchema,
  News,
  CreateNews,
  UpdateNews,
} from "@/lib/schemas/news";
import { useCreateNews, useUpdateNews } from "@/lib/hooks/cms/useNews";
import { useLeagues } from "@/lib/hooks/cms/useLeagues";
import { useNewsCategories } from "@/lib/hooks/cms/useNewsCategories";
import { useAuthors } from "@/lib/hooks/cms/useAuthors";
import {
  Newspaper,
  Globe,
  Save,
  X,
  Image as ImageIcon,
  Calendar,
  Tag,
  User,
  Star,
} from "lucide-react";
import { useEffect } from "react";

interface NewsFormProps {
  news?: News;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function NewsForm({ news, onSuccess, onCancel }: NewsFormProps) {
  const isEditing = !!news;
  const { data: leagues } = useLeagues();
  const { data: categories } = useNewsCategories();
  const { data: authors } = useAuthors();

  const form = useForm<CreateNews | UpdateNews>({
    resolver: zodResolver(
      isEditing ? updateNewsInputSchema : createNewsInputSchema
    ),
    defaultValues: {
      title_en: news?.title_en || "",
      title_am: news?.title_am || "",
      content_en: news?.content_en || "",
      content_am: news?.content_am || "",
      excerpt_en: news?.excerpt_en || "",
      excerpt_am: news?.excerpt_am || "",
      thumbnail_url: news?.thumbnail_url || "",
      category_id: news?.category_id || undefined, // Changed from "" to undefined
      league_id: news?.league_id || undefined, // Changed from "" to undefined
      author_id: news?.author_id || undefined, // Changed from "" to undefined
      tags: news?.tags || [],
      is_featured: news?.is_featured || false,
      is_published: news?.is_published || false,
      published_at: news?.published_at || new Date().toISOString(),
    },
  });

  // Add debugging to see what's happening
  useEffect(() => {
    console.log("Form errors:", form.formState.errors);
    const subscription = form.watch((value, { name, type }) => {
      console.log("Form watch:", { name, type, value });
    });
    return () => subscription.unsubscribe();
  }, [form.watch, form.formState.errors]);

  const createNewsMutation = useCreateNews();
  const updateNewsMutation = useUpdateNews();

  const onSubmit = async (data: CreateNews | UpdateNews) => {
    console.log("Form submitted with data:", data); // Debug log

    // Remove any undefined values that might cause issues
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    // Set published_at if publishing and not already set
    if (cleanedData.is_published && !cleanedData.published_at) {
      cleanedData.published_at = new Date().toISOString();
    }

    const promise =
      isEditing && news
        ? updateNewsMutation.mutateAsync({
            id: news.id,
            updates: cleanedData,
          })
        : createNewsMutation.mutateAsync(cleanedData as CreateNews);

    toast.promise(promise, {
      loading: isEditing ? "Updating article..." : "Creating article...",
      success: (data) => {
        return isEditing
          ? `Article "${data.title_en}" updated successfully`
          : `Article "${data.title_en}" created successfully`;
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
                    name="excerpt_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                          <Newspaper className="h-4 w-4 text-primary" />
                          Excerpt (English)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Brief summary of the article..."
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                            className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                          />
                        </FormControl>
                        <FormDescription>
                          A short summary of your article in English
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
                          <TiptapEditor
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Write your article content here..."
                            className="bg-background border-input focus:border-primary transition-colors rounded-lg"
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
                    name="excerpt_am"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                          <Newspaper className="h-4 w-4 text-primary" />
                          Excerpt (Amharic)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="የጽሁፍ ማጠቃለያ..."
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                            className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                          />
                        </FormControl>
                        <FormDescription>
                          A short summary of your article in Amharic
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
                          <TiptapEditor
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="የጽሁፍ ይዘት እዚህ ይፃፉ..."
                            className="bg-background border-input focus:border-primary transition-colors rounded-lg"
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
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                        <Tag className="h-4 w-4 text-primary" />
                        Category
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        defaultValue={field.value || undefined} // Fixed: use undefined instead of empty string
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                        <User className="h-4 w-4 text-primary" />
                        Author
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        defaultValue={field.value || undefined} // Fixed: use undefined instead of empty string
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                            <SelectValue placeholder="Select author" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {authors?.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              {author.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="league_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                      <Tag className="h-4 w-4 text-primary" />
                      League (Optional)
                    </FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "none" ? undefined : value)
                      }
                      value={field.value || "none"}
                      defaultValue={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                          <SelectValue placeholder="Select league" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {leagues?.map((league) => (
                          <SelectItem key={league.id} value={league.id}>
                            {league.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnail_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      Thumbnail Image
                    </FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload an image or provide a URL for article thumbnail
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          value={
                            field.value
                              ? new Date(field.value).toISOString().slice(0, 16)
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              new Date(e.target.value).toISOString()
                            )
                          }
                          className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <Star className="h-4 w-4 text-primary" />
                            Featured Article
                          </FormLabel>
                          <FormDescription>
                            Display this article in featured sections
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-medium text-foreground">
                            Published
                          </FormLabel>
                          <FormDescription>
                            Make this article visible to the public
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                  type="submit" // Explicitly set type to submit
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
                      {isEditing ? "Update Article" : "Create Article"}
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
