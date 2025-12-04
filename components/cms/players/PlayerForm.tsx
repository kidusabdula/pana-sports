"use client";

import { useEffect, useState, useRef } from "react";
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
  createPlayerInputSchema,
  updatePlayerInputSchema,
  Player,
  CreatePlayer,
  UpdatePlayer,
} from "@/lib/schemas/player";
import { useCreatePlayer, useUpdatePlayer } from "@/lib/hooks/cms/usePlayers";
import { useTeams } from "@/lib/hooks/cms/useTeams";
import {
  User,
  Globe,
  Hash,
  Calendar,
  CreditCard,
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

interface PlayerFormProps {
  player?: Player;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PlayerForm({
  player,
  onSuccess,
  onCancel,
}: PlayerFormProps) {
  const isEditing = !!player;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreatePlayer | UpdatePlayer>({
    resolver: zodResolver(
      isEditing ? updatePlayerInputSchema : createPlayerInputSchema
    ),
    defaultValues: {
      slug: player?.slug || "",
      team_id: player?.team_id || "",
      name_en: player?.name_en || "",
      name_am: player?.name_am || "",
      position_en: player?.position_en || "",
      position_am: player?.position_am || "",
      jersey_number: player?.jersey_number || undefined,
      dob: player?.dob ? new Date(player.dob).toISOString().split("T")[0] : "",
      nationality: player?.nationality || "",
      height_cm: player?.height_cm || undefined,
      weight_kg: player?.weight_kg || undefined,
      bio_en: player?.bio_en || "",
      bio_am: player?.bio_am || "",
      photo_url: player?.photo_url ?? "",
      contract_until: player?.contract_until
        ? new Date(player.contract_until).toISOString().split("T")[0]
        : "",
      market_value: player?.market_value || "",
      is_active: player?.is_active ?? true,
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

  const { data: teams } = useTeams();

  const createPlayerMutation = useCreatePlayer();
  const updatePlayerMutation = useUpdatePlayer();

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
      formData.append("bucket", "player-photos");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadedImageUrl(result.publicUrl);
        form.setValue("photo_url", result.publicUrl);
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

  const onSubmit = async (data: CreatePlayer | UpdatePlayer) => {
    const promise =
      isEditing && player
        ? updatePlayerMutation.mutateAsync({
            id: player.id,
            updates: data,
          })
        : createPlayerMutation.mutateAsync(data as CreatePlayer);

    toast.promise(promise, {
      loading: isEditing ? "Updating player..." : "Creating player...",
      success: (data) => {
        return isEditing
          ? `Player "${data.name_en}" updated successfully`
          : `Player "${data.name_en}" created successfully`;
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
            <User className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {isEditing ? "Edit Player" : "Create New Player"}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-md mx-auto">
            {isEditing
              ? "Update player information below."
              : "Fill in the details to create a new player."}
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
                            <User className="h-4 w-4 text-primary" />
                            Player Name (English)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            The official name of the player in English
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
                              placeholder="john-doe"
                              {...field}
                              className="h-11 bg-muted/50 border-input focus:border-primary transition-colors font-mono text-sm rounded-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            Unique identifier for the player (auto-generated
                            from name)
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
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <User className="h-4 w-4 text-primary" />
                            Team
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                              <SelectValue placeholder="Select a team" />
                            </SelectTrigger>
                            <SelectContent>
                              {teams?.map((team) => (
                                <SelectItem key={team.id} value={team.id}>
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
                      name="position_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <User className="h-4 w-4 text-primary" />
                            Position (English)
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                              <SelectValue placeholder="Select a position" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Goalkeeper">
                                Goalkeeper
                              </SelectItem>
                              <SelectItem value="Defender">Defender</SelectItem>
                              <SelectItem value="Midfielder">
                                Midfielder
                              </SelectItem>
                              <SelectItem value="Forward">Forward</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The player's position on the field
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="jersey_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <Hash className="h-4 w-4 text-primary" />
                            Jersey Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="10"
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
                            The player's jersey number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <Globe className="h-4 w-4 text-primary" />
                            Nationality
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ethiopian"
                              {...field}
                              className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            The player's nationality
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            Date of Birth
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            The player's date of birth
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="height_cm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <User className="h-4 w-4 text-primary" />
                            Height (cm)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="180"
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
                            The player's height in centimeters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight_kg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <User className="h-4 w-4 text-primary" />
                            Weight (kg)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="75"
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
                            The player's weight in kilograms
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="market_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <CreditCard className="h-4 w-4 text-primary" />
                            Market Value
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="$500,000"
                              {...field}
                              className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            The player's estimated market value
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FormField
                      control={form.control}
                      name="photo_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-foreground">
                            Photo URL
                          </FormLabel>
                          <div className="space-y-2">
                            <FormControl>
                              <Input
                                placeholder="https://example.com/photo.jpg"
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
                              URL to the player's photo
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
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </div>

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
                      name="contract_until"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            Contract Until
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            The player's contract end date
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bio_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-foreground">
                          <FileText className="h-4 w-4 text-primary" />
                          Biography (English)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief biography of the player..."
                            {...field}
                            className="bg-background border-input focus:border-primary transition-colors rounded-lg min-h-[120px]"
                          />
                        </FormControl>
                        <FormDescription>
                          A brief biography of the player in English
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                          Whether this player is currently active
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="amharic" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name_am"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <User className="h-4 w-4 text-primary" />
                            Player Name (Amharic)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ጆን ዶ"
                              {...field}
                              className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            The official name of the player in Amharic
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="position_am"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <User className="h-4 w-4 text-primary" />
                            Position (Amharic)
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                              <SelectValue placeholder="Select a position" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ግብርና">ግብርና</SelectItem>
                              <SelectItem value="መከላከያ">መከላከያ</SelectItem>
                              <SelectItem value="መካከለኛ">መካከለኛ</SelectItem>
                              <SelectItem value="ተላላክ">ተላላክ</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The player's position on the field in Amharic
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
                              placeholder="player-slug"
                              {...field}
                              className="h-11 bg-muted/50 border-input focus:border-primary transition-colors font-mono text-sm rounded-lg"
                            />
                          </FormControl>
                          <FormDescription>
                            Unique identifier for the player (auto-generated
                            from name)
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
                          <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                            <User className="h-4 w-4 text-primary" />
                            Team
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                              <SelectValue placeholder="Select a team" />
                            </SelectTrigger>
                            <SelectContent>
                              {teams?.map((team) => (
                                <SelectItem key={team.id} value={team.id}>
                                  {team.name_am || team.name_en}
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
                  </div>

                  <FormField
                    control={form.control}
                    name="bio_am"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-foreground">
                          <FileText className="h-4 w-4 text-primary" />
                          Biography (Amharic)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="ተጨማሪ መረጃ..."
                            {...field}
                            className="bg-background border-input focus:border-primary transition-colors rounded-lg min-h-[120px]"
                          />
                        </FormControl>
                        <FormDescription>
                          A brief biography of the player in Amharic
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                          Whether this player is currently active
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
                      {isEditing ? "Update Player" : "Create Player"}
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
