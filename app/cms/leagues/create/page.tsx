import { redirect } from "next/navigation";
import LeagueForm from "@/components/cms/leagues/LeagueForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create League | Pana Sports CMS",
  description: "Create a new football league",
};

export default function CreateLeaguePage() {
  // Create a server action that can be called from the client
  async function handleSuccess() {
    "use server";
    redirect("/cms/leagues");
  }

  async function handleCancel() {
    "use server";
    redirect("/cms/leagues");
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Create League
        </h1>
        <p className="mt-2 text-muted-foreground">
          Add a new league to the system.
        </p>
      </div>

      <LeagueForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
