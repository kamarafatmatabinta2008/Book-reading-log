import Link from "next/link";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 flex flex-col">
      <nav className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-950/75 backdrop-blur">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-black tracking-tighter">READ_MATRIX</span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-black tracking-tight">{title}</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{subtitle}</p>
          </header>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            {children}
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">{footer}</p>
        </div>
      </main>
    </div>
  );
}
