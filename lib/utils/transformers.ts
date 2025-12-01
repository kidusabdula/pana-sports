// lib/utils/transformers.ts

import { News } from '@/lib/schemas/news';

// Transform news data from API to UI format
export function transformNewsToUINews(news: News) {
  return {
    id: news.id,
    title: news.title_en,
    title_am: news.title_am,
    category: news.category?.name || 'General',
    category_slug: news.category_slug,
    image: news.thumbnail_url || '/placeholder.svg',
    date: formatDate(news.published_at), // Keep this as is
    author: news.author?.name || 'Pana Sports',
    author_avatar: news.author?.avatar_url,
    excerpt: generateExcerpt(stripHtml(news.content_en || '')),
    content: news.content_en || '',
    content_am: news.content_am || '',
    views: news.views || 0,
    comments_count: news.comments_count || 0,
    league: news.league?.name_en,
    league_slug: news.league_slug,
  };
}

// Format date function
function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

// Strip HTML tags from content
function stripHtml(html: string) {
  if (!html) return '';
  
  // Create a temporary div element
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Return the text content
  return tempDiv.textContent || tempDiv.innerText || '';
}

// Generate excerpt from content
function generateExcerpt(content: string, maxLength = 150) {
  if (!content) return '';
  
  // Strip HTML tags
  const plainText = stripHtml(content);
  
  if (plainText.length <= maxLength) return plainText;
  
  return plainText.substring(0, maxLength).trim() + '...';
}

// Transform an array of news items
export function transformNewsList(newsList: News[]) {
  return newsList.map(transformNewsToUINews);
}