import { redirect } from "next/navigation";
import StandingForm from "@/components/cms/standings/StandingForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Standing | Pana Sports CMS",
  description: "Create a new league standing",
};

export default function CreateStandingPage() {
  // Create a server action that can be called from the client
  async function handleSuccess() {
    "use server";
    redirect("/cms/standings");
  }

  async function handleCancel() {
    "use server";
    redirect("/cms/standings");
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Create Standing
        </h1>
        <p className="mt-2 text-muted-foreground">
          Add a new standing record to the system.
        </p>
      </div>

      <StandingForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}