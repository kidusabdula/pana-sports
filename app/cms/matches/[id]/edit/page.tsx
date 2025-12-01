import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MatchForm from "@/components/cms/matches/MatchForm";
import { Metadata } from "next";

interface EditMatchPageProps {
  params: Promise<{ id: string }>;
}

// Helper Function
async function getMatch(id: string) {
  if (!id) {
    console.error("getMatch called without an ID");
    notFound();
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("matches")
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(id, name_en, name_am, slug, logo_url),
        away_team:teams!matches_away_team_id_fkey(id, name_en, name_am, slug, logo_url),
        league:leagues(id, name_en, name_am, slug, category),
        venue:venues(id, name_en, name_am, city, capacity)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error fetching match:", error);
      notFound();
    }

    if (!data) {
      console.error("No match found with ID:", id);
      notFound();
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in getMatch:", err);
    notFound();
  }
}

// Generate metadata
export async function generateMetadata({
  params,
}: EditMatchPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const match = await getMatch(id);
    return {
      title: `Edit ${match.home_team?.name_en} vs ${match.away_team?.name_en} | Pana Sports CMS`,
      description: `Edit match details`,
    };
  } catch {
    return {
      title: "Match Not Found | Pana Sports CMS",
      description: "The requested match could not be found",
    };
  }
}

// Page Component
export default async function EditMatchPage({ params }: EditMatchPageProps) {
  const { id } = await params;
  const match = await getMatch(id);

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
          Edit Match
        </h1>
        <p className="mt-2 text-muted-foreground">
          Update match details and settings.
        </p>
      </div>

      <MatchForm
        match={match}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}