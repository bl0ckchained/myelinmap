// components/Header.tsx
import Link from "next/link";

export default function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="bg-gray-900 text-white text-center py-12 px-4">
      <h1 className="text-4xl font-bold">{title}</h1>
      {subtitle && <p className="text-lg mt-2 max-w-xl mx-auto">{subtitle}</p>}
      <nav className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        <Link href="/">
          <span className="px-4 py-2 rounded-full bg-gray-800 hover:bg-emerald-500 hover:text-black transition-all duration-300 shadow-md">
            🏠 Home
          </span>
        </Link>
        <Link href="/rewire">
          <span className="px-4 py-2 rounded-full bg-gray-800 hover:bg-amber-400 hover:text-black transition-all duration-300 shadow-md">
            🔥 7-Day Challenge
          </span>
        </Link>
        <Link href="/about">
          <span className="px-4 py-2 rounded-full bg-gray-800 hover:bg-lime-400 hover:text-black transition-all duration-300 shadow-md">
            👤 About Us
          </span>
        </Link>
        <Link href="/visualizer">
          <span className="px-4 py-2 rounded-full bg-gray-800 hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-md">
            🧬 Visualizer
          </span>
        </Link>
        <Link href="/coach">
          <span className="px-4 py-2 rounded-full bg-gray-800 hover:bg-pink-400 hover:text-black transition-all duration-300 shadow-md">
            🧠 Coach
          </span>
        </Link>
      </nav>
    </header>
  );
}
