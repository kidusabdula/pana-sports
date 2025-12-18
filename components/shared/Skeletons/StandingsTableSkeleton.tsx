// components/shared/Skeletons/StandingsTableSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function StandingsTableSkeleton() {
  return (
    <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 overflow-hidden rounded-2xl">
      <div className="py-3 px-4 border-b border-white/5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="py-4 pl-4 w-12">
                  <Skeleton className="h-3 w-4 mx-auto" />
                </th>
                <th className="py-4 px-2">
                  <Skeleton className="h-3 w-12" />
                </th>
                {[...Array(7)].map((_, i) => (
                  <th key={i} className="py-4 px-2 text-center w-10">
                    <Skeleton className="h-3 w-6 mx-auto" />
                  </th>
                ))}
                <th className="py-4 px-4 hidden md:table-cell">
                  <Skeleton className="h-3 w-16 mx-auto" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {[...Array(10)].map((_, i) => (
                <tr key={i} className="hover:bg-white/5">
                  <td className="py-3 pl-4 text-center">
                    <Skeleton className="h-4 w-4 mx-auto" />
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-6 h-6 rounded-full shrink-0" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </td>
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="py-3 px-2 text-center">
                      <Skeleton className="h-4 w-4 mx-auto" />
                    </td>
                  ))}
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      {[...Array(5)].map((_, k) => (
                        <Skeleton key={k} className="h-5 w-5 rounded-sm" />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-white/5 p-4 text-center">
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    </div>
  );
}
