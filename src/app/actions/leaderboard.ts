'use server'

import { cookies } from 'next/headers';

export interface TrendingBook {
  id: string;
  title: string;
  author: string;
  engagement_score: number;
  cover_url: string;
}

/**
 * Discovery Matrix Logic:
 * Engagement Score = Unique Clicks + (Active Reading Sessions * 2.5)
 * 
 * throttling: uses cookies to track unique clicks per session
 */
export async function getTrendingBooks(): Promise<TrendingBook[]> {
  // In a real app, you'd use a Supabase client here:
  // const { data, error } = await supabase.from('books').select('*').order('engagement_score', { ascending: false }).limit(10);
  
  // Mocking the query for now as per instructions
  return [
    {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      engagement_score: 450.5,
      cover_url: "https://example.com/gatsby.jpg"
    },
    {
      id: "2",
      title: "1984",
      author: "George Orwell",
      engagement_score: 320.0,
      cover_url: "https://example.com/1984.jpg"
    }
  ];
}

export async function incrementUniqueClick(bookId: string) {
  const cookieStore = await cookies();
  const clickKey = `clicked_${bookId}`;
  
  // Anti-spam throttling check
  if (cookieStore.has(clickKey)) {
    return { success: false, message: "Click already registered for this session" };
  }

  // Set cookie to expire in 24 hours to prevent spamming
  cookieStore.set(clickKey, 'true', { maxAge: 60 * 60 * 24 });

  // Here you would execute the Supabase update:
  // await supabase.rpc('increment_unique_click', { book_id: bookId });
  
  console.log(`Incremented unique click for book: ${bookId}`);
  return { success: true };
}
