'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface LibraryCardProps {
  title: string;
  author: string;
  description: string;
  genre: string;
  price: string;
}

const LibraryCard = ({ title, author, description, genre, price }: LibraryCardProps) => {
  const [coverUrl, setCoverUrl] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    async function fetchCover() {
      try {
        const query = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=1`;
        const res = await fetch(query);
        if (!res.ok) return;
        const data = await res.json();
        const doc = data.docs?.[0];
        if (!doc) return;

        const cover = doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
          : doc.edition_key?.[0]
          ? `https://covers.openlibrary.org/b/olid/${doc.edition_key[0]}-M.jpg`
          : '';

        if (mounted && cover) setCoverUrl(cover);
      } catch {
        // ignore
      }
    }

    fetchCover();

    return () => {
      mounted = false;
    };
  }, [title, author]);

  return (
    <article className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-lg transition-shadow">
      <div className="mb-4 overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-950 h-72 flex items-center justify-center">
        {coverUrl ? (
          <img src={coverUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500 dark:text-gray-400 px-4 text-center">
            Cover loading...
          </div>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <span className={`text-sm font-semibold uppercase tracking-[0.2em] ${price === 'Free' ? 'text-green-600' : 'text-yellow-600'}`}>
          {price}
        </span>
        <span className="text-xs text-gray-400">{genre}</span>
      </div>

      <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{author}</p>
      <p className="text-sm leading-7 text-gray-600 dark:text-gray-300 mb-6">{description}</p>

      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/?reader=${encodeURIComponent(title)}`}
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-300"
        >
          Read now
        </Link>
        <span className="text-xs uppercase tracking-[0.2em] text-gray-400">Open</span>
      </div>
    </article>
  );
};

export default LibraryCard;
