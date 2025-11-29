// lib/utils/transformers.ts
import { News } from '@/lib/schemas/news'

// Transform news data from API to UI format
export function transformNewsToUINews(news: News) {
  return {
    id: news.id,
    title: news.title_en, // Using English title for now, could add locale logic
    category: news.category || 'General',
    image: news.thumbnail_url || '/placeholder.svg',
    date: formatDate(news.published_at),
    author: news.author?.name || 'Pana Sports',
    excerpt: generateExcerpt(news.content_en || ''),
    content: news.content_en || '',
  }
}

// Format date to a more readable format
function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60))
      return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`
    }
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }
}

// Generate excerpt from content
function generateExcerpt(content: string, maxLength = 150) {
  if (!content) return ''
  
  // Strip HTML tags
  const plainText = content.replace(/<[^>]*>/g, '')
  
  if (plainText.length <= maxLength) return plainText
  
  return plainText.substring(0, maxLength).trim() + '...'
}

// Transform an array of news items
export function transformNewsList(newsList: News[]) {
  return newsList.map(transformNewsToUINews)
}