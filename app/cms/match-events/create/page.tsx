import { redirect } from "next/navigation";
import MatchEventForm from "@/components/cms/match-events/MatchEventForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Match Event | Pana Sports CMS",
  description: "Create a new match event",
};

export default function CreateMatchEventPage() {
  // Create a server action that can be called from the client
  async function handleSuccess() {
    "use server";
    redirect("/cms/match-events");
  }

  async function handleCancel() {
    "use server";
    redirect("/cms/match-events");
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Create Match Event
        </h1>
        <p className="mt-2 text-muted-foreground">
          Add a new match event to the system.
        </p>
      </div>

      <MatchEventForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}