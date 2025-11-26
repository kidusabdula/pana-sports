import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // If there is no code, just return to the home page
  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }
  
  const supabase = await createClient()
  
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }
  
  // Get the redirectTo parameter from the URL
  const redirectTo = searchParams.get('redirectTo') || '/cms/dashboard'
  
  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}${redirectTo}`)
}