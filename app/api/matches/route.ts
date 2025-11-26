import { createClient } from '@/lib/supabase/server'
import { createMatchInputSchema } from '@/lib/schemas/match'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Fetch matches first
    const { data: matchesData, error: matchesError } = await supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: true })
    
    if (matchesError) {
      console.error('Supabase error fetching matches:', matchesError)
      return NextResponse.json(
        { 
          error: 'Failed to fetch matches', 
          details: matchesError.message 
        },
        { status: 500 }
      )
    }

    // Fetch all leagues and teams for joining
    const { data: leagues } = await supabase.from('leagues').select('*')
    const { data: teams } = await supabase.from('teams').select('*')

    // Manually join the data
    const enrichedMatches = matchesData?.map(match => ({
      ...match,
      league: leagues?.find(l => l.slug === match.league_slug),
      home_team: teams?.find(t => t.slug === match.home_team_slug),
      away_team: teams?.find(t => t.slug === match.away_team_slug),
    }))
    
    return NextResponse.json(enrichedMatches)
  } catch (error) {
    console.error('Unexpected error fetching matches:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch matches', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
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
      validatedData = createMatchInputSchema.parse(body)
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
    
    // Create the match with the current user as creator
    const { data, error } = await supabase
      .from('matches')
      .insert({
        ...validatedData,
        created_by: user.id,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error creating match:', error);
      return NextResponse.json(
        { 
          error: 'Failed to create match', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error creating match:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create match', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
