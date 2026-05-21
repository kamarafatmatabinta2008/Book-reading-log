'use client'

import React, { useState, useEffect } from 'react';
import type { BookResult } from '@/app/actions/openlibrary';
import FillingBook from '@/components/FillingBook';
import ReaderPage from '@/components/ReaderPage';

interface DemoContainerProps {
  onBookSelect?: (book: BookResult) => void;
  showWorkspace?: boolean;
}

const DemoContainer = ({ onBookSelect, showWorkspace = true }: DemoContainerProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookResult[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const defaultBooks: BookResult[] = [
    { id: 'default-pride-and-prejudice', title: "Pride and Prejudice", author: 'Jane Austen', cover_url: '', page_count: null, needs_page_estimation: true },
    { id: 'default-moby-dick', title: 'Moby-Dick', author: 'Herman Melville', cover_url: '', page_count: null, needs_page_estimation: true },
    { id: 'default-dracula', title: 'Dracula', author: 'Bram Stoker', cover_url: '', page_count: null, needs_page_estimation: true },
    { id: 'default-frankenstein', title: 'Frankenstein', author: 'Mary Shelley', cover_url: '', page_count: null, needs_page_estimation: true },
    { id: 'default-sherlock', title: 'The Adventures of Sherlock Holmes', author: 'Arthur Conan Doyle', cover_url: '', page_count: null, needs_page_estimation: true },
    { id: 'default-alice', title: "Alice's Adventures in Wonderland", author: 'Lewis Carroll', cover_url: '', page_count: null, needs_page_estimation: true },
    { id: 'default-treasure-island', title: 'Treasure Island', author: 'Robert Louis Stevenson', cover_url: '', page_count: null, needs_page_estimation: true },
    { id: 'default-around-the-world', title: 'Around the World in Eighty Days', author: 'Jules Verne', cover_url: '', page_count: null, needs_page_estimation: true },
    { id: 'default-jekyll-hyde', title: 'The Strange Case of Dr. Jekyll and Mr. Hyde', author: 'Robert Louis Stevenson', cover_url: '', page_count: null, needs_page_estimation: true },
    { id: 'default-dorian-gray', title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', cover_url: '', page_count: null, needs_page_estimation: true },
    { id: 'default-meditations', title: 'Meditations', author: 'Marcus Aurelius', cover_url: '', page_count: null, needs_page_estimation: true },
    { id: 'default-art-of-war', title: 'The Art of War', author: 'Sun Tzu', cover_url: '', page_count: null, needs_page_estimation: true },
    { id: 'default-as-a-man-thinketh', title: 'As a Man Thinketh', author: 'James Allen', cover_url: '', page_count: null, needs_page_estimation: true },
    { id: 'default-time-machine', title: 'The Time Machine', author: 'H. G. Wells', cover_url: '', page_count: null, needs_page_estimation: true },
    { id: 'default-20000-leagues', title: 'Twenty Thousand Leagues Under the Seas', author: 'Jules Verne', cover_url: '', page_count: null, needs_page_estimation: true },
    { id: 'default-iliad', title: 'The Iliad', author: 'Homer', cover_url: '', page_count: null, needs_page_estimation: true },
    { id: 'default-tale-of-two-cities', title: 'A Tale of Two Cities', author: 'Charles Dickens', cover_url: '', page_count: null, needs_page_estimation: true },
    { id: 'default-crime-and-punishment', title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', cover_url: '', page_count: null, needs_page_estimation: true },
  ];

  const [defaultBooksState, setDefaultBooksState] = useState<BookResult[]>(defaultBooks);

  useEffect(() => {
    let mounted = true;

    async function fetchCovers() {
      const updated = await Promise.all(defaultBooks.map(async (b) => {
        try {
          const q = `https://openlibrary.org/search.json?title=${encodeURIComponent(b.title)}&author=${encodeURIComponent(b.author)}&limit=1`;
          const res = await fetch(q);
          if (!res.ok) return b;
          const data = await res.json();
          const doc = data.docs && data.docs[0];
          if (!doc) return b;

          const cover = doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
            : (doc.edition_key && doc.edition_key[0])
              ? `https://covers.openlibrary.org/b/olid/${doc.edition_key[0]}-M.jpg`
              : b.cover_url;

          return { ...b, cover_url: cover || b.cover_url };
        } catch (e) {
          return b;
        }
      }));

      if (mounted) setDefaultBooksState(updated);
    }

    fetchCovers();

    return () => { mounted = false; };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resp = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12`);
      if (!resp.ok) throw new Error('Search failed');
      const data = await resp.json();
      const books: BookResult[] = (data.docs || []).map((doc: any) => {
        const pageCount = (doc.number_of_pages_median ?? doc.number_of_pages) || null;
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

      setResults(books);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadBook = (book: BookResult) => {
    if (onBookSelect) {
      onBookSelect(book);
      return;
    }

    setSelectedBook(book);
    setIsReading(true);
  };

  return (
    <div className="space-y-12">
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4">Find a Book</h2>
        <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or ISBN..."
            className="flex-1 min-w-0 p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(() => {
            const isSearching = query.trim().length > 0;
            const displayBooks: BookResult[] = isSearching ? results : defaultBooksState;

            return displayBooks.map((book, idx) => (
              <div
                key={book.id ?? idx}
                onClick={() => handleReadBook(book)}
                className="p-4 border rounded-xl hover:border-blue-500 cursor-pointer transition-colors flex gap-4 items-start bg-gray-50 dark:bg-gray-900"
              >
                {book.cover_url ? (
                  <img src={book.cover_url} alt={book.title} className="w-16 h-24 object-cover rounded shadow" />
                ) : (
                  <div className="w-16 h-24 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs text-center p-1">No Cover</div>
                )}
                <div>
                  <h3 className="font-bold line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{book.author}</p>
                  <p className="text-xs mt-2 text-blue-600">{book.page_count ? `${book.page_count} pages` : 'Page count unknown'}</p>
                </div>
              </div>
            ));
          })()}
        </div>
      </section>

      {showWorkspace && (
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 rounded-lg">📖</span>
            E-Reader Workspace
          </h2>

          {selectedBook ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{selectedBook.title}</h3>
                  <p className="text-gray-500 text-lg">{selectedBook.author}</p>
                </div>

                <FillingBook
                  currentPage={0}
                  totalPages={selectedBook.page_count || 300}
                />
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Reading Note</h4>
                  <p className="text-sm text-blue-800/80 dark:text-blue-200/80">
                    Your progress is being synced to your multi-device cloud library.
                    Reach 100% to unlock the feedback matrix.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center text-gray-400">
              <p className="text-lg">Select a book from search to start reading</p>
            </div>
          )}
        </section>
      )}

      {!onBookSelect && isReading && selectedBook && (
        <ReaderPage
          bookTitle={selectedBook.title}
          onClose={() => setIsReading(false)}
        />
      )}
    </div>
  );
};

export default DemoContainer;
