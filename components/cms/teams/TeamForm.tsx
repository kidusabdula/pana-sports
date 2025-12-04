"use client";

import { useEffect, useState, useRef } from "react";
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
  createTeamInputSchema,
  updateTeamInputSchema,
  Team,
  CreateTeam,
  UpdateTeam,
} from "@/lib/schemas/team";
import { useCreateTeam, useUpdateTeam } from "@/lib/hooks/cms/useTeams";
import { useLeagues } from "@/lib/hooks/cms/useLeagues";
import {
  Shield,
  Globe,
  Hash,
  Calendar,
  MapPin,
  FileText,
  Save,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

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

interface TeamFormProps {
  team?: Team;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TeamForm({ team, onSuccess, onCancel }: TeamFormProps) {
  const isEditing = !!team;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateTeam | UpdateTeam>({
    resolver: zodResolver(
      isEditing ? updateTeamInputSchema : createTeamInputSchema
    ),
    defaultValues: {
      slug: team?.slug || "",
      name_en: team?.name_en || "",
      name_am: team?.name_am || "",
      short_name_en: team?.short_name_en || "",
      short_name_am: team?.short_name_am || "",
      league_id: team?.league_id || "",
      logo_url: team?.logo_url ?? "",
      description_en: team?.description_en ?? "",
      description_am: team?.description_am ?? "",
      stadium_en: team?.stadium_en || "",
      stadium_am: team?.stadium_am || "",
      founded: team?.founded ? Number(team.founded) : undefined,
      is_active: team?.is_active ?? true,
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

  const { data: leagues } = useLeagues();

  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "team-logos");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadedImageUrl(result.publicUrl);
        form.setValue("logo_url", result.publicUrl);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: CreateTeam | UpdateTeam) => {
    const promise =
      isEditing && team
        ? updateTeamMutation.mutateAsync({
            id: team.id,
            updates: data,
          })
        : createTeamMutation.mutateAsync(data as CreateTeam);

    toast.promise(promise, {
      loading: isEditing ? "Updating team..." : "Creating team...",
      success: (data) => {
        return isEditing
          ? `Team "${data.name_en}" updated successfully`
          : `Team "${data.name_en}" created successfully`;
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
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Header Card */}
      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <CardHeader className="text-center py-6 sm:py-8 bg-muted/20">
          <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
            {isEditing ? "Edit Team" : "Create New Team"}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto px-4">
            {isEditing
              ? "Update team information below."
              : "Fill in the details to create a new team."}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Form Card */}
      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <Tabs defaultValue="english" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 bg-muted/50 p-1 rounded-lg">
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

                <TabsContent value="english" className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FormField
                      control={form.control}
                      name="name_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <Shield className="h-4 w-4 text-primary" />
                            Team Name (English)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Saint George"
                              {...field}
                              className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            The official name of the team in English
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="short_name_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <Shield className="h-4 w-4 text-primary" />
                            Short Name (English)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="STG"
                              {...field}
                              className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            Abbreviated name of the team in English
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                              placeholder="saint-george"
                              {...field}
                              className="h-11 bg-muted/50 border-input focus:border-primary transition-colors font-mono text-sm rounded-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            Unique identifier for the team (auto-generated from
                            name)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="league_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <Shield className="h-4 w-4 text-primary" />
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
                            The league this team belongs to
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FormField
                      control={form.control}
                      name="logo_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-foreground">
                            Logo URL
                          </FormLabel>
                          <div className="space-y-2">
                            <FormControl>
                              <Input
                                placeholder="https://example.com/logo.png"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  // Reset uploaded image URL if URL is manually changed
                                  if (
                                    e.target.value !== (uploadedImageUrl || "")
                                  ) {
                                    setUploadedImageUrl("");
                                  }
                                }}
                                className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                              />
                            </FormControl>
                            <FormDescription>
                              URL to the team&apos;s logo image
                            </FormDescription>
                            <FormMessage />
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="text-sm text-muted-foreground">
                              OR
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isUploading}
                              className="flex items-center gap-2"
                            >
                              {isUploading ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4" />
                                  Upload Image
                                </>
                              )}
                            </Button>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />

                          {uploadedImageUrl && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                              <div className="flex items-center gap-2">
                                <ImageIcon className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-800">
                                  Image uploaded successfully
                                </span>
                              </div>
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-foreground">
                            Description (English)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description of the team..."
                              {...field}
                              className="bg-background border-input focus:border-primary transition-colors rounded-lg min-h-[120px]"
                            />
                          </FormControl>
                          <FormDescription>
                            A brief description of the team in English
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stadium_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <MapPin className="h-4 w-4 text-primary" />
                            Stadium Name (English)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Addis Ababa Stadium"
                              {...field}
                              className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            The name of the team&apos;s home stadium in English
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="founded"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            Founded Year
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1935"
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
                            The year the team was founded
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="is_active"
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
                          Active
                        </FormLabel>
                        <FormDescription>
                          Whether this team is currently active
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="amharic" className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FormField
                      control={form.control}
                      name="name_am"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <Shield className="h-4 w-4 text-primary" />
                            Team Name (Amharic)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ሴንት ጆርጄ"
                              {...field}
                              className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            The official name of the team in Amharic
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="short_name_am"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <Shield className="h-4 w-4 text-primary" />
                            Short Name (Amharic)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ሴንት"
                              {...field}
                              className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            Abbreviated name of the team in Amharic
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                              placeholder="team-slug"
                              {...field}
                              className="h-11 bg-muted/50 border-input focus:border-primary transition-colors font-mono text-sm rounded-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            Unique identifier for the team (auto-generated from
                            name)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description_am"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-foreground">
                            <FileText className="h-4 w-4 text-primary" />
                            Description (Amharic)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="ቡምርቱውንት መግለጫ..."
                              {...field}
                              className="bg-background border-input focus:border-primary transition-colors rounded-lg min-h-[120px]"
                            />
                          </FormControl>
                          <FormDescription>
                            A brief description of the team in Amharic
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stadium_am"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <MapPin className="h-4 w-4 text-primary" />
                            Stadium Name (Amharic)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="አዲስ በማባ ስቲየም"
                              {...field}
                              className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            The name of the team&apos;s home stadium in Amharic
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="founded"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            Founded Year
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1935"
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
                            The year the team was founded
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="is_active"
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
                          Active
                        </FormLabel>
                        <FormDescription>
                          Whether this team is currently active
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="bg-muted/20 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-border/50">
              <div className="flex flex-col sm:flex-row justify-between w-full gap-3 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="h-10 sm:h-11 px-4 sm:px-6 hover:bg-muted transition-colors rounded-lg w-full sm:w-auto"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="h-10 sm:h-11 px-4 sm:px-6 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg w-full sm:w-auto"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isEditing ? "Update Team" : "Create Team"}
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