"use client";

import { Button } from "@/components/ui/button";

export default function LeagueNotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Premier League Not Found
        </h2>
        <p className="text-zinc-400 mb-6">
          The Premier League data is not available at the moment. Please try
          again later.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
