// components/shared/Skeletons/StandingsTableSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function StandingsTableSkeleton() {
  return (
    <div className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
      <div className="bg-zinc-900/50 px-4 py-2 border-b border-white/5 flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[2rem_1fr_2rem_2rem_2rem_2rem_2rem_2rem_2rem_3rem] gap-1 px-2 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-white/5">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-4" />
      </div>

      {/* Table Rows */}
      <div className="max-h-96 overflow-y-auto">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="grid grid-cols-[2rem_1fr_2rem_2rem_2rem_2rem_2rem_2rem_2rem_3rem] gap-1 px-2 py-2 text-xs border-b border-white/5">
            <Skeleton className="h-4 w-4" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4" />
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-white/5">
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  )
}