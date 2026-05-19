'use server'

export interface BookResult {
  id?: string;
  title: string;
  author: string;
  cover_url: string;
  page_count: number | null;
  needs_page_estimation: boolean;
}

export async function searchGoogleBooks(query: string): Promise<BookResult[]> {
  if (!query) return [];

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch from Google Books API');
  }

  const data = await response.json();

  return (data.items || []).map((item: any) => {
    const info = item.volumeInfo;
    const pageCount = info.pageCount || 0;

    return {
      title: info.title || "Untitled Document",
      author: info.authors ? info.authors.join(", ") : "Unknown Author",
      cover_url: info.imageLinks?.thumbnail || "", // Empty string to handle fallback in UI
      page_count: pageCount > 0 ? pageCount : null,
      needs_page_estimation: !pageCount || pageCount === 0,
    };
  });
}
