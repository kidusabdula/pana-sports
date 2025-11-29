// components/shared/Skeletons/NewsCardSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

interface NewsCardSkeletonProps {
  variant?: "default" | "featured" | "compact" | "minimal" | "horizontal";
}

export default function NewsCardSkeleton({ variant = "default" }: NewsCardSkeletonProps) {
  if (variant === "featured") {
    return (
      <div className="relative rounded-3xl overflow-hidden h-[500px] w-full bg-zinc-900">
        <Skeleton className="h-full w-full" />
        <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full md:w-3/4">
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === "minimal") {
    return (
      <div className="flex gap-4 items-center p-3 rounded-xl">
        <Skeleton className="w-20 h-20 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  if (variant === "horizontal") {
    return (
      <div className="grid grid-cols-12 gap-6 p-4 rounded-2xl">
        <div className="col-span-12 md:col-span-4 h-48 md:h-full min-h-[200px]">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
        <div className="col-span-12 md:col-span-8 space-y-3">
          <div className="flex gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  // Default Card
  return (
    <div className="h-full bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden flex flex-col">
      <div className="h-52">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-5 flex flex-col flex-1 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between mt-auto pt-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  )
}