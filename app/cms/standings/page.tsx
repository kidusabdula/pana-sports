import StandingTable from "@/components/cms/standings/StandingTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Standings | Pana Sports CMS",
  description: "Manage league standings",
};

export default function StandingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Standings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage league standings and team rankings.
        </p>
      </div>

      <StandingTable />
    </div>
  );
}