'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DemoContainer from '@/components/DemoContainer';
import FillingBook from '@/components/FillingBook';
import ReaderPage from '@/components/ReaderPage';
import type { BookResult } from '@/app/actions/openlibrary';

const ReadingWorkspace = () => {
  const searchParams = useSearchParams();
  const [selectedBook, setSelectedBook] = useState<BookResult | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const streakPercentage = selectedBook ? Math.round((currentPage / (selectedBook.page_count || 300)) * 100) : 0;

  const handleBookSelect = (book: BookResult) => {
    setSelectedBook(book);
    setCurrentPage(0);
    setIsReading(true);
  };

  useEffect(() => {
    const readerTitle = searchParams.get('reader');
    if (readerTitle && !selectedBook) {
      setSelectedBook({
        id: readerTitle,
        title: readerTitle,
        author: 'Classic Read',
        cover_url: '',
        page_count: null,
        needs_page_estimation: true,
      });
      setCurrentPage(0);
      setIsReading(true);
    }
  }, [searchParams, selectedBook]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-16">
          <DemoContainer onBookSelect={handleBookSelect} showWorkspace={false} />
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-orange-500 text-xl">📖</span>
              <div>
                <h3 className="text-lg font-bold">E-Reader Workspace</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Track your active reading session and streak status.</p>
              </div>
            </div>

            {selectedBook ? (
              <div className="space-y-5">
                <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-3xl border border-gray-100 dark:border-gray-800">
                  <h4 className="text-xl font-bold mb-2">{selectedBook.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{selectedBook.author}</p>
                  <p className="text-sm text-blue-600">{selectedBook.page_count ? `${selectedBook.page_count} pages` : 'Page count unknown'}</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-3xl border border-blue-100 dark:border-blue-800">
                  <FillingBook
                    currentPage={currentPage}
                    totalPages={selectedBook.page_count || 300}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Current streak</h4>
                  <p className="text-sm text-blue-800/90 dark:text-blue-200/90">
                    Your reading session is live. Your streak fill is currently {streakPercentage}%.
                  </p>
                  <p className="text-sm text-blue-800/90 dark:text-blue-200/90 mt-2">
                    Page {currentPage} of {selectedBook?.page_count || 300}.
                  </p>
                </div>

                <button
                  onClick={() => setIsReading(true)}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  Continue Reading
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-gray-500 dark:text-gray-400">
                <div className="h-32 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center">
                  <p className="text-center px-4">Select a book from the library to load it into your workspace.</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-3xl border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-800/90 dark:text-blue-200/90">
                    Your streak panel will update once you start reading. Keep going every day.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-500/20">
            <h3 className="text-xl font-bold mb-2">Build momentum</h3>
            <p className="text-blue-100 text-sm">
              The sidebar now shows the active book for your reading streak.
            </p>
          </div>
        </aside>
      </div>

      {isReading && selectedBook && (
        <ReaderPage bookTitle={selectedBook.title} onClose={() => setIsReading(false)} />
      )}
    </>
  );
};

export default ReadingWorkspace;
