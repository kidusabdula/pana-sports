// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { format } from "date-fns";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import {
//   useMatchEvents,
//   useDeleteMatchEvent,
// } from "@/lib/hooks/cms/useMatchEvents";
// import { useMatches } from "@/lib/hooks/cms/useMatches";
// import { usePlayers } from "@/lib/hooks/cms/usePlayers";
// import { useTeams } from "@/lib/hooks/cms/useTeams";
// import {
//   Edit,
//   Trash2,
//   Plus,
//   Search,
//   Calendar,
//   Filter,
//   ChevronDown,
//   Clock,
// } from "lucide-react";
// import { toast } from "sonner";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export default function MatchEventTable() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterMatch, setFilterMatch] = useState("all");
//   const [filterType, setFilterType] = useState("all");
//   const { data: matchEvents, isLoading, error } = useMatchEvents();
//   const { data: matches } = useMatches();
//   const { data: players } = usePlayers();
//   const { data: teams } = useTeams();
//   const deleteMatchEventMutation = useDeleteMatchEvent();

//   const filteredMatchEvents =
//     matchEvents?.filter((event) => {
//       const matchesSearch =
//         event.description_en
//           ?.toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         (event.description_am?.toLowerCase() ?? "").includes(
//           searchTerm.toLowerCase()
//         );

//       const matchesMatch =
//         filterMatch === "all" || event.match_id === filterMatch;

//       const matchesType = filterType === "all" || event.type === filterType;

//       return matchesSearch && matchesMatch && matchesType;
//     }) || [];

//   const handleDelete = async (id: string, description: string) => {
//     const promise = deleteMatchEventMutation.mutateAsync(id);

//     toast.promise(promise, {
//       loading: `Deleting event...`,
//       success: `Match event deleted successfully`,
//       error: (error) => {
//         return error instanceof Error
//           ? error.message
//           : "Failed to delete match event";
//       },
//     });

//     try {
//       await promise;
//     } catch (error) {
//       // Error is handled by toast.promise
//       console.error(error);
//     }
//   };

//   const getEventTypeBadge = (type: string) => {
//     const typeConfig = {
//       goal: { label: "Goal", variant: "default" as const },
//       yellow: { label: "Yellow Card", variant: "secondary" as const },
//       red: { label: "Red Card", variant: "destructive" as const },
//       sub: { label: "Substitution", variant: "outline" as const },
//       assist: { label: "Assist", variant: "default" as const },
//       own_goal: { label: "Own Goal", variant: "secondary" as const },
//       penalty: { label: "Penalty", variant: "default" as const },
//     };

//     return (
//       typeConfig[type as keyof typeof typeConfig] || {
//         label: type,
//         variant: "outline" as const,
//       }
//     );
//   };

//   if (isLoading)
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     );

//   if (error)
//     return (
//       <Card className="border-destructive/50 bg-destructive/5">
//         <CardContent className="p-6">
//           <div className="flex items-center space-x-2 text-destructive">
//             <Calendar className="h-5 w-5" />
//             <span>
//               Error loading match events:{" "}
//               {error instanceof Error ? error.message : "Unknown error"}
//             </span>
//           </div>
//         </CardContent>
//       </Card>
//     );

//   return (
//     <div className="space-y-6">
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Total Events
//                 </p>
//                 <p className="text-3xl font-bold text-foreground mt-1">
//                   {matchEvents?.length || 0}
//                 </p>
//               </div>
//               <div className="p-3 bg-primary/10 rounded-full">
//                 <Calendar className="h-6 w-6 text-primary" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Goals
//                 </p>
//                 <p className="text-3xl font-bold text-foreground mt-1">
//                   {matchEvents?.filter((e) => e.type === "goal").length || 0}
//                 </p>
//               </div>
//               <div className="p-3 bg-blue-500/10 rounded-full">
//                 <span className="text-blue-500 font-bold">⚽</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 border-yellow-500/20">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Cards
//                 </p>
//                 <p className="text-3xl font-bold text-foreground mt-1">
//                   {matchEvents?.filter(
//                     (e) => e.type === "yellow" || e.type === "red"
//                   ).length || 0}
//                 </p>
//               </div>
//               <div className="p-3 bg-yellow-500/10 rounded-full">
//                 <span className="text-yellow-600 font-bold">🟨</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Today
//                 </p>
//                 <p className="text-3xl font-bold text-foreground mt-1">
//                   {matchEvents?.filter((e) => {
//                     const eventDate = new Date(e.created_at);
//                     const today = new Date();
//                     return eventDate.toDateString() === today.toDateString();
//                   }).length || 0}
//                 </p>
//               </div>
//               <div className="p-3 bg-green-500/10 rounded-full">
//                 <Clock className="h-6 w-6 text-green-500" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Main Content Card */}
//       <Card className="shadow-sm border border-border/50 bg-card rounded-xl overflow-hidden">
//         <CardHeader className="bg-background/50 border-b border-border/50 px-6 py-4">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
//                 Match Events ({matchEvents?.length || 0})
//               </CardTitle>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-9 h-9 bg-background border-input focus:border-primary w-64 rounded-lg transition-all"
//                 />
//               </div>
//               <Select value={filterMatch} onValueChange={setFilterMatch}>
//                 <SelectTrigger className="h-9 w-40">
//                   <SelectValue placeholder="Filter by match" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Matches</SelectItem>
//                   {matches?.map((match) => (
//                     <SelectItem key={match.id} value={match.id}>
//                       {match.home_team_slug} vs {match.away_team_slug}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Select value={filterType} onValueChange={setFilterType}>
//                 <SelectTrigger className="h-9 w-40">
//                   <SelectValue placeholder="Filter by type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Types</SelectItem>
//                   <SelectItem value="goal">Goals</SelectItem>
//                   <SelectItem value="yellow">Yellow Cards</SelectItem>
//                   <SelectItem value="red">Red Cards</SelectItem>
//                   <SelectItem value="sub">Substitutions</SelectItem>
//                   <SelectItem value="assist">Assists</SelectItem>
//                   <SelectItem value="own_goal">Own Goals</SelectItem>
//                   <SelectItem value="penalty">Penalties</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Link href="/cms/match-events/create">
//                 <Button size="sm" className="h-9 gap-2 rounded-lg shadow-sm">
//                   <Plus className="h-4 w-4" />
//                   Add Event
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </CardHeader>

//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader className="bg-muted/30">
//               <TableRow className="hover:bg-transparent border-b border-border/50">
//                 <TableHead className="w-12 pl-6">
//                   <input
//                     type="checkbox"
//                     className="rounded border-muted-foreground/30 text-primary focus:ring-primary"
//                   />
//                 </TableHead>
//                 <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
//                   Match
//                 </TableHead>
//                 <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
//                   Type
//                 </TableHead>
//                 <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
//                   Player
//                 </TableHead>
//                 <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
//                   Team
//                 </TableHead>
//                 <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
//                   Minute
//                 </TableHead>
//                 <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
//                   Created Date
//                 </TableHead>
//                 <TableHead className="text-right font-medium text-muted-foreground text-xs uppercase tracking-wider pr-6">
//                   Action
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredMatchEvents.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} className="text-center py-12">
//                     <div className="flex flex-col items-center space-y-3">
//                       <Calendar className="h-12 w-12 text-muted-foreground/20" />
//                       <p className="text-muted-foreground">
//                         No match events found.
//                       </p>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredMatchEvents.map((event) => (
//                   <TableRow
//                     key={event.id}
//                     className="hover:bg-muted/30 transition-colors border-b border-border/40"
//                   >
//                     <TableCell className="pl-6">
//                       <input
//                         type="checkbox"
//                         className="rounded border-muted-foreground/30 text-primary focus:ring-primary"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <span className="text-sm text-foreground">
//                         {
//                           matches?.find((m) => m.id === event.match_id)
//                             ?.home_team_slug
//                         }{" "}
//                         vs{" "}
//                         {
//                           matches?.find((m) => m.id === event.match_id)
//                             ?.away_team_slug
//                         }
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         variant={getEventTypeBadge(event.type).variant}
//                         className="text-xs"
//                       >
//                         {getEventTypeBadge(event.type).label}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <span className="text-sm text-foreground">
//                         {players?.find((p) => p.slug === event.player_slug)
//                           ?.name_en || "N/A"}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <span className="text-sm text-foreground">
//                         {teams?.find((t) => t.slug === event.team_slug)
//                           ?.name_en || "N/A"}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <span className="text-sm text-foreground">
//                         {event.minute}'
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <span className="text-sm text-muted-foreground">
//                         {format(
//                           new Date(event.created_at),
//                           "MMM dd, yyyy HH:mm"
//                         )}
//                       </span>
//                     </TableCell>
//                     <TableCell className="text-right pr-6">
//                       <div className="flex items-center justify-end gap-1">
//                         <Link href={`/cms/match-events/${event.id}/edit`}>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                         </Link>

//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>
//                                 Delete Match Event
//                               </AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 Are you sure you want to delete this match
//                                 event? This action cannot be undone.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>Cancel</AlertDialogCancel>
//                               <AlertDialogAction
//                                 onClick={() =>
//                                   handleDelete(
//                                     event.id,
//                                     event.description_en || "Match event"
//                                   )
//                                 }
//                                 className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                               >
//                                 Delete
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Pagination Info */}
//         <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-background/50">
//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <span>Show</span>
//             <Select defaultValue="10">
//               <SelectTrigger className="h-8 w-16">
//                 <SelectValue placeholder="10" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="10">10</SelectItem>
//                 <SelectItem value="20">20</SelectItem>
//                 <SelectItem value="50">50</SelectItem>
//               </SelectContent>
//             </Select>
//             <span>events per page</span>
//           </div>

//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               size="icon"
//               className="h-8 w-8 rounded-lg"
//               disabled
//             >
//               <span className="sr-only">Previous</span>
//               <ChevronDown className="h-4 w-4 rotate-90" />
//             </Button>
//             <div className="flex items-center gap-1">
//               <Button
//                 variant="default"
//                 size="sm"
//                 className="h-8 w-8 rounded-lg p-0"
//               >
//                 1
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="h-8 w-8 rounded-lg p-0"
//               >
//                 2
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="h-8 w-8 rounded-lg p-0"
//               >
//                 3
//               </Button>
//               <span className="text-muted-foreground px-1">...</span>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="h-8 w-8 rounded-lg p-0"
//               >
//                 12
//               </Button>
//             </div>
//             <Button
//               variant="outline"
//               size="icon"
//               className="h-8 w-8 rounded-lg"
//               disabled
//             >
//               <span className="sr-only">Next</span>
//               <ChevronDown className="h-4 w-4 -rotate-90" />
//             </Button>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }
