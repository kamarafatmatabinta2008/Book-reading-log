import { Suspense } from 'react';
import ResponsiveNav from '@/components/ResponsiveNav';
import ReadingWorkspace from '@/components/ReadingWorkspace';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100">
      <ResponsiveNav />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <Suspense fallback={<div className="py-20 text-center text-sm text-gray-500 dark:text-gray-400">Loading workspace...</div>}>
          <ReadingWorkspace />
        </Suspense>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-24 border-t border-gray-200 dark:border-gray-800 mt-24">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <span className="font-black tracking-tighter">REVO</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 REVO Platform. Built with Next.js & Supabase.</p>
        </div>
      </footer>
    </div>
  );
}
