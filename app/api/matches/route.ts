// app/api/matches/route.ts
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const date = searchParams.get('date')
    const limit = searchParams.get('limit')
    
    console.log(`Fetching matches with params: status=${status}, date=${date}, limit=${limit}`)
    
    const supabase = await createClient()
    
    let query = supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!home_team_slug(*),
        away_team:teams!away_team_slug(*),
        league:leagues!league_slug(*)
      `)
    
    // Apply status filter if provided
    if (status) {
      query = query.eq('status', status)
    }
    
    // Apply date filter if provided
    if (date === 'today') {
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
      
      query = query
        .gte('date', startOfDay.toISOString())
        .lt('date', endOfDay.toISOString())
    }
    
    // Apply limit if provided
    if (limit) {
      query = query.limit(parseInt(limit))
    }
    
    const { data: matchesData, error: matchesError } = await query
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
    
    console.log(`Successfully fetched ${matchesData?.length || 0} matches`)
    
    return NextResponse.json(matchesData)
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
    
    console.log('Creating match with data:', body)
    
    const supabase = await createClient()
    
    // Create match with current user as creator
    const { data, error } = await supabase
      .from('matches')
      .insert({
        ...body,
        created_by: user.id,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error creating match:', error)
      return NextResponse.json(
        { 
          error: 'Failed to create match', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    console.log('Successfully created match:', data)
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error creating match:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create match', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}