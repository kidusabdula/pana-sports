// app/api/auth/callback/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // If there is no code, just return to home page
  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`
    );
  }
  // Get the user to check if they're an admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user doesn't have admin role, set it (only for the first admin)
  if (user && !user.user_metadata?.role) {
    await supabase.auth.updateUser({
      data: { role: "admin" },
    });
  }

  // Get the redirectTo parameter from URL
  const redirectTo = searchParams.get("redirectTo") || "/cms/dashboard";

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}${redirectTo}`);
}
