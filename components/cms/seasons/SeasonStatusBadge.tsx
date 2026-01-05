// components/cms/seasons/SeasonStatusBadge.tsx
import { Badge } from "@/components/ui/badge";

interface SeasonStatusBadgeProps {
  isCurrent: boolean;
  isArchived: boolean;
}

export function SeasonStatusBadge({
  isCurrent,
  isArchived,
}: SeasonStatusBadgeProps) {
  if (isCurrent) {
    return (
      <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">
        Current
      </Badge>
    );
  }

  if (isArchived) {
    return (
      <Badge
        variant="secondary"
        className="bg-slate-500/10 text-slate-500 border-slate-500/20 hover:bg-slate-500/20"
      >
        Archived
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="text-primary border-primary/20 hover:bg-primary/5"
    >
      Active
    </Badge>
  );
}
