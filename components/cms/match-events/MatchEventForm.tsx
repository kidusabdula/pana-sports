// "use client";

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   createMatchEventInputSchema,
//   updateMatchEventInputSchema,
//   MatchEvent,
//   CreateMatchEvent,
//   UpdateMatchEvent,
// } from "@/lib/schemas/matchEvent";
// import {
//   useCreateMatchEvent,
//   useUpdateMatchEvent,
// } from "@/lib/hooks/cms/useMatchEvents";
// import { usePlayers } from "@/lib/hooks/cms/usePlayers";
// import { useTeams } from "@/lib/hooks/cms/useTeams";
// import { useMatches } from "@/lib/hooks/cms/useMatches";
// import {
//   Calendar,
//   Hash,
//   Save,
//   X,
//   Goal,
//   Shirt,
//   Clock,
//   FileText,
// } from "lucide-react";

// interface MatchEventFormProps {
//   matchEvent?: MatchEvent;
//   onSuccess?: () => void;
//   onCancel?: () => void;
// }

// export default function MatchEventForm({
//   matchEvent,
//   onSuccess,
//   onCancel,
// }: MatchEventFormProps) {
//   const isEditing = !!matchEvent;

//   // Fetch matches and players for dropdowns
//   const { data: matches } = useMatches();
//   const { data: players } = usePlayers();
//   const { data: teams } = useTeams();

//   const form = useForm<CreateMatchEvent | UpdateMatchEvent>({
//     resolver: zodResolver(
//       isEditing ? updateMatchEventInputSchema : createMatchEventInputSchema
//     ),
//     defaultValues: {
//       match_id: matchEvent?.match_id || "",
//       minute: matchEvent?.minute || 0,
//       type: matchEvent?.type || "goal",
//       player_slug: matchEvent?.player_slug || "",
//       team_slug: matchEvent?.team_slug || "",
//       description_en: matchEvent?.description_en || "",
//       description_am: matchEvent?.description_am || "",
//     },
//   });

//   const createMatchEventMutation = useCreateMatchEvent();
//   const updateMatchEventMutation = useUpdateMatchEvent();

//   const onSubmit = async (data: CreateMatchEvent | UpdateMatchEvent) => {
//     const promise =
//       isEditing && matchEvent
//         ? updateMatchEventMutation.mutateAsync({
//             id: matchEvent.id,
//             updates: data,
//           })
//         : createMatchEventMutation.mutateAsync(data as CreateMatchEvent);

//     toast.promise(promise, {
//       loading: isEditing
//         ? "Updating match event..."
//         : "Creating match event...",
//       success: (data) => {
//         return isEditing
//           ? `Match event updated successfully`
//           : `Match event created successfully`;
//       },
//       error: (error) => {
//         return error instanceof Error
//           ? error.message
//           : "An unexpected error occurred";
//       },
//     });

//     try {
//       await promise;
//       // Small delay to ensure the toast is visible before redirecting
//       setTimeout(() => {
//         onSuccess?.();
//       }, 500);
//     } catch (error) {
//       // Error is handled by toast.promise
//       console.error(error);
//     }
//   };

//   const eventTypeOptions = [
//     { value: "goal", label: "Goal", icon: "⚽" },
//     { value: "yellow", label: "Yellow Card", icon: "🟨" },
//     { value: "red", label: "Red Card", icon: "🟥" },
//     { value: "sub", label: "Substitution", icon: "🔄" },
//     { value: "assist", label: "Assist", icon: "🎯" },
//     { value: "own_goal", label: "Own Goal", icon: "😅" },
//     { value: "penalty", label: "Penalty", icon: "⚽" },
//   ];

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* Header Card */}
//       <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
//         <CardHeader className="text-center py-8 bg-muted/20">
//           <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
//             <Calendar className="h-8 w-8 text-primary" />
//           </div>
//           <CardTitle className="text-2xl font-bold text-foreground">
//             {isEditing ? "Edit Match Event" : "Create New Match Event"}
//           </CardTitle>
//           <CardDescription className="text-base text-muted-foreground max-w-md mx-auto">
//             {isEditing
//               ? "Update match event information below."
//               : "Record a new match event like goal, card, or substitution."}
//           </CardDescription>
//         </CardHeader>
//       </Card>

