// components/shared/Skeletons/MatchRowSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function MatchRowSkeleton() {
  return (
    <div className="group relative flex items-center justify-between py-3 px-1 border-b border-white/5">
      {/* Time / Status */}
      <div className="w-12 flex flex-col items-center justify-center gap-1">
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>

      {/* Match Info */}
      <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
        {/* Home Team */}
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="w-5 h-5 rounded-full" />
        </div>

        {/* Score */}
        <div className="px-2 py-0.5 bg-zinc-900/50 rounded-md font-mono text-xs">
          <Skeleton className="h-4 w-8" />
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-start gap-2">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}