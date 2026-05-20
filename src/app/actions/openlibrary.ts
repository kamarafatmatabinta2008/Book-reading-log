'use server'

export interface BookResult {
  id?: string;
  title: string;
  author: string;
  cover_url: string;
  page_count: number | null;
  needs_page_estimation: boolean;
}

export async function searchOpenLibrary(query: string): Promise<BookResult[]> {
  if (!query) return [];

  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch from Open Library API');
  }

  const data = await response.json();

  return (data.docs || []).map((doc: any) => {
    const pageCount = doc.number_of_pages_median ?? null;
    const coverUrl = doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : '';

    return {
      id: doc.key || doc.edition_key?.[0] || doc.title,
      title: doc.title || 'Untitled Document',
      author: doc.author_name ? doc.author_name.join(', ') : 'Unknown Author',
      cover_url: coverUrl,
      page_count: typeof pageCount === 'number' && pageCount > 0 ? pageCount : null,
      needs_page_estimation: !pageCount || pageCount === 0,
    };
  });
}
