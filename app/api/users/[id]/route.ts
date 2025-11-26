import { createClient } from '@/lib/supabase/server'
import { updateUserMetadataInputSchema } from '@/lib/schemas/user'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
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
    
    // Parse and validate request body
    let body;
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { 
          error: 'Invalid JSON in request body', 
          details: parseError instanceof Error ? parseError.message : 'Unknown parsing error' 
        },
        { status: 400 }
      )
    }
    
    let validatedData;
    try {
      validatedData = updateUserMetadataInputSchema.parse(body)
    } catch (validationError) {
      return NextResponse.json(
        { 
          error: 'Invalid input data', 
          details: validationError instanceof Error ? validationError.message : 'Unknown validation error' 
        },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Update user metadata
    const { data, error } = await supabase.auth.admin.updateUserById(
      id,
      { 
        user_metadata: validatedData
      }
    )
    
    if (error) {
      console.error('Supabase error updating user:', error)
      return NextResponse.json(
        { 
          error: 'Failed to update user', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      id: data.user.id,
      email: data.user.email,
      created_at: data.user.created_at,
      updated_at: data.user.updated_at,
      last_sign_in_at: data.user.last_sign_in_at,
      raw_user_meta_data: data.user.user_metadata,
      role: data.user.user_metadata?.role || 'user',
    })
  } catch (error) {
    console.error('Unexpected error updating user:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update user', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
