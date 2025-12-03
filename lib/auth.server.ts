// lib/auth.server.ts
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getSession() {
  const supabase = await createClient();

  try {
    // Use getUser() instead of getSession() for better security
    // getUser() authenticates with the Supabase Auth server
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Get the session after verifying the user
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!session?.user) {
    return null;
  }

  return session.user;
}

export async function isAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  // Check if user has admin role in metadata
  return user.user_metadata?.role === "admin";
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.user_metadata?.role !== "admin") {
    redirect("/unauthorized");
  }

  return user;
}
