// components/shared/Skeletons/NewsDetailSkeleton.tsx
export default function NewsDetailSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <div className="h-10 w-32 bg-zinc-800 rounded-lg mb-8"></div>

          {/* Featured Image */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden mb-12 bg-zinc-900">
            <div className="h-full w-full bg-zinc-800"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-3/4">
              <div className="space-y-4">
                <div className="h-6 w-24 bg-zinc-700 rounded-lg"></div>
                <div className="h-12 w-full bg-zinc-700 rounded-lg"></div>
                <div className="h-12 w-3/4 bg-zinc-700 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-2 hidden lg:block">
              <div className="sticky top-32 space-y-4">
                <div className="h-4 w-12 bg-zinc-800 rounded-lg"></div>
                <div className="h-10 w-10 bg-zinc-800 rounded-full"></div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-4 w-full bg-zinc-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}