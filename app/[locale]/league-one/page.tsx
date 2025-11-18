// app/[locale]/league-one/page.tsx
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import LeagueOneHeader from '@/components/league-one/LeagueOneHeader';

export default function LeagueOnePage({ params }: {
  params: Promise<{ locale: string }>
}) {
  // Using the params Promise as per Next.js 16
  const { locale } = use(params);
  
  // Set the locale for this page
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-6">
      <LeagueOneHeader />
    </div>
  );
}