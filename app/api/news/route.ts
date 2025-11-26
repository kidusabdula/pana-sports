import { createClient } from '@/lib/supabase/server'
import { createNewsInputSchema } from '@/lib/schemas/news'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Fetch news first
    const { data: newsData, error: newsError } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false })
    
    if (newsError) {
      console.error('Supabase error fetching news:', newsError)
      return NextResponse.json(
        { 
          error: 'Failed to fetch news', 
          details: newsError.message 
        },
        { status: 500 }
      )
    }

    // Fetch all leagues and authors for joining
    const { data: leagues } = await supabase.from('leagues').select('*')
    const { data: authors } = await supabase.from('authors').select('*')

    // Manually join the data
    const enrichedNews = newsData?.map(news => ({
      ...news,
      league: news.league_slug ? leagues?.find(l => l.slug === news.league_slug) : null,
      author: news.author_id ? authors?.find(a => a.id === news.author_id) : null,
    }))
    
    return NextResponse.json(enrichedNews)
  } catch (error) {
    console.error('Unexpected error fetching news:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch news', 
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
      validatedData = createNewsInputSchema.parse(body)
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
    
    // Create the news with the current user as creator
    const { data, error } = await supabase
      .from('news')
      .insert({
        ...validatedData,
        created_by: user.id,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error creating news:', error);
      return NextResponse.json(
        { 
          error: 'Failed to create news', 
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error creating news:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create news', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
