// components/shared/Skeletons/MatchesListSkeleton.tsx
import MatchRowSkeleton from "./MatchRowSkeleton"

export default function MatchesListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Live Matches */}
      <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
        <div className="bg-gradient-to-r from-red-900/20 to-transparent px-4 py-2 border-b border-white/5 flex justify-between items-center">
          <span className="text-xs font-bold text-red-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Premier League Live
          </span>
        </div>
        <div className="px-2">
          {[1, 2].map((i) => (
            <MatchRowSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Today's Matches */}
      <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
        <div className="bg-zinc-900/50 px-4 py-2 border-b border-white/5">
          <span className="text-xs font-bold text-zinc-400">Today</span>
        </div>
        <div className="px-2">
          {[1, 2, 3].map((i) => (
            <MatchRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}