"use client";

import { Button } from "@/components/ui/button";

interface LeagueNotFoundProps {
  title: string;
  message: string;
}

export default function LeagueNotFound({
  title,
  message,
}: LeagueNotFoundProps) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <p className="text-zinc-400 mb-6">{message}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
