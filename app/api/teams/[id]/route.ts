import { createClient } from '@/lib/supabase/server'
import { updateTeamInputSchema } from '@/lib/schemas/team'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Supabase error fetching team:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch team', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error fetching team:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch team', 
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
        { error: 'Team ID is required' },
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
      validatedData = updateTeamInputSchema.parse(body)
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
      .from('teams')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error updating team:', error);
      
      // Handle specific error codes
      if (error.code === '23505') {
        return NextResponse.json(
          { 
            error: 'Team with this slug already exists', 
            details: 'The slug must be unique across all teams' 
          },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to update team', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error updating team:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update team', 
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
        { error: 'Team ID is required' },
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
    
    // Check if team exists
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id')
      .eq('id', id)
      .single()
    
    if (teamError) {
      console.error('Supabase error checking team existence:', teamError)
      return NextResponse.json(
        { 
          error: 'Failed to check team existence', 
          details: teamError.message 
        },
        { status: 500 }
      )
    }
    
    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }
    
    // Check if there are players in this team
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('id')
      .eq('team_id', id)
      .limit(1)
    
    if (playersError) {
      console.error('Supabase error checking players:', playersError)
      return NextResponse.json(
        { 
          error: 'Failed to check players', 
          details: playersError.message 
        },
        { status: 500 }
      )
    }
    
    // Only allow deletion if there are no players in the team
    if (players && players.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete team with associated players', 
          details: 'Please delete or reassign all players in this team first' 
        },
        { status: 400 }
      )
    }
    
    // Delete the team without checking for associated players
    const { error: deleteError } = await supabase
      .from('teams')
      .delete()
      .eq('id', id)
    
    if (deleteError) {
      console.error('Supabase error deleting team:', deleteError)
      return NextResponse.json(
        { 
          error: 'Failed to delete team', 
          details: deleteError.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting team:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete team', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}