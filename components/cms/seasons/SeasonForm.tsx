// components/cms/seasons/SeasonForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { seasonCreateSchema, SeasonCreate, Season } from "@/lib/schemas/season";
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
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface SeasonFormProps {
  initialData?: Season;
  onSubmit: (data: SeasonCreate) => void;
  isLoading?: boolean;
}

export function SeasonForm({
  initialData,
  onSubmit,
  isLoading,
}: SeasonFormProps) {
  const form = useForm<SeasonCreate>({
    resolver: zodResolver(seasonCreateSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      start_date: initialData?.start_date?.split("T")[0] || "",
      end_date: initialData?.end_date?.split("T")[0] || "",
      is_current: initialData?.is_current || false,
      is_archived: initialData?.is_archived || false,
      description_en: initialData?.description_en || "",
      description_am: initialData?.description_am || "",
    },
  });

  const nameValue = form.watch("name");

  // Auto-generate slug from name if it's a new season
  useEffect(() => {
    if (!initialData && nameValue) {
      const slug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9/]/g, "-")
        .replace(/\//g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [nameValue, initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Season Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 2024/25" {...field} />
                </FormControl>
                <FormDescription>
                  The display name for the season.
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
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 2024-25" {...field} />
                </FormControl>
                <FormDescription>
                  Unique identifier used in URLs.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="is_current"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Current Season</FormLabel>
                  <FormDescription>
                    Mark this as the active season for the site.
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

          <FormField
            control={form.control}
            name="is_archived"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Archived</FormLabel>
                  <FormDescription>
                    Archive seasons to prevent editing history.
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
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="description_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (English)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of the season..."
                    className="min-h-[100px]"
                    {...field}
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
                <FormLabel>Description (Amharic)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="የውድድር ዓመቱ አጭር መግለጫ..."
                    className="min-h-[100px] text-right"
                    dir="rtl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Season" : "Create Season"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
