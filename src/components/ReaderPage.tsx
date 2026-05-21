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
  const [progress, setProgress] = useState(12);
  const [stage, setStage] = useState('Finding the best free edition...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: number | null = null;

    if (isLoading) {
      setProgress(12);
      setStage('Finding the best free edition...');
      interval = window.setInterval(() => {
        setProgress((current) => {
          if (current >= 92) {
            return current;
          }
          return Math.min(current + Math.floor(Math.random() * 8) + 4, 92);
        });
      }, 180);
    }

    return () => {
      if (interval !== null) window.clearInterval(interval);
    };
  }, [isLoading]);

  useEffect(() => {
    if (progress <= 35) {
      setStage('Finding the best free edition...');
    } else if (progress <= 70) {
      setStage('Preparing the reader experience...');
    } else if (progress < 100) {
      setStage('Almost ready — opening your book...');
    }
  }, [progress]);

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
          const formats = foundBook.formats;
          if (formats['text/html']) setMimeType('text/html');
          else if (formats['application/epub+zip']) setMimeType('application/epub+zip');
          else setMimeType('text/plain');
        }
      } catch (err) {
        setError('An error occurred while loading the book.');
      } finally {
        setProgress(100);
        setStage('Opening your reader...');
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      }
    }

    fetchBook();
  }, [bookTitle]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-gray-950/95 p-6 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-[2rem] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-[0_40px_120px_rgba(15,23,42,0.2)] p-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/20">
              <span className="text-3xl">📗</span>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-600 dark:text-blue-300">Book Reader</p>
              <h2 className="mt-3 text-3xl font-black text-gray-900 dark:text-white">Preparing your chapter</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl bg-gray-100 dark:bg-gray-800 p-4 text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{stage}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we open the reader.</p>
              </div>
              <div className="rounded-3xl bg-gray-100 dark:bg-gray-800 p-4 text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{progress}% complete</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">This may take a moment for larger books.</p>
              </div>
            </div>

            <div className="w-full">
              <div className="h-2.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">loading reader…</p>
            </div>
          </div>
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
        {
          // Use a proxied URL so production can load remote resources without CORS/X-Frame blocks
        }
        <BookReader
          url={readableUrl ? `/api/proxy?url=${encodeURIComponent(readableUrl)}` : ''}
          mimeType={mimeType}
          title={book?.title || 'Reading'}
        />
      </div>
    </div>
  );
};

export default ReaderPage;
