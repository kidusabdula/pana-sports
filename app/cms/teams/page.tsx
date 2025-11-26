import TeamTable from "@/components/cms/teams/TeamTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teams | Pana Sports CMS",
  description: "Manage football teams",
};

export default function TeamsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Teams
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage football teams and their information.
        </p>
      </div>

      <TeamTable />
    </div>
  );
}