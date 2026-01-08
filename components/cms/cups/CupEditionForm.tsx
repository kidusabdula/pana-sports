"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cupEditionCreateSchema, CupEditionCreate } from "@/lib/schemas/cup";
import { CupEdition } from "@/lib/types/cup";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAdminSeasons } from "@/lib/hooks/cms/useSeasons";
import { Loader2, PlusCircle, Save } from "lucide-react";

interface CupEditionFormProps {
  cupId: string;
  initialData?: CupEdition;
  onSubmit: (data: CupEditionCreate) => void;
  isPending: boolean;
  onCancel?: () => void;
}

export function CupEditionForm({
  cupId,
  initialData,
  onSubmit,
  isPending,
  onCancel,
}: CupEditionFormProps) {
  const { data: seasons, isLoading: seasonsLoading } = useAdminSeasons();

  const form = useForm<CupEditionCreate>({
    resolver: zodResolver(cupEditionCreateSchema) as any,
    defaultValues: initialData
      ? {
          cup_id: initialData.cup_id,
          season_id: initialData.season_id,
          name: initialData.name,
          start_date: initialData.start_date || "",
          end_date: initialData.end_date || "",
          status: initialData.status,
          total_teams: initialData.total_teams,
          has_group_stage: initialData.has_group_stage,
          groups_count: initialData.groups_count,
        }
      : {
          cup_id: cupId,
          season_id: "",
          name: "",
          status: "upcoming",
          total_teams: 0,
          has_group_stage: false,
          groups_count: 0,
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Edition Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Ethiopian Cup 2024/25"
                  className="bg-background border-border"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The title for this specific year&apos;s competition.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="season_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Season</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue
                        placeholder={
                          seasonsLoading ? "Loading..." : "Select season"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card border-border text-foreground">
                    {seasons?.map((season) => (
                      <SelectItem key={season.id} value={season.id}>
                        {season.name}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/20 rounded-xl border border-border/50">
          <FormField
            control={form.control}
            name="has_group_stage"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3 bg-background/30">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">Group Stage</FormLabel>
                  <FormDescription className="text-[10px]">
                    Does it have groups?
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

          {form.watch("has_group_stage") && (
            <FormField
              control={form.control}
              name="groups_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Number of Groups</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="bg-background border-border h-9"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="total_teams"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Total Teams</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-background border-border"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending} className="px-6">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : initialData ? (
              <Save className="mr-2 h-4 w-4" />
            ) : (
              <PlusCircle className="mr-2 h-4 w-4" />
            )}
            {initialData ? "Apply Changes" : "Launch Edition"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
