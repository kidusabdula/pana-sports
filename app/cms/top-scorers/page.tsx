import TopScorerTable from "@/components/cms/top-scorers/TopScorerTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Scorers | Pana Sports CMS",
  description: "Manage top scorers",
};

export default function TopScorersPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Top Scorers
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage top scorers across all leagues.
        </p>
      </div>

      <TopScorerTable />
    </div>
  );
}