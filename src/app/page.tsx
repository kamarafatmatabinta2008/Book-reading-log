import DemoContainer from "@/components/DemoContainer";
import { getTrendingBooks } from "@/app/actions/leaderboard";

export default async function Home() {
  const trendingBooks = await getTrendingBooks();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full backdrop-blur border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-950/75">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <h1 className="text-xl font-black tracking-tighter">READ_MATRIX</h1>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 text-sm font-medium hover:text-blue-600 transition-colors">Library</button>
            <button className="px-4 py-2 text-sm font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full">Sign In</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-16">
            <header className="space-y-4">
              <h2 className="text-5xl font-black tracking-tight lg:text-6xl">
                Your reading, <br />
                <span className="text-blue-600">synchronized.</span>
              </h2>
              <p className="text-xl text-gray-500 dark:text-gray-400 max-w-xl">
                The native e-reader workspace with real-time progress tracking, 
                global discovery, and multi-device cloud sync.
              </p>
            </header>

            <DemoContainer />
          </div>

          {/* Sidebar / Leaderboard */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="text-orange-500">🔥</span>
                Discovery Matrix
              </h3>
              
              <div className="space-y-6">
                {trendingBooks.map((book, idx) => (
                  <div key={book.id} className="flex gap-4 items-center group cursor-pointer">
                    <div className="text-2xl font-black text-gray-200 dark:text-gray-800 tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold group-hover:text-blue-600 transition-colors line-clamp-1">{book.title}</h4>
                      <p className="text-xs text-gray-500">{book.author}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                        {Math.round(book.engagement_score)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-8 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors border-t border-gray-100 dark:border-gray-800">
                View Full Leaderboard
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-500/20">
              <h3 className="text-xl font-bold mb-2">Join the Collective</h3>
              <p className="text-blue-100 text-sm mb-6">
                Create an account to save your library, track habits, and compete on the global matrix.
              </p>
              <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-black shadow-lg">
                Create Free Account
              </button>
            </div>
          </aside>

        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-24 border-t border-gray-200 dark:border-gray-800 mt-24">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <span className="font-black tracking-tighter">READ_MATRIX</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 READ_MATRIX Platform. Built with Next.js & Supabase.</p>
        </div>
      </footer>
    </div>
  );
}