//       {/* Form Card */}
//       <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)}>
//             <CardContent className="p-8">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField
//                   control={form.control}
//                   name="match_id"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="flex items-center gap-2 font-medium text-foreground">
//                         <Calendar className="h-4 w-4 text-primary" />
//                         Match
//                       </FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
//                             <SelectValue placeholder="Select a match" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {matches?.map((match) => (
//                             <SelectItem key={match.id} value={match.id}>
//                               {match.home_team_slug} vs {match.away_team_slug}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormDescription>
//                         Select the match this event belongs to
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="minute"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="flex items-center gap-2 font-medium text-foreground">
//                         <Clock className="h-4 w-4 text-primary" />
//                         Minute
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           placeholder="45"
//                           {...field}
//                           onChange={(e) =>
//                             field.onChange(
//                               e.target.value
//                                 ? parseInt(e.target.value)
//                                 : undefined
//                             )
//                           }
//                           className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg"
//                         />
//                       </FormControl>
//                       <FormDescription>
//                         The minute when the event occurred (0-120)
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField
//                   control={form.control}
//                   name="type"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="flex items-center gap-2 font-medium text-foreground">
//                         <Goal className="h-4 w-4 text-primary" />
//                         Event Type
//                       </FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
//                             <SelectValue placeholder="Select event type" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {eventTypeOptions.map((type) => (
//                             <SelectItem key={type.value} value={type.value}>
//                               <div className="flex items-center gap-2">
//                                 <span>{type.icon}</span>
//                                 <span>{type.label}</span>
//                               </div>
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormDescription>The type of match event</FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="player_slug"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="flex items-center gap-2 font-medium text-foreground">
//                         <Shirt className="h-4 w-4 text-primary" />
//                         Player
//                       </FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
//                             <SelectValue placeholder="Select a player" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {players?.map((player) => (
//                             <SelectItem key={player.slug} value={player.slug}>
//                               {player.name_en}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormDescription>
//                         The player involved in this event
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField
//                   control={form.control}
//                   name="team_slug"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="flex items-center gap-2 font-medium text-foreground">
//                         <Shirt className="h-4 w-4 text-primary" />
//                         Team
//                       </FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger className="h-11 bg-background border-input focus:border-primary transition-colors rounded-lg">
//                             <SelectValue placeholder="Select a team" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {teams?.map((team) => (
//                             <SelectItem key={team.slug} value={team.slug}>
//                               {team.name_en}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormDescription>
//                         The team involved in this event
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="description_en"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="flex items-center gap-2 font-medium text-foreground">
//                         <FileText className="h-4 w-4 text-primary" />
//                         Description (English)
//                       </FormLabel>
//                       <FormControl>
//                         <Textarea
//                           placeholder="Brief description of the event..."
//                           {...field}
//                           className="bg-background border-input focus:border-primary transition-colors rounded-lg min-h-[120px]"
//                         />
//                       </FormControl>
//                       <FormDescription>
//                         A brief description of the event in English
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="description_am"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="flex items-center gap-2 font-medium text-foreground">
//                       <FileText className="h-4 w-4 text-primary" />
//                       Description (Amharic)
//                     </FormLabel>
//                     <FormControl>
//                       <Textarea
//                         placeholder="ተንት የቡዣንት መግለጫ..."
//                         {...field}
//                         className="bg-background border-input focus:border-primary transition-colors rounded-lg min-h-[120px]"
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       A brief description of the event in Amharic
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </CardContent>

//             <CardFooter className="bg-muted/20 px-8 py-6 border-t border-border/50">
//               <div className="flex justify-between w-full">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={onCancel}
//                   className="h-11 px-6 hover:bg-muted transition-colors rounded-lg"
//                 >
//                   <X className="mr-2 h-4 w-4" />
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   disabled={form.formState.isSubmitting}
//                   className="h-11 px-6 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
//                 >
//                   {form.formState.isSubmitting ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="mr-2 h-4 w-4" />
//                       {isEditing ? "Update Event" : "Create Event"}
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </CardFooter>
//           </form>
//         </Form>
//       </Card>
//     </div>
//   );
// }
