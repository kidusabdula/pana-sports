// components/shared/Skeletons/NewsPageSkeleton.tsx
import NewsCardSkeleton from "./NewsCardSkeleton"

export default function NewsPageSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="mb-12">
          <div className="h-16 w-64 bg-zinc-800 rounded-lg mb-4"></div>
          <div className="h-6 w-96 bg-zinc-800 rounded-lg"></div>
        </div>

        {/* Filter Section */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-24 bg-zinc-800 rounded-full"></div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
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

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            {/* Trending Section */}
            <div className="bg-zinc-900/20 border border-white/5 rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-5 w-5 bg-zinc-800 rounded-full"></div>
                <div className="h-6 w-32 bg-zinc-800 rounded-lg"></div>
              </div>

              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <NewsCardSkeleton key={i} variant="minimal" />
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="h-4 w-24 bg-zinc-800 rounded-lg mb-4"></div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 w-20 bg-zinc-800 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}