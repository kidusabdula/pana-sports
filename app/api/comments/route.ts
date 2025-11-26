import { createClient } from '@/lib/supabase/server'
import { createCommentInputSchema } from '@/lib/schemas/comment'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Fetch comments first
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (commentsError) {
      console.error('Supabase error fetching comments:', commentsError)
      return NextResponse.json(
        { 
          error: 'Failed to fetch comments', 
          details: commentsError.message 
        },
        { status: 500 }
      )
    }

    // Fetch all news for joining
    const { data: news } = await supabase.from('news').select('id, title_en, title_am')

    // Manually join the data
    const enrichedComments = commentsData?.map(comment => ({
      ...comment,
      news: news?.find(n => n.id === comment.news_id),
      user: null, // User data would come from auth.users which requires admin access
    }))
    
    return NextResponse.json(enrichedComments)
  } catch (error) {
    console.error('Unexpected error fetching comments:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch comments', 
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
      validatedData = createCommentInputSchema.parse(body)
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
    
    // Create the comment with the current user
    const { data, error } = await supabase
      .from('comments')
      .insert({
        ...validatedData,
        user_id: user.id,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error creating comment:', error);
      return NextResponse.json(
        { 
          error: 'Failed to create comment', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error creating comment:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create comment', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
