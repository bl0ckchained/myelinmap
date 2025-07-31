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
        {[
          { href: "/", label: "🏠 Home", color: "emerald-500" },
          { href: "/rewire", label: "🔥 7-Day Challenge", color: "amber-400" },
          { href: "/about", label: "👤 About Us", color: "lime-400" },
          { href: "/visualizer", label: "🧬 Visualizer", color: "cyan-500" },
          { href: "/coach", label: "🧠 Coach", color: "pink-400" },
        ].map(({ href, label, color }) => (
          <Link key={href} href={href}>
            <span
              className={`
                px-4 py-2 rounded-full bg-gray-800 
                hover:bg-${color} hover:text-black 
                transition-all duration-300 shadow-md 
                transform hover:-translate-y-1 hover:scale-105
              `}
            >
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
