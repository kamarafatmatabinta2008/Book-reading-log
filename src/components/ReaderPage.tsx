'use client'

import React, { useState, useEffect } from 'react';
import { searchGutendex, getReadableUrl, GutendexBook } from '@/app/actions/gutendex';
import BookReader from '@/components/BookReader';
import { useRouter } from 'next/navigation';

interface ReaderPageProps {
  bookTitle: string;
  onClose: () => void;
}

const ReaderPage = ({ bookTitle, onClose }: ReaderPageProps) => {
  const [book, setBook] = useState<GutendexBook | null>(null);
  const [readableUrl, setReadableUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBook() {
      setIsLoading(true);
      try {
        const foundBook = await searchGutendex(bookTitle);
        if (!foundBook) {
          setError('This book is not available for free reading.');
          setIsLoading(false);
          return;
        }
        
        setBook(foundBook);
        const url = await getReadableUrl(foundBook);
        if (!url) {
          setError('No readable format found for this book.');
        } else {
          setReadableUrl(url);
          // Determine mime type based on URL extension or Gutendex format keys
          const formats = foundBook.formats;
          if (formats['text/html']) setMimeType('text/html');
          else if (formats['application/epub+zip']) setMimeType('application/epub+zip');
          else setMimeType('text/plain');
        }
      } catch (err) {
        setError('An error occurred while loading the book.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBook();
  }, [bookTitle]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium">Searching Gutendex for readable version...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-950 p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl">📚</div>
          <h2 className="text-2xl font-bold">Book Not Available</h2>
          <p className="text-gray-500">{error}</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
            <a 
              href={`https://openlibrary.org/search?q=${encodeURIComponent(bookTitle)}`}
              target="_blank"
              className="px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              View on Open Library
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-950">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-900">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          ← Back to Library
        </button>
        <span className="text-sm font-medium text-gray-400">{book?.title}</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <BookReader 
          url={readableUrl!} 
          mimeType={mimeType} 
          title={book?.title || 'Reading'} 
        />
      </div>
    </div>
  );
};

export default ReaderPage;
