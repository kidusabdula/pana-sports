import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TeamForm from "@/components/cms/teams/TeamForm";
import { Metadata } from "next";

interface EditTeamPageProps {
  params: Promise<{ id: string }>;
}

// Helper Function
async function getTeam(id: string) {
  if (!id) {
    console.error("getTeam called without an ID");
    notFound();
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error fetching team:", error);
      notFound();
    }

    if (!data) {
      console.error("No team found with ID:", id);
      notFound();
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in getTeam:", err);
    notFound();
  }
}

// Generate metadata
export async function generateMetadata({
  params,
}: EditTeamPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const team = await getTeam(id);
    return {
      title: `Edit ${team.name_en} | Pana Sports CMS`,
      description: `Edit ${team.name_en} team`,
    };
  } catch {
    return {
      title: "Team Not Found | Pana Sports CMS",
      description: "The requested team could not be found",
    };
  }
}

// Page Component
export default async function EditTeamPage({ params }: EditTeamPageProps) {
  const { id } = await params;
  const team = await getTeam(id);

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
          Edit Team
        </h1>
        <p className="mt-2 text-muted-foreground">
          Update team details and settings.
        </p>
      </div>

      <TeamForm
        team={team}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}