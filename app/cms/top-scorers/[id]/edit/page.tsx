import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TopScorerForm from "@/components/cms/top-scorers/TopScorerForm";
import { Metadata } from "next";

interface EditTopScorerPageProps {
  params: Promise<{ id: string }>;
}

// Helper Function
async function getTopScorer(id: string) {
  if (!id) {
    console.error("getTopScorer called without an ID");
    notFound();
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("top_scorers")
      .select(`
        *,
        player:players(id, name_en, name_am, slug, jersey_number, photo_url),
        team:teams(id, name_en, name_am, slug, logo_url),
        league:leagues(id, name_en, name_am, slug, category)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error fetching top scorer:", error);
      notFound();
    }

    if (!data) {
      console.error("No top scorer found with ID:", id);
      notFound();
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in getTopScorer:", err);
    notFound();
  }
}

// Generate metadata
export async function generateMetadata({
  params,
}: EditTopScorerPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const topScorer = await getTopScorer(id);
    return {
      title: `Edit ${topScorer.player?.name_en} | Pana Sports CMS`,
      description: `Edit ${topScorer.player?.name_en} top scorer statistics`,
    };
  } catch {
    return {
      title: "Top Scorer Not Found | Pana Sports CMS",
      description: "The requested top scorer could not be found",
    };
  }
}

// Page Component
export default async function EditTopScorerPage({ params }: EditTopScorerPageProps) {
  const { id } = await params;
  const topScorer = await getTopScorer(id);

  async function handleSuccess() {
    "use server";
    redirect("/cms/top-scorers");
  }

  async function handleCancel() {
    "use server";
    redirect("/cms/top-scorers");
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Edit Top Scorer
        </h1>
        <p className="mt-2 text-muted-foreground">
          Update top scorer statistics.
        </p>
      </div>

      <TopScorerForm
        topScorer={topScorer}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}