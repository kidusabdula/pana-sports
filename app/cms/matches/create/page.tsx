import { redirect } from "next/navigation";
import MatchForm from "@/components/cms/matches/MatchForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Match | Pana Sports CMS",
  description: "Create a new football match",
};

export default function CreateMatchPage() {
  // Create a server action that can be called from the client
  async function handleSuccess() {
    "use server";
    redirect("/cms/matches");
  }

  async function handleCancel() {
    "use server";
    redirect("/cms/matches");
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Create Match
        </h1>
        <p className="mt-2 text-muted-foreground">
          Schedule a new match in the system.
        </p>
      </div>

      <MatchForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}