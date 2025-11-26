import { createClient } from '@/lib/supabase/server'
import { createTransferInputSchema } from '@/lib/schemas/transfer'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Fetch transfers first
    const { data: transfersData, error: transfersError } = await supabase
      .from('transfers')
      .select('*')
      .order('date', { ascending: false })
    
    if (transfersError) {
      console.error('Supabase error fetching transfers:', transfersError)
      return NextResponse.json(
        { 
          error: 'Failed to fetch transfers', 
          details: transfersError.message 
        },
        { status: 500 }
      )
    }

    // Fetch all players and teams for joining
    const { data: players } = await supabase.from('players').select('id, name_en, name_am, slug')
    const { data: teams } = await supabase.from('teams').select('id, name_en, name_am, slug, logo_url')

    // Manually join the data
    const enrichedTransfers = transfersData?.map(transfer => ({
      ...transfer,
      player: players?.find(p => p.slug === transfer.player_slug),
      from_team: transfer.from_team_slug ? teams?.find(t => t.slug === transfer.from_team_slug) : null,
      to_team: teams?.find(t => t.slug === transfer.to_team_slug),
    }))
    
    return NextResponse.json(enrichedTransfers)
  } catch (error) {
    console.error('Unexpected error fetching transfers:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch transfers', 
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
      validatedData = createTransferInputSchema.parse(body)
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
      .from('transfers')
      .insert({
        ...validatedData,
        created_by: user.id,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error creating transfer:', error);
      return NextResponse.json(
        { 
          error: 'Failed to create transfer', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error creating transfer:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create transfer', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
