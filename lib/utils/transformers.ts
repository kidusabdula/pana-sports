// /lib/utils/transformers.ts
import { News } from '@/lib/schemas/news'

export function transformNewsForCard(news: News) {
  return {
    id: news.id,
    title: news.title_en, // Default to English, could add locale logic
    excerpt: news.content_en ? news.content_en.substring(0, 150) + '...' : '',
    image: news.thumbnail_url || '/placeholder-news.jpg',
    date: new Date(news.published_at).toLocaleDateString(),
    category: news.category || 'General',
    author: news.author?.name || 'Pana Sports',
    views: news.views,
    comments: news.comments_count,
  };
}

export function transformNewsForFeaturedCard(news: News) {
  return {
    ...transformNewsForCard(news),
    featured: true,
  };
}