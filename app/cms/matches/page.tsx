import MatchTable from "@/components/cms/matches/MatchTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matches | Pana Sports CMS",
  description: "Manage football matches",
};

export default function MatchesPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Matches
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your football matches and fixtures.
        </p>
      </div>

      <MatchTable />
    </div>
  );
}