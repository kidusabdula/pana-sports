"use client";

import { useCupBracket } from "@/lib/hooks/public/useCups";
import { Brackets, Loader2, Trophy } from "lucide-react";
import Image from "next/image";

interface CupBracketProps {
  editionId: string;
}

interface BracketMatch {
  id: string;
  round_name: string;
  match_number: number;
  home_team?: {
    id: string;
    name_en: string;
    logo_url?: string;
  };
  away_team?: {
    id: string;
    name_en: string;
    logo_url?: string;
  };
  home_score?: number;
  away_score?: number;
  winner_team_id?: string;
  status: string;
}

// TODO: Implement full bracket API endpoint. For now, show placeholder.
export default function CupBracket({ editionId }: CupBracketProps) {
  // const { data: bracket, isLoading } = useCupBracket(editionId);

  // Placeholder until bracket API is fully implemented
  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
            <Brackets className="h-12 w-12 text-amber-500" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-3">Knockout Bracket</h3>
        <p className="text-zinc-500 max-w-md mx-auto mb-6">
          The interactive knockout bracket visualization is under development.
          You can view individual matches in the Matches tab.
        </p>

        {/* Bracket Preview Placeholder */}
        <div className="mt-8 p-6 bg-zinc-950/50 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-center gap-4 text-zinc-600">
            <div className="flex flex-col items-center gap-2">
              <div className="w-32 h-10 bg-zinc-800 rounded-lg flex items-center px-3 gap-2">
                <div className="w-6 h-6 rounded-full bg-zinc-700"></div>
                <div className="h-2 w-12 bg-zinc-700 rounded"></div>
              </div>
              <div className="w-32 h-10 bg-zinc-800 rounded-lg flex items-center px-3 gap-2">
                <div className="w-6 h-6 rounded-full bg-zinc-700"></div>
                <div className="h-2 w-16 bg-zinc-700 rounded"></div>
              </div>
            </div>

            <div className="w-8 h-px bg-zinc-700"></div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-32 h-10 bg-zinc-800 rounded-lg flex items-center px-3 gap-2">
                <div className="w-6 h-6 rounded-full bg-zinc-700"></div>
                <div className="h-2 w-14 bg-zinc-700 rounded"></div>
              </div>
            </div>

            <div className="w-8 h-px bg-zinc-700"></div>

            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <Trophy className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          <p className="text-xs text-zinc-600 mt-4 uppercase tracking-widest font-bold">
            Visual bracket coming soon
          </p>
        </div>
      </div>

      {/* Round Labels */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {["Round of 16", "Quarter-finals", "Semi-finals", "Final"].map(
          (round, idx) => (
            <div
              key={round}
              className={`p-4 rounded-xl border text-center ${
                idx === 3
                  ? "bg-amber-500/10 border-amber-500/20"
                  : "bg-zinc-900/30 border-zinc-800"
              }`}
            >
              <p
                className={`text-sm font-bold uppercase tracking-wider ${
                  idx === 3 ? "text-amber-400" : "text-zinc-400"
                }`}
              >
                {round}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
