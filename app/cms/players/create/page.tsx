import { redirect } from "next/navigation";
import PlayerForm from "@/components/cms/players/PlayerForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Player | Pana Sports CMS",
  description: "Create a new football player",
};

export default function CreatePlayerPage() {
  // Create a server action that can be called from the client
  async function handleSuccess() {
    "use server";
    redirect("/cms/players");
  }

  async function handleCancel() {
    "use server";
    redirect("/cms/players");
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Create Player
        </h1>
        <p className="mt-2 text-muted-foreground">
          Add a new player to the system.
        </p>
      </div>

      <PlayerForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}