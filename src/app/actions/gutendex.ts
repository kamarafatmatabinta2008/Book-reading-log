'use server'

export interface GutendexBook {
  id: number;
  title: string;
  authors: { name: string }[];
  formats: { [key: string]: string };
  downloads: number;
}

export interface GutendexSearchResponse {
  start_index: number;
  num_results: number;
  results: GutendexBook[];
}

export async function searchGutendex(title: string): Promise<GutendexBook | null> {
  try {
    const response = await fetch(`https://gutendex.com/books/?search=${encodeURIComponent(title)}`);
    
    if (!response.ok) {
      throw new Error('Gutendex API response was not ok');
    }

    const data: GutendexSearchResponse = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return null;
    }

    // Basic fuzzy match: find the result with the most similar title
    // In a real app, we'd use a library like fuse.js or string-similarity
    const bestMatch = data.results[0]; 
    
    return bestMatch;
  } catch (error) {
    console.error('Error searching Gutendex:', error);
    return null;
  }
}

export async function getReadableUrl(book: GutendexBook): Promise<string | null> {
  const formats = book.formats;
  
  // Priority: HTML -> EPUB -> Plain Text
  if (formats['text/html']) return formats['text/html'];
  if (formats['application/epub+zip']) return formats['application/epub+zip'];
  if (formats['text/plain']) return formats['text/plain'];
  
  return null;
}
