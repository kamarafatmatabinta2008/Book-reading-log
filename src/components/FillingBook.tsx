'use client'

import React, { useState, useEffect, useMemo } from 'react';

interface FillingBookProps {
  currentPage: number;
  totalPages: number;
  onComplete?: () => void;
  onPageChange?: (page: number) => void;
}

const FillingBook: React.FC<FillingBookProps> = ({
  currentPage: initialPage,
  totalPages,
  onComplete,
  onPageChange
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Input validation
  const validatedPage = useMemo(() => {
    if (currentPage < 0) return 0;
    if (currentPage > totalPages) return totalPages;
    return currentPage;
  }, [currentPage, totalPages]);

  const completionPercentage = useMemo(() => {
    if (totalPages === 0) return 0;
    return (validatedPage / totalPages) * 100;
  }, [validatedPage, totalPages]);

  useEffect(() => {
    if (completionPercentage === 100 && !showFeedbackModal) {
      setShowFeedbackModal(true);
      onComplete?.();
    }
  }, [completionPercentage, onComplete, showFeedbackModal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setCurrentPage(value);
    onPageChange?.(value);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md mx-auto">
      {/* Book Progress SVG Container */}
      <div className="relative w-48 h-64 bg-white dark:bg-gray-800 border-4 border-gray-300 dark:border-gray-700 rounded-r-2xl overflow-hidden shadow-inner flex items-end">
        {/* Spine Detail */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gray-200 dark:bg-gray-700 border-r border-gray-300 dark:border-gray-600 z-10" />
        
        {/* Fill Layer */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all duration-700 ease-out"
          style={{ height: `${completionPercentage}%` }}
        />
        
        {/* Decorative SVG Overlay */}
        <svg className="absolute inset-0 w-full h-full p-6 text-gray-400 dark:text-gray-500 opacity-20 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>

        {/* Percentage Label */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <span className="text-2xl font-bold text-gray-800 dark:text-white drop-shadow-sm">
            {Math.round(completionPercentage)}%
          </span>
        </div>
      </div>

      {/* Progress Controls */}
      <div className="w-full space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Current Progress: Page {validatedPage} of {totalPages}
        </label>
        <input
          type="range"
          min="0"
          max={totalPages}
          value={validatedPage}
          onChange={handleInputChange}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <input
          type="number"
          min="0"
          max={totalPages}
          value={validatedPage}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Un-dismissible Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
            <h2 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">🎉 Book Finished!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
              Congratulations on completing your reading journey. Please share your thoughts below.
            </p>
            
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              // Mutation logic would go here
              console.log("Submitting feedback and updating library status...");
              setShowFeedbackModal(false);
            }}>
              <div>
                <label className="block text-sm font-semibold mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" className="text-2xl hover:scale-110 transition-transform">⭐</button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Comments</label>
                <textarea 
                  className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" 
                  rows={4}
                  placeholder="What did you think about this book?"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-blue-500/30"
              >
                Save Review & Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FillingBook;
