// app/teams/[id]/page.tsx
import { notFound } from "next/navigation";
import TeamDetailPage from "@/components/teams/TeamDetailPage";

interface TeamPageProps {
  params: Promise<{ id: string }>;
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return <TeamDetailPage teamId={id} />;
}
