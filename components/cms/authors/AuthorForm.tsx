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
import { Textarea } from "@/components/ui/textarea";
import {
  createAuthorInputSchema,
  updateAuthorInputSchema,
  Author,
  CreateAuthor,
  UpdateAuthor,
} from "@/lib/schemas/author";
import { useCreateAuthor, useUpdateAuthor } from "@/lib/hooks/cms/useAuthors";
import { User, Globe, Save, X, Image as ImageIcon } from "lucide-react";

interface AuthorFormProps {
  author?: Author;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AuthorForm({
  author,
  onSuccess,
  onCancel,
}: AuthorFormProps) {
  const isEditing = !!author;

  const form = useForm<CreateAuthor | UpdateAuthor>({
    resolver: zodResolver(
      isEditing ? updateAuthorInputSchema : createAuthorInputSchema
    ) as any,
    defaultValues: {
      name: author?.name || "",
      bio_en: author?.bio_en || "",
      bio_am: author?.bio_am || "",
      avatar_url: author?.avatar_url || "",
    },
  });

  const createAuthorMutation = useCreateAuthor();
  const updateAuthorMutation = useUpdateAuthor();

  const onSubmit = async (data: CreateAuthor | UpdateAuthor) => {
    const promise =
      isEditing && author
        ? updateAuthorMutation.mutateAsync({
            id: author.id,
            updates: data,
          })
        : createAuthorMutation.mutateAsync(data as CreateAuthor);

    toast.promise(promise, {
      loading: isEditing ? "Updating author..." : "Creating author...",
      success: "Author saved successfully",
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
            <User className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {isEditing ? "Edit Author" : "Create New Author"}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-md mx-auto">
            {isEditing
              ? "Update author information below."
              : "Fill in the details to create a new author."}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-8 space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                      <User className="h-4 w-4 text-primary" />
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Author name"
                        {...field}
                        className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                      />
                    </FormControl>
                    <FormDescription>
                      The full name of the author
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatar_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      Avatar URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/avatar.jpg"
                        {...field}
                        value={field.value || ""}
                        className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                      />
                    </FormControl>
                    <FormDescription>
                      URL to the author's profile picture
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Tabs defaultValue="english" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1 rounded-lg">
                  <TabsTrigger
                    value="english"
                    className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    English Bio
                  </TabsTrigger>
                  <TabsTrigger
                    value="amharic"
                    className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Amharic Bio
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="english">
                  <FormField
                    control={form.control}
                    name="bio_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                          Bio (English)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write author bio in English..."
                            {...field}
                            value={field.value || ""}
                            className="bg-background border-input focus:border-primary transition-colors rounded-lg min-h-[150px]"
                          />
                        </FormControl>
                        <FormDescription>
                          A brief biography of the author in English
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="amharic">
                  <FormField
                    control={form.control}
                    name="bio_am"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                          Bio (Amharic)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="የደራሲ ባዮግራፊ በአማርኛ..."
                            {...field}
                            value={field.value || ""}
                            className="bg-background border-input focus:border-primary transition-colors rounded-lg min-h-[150px]"
                          />
                        </FormControl>
                        <FormDescription>
                          A brief biography of the author in Amharic
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
                      {isEditing ? "Update Author" : "Create Author"}
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
