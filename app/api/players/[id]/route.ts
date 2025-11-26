import { createClient } from '@/lib/supabase/server'
import { updatePlayerInputSchema } from '@/lib/schemas/player'
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
        { error: 'Player ID is required' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Supabase error fetching player:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch player', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error fetching player:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch player', 
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
        { error: 'Player ID is required' },
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
      validatedData = updatePlayerInputSchema.parse(body)
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
      .from('players')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error updating player:', error);
      
      // Handle specific error codes
      if (error.code === '23505') {
        return NextResponse.json(
          { 
            error: 'Player with this slug already exists', 
            details: 'The slug must be unique across all players' 
          },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to update player', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error updating player:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update player', 
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
        { error: 'Player ID is required' },
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
    
    // Check if player exists
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('id')
      .eq('id', id)
      .single()
    
    if (playerError) {
      console.error('Supabase error checking player existence:', playerError)
      return NextResponse.json(
        { 
          error: 'Failed to check player existence', 
          details: playerError.message 
        },
        { status: 500 }
      )
    }
    
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }
    
    // Delete player without checking for associated teams or matches
    const { error: deleteError } = await supabase
      .from('players')
      .delete()
      .eq('id', id)
    
    if (deleteError) {
      console.error('Supabase error deleting player:', deleteError)
      return NextResponse.json(
        { 
          error: 'Failed to delete player', 
          details: deleteError.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting player:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete player', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}