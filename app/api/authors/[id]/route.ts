import { createClient } from '@/lib/supabase/server'
import { updateAuthorInputSchema } from '@/lib/schemas/author'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Supabase error fetching author:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch author', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error fetching author:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch author', 
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
      validatedData = updateAuthorInputSchema.parse(body)
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
    
    const { data, error } = await supabase
      .from('authors')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error updating author:', error)
      return NextResponse.json(
        { 
          error: 'Failed to update author', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error updating author:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update author', 
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
    
    const { error } = await supabase
      .from('authors')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Supabase error deleting author:', error)
      return NextResponse.json(
        { 
          error: 'Failed to delete author', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting author:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete author', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
