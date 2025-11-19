// app/[locale]/page.tsx
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import LeftColumn from '@/components/shared/LeftColumn';
import RightColumn from '@/components/shared/RightColumn';

export default function HomePage({ params }: {
  params: Promise<{ locale: string }>
}) {
  // Using the params Promise as per Next.js 16
  const { locale } = use(params);
  
  // Set the locale for this page
  setRequestLocale(locale);

  return (
    <>
      <div className="mb-6 p-6">
        <div className="relative overflow-hidden rounded-3xl group">
          {/* Premium gradient background */}
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          {/* Subtle animated pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDYwIEwgNjAgMCBNIC01IDUgIEwgNSAtNSBNIDU1IDY1IEwgNjUgNTUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIwLjUiIGZpbGw9Im5vbmUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
          
          {/* Glass-morphism border effect */}
          <div className="absolute inset-0 rounded-3xl border border-zinc-700/30 bg-linear-to-br from-white/5 to-transparent" />
          
          <div className="relative z-10 p-8 md:p-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-4 max-w-2xl">
                {/* Premium heading with enhanced typography */}
                <div className="space-y-2">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-2">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                    Ethiopian Football Hub
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                    <span className="bg-linear-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                      Your Complete
                    </span>
                    <span className="block bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      Football Experience
                    </span>
                  </h1>
                </div>
                
                {/* Enhanced description with better typography */}
                <p className="text-zinc-300 text-base md:text-lg leading-relaxed">
                  Access comprehensive Ethiopian football coverage including live matches, in-depth statistics, 
                  breaking news, and exclusive insights from the heart of Ethiopian football.
                </p>
                
                {/* Premium stats/indicators */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100 4h2a1 1 0 100 2 2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-sm text-zinc-400">5+ Leagues</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-sm text-zinc-400">Live Coverage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-sm text-zinc-400">Real-time Stats</span>
                  </div>
                </div>
              </div>
              
              {/* Enhanced premium buttons with better hover effects */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button className="group relative overflow-hidden btn-pana py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Follow All Leagues
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-white/10 to-primary/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
                
                <button className="group relative overflow-hidden bg-zinc-800/60 border border-zinc-700/50 hover:bg-zinc-800/80 hover:border-zinc-700/70 py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    View All Stats
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/5 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </div>
            </div>
            
            {/* Decorative bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-zinc-700/50 to-transparent" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 lg:px-0">
        <div className="lg:col-span-8">
          <LeftColumn />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <RightColumn />
        </div>
      </div>
    </>
  );
}