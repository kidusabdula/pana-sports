// app/api/top-scorers/route.ts
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const league = searchParams.get('league')
    
    const supabase = await createClient()
    
    let query = supabase
      .from('top_scorers')
      .select(`
        *,
        player:players!player_slug(*),
        team:teams!team_slug(*),
        league:leagues!league_slug(*)
      `)
    
    // Apply league filter if provided
    if (league) {
      query = query.eq('league_slug', league)
    }
    
    const { data, error } = await query
      .order('goals', { ascending: false })
    
    if (error) {
      console.error('Supabase error fetching top scorers:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch top scorers', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error fetching top scorers:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch top scorers', 
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
    
    // Validate with schema (you would need to import the appropriate schema)
    // let validatedData;
    // try {
    //   validatedData = createTopScorerInputSchema.parse(body)
    // } catch (validationError) {
    //   console.error('Validation error:', validationError);
    //   return NextResponse.json(
    //     { 
    //       error: 'Invalid input data', 
    //       details: validationError instanceof Error ? validationError.message : 'Unknown validation error' 
    //     },
    //     { status: 400 }
    //   )
    // }
    
    const supabase = await createClient()
    
    // Create top scorer with current user as creator
    const { data, error } = await supabase
      .from('top_scorers')
      .insert({
        ...body,
        created_by: user.id,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error creating top scorer:', error);
      return NextResponse.json(
        { 
          error: 'Failed to create top scorer', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error creating top scorer:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create top scorer', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}