'use server'

import { cookies } from 'next/headers';
import { createAnonClient } from '@/lib/supabase/client';

export interface TrendingBook {
  id: string;
  title: string;
  author: string;
  engagement_score: number;
  cover_url: string;
}

const FALLBACK_BOOKS: TrendingBook[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    engagement_score: 450.5,
    cover_url: "https://books.google.com/books/content?id=iXn5U2IzVH0C&printsec=frontcover&img=1&zoom=1",
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    engagement_score: 320.0,
    cover_url: "https://books.google.com/books/content?id=kotPYEqx7kMC&printsec=frontcover&img=1&zoom=1",
  },
];

/**
 * Discovery Matrix Logic:
 * Engagement Score = Unique Clicks + (Active Reading Sessions * 2.5)
 *
 * throttling: uses cookies to track unique clicks per session
 */
export async function getTrendingBooks(): Promise<TrendingBook[]> {
  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from('books')
      .select('id, title, author, engagement_score, cover_url')
      .order('engagement_score', { ascending: false })
      .limit(10);

    if (error || !data?.length) {
      if (error) console.error('getTrendingBooks:', error.message);
      return FALLBACK_BOOKS;
    }

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      author: row.author,
      engagement_score: Number(row.engagement_score),
      cover_url: row.cover_url ?? '',
    }));
  } catch (err) {
    console.error('getTrendingBooks:', err);
    return FALLBACK_BOOKS;
  }
}

export async function incrementUniqueClick(bookId: string) {
  const cookieStore = await cookies();
  const clickKey = `clicked_${bookId}`;

  if (cookieStore.has(clickKey)) {
    return { success: false, message: "Click already registered for this session" };
  }

  cookieStore.set(clickKey, 'true', { maxAge: 60 * 60 * 24 });

  try {
    const supabase = createAnonClient();
    const { error } = await supabase.rpc('increment_unique_click', {
      book_id: bookId,
    });

    if (error) {
      console.error('incrementUniqueClick:', error.message);
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('incrementUniqueClick:', err);
    return { success: false, message: 'Failed to record click' };
  }
}
