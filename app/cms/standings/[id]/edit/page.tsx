import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StandingForm from "@/components/cms/standings/StandingForm";
import { Metadata } from "next";

interface EditStandingPageProps {
  params: Promise<{ id: string }>;
}

// --- Helper Function ---
async function getStanding(id: string) {
  if (!id) {
    console.error("getStanding called without an ID");
    notFound();
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("standings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error fetching standing:", error);
      notFound();
    }

    if (!data) {
      console.error("No standing found with ID:", id);
      notFound();
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in getStanding:", err);
    notFound();
  }
}

// --- generateMetadata ---
export async function generateMetadata({
  params,
}: EditStandingPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const standing = await getStanding(id);
    return {
      title: `Edit Standing | Pana Sports CMS`,
      description: `Edit standing record`,
    };
  } catch {
    return {
      title: "Standing Not Found | Pana Sports CMS",
      description: "The requested standing could not be found",
    };
  }
}

// --- Page Component ---
export default async function EditStandingPage({ params }: EditStandingPageProps) {
  const { id } = await params;
  const standing = await getStanding(id);

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
          Edit Standing
        </h1>
        <p className="mt-2 text-muted-foreground">
          Update standing record and settings.
        </p>
      </div>

      <StandingForm
        standing={standing}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}