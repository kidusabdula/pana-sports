import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Verify admin authentication
    try {
      await requireAdmin()
    } catch (authError) {
      return NextResponse.json(
        { 
          error: 'Authentication failed', 
          details: authError instanceof Error ? authError.message : 'Unknown auth error' 
        },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    
    // Fetch users from auth.users (requires service role key in production)
    const { data, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('Supabase error fetching users:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch users', 
          details: error.message 
        },
        { status: 500 }
      )
    }

    // Transform the data to include role from metadata
    const users = data.users.map(user => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_sign_in_at: user.last_sign_in_at,
      raw_user_meta_data: user.user_metadata,
      role: user.user_metadata?.role || 'user',
    }))
    
    return NextResponse.json(users)
  } catch (error) {
    console.error('Unexpected error fetching users:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch users', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
