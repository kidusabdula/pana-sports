"use client";

import {
  useCupGroups,
  useCreateCupGroup,
  useAddTeamToGroup,
  useRemoveTeamFromGroup,
} from "@/lib/hooks/cms/useCups";
import { useTeams } from "@/lib/hooks/cms/useTeams";
import { Button } from "@/components/ui/button";
import { Plus, Users, Loader2, Trophy, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface CupGroupManagerProps {
  editionId: string;
}

export function CupGroupManager({ editionId }: CupGroupManagerProps) {
  const { data: groups, isLoading } = useCupGroups(editionId);
  const { mutate: createGroup, isPending: isCreating } = useCreateCupGroup();
  const { mutate: addTeam } = useAddTeamToGroup();
  const { mutate: removeTeam } = useRemoveTeamFromGroup();
  const { data: allTeams } = useTeams();

  const [newGroupName, setNewGroupName] = useState("");
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    createGroup(
      { cup_edition_id: editionId, name: newGroupName },
      {
        onSuccess: () => {
          toast.success(`Group "${newGroupName}" created`);
          setNewGroupName("");
          setIsAddGroupOpen(false);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleAddTeam = (groupId: string, teamId: string) => {
    addTeam(
      { cup_group_id: groupId, team_id: teamId, cup_edition_id: editionId },
      {
        onSuccess: () => toast.success("Team added to group"),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleRemoveTeam = (groupId: string, teamId: string) => {
    removeTeam(
      { cup_group_id: groupId, team_id: teamId, cup_edition_id: editionId },
      {
        onSuccess: () => toast.success("Team removed from group"),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-muted/40 p-4 rounded-2xl border border-border">
        <div>
          <h3 className="text-xl font-bold tracking-tight uppercase italic flex items-center gap-2 text-foreground">
            <Users className="h-5 w-5 text-primary" />
            Group Stages
          </h3>
          <p className="text-xs text-muted-foreground font-medium">
            Manage groups and team placements.
          </p>
        </div>
        <Dialog open={isAddGroupOpen} onOpenChange={setIsAddGroupOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4 mr-2" />
              Add Group
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border text-foreground">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="e.g. Group A"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="bg-background border-border h-11"
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsAddGroupOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGroup} disabled={isCreating}>
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Create Group"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups?.map((group) => (
          <Card
            key={group.id}
            className="bg-card border-border overflow-hidden shadow-xl"
          >
            <CardHeader className="flex flex-row items-center justify-between bg-muted/30 border-b border-border py-3 px-4">
              <CardTitle className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-2 text-foreground">
                <Trophy className="h-4 w-4 text-amber-500" />
                {group.name}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-card border-border text-foreground w-56 max-h-80 overflow-y-auto"
                >
                  <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border mb-1">
                    Select Contender
                  </div>
                  {allTeams
                    ?.filter(
                      (t) => !group.teams?.some((gt) => gt.team_id === t.id)
                    )
                    .map((team) => (
                      <DropdownMenuItem
                        key={team.id}
                        onClick={() => handleAddTeam(group.id, team.id)}
                        className="gap-2 cursor-pointer"
                      >
                        {team.logo_url && (
                          <div className="relative h-4 w-4">
                            <Image
                              src={team.logo_url}
                              alt={team.name_en}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <span className="truncate">{team.name_en}</span>
                      </DropdownMenuItem>
                    ))}
                  {allTeams?.filter(
                    (t) => !group.teams?.some((gt) => gt.team_id === t.id)
                  ).length === 0 && (
                    <div className="p-4 text-center text-xs text-muted-foreground italic">
                      All teams assigned
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="p-0 text-foreground">
              <div className="divide-y divide-border/50">
                {group.teams && group.teams.length > 0 ? (
                  group.teams.map((gt, idx) => (
                    <div
                      key={gt.id}
                      className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors group"
                    >
                      <div className="w-6 text-center text-[10px] font-black text-muted-foreground italic">
                        {(idx + 1).toString().padStart(2, "0")}
                      </div>
                      <div className="h-8 w-8 rounded-lg bg-background p-1.5 flex items-center justify-center border border-border shadow-inner">
                        {gt.team?.logo_url ? (
                          <Image
                            src={gt.team.logo_url}
                            alt={gt.team.name_en}
                            width={20}
                            height={20}
                            className="object-contain"
                          />
                        ) : (
                          <Users className="h-4 w-4 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate leading-none mb-1">
                          {gt.team?.name_en}
                        </p>
                        <div className="flex gap-2 text-[10px] uppercase font-black tracking-tighter">
                          <span className="text-primary">{gt.points} PTS</span>
                          <span className="text-muted-foreground">
                            {gt.played}P / {gt.won}W / {gt.gd}GD
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => handleRemoveTeam(group.id, gt.team_id)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-background/20">
                    <Users className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2 opacity-30" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                      No teams recruited for {group.name}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {(!groups || groups.length === 0) && (
          <div className="md:col-span-2 text-center py-16 bg-muted/10 border-2 border-dashed border-border rounded-3xl">
            <Users className="h-16 w-16 text-muted-foreground mx-auto opacity-10 mb-4" />
            <h4 className="text-muted-foreground font-black italic uppercase tracking-tighter">
              Groups Uninitialized
            </h4>
            <p className="text-xs text-muted-foreground/60 mt-1 max-w-xs mx-auto">
              This edition doesn&apos;t have any groups yet. Create groups to
              manage seeds and standings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
