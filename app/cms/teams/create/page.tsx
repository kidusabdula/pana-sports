import { redirect } from "next/navigation";
import TeamForm from "@/components/cms/teams/TeamForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Team | Pana Sports CMS",
  description: "Create a new football team",
};

export default function CreateTeamPage() {
  // Create a server action that can be called from the client
  async function handleSuccess() {
    "use server";
    redirect("/cms/teams");
  }

  async function handleCancel() {
    "use server";
    redirect("/cms/teams");
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Create Team
        </h1>
        <p className="mt-2 text-muted-foreground">
          Add a new team to the system.
        </p>
      </div>

      <TeamForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}