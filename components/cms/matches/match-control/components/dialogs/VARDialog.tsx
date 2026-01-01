// components/cms/matches/match-control/components/dialogs/VARDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye } from "lucide-react";
import { VAR_CHECK_TYPES } from "../../constants";

interface VARDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  varType: string;
  onVarTypeChange: (type: string) => void;
  onSubmit: () => void;
}

export function VARDialog({
  open,
  onOpenChange,
  varType,
  onVarTypeChange,
  onSubmit,
}: VARDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>VAR Check</DialogTitle>
          <DialogDescription>
            Select the type of VAR review to initiate.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="varType">VAR Check Type</Label>
            <Select value={varType} onValueChange={onVarTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select VAR check type" />
              </SelectTrigger>
              <SelectContent>
                {VAR_CHECK_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} className="gap-2" disabled={!varType}>
            <Eye className="h-4 w-4" />
            Initiate VAR Check
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
