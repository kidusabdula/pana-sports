import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MatchEventForm from "@/components/cms/match-events/MatchEventForm";
import { Metadata } from "next";

interface EditMatchEventPageProps {
  params: Promise<{ id: string }>;
}

// --- Helper Function ---
async function getMatchEvent(id: string) {
  if (!id) {
    console.error("getMatchEvent called without an ID");
    notFound();
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("match_events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error fetching match event:", error);
      notFound();
    }

    if (!data) {
      console.error("No match event found with ID:", id);
      notFound();
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in getMatchEvent:", err);
    notFound();
  }
}

// --- generateMetadata ---
export async function generateMetadata({
  params,
}: EditMatchEventPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const matchEvent = await getMatchEvent(id);
    return {
      title: `Edit Match Event | Pana Sports CMS`,
      description: `Edit match event`,
    };
  } catch {
    return {
      title: "Match Event Not Found | Pana Sports CMS",
      description: "The requested match event could not be found",
    };
  }
}

// --- Page Component ---
export default async function EditMatchEventPage({ params }: EditMatchEventPageProps) {
  const { id } = await params;
  const matchEvent = await getMatchEvent(id);

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
          Edit Match Event
        </h1>
        <p className="mt-2 text-muted-foreground">
          Update match event details and settings.
        </p>
      </div>

      <MatchEventForm
        matchEvent={matchEvent}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}