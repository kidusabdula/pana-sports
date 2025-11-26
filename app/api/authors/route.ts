import { createClient } from '@/lib/supabase/server'
import { createAuthorInputSchema } from '@/lib/schemas/author'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) {
      console.error('Supabase error fetching authors:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch authors', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error fetching authors:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch authors', 
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
      validatedData = createAuthorInputSchema.parse(body)
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
      .from('authors')
      .insert({
        ...validatedData,
        created_by: user.id,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error creating author:', error);
      return NextResponse.json(
        { 
          error: 'Failed to create author', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error creating author:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create author', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
