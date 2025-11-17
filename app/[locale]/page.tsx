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
    <div className="flex">
      {/* Left Column - 75% width */}
      <div className="w-full md:w-[65%] border-r border-border/30">
        <LeftColumn />
      </div>
      
      {/* Right Column - 25% width */}
      <div className="w-full md:w-[35%]">
        <RightColumn />
      </div>
    </div>
  );
}