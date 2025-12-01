// components/shared/Skeletons/TopScorersListSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function TopScorersListSkeleton() {
  return (
    <div className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
      <div className="bg-zinc-900/50 px-4 py-2 border-b border-white/5 flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="max-h-64 overflow-y-auto">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-2 border-b border-white/5 last:border-0">
            <Skeleton className="w-6 h-4" />
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-1" />
              <div className="flex items-center gap-1">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-8 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}