// components/shared/Skeletons/HomeNewsSectionSkeleton.tsx
import NewsCardSkeleton from "./NewsCardSkeleton"

export default function HomeNewsSectionSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-3">
        <div className="h-12 w-48 bg-zinc-800 rounded-lg"></div>
        <div className="h-6 w-96 bg-zinc-800 rounded-lg"></div>
      </div>

      {/* Filter Section */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-24 bg-zinc-800 rounded-full"></div>
        ))}
      </div>

      {/* Featured Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-zinc-800 rounded-full"></div>
          <div className="h-6 w-24 bg-zinc-800 rounded-lg"></div>
        </div>
        <NewsCardSkeleton variant="featured" />
      </div>

      {/* Latest News Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-zinc-800"></div>
          <div className="h-6 w-32 bg-zinc-800 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}