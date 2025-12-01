// app/api/news-categories/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: categories, error } = await supabase
      .from('news_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching news categories:', error);
      return NextResponse.json(
        { error: 'Failed to fetch news categories' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
