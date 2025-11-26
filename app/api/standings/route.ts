import { createClient } from '@/lib/supabase/server'
import { createStandingInputSchema } from '@/lib/schemas/standing'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('standings')
      .select('*')
      .order('rank', { ascending: true })
    
    if (error) {
      console.error('Supabase error fetching standings:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch standings', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error fetching standings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch standings', 
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
      validatedData = createStandingInputSchema.parse(body)
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
    
    // Create standing with current user as creator
    const { data, error } = await supabase
      .from('standings')
      .insert({
        ...validatedData,
        created_by: user.id,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error creating standing:', error);
      
      // Handle specific error codes
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
          error: 'Failed to create standing', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error creating standing:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create standing', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}