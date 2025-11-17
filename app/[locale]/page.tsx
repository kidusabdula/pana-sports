// app/[locale]/page.tsx
import { useTranslations } from 'next-intl';
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

  const t = useTranslations('Home');

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30 rounded-2xl overflow-hidden">
          <div className="p-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                  Ethiopian Football Hub
                </h1>
                <p className="text-muted-foreground">
                  Your comprehensive source for Ethiopian football news, matches, and statistics
                </p>
              </div>
              
              <div className="flex items-center gap-2 mt-4 md:mt-0 p-4">
                <button className="btn-pana py-2 px-4">
                  Follow All Leagues
                </button>
                <button className="bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60 px-4 py-2 rounded-xl transition-all duration-300">
                  View All Stats
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-6">
        {/* Left Column - 65% width */}
        <div className="w-full md:w-[65%]">
          <LeftColumn />
        </div>
        
        {/* Right Column - 35% width */}
        <div className="w-full md:w-[35%]">
          <RightColumn />
        </div>
      </div>
    </div>
  );
}