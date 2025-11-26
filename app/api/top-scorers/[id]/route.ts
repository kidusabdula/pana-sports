import { createClient } from '@/lib/supabase/server'
import { updateTopScorerInputSchema } from '@/lib/schemas/topScorer'
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
        { error: 'Top Scorer ID is required' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('top_scorers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Supabase error fetching top scorer:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch top scorer', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Top Scorer not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error fetching top scorer:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch top scorer', 
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
        { error: 'Top Scorer ID is required' },
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
      validatedData = updateTopScorerInputSchema.parse(body)
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
      .from('top_scorers')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error updating top scorer:', error);
      
      // Handle specific error codes
      if (error.code === '23505') {
        return NextResponse.json(
          { 
            error: 'This player/league combination already exists in top scorers', 
            details: 'The combination must be unique' 
          },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to update top scorer', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Top Scorer not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error updating top scorer:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update top scorer', 
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
        { error: 'Top Scorer ID is required' },
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
    
    // Check if top scorer exists
    const { data: topScorer, error: topScorerError } = await supabase
      .from('top_scorers')
      .select('id')
      .eq('id', id)
      .single()
    
    if (topScorerError) {
      console.error('Supabase error checking top scorer existence:', topScorerError)
      return NextResponse.json(
        { 
          error: 'Failed to check top scorer existence', 
          details: topScorerError.message 
        },
        { status: 500 }
      )
    }
    
    if (!topScorer) {
      return NextResponse.json(
        { error: 'Top Scorer not found' },
        { status: 404 }
      )
    }
    
    // Delete top scorer
    const { error: deleteError } = await supabase
      .from('top_scorers')
      .delete()
      .eq('id', id)
    
    if (deleteError) {
      console.error('Supabase error deleting top scorer:', deleteError)
      return NextResponse.json(
        { 
          error: 'Failed to delete top scorer', 
          details: deleteError.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting top scorer:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete top scorer', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}