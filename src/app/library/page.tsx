import Link from 'next/link';
import NavAuth from '@/components/NavAuth';
import LibraryCard from '@/components/LibraryCard';

const libraryBooks = [
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A sharp social comedy about love, class, and the dance of courtship.',
    genre: 'Classic',
    price: 'Free',
  },
  {
    title: 'Moby-Dick',
    author: 'Herman Melville',
    description: 'A seafaring epic of obsession, whaling, and the price of revenge.',
    genre: 'Adventure',
    price: 'Free',
  },
  {
    title: 'Dracula',
    author: 'Bram Stoker',
    description: 'A gothic vampire tale of terror, suspicion, and dark immortality.',
    genre: 'Horror',
    price: 'Free',
  },
  {
    title: 'Frankenstein',
    author: 'Mary Shelley',
    description: 'A haunting story of creation, ambition, and what it means to be human.',
    genre: 'Science Fiction',
    price: 'Free',
  },
  {
    title: "Alice's Adventures in Wonderland",
    author: 'Lewis Carroll',
    description: 'A whimsical journey through a surreal world of curious characters and riddles.',
    genre: 'Fantasy',
    price: 'Free',
  },
  {
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    description: 'A collection of brilliant mysteries solved by London’s greatest detective.',
    genre: 'Mystery',
    price: 'Free',
  },
  {
    title: 'Treasure Island',
    author: 'Robert Louis Stevenson',
    description: 'A classic pirate adventure full of mutiny, maps, and hidden treasure.',
    genre: 'Adventure',
    price: 'Free',
  },
  {
    title: 'The Time Machine',
    author: 'H. G. Wells',
    description: 'A visionary time-travel adventure into the far future and human destiny.',
    genre: 'Science Fiction',
    price: 'Free',
  },
  {
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    description: 'A dark portrait of beauty, corruption, and the cost of eternal youth.',
    genre: 'Philosophy',
    price: 'Free',
  },
  {
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    description: 'A gripping psychological drama of guilt, morality, and redemption.',
    genre: 'Psychological',
    price: 'Free',
  },
  {
    title: 'The Iliad',
    author: 'Homer',
    description: 'A sweeping epic of heroes, gods, and the fury of war at Troy.',
    genre: 'Epic',
    price: 'Free',
  },
  {
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    description: 'A passionate tale of independence, love, and moral courage.',
    genre: 'Romance',
    price: 'Free',
  },
  {
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    description: 'A stormy romance set on the windswept Yorkshire moors.',
    genre: 'Romance',
    price: 'Free',
  },
  {
    title: 'The Secret Garden',
    author: 'Frances Hodgson Burnett',
    description: 'A gentle story about healing, friendship, and a hidden garden reborn.',
    genre: 'Children',
    price: 'Free',
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    description: 'A moving parable about following your dreams and discovering your destiny.',
    genre: 'Philosophical',
    price: '$9.99',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'A modern guide to building powerful habits and breaking bad ones with ease.',
    genre: 'Self-Help',
    price: '$12.99',
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'A sweeping science fiction saga of politics, desert worlds, and messianic prophecy.',
    genre: 'Science Fiction',
    price: '$14.99',
  },
  {
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    description: 'A twisty psychological thriller about a woman who stops speaking after a violent crime.',
    genre: 'Thriller',
    price: '$11.99',
  },
  {
    title: 'Becoming',
    author: 'Michelle Obama',
    description: 'A revealing memoir from the former first lady on family, power, and purpose.',
    genre: 'Memoir',
    price: '$18.99',
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    description: 'A bold history of humanity that explores how we became what we are today.',
    genre: 'History',
    price: '$21.99',
  },
  {
    title: 'The Night Circus',
    author: 'Erin Morgenstern',
    description: 'A lyrical fantasy of a magical rivalry played out inside an enchanted circus.',
    genre: 'Fantasy',
    price: '$13.99',
  },
  {
    title: 'Ready Player One',
    author: 'Ernest Cline',
    description: 'A fast-paced sci-fi adventure through a virtual world full of puzzles and nostalgia.',
    genre: 'Science Fiction',
    price: '$15.99',
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description: 'A charming prelude to a mythic fantasy quest through Middle-earth.',
    genre: 'Fantasy',
    price: '$12.99',
  },
  {
    title: 'The Subtle Art of Not Giving a F*ck',
    author: 'Mark Manson',
    description: 'A blunt self-help guide to focusing on what really matters and letting go of the rest.',
    genre: 'Self-Help',
    price: '$11.99',
  },
  {
    title: 'The Art of War',
    author: 'Sun Tzu',
    description: 'An ancient manual on strategy, leadership, and winning without fighting.',
    genre: 'Strategy',
    price: 'Free',
  },
  {
    title: 'Meditations',
    author: 'Marcus Aurelius',
    description: 'Stoic reflections on life, purpose, and calm in the midst of chaos.',
    genre: 'Philosophy',
    price: 'Free',
  },
];

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100">
      <nav className="sticky top-0 z-40 w-full backdrop-blur border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-950/75">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <h1 className="text-xl font-black tracking-tighter">REVO</h1>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/" className="px-4 py-2 text-sm font-medium hover:text-blue-600 transition-colors">
              Home
            </Link>
            <NavAuth />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <header className="space-y-4 mb-12">
          <div className="flex items-center gap-3 text-blue-600">
            <span className="text-3xl">📖</span>
            <p className="uppercase text-xs tracking-[0.4em] font-semibold">Library</p>
          </div>
          <div className="max-w-3xl">
            <h2 className="text-5xl font-black tracking-tight">A mix of free and paid reads across every genre.</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Browse new releases, classic public domain works, thrillers, self-help, and more — all ready for quick discovery.
            </p>
          </div>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {libraryBooks.map((book) => (
            <LibraryCard
              key={book.title}
              title={book.title}
              author={book.author}
              description={book.description}
              genre={book.genre}
              price={book.price}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
