'use client'

import React, { useState } from 'react';
import { searchOpenLibrary, BookResult } from '@/app/actions/google-books';
import FillingBook from '@/components/FillingBook';
import ReaderPage from '@/components/ReaderPage';

const DemoContainer = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookResult[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const books = await searchOpenLibrary(query);
      setResults(books);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadBook = (book: BookResult) => {
    setSelectedBook(book);
    setIsReading(true);
  };

  return (
    <div className="space-y-12">
      {/* Search Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4">Find a Book</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or ISBN..."
            className="flex-1 p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map((book, idx) => (
            <div 
              key={idx}
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
          ))}
        </div>
      </section>

      {/* Reader Workspace Section */}
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

      {isReading && selectedBook && (
        <ReaderPage 
          bookTitle={selectedBook.title} 
          onClose={() => setIsReading(false)} 
        />
      )}
    </div>
  );
};

export default DemoContainer;
