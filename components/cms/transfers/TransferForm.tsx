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
  createTransferInputSchema,
  updateTransferInputSchema,
  Transfer,
  CreateTransfer,
  UpdateTransfer,
} from "@/lib/schemas/transfer";
import { useCreateTransfer, useUpdateTransfer } from "@/lib/hooks/useTransfers";
import { useTeams } from "@/lib/hooks/useTeams";
import { usePlayers } from "@/lib/hooks/usePlayers";
import {
  ArrowRightLeft,
  Globe,
  Save,
  X,
  Calendar,
  DollarSign,
  User,
} from "lucide-react";

interface TransferFormProps {
  transfer?: Transfer;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TransferForm({ transfer, onSuccess, onCancel }: TransferFormProps) {
  const isEditing = !!transfer;
  const { data: teams } = useTeams();
  const { data: players } = usePlayers();

  const form = useForm<CreateTransfer | UpdateTransfer>({
    resolver: zodResolver(
      isEditing ? updateTransferInputSchema : createTransferInputSchema
    ) as any,
    defaultValues: {
      player_slug: transfer?.player_slug || "",
      from_team_slug: transfer?.from_team_slug || "",
      to_team_slug: transfer?.to_team_slug || "",
      date: transfer?.date || new Date().toISOString().split('T')[0],
      fee: transfer?.fee || "",
      notes_en: transfer?.notes_en || "",
      notes_am: transfer?.notes_am || "",
    },
  });

  const createTransferMutation = useCreateTransfer();
  const updateTransferMutation = useUpdateTransfer();

  const onSubmit = async (data: CreateTransfer | UpdateTransfer) => {
    const promise =
      isEditing && transfer
        ? updateTransferMutation.mutateAsync({
            id: transfer.id,
            updates: data,
          })
        : createTransferMutation.mutateAsync(data as CreateTransfer);

    toast.promise(promise, {
      loading: isEditing ? "Updating transfer..." : "Creating transfer...",
      success: "Transfer saved successfully",
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
            <ArrowRightLeft className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {isEditing ? "Edit Transfer" : "Record New Transfer"}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-md mx-auto">
            {isEditing
              ? "Update transfer details below."
              : "Record a new player transfer."}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-8 space-y-6">
              <FormField
                control={form.control}
                name="player_slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                      <User className="h-4 w-4 text-primary" />
                      Player
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                          <SelectValue placeholder="Select player" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {players?.map((player) => (
                          <SelectItem key={player.id} value={player.slug}>
                            {player.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The player being transferred
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="from_team_slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                        From Team (Optional)
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === "free-agent" ? "" : value)}
                        defaultValue={field.value || "free-agent"}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                            <SelectValue placeholder="Free agent" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="free-agent">Free Agent</SelectItem>
                          {teams?.map((team) => (
                            <SelectItem key={team.id} value={team.slug}>
                              {team.name_en}
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
                  name="to_team_slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                        To Team
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
                            <SelectValue placeholder="Select destination team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teams?.map((team) => (
                            <SelectItem key={team.id} value={team.slug}>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        Transfer Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium text-foreground">
                        <DollarSign className="h-4 w-4 text-primary" />
                        Transfer Fee (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. $5M, Free"
                          {...field}
                          value={field.value || ""}
                          className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Tabs defaultValue="english" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1 rounded-lg">
                  <TabsTrigger
                    value="english"
                    className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    English Notes
                  </TabsTrigger>
                  <TabsTrigger
                    value="amharic"
                    className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Amharic Notes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="english">
                  <FormField
                    control={form.control}
                    name="notes_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (English)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional notes about the transfer..."
                            {...field}
                            value={field.value || ""}
                            className="bg-background border-input focus:border-primary transition-colors rounded-lg min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="amharic">
                  <FormField
                    control={form.control}
                    name="notes_am"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Amharic)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="ስለ ዝውውሩ ተጨማሪ ማስታወሻዎች..."
                            {...field}
                            value={field.value || ""}
                            className="bg-background border-input focus:border-primary transition-colors rounded-lg min-h-[100px]"
                          />
                        </FormControl>
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
                      {isEditing ? "Update Transfer" : "Record Transfer"}
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
