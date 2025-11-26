import { createClient } from '@/lib/supabase/server'
import { updateMatchInputSchema } from '@/lib/schemas/match'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: match, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Supabase error fetching match:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch match', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Fetch related data
    const { data: league } = await supabase
      .from('leagues')
      .select('*')
      .eq('slug', match.league_slug)
      .single()

    const { data: home_team } = await supabase
      .from('teams')
      .select('*')
      .eq('slug', match.home_team_slug)
      .single()

    const { data: away_team } = await supabase
      .from('teams')
      .select('*')
      .eq('slug', match.away_team_slug)
      .single()

    const enrichedMatch = {
      ...match,
      league,
      home_team,
      away_team,
    }
    
    return NextResponse.json(enrichedMatch)
  } catch (error) {
    console.error('Unexpected error fetching match:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch match', 
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
      validatedData = updateMatchInputSchema.parse(body)
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
      .from('matches')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error updating match:', error)
      return NextResponse.json(
        { 
          error: 'Failed to update match', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error updating match:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update match', 
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
      .from('matches')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Supabase error deleting match:', error)
      return NextResponse.json(
        { 
          error: 'Failed to delete match', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting match:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete match', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
