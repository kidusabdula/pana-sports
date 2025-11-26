import { createClient } from '@/lib/supabase/server'
import { updateStandingInputSchema } from '@/lib/schemas/standing'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Standing ID is required' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('standings')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Supabase error fetching standing:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch standing', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Standing not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error fetching standing:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch standing', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Standing ID is required' },
        { status: 400 }
      )
    }
    
    // Verify admin authentication
    let user;
    try {
      user = await requireAdmin()
    } catch (authError) {
      console.error('Authentication error:', authError);
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
      console.error('JSON parsing error:', parseError)
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
      validatedData = updateStandingInputSchema.parse(body)
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { 
          error: 'Invalid input data', 
          details: validationError instanceof Error ? validationError.message : 'Unknown validation error' 
        },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('standings')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error updating standing:', error);
      
      return NextResponse.json(
        { 
          error: 'Failed to update standing', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Standing not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error updating standing:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update standing', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Standing ID is required' },
        { status: 400 }
      )
    }
    
    // Verify admin authentication
    let user;
    try {
      user = await requireAdmin()
    } catch (authError) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        { 
          error: 'Authentication failed', 
          details: authError instanceof Error ? authError.message : 'Unknown auth error' 
        },
        { status: 401 }
      )
    }
    
    const supabase = await createClient()
    
    // Check if standing exists
    const { data: standing, error: standingError } = await supabase
      .from('standings')
      .select('id')
      .eq('id', id)
      .single()
    
    if (standingError) {
      console.error('Supabase error checking standing existence:', standingError)
      return NextResponse.json(
        { 
          error: 'Failed to check standing existence', 
          details: standingError.message 
        },
        { status: 500 }
      )
    }
    
    if (!standing) {
      return NextResponse.json(
        { error: 'Standing not found' },
        { status: 404 }
      )
    }
    
    // Delete standing
    const { error: deleteError } = await supabase
      .from('standings')
      .delete()
      .eq('id', id)
    
    if (deleteError) {
      console.error('Supabase error deleting standing:', deleteError)
      return NextResponse.json(
        { 
          error: 'Failed to delete standing', 
          details: deleteError.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting standing:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete standing', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}