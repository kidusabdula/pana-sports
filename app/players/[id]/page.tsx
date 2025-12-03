// app/players/[id]/page.tsx
import { notFound } from "next/navigation";
import { PlayerDetailPage } from "@/components/players/PlayerDetailPage";

interface PlayerPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  
  if (!id) {
    notFound();
  }
  
  return <PlayerDetailPage playerId={id} />;
}