import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LeagueForm from "@/components/cms/leagues/LeagueForm";
import { Metadata } from "next";

interface EditLeaguePageProps {
  params: Promise<{ id: string }>;
}

// --- Helper Function ---
async function getLeague(id: string) {
  if (!id) {
    console.error("getLeague called without an ID");
    notFound();
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("leagues")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error fetching league:", error);
      notFound();
    }

    if (!data) {
      console.error("No league found with ID:", id);
      notFound();
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in getLeague:", err);
    notFound();
  }
}

// --- generateMetadata ---
export async function generateMetadata({
  params,
}: EditLeaguePageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const league = await getLeague(id);
    return {
      title: `Edit ${league.name_en} | Pana Sports CMS`,
      description: `Edit ${league.name_en} league`,
    };
  } catch {
    return {
      title: "League Not Found | Pana Sports CMS",
      description: "The requested league could not be found",
    };
  }
}

// --- Page Component ---
export default async function EditLeaguePage({ params }: EditLeaguePageProps) {
  const { id } = await params;
  const league = await getLeague(id);

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
          Edit League
        </h1>
        <p className="mt-2 text-muted-foreground">
          Update league details and settings.
        </p>
      </div>

      <LeagueForm
        league={league}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
