// app/[locale]/higher-league/page.tsx
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import HigherLeagueHeader from '@/components/higher-league/HigherLeagueHeader';

export default function HigherLeaguePage({ params }: {
  params: Promise<{ locale: string }>
}) {
  // Using the params Promise as per Next.js 16
  const { locale } = use(params);
  
  // Set the locale for this page
  setRequestLocale(locale);

  const t = useTranslations('higherLeague');

  return (
    <div className="container mx-auto px-4 py-6">
      <HigherLeagueHeader />
    </div>
  );
}