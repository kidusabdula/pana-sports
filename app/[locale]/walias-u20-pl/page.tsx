// app/[locale]/walias-u20-pl/page.tsx
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import WaliasU20Header from '@/components/walias-u20-pl/WaliasU20Header';

export default function WaliasU20PLPage({ params }: {
  params: Promise<{ locale: string }>
}) {
  // Using the params Promise as per Next.js 16
  const { locale } = use(params);
  
  // Set the locale for this page
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-6">
      <WaliasU20Header />
    </div>
  );
}