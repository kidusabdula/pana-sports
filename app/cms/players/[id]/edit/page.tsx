import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PlayerForm from "@/components/cms/players/PlayerForm";
import { Metadata } from "next";

interface EditPlayerPageProps {
  params: Promise<{ id: string }>;
}

// --- Helper Function ---
async function getPlayer(id: string) {
  if (!id) {
    console.error("getPlayer called without an ID");
    notFound();
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error fetching player:", error);
      notFound();
    }

    if (!data) {
      console.error("No player found with ID:", id);
      notFound();
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in getPlayer:", err);
    notFound();
  }
}

// --- generateMetadata ---
export async function generateMetadata({
  params,
}: EditPlayerPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const player = await getPlayer(id);
    return {
      title: `Edit ${player.name_en} | Pana Sports CMS`,
      description: `Edit ${player.name_en} player`,
    };
  } catch {
    return {
      title: "Player Not Found | Pana Sports CMS",
      description: "The requested player could not be found",
    };
  }
}

// --- Page Component ---
export default async function EditPlayerPage({ params }: EditPlayerPageProps) {
  const { id } = await params;
  const player = await getPlayer(id);

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
          Edit Player
        </h1>
        <p className="mt-2 text-muted-foreground">
          Update player details and settings.
        </p>
      </div>

      <PlayerForm
        player={player}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}