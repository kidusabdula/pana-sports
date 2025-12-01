// components/shared/Skeletons/PlayerSpotlightSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function PlayerSpotlightSkeleton() {
  return (
    <div className="bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
      <div className="bg-zinc-900/50 px-4 py-2 border-b border-white/5">
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-zinc-800/40 rounded-lg p-3 text-center">
            <Skeleton className="h-4 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
          <div className="bg-zinc-800/40 rounded-lg p-3 text-center">
            <Skeleton className="h-4 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
          <div className="bg-zinc-800/40 rounded-lg p-3 text-center">
            <Skeleton className="h-4 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        </div>

        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-zinc-800/40 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  )
}