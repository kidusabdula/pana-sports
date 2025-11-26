import LeagueTable from "@/components/cms/leagues/LeagueTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leagues | Pana Sports CMS",
  description: "Manage football leagues",
};

export default function LeaguesPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Leagues
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your football leagues, categories, and settings.
        </p>
      </div>

      <LeagueTable />
    </div>
  );
}
