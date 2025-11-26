import { createClient } from '@/lib/supabase/server'
import { createTopScorerInputSchema } from '@/lib/schemas/topScorer'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('top_scorers')
      .select('*')
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
    
    console.log('Request body:', body); // Log the incoming data
    
    let validatedData;
    try {
      validatedData = createTopScorerInputSchema.parse(body)
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
    
    // Create top scorer with current user as creator
    const { data, error } = await supabase
      .from('top_scorers')
      .insert({
        ...validatedData,
        created_by: user.id,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error creating top scorer:', error);
      
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
      
      if (error.code === '23502') {
        return NextResponse.json(
          { 
            error: 'Required field is missing', 
            details: error.details || 'Please check all required fields' 
          },
          { status: 400 }
        )
      }
      
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