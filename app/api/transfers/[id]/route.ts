import { createClient } from '@/lib/supabase/server'
import { updateTransferInputSchema } from '@/lib/schemas/transfer'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: transfer, error } = await supabase
      .from('transfers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Supabase error fetching transfer:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch transfer', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    if (!transfer) {
      return NextResponse.json(
        { error: 'Transfer not found' },
        { status: 404 }
      )
    }

    // Fetch related data
    const { data: player } = await supabase
      .from('players')
      .select('id, name_en, name_am, slug')
      .eq('slug', transfer.player_slug)
      .single()

    const { data: from_team } = transfer.from_team_slug ? await supabase
      .from('teams')
      .select('id, name_en, name_am, slug, logo_url')
      .eq('slug', transfer.from_team_slug)
      .single() : { data: null }

    const { data: to_team } = await supabase
      .from('teams')
      .select('id, name_en, name_am, slug, logo_url')
      .eq('slug', transfer.to_team_slug)
      .single()

    const enrichedTransfer = {
      ...transfer,
      player,
      from_team,
      to_team,
    }
    
    return NextResponse.json(enrichedTransfer)
  } catch (error) {
    console.error('Unexpected error fetching transfer:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch transfer', 
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
      validatedData = updateTransferInputSchema.parse(body)
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
      .from('transfers')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error updating transfer:', error)
      return NextResponse.json(
        { 
          error: 'Failed to update transfer', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error updating transfer:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update transfer', 
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
      .from('transfers')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Supabase error deleting transfer:', error)
      return NextResponse.json(
        { 
          error: 'Failed to delete transfer', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting transfer:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete transfer', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
