"use client";

import { useRouter } from "next/navigation";
import MatchForm from "@/components/cms/matches/MatchForm";

export default function CreateMatchPage() {
  const router = useRouter();

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <MatchForm
        onSuccess={() => router.push("/cms/matches")}
        onCancel={() => router.back()}
      />
    </div>
  );
}
