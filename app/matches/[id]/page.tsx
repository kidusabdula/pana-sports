// app/matches/[id]/page.tsx
import { notFound } from "next/navigation";
import { MatchDetailPage } from "@/components/matches/MatchDetailPage";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;
  
  if (!id) {
    notFound();
  }
  
  return <MatchDetailPage matchId={id} />;
}