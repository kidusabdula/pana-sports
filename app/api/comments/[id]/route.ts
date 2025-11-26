import { createClient } from '@/lib/supabase/server'
import { updateCommentInputSchema } from '@/lib/schemas/comment'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: comment, error } = await supabase
      .from('comments')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Supabase error fetching comment:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch comment', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Fetch related data
    const { data: news } = await supabase
      .from('news')
      .select('id, title_en, title_am')
      .eq('id', comment.news_id)
      .single()

    const enrichedComment = {
      ...comment,
      news,
      user: null,
    }
    
    return NextResponse.json(enrichedComment)
  } catch (error) {
    console.error('Unexpected error fetching comment:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch comment', 
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
      validatedData = updateCommentInputSchema.parse(body)
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
      .from('comments')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error updating comment:', error)
      return NextResponse.json(
        { 
          error: 'Failed to update comment', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error updating comment:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update comment', 
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
      .from('comments')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Supabase error deleting comment:', error)
      return NextResponse.json(
        { 
          error: 'Failed to delete comment', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting comment:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete comment', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
