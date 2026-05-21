'use client'

import React, { useEffect, useRef, useState } from 'react';
import ePub from 'epubjs';

interface BookReaderProps {
  url: string;
  mimeType: string;
  title: string;
  onProgressChange?: (progress: number) => void;
}

const BookReader: React.FC<BookReaderProps> = ({ url, mimeType, title, onProgressChange }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const savedProgress = localStorage.getItem(`book-progress-${title}`);
    if (savedProgress) {
      setProgress(parseFloat(savedProgress));
    }
  }, [title]);

  useEffect(() => {
    if (!viewerRef.current) return;

    if (mimeType === 'application/epub+zip') {
      const book = ePub(url);
      const rendition = book.renderTo(viewerRef.current, {
        width: '100%',
        height: '100%',
        flow: 'paginated',
      });

      book.ready.then(() => {
        return rendition.display();
      });

      // Apply font size to EPUB
      rendition.themes.fontSize(fontSize + 'px');

      rendition.on('relocated', (location: any) => {
        const prog = location.start.percentage;
        setProgress(prog);
        localStorage.setItem(`book-progress-${title}`, prog.toString());
        onProgressChange?.(prog);
      });

      return () => {
        book.destroy();
      };
    } else if (mimeType === 'text/html') {
      // Use an iframe for HTML to avoid CSS conflicts and provide a cleaner reading experience.
      // Create the iframe element and set its src to the proxied URL so headers/CSP are controlled server-side.
      viewerRef.current!.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.className = 'w-full h-full border-none rounded-lg';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.setAttribute('referrerpolicy', 'no-referrer');
      viewerRef.current!.appendChild(iframe);
      return () => {
        try {
          iframe.remove();
        } catch {}
      };
    } else {
      fetch(url)
        .then(res => res.text())
        .then(text => {
          viewerRef.current!.innerText = text;
          viewerRef.current!.style.whiteSpace = 'pre-wrap';
          viewerRef.current!.style.minHeight = '100%';
        });
    }
  }, [url, mimeType, title, onProgressChange, fontSize]);

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h3 className="font-bold truncate max-w-xs">{title}</h3>
          <div className="flex items-center gap-2 ml-4">
            <button 
              onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              A-
            </button>
            <button 
              onClick={() => setFontSize(prev => Math.min(32, prev + 2))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              A+
            </button>
          </div>
        </div>
        
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {/* Reader Area */}
      <div className="flex-1 overflow-hidden p-4 md:p-12">
        <div 
          ref={viewerRef} 
          className="max-w-3xl mx-auto h-full transition-all duration-200"
          style={{ fontSize: `${fontSize}px` }}
        />
      </div>
    </div>
  );
};

export default BookReader;
