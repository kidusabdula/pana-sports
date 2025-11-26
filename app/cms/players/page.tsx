import PlayerTable from "@/components/cms/players/PlayerTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Players | Pana Sports CMS",
  description: "Manage football players",
};

export default function PlayersPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Players
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage football players and their information.
        </p>
      </div>

      <PlayerTable />
    </div>
  );
}