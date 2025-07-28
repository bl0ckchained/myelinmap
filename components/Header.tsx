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
      <nav className="mt-6 flex justify-center gap-6 text-sm">
        <Link href="/">🏠 Home</Link>
        <Link href="/rewire">🔥 7-Day Challenge</Link>
        <Link href="/about">👤 About Us</Link>
        <Link href="/visualizer">🧬 Visualizer</Link>
        <Link href="/coach">
          <span className="hover:text-emerald-400 transition-colors">
            Coach
          </span>
        </Link>
      </nav>
    </header>
  );
}
