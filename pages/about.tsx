import React from "react";
import Head from "next/head";
import Link from "next/link";

// --- Embedded Header Component ---
const navLinks = [
  { href: "/", label: "🏠 Home", hoverColor: "hover:bg-emerald-500" },
  { href: "/rewire", label: "🔥 7-Day Challenge", hoverColor: "hover:bg-amber-400" },
  { href: "/about", label: "👤 About Us", hoverColor: "hover:bg-lime-400" },
  { href: "/visualizer", label: "🧬 Visualizer", hoverColor: "hover:bg-cyan-500" },
  { href: "/coach", label: "🧠 Coach", hoverColor: "hover:bg-pink-400" },
  { href: "/community", label: "🤝 Myelin Nation", hoverColor: "hover:bg-rose-400" },
  { href: "/dashboard", label: "📈 Dashboard", hoverColor: "hover:bg-blue-400" },
];

const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <header className="bg-gray-900 text-white text-center py-12 px-4">
      <h1 className="text-4xl font-bold">{title}</h1>
      {subtitle && <p className="text-lg mt-2 max-w-xl mx-auto">{subtitle}</p>}
      <nav className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        {navLinks.map(({ href, label, hoverColor }) => (
          <Link key={href} href={href} legacyBehavior>
            <a
              className={`
                px-4 py-2 rounded-full bg-gray-800 text-white
                ${hoverColor} hover:text-black
                transition-all duration-300 shadow-md
                transform hover:-translate-y-1 hover:scale-105
              `}
            >
              {label}
            </a>
          </Link>
        ))}
      </nav>
    </header>
  );
};

// --- Embedded Footer Component ---
const Footer = () => {
  return (
    <footer className="text-center p-8 bg-gray-900 text-white text-sm">
      <div className="space-y-2 mb-4">
        <p className="text-gray-400 mt-2">
          Special thanks to Matt Stewart &mdash; your belief helped light this path.
        </p>
        <p>
          <span role="img" aria-label="brain emoji">🧠</span> Designed to wire greatness into your day <span role="img" aria-label="brain emoji">🧠</span>
        </p>
      </div>
      <div className="space-y-2 mb-4">
        <p>
          &copy; 2025 MyelinMap.com Made with <span role="img" aria-label="blue heart emoji">💙</span> in Michigan &middot; Powered by Quantum Step
          Consultants LLC
        </p>
        <p>
          <Link href="/legalpage" legacyBehavior>
            <a className="underline hover:text-blue-300">
              Privacy Policy & Terms
            </a>
          </Link>
        </p>
      </div>
      <div className="flex justify-center items-center gap-2">
        <span className="text-gray-400">Join our journey</span>
        <a
          href="https://www.youtube.com/@myelinmap"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition"
          aria-label="YouTube Channel"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-red-500"
          >
            <path d="M19.615 3.184c-1.007-.372-5.615-.372-5.615-.372s-4.608 0-5.615.372a3.21 3.21 0 0 0-2.262 2.262c-.373 1.007-.373 3.108-.373 3.108s0 2.101.373 3.108a3.21 3.21 0 0 0 2.262 2.262c1.007.372 5.615.372 5.615.372s4.608 0 5.615-.372a3.21 3.21 0 0 0 2.262-2.262c.373-1.007.373-3.108.373-3.108s0-2.101-.373-3.108a3.21 3.21 0 0 0-2.262-2.262zm-10.615 8.816v-5l5 2.5-5 2.5z" />
          </svg>
        </a>
      </div>
    </footer>
  );
};

// --- Main About Page Component ---
export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | Myelin Map</title>
        <meta
          name="description"
          content="Learn the story behind Myelin Map, our mission, and how we&apos;re helping people rewire their brains through habit-driven growth."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header
        title="About Myelin Map 🧠"
        subtitle="A visual growth engine powered by neuroscience, grit, and purpose"
      />

      <main className="px-6 py-12 max-w-4xl mx-auto text-gray-100 space-y-16">
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Our Mission</h2>
          <p>
            Myelin Map exists to help people reclaim their lives through consistent, meaningful
            practice. Rooted in the science of myelination &mdash; the biological process that wires habits
            into the brain &mdash; our platform is a visual, interactive, and radically empowering system
            for personal transformation.
          </p>
          <p>
            We believe growth shouldn&apos;t be reserved for the privileged few. We believe that no
            matter your past, you can shape your future. And we&apos;re building the greatest growth tool
            in the world to prove it.
          </p>
        </section>
        
        {/* The story section has been removed to keep the focus on the mission */}

        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">What Makes Us Different</h2>
          <p>
            While most self-help tools shout &quot;just do it,&quot; we ask: <em>how does the brain actually change?</em> Then we build from there.
          </p>
          <ul className="list-disc list-inside space-y-2 text-left text-gray-300">
            <li><span role="img" aria-label="check mark emoji">✅</span> Neuroscience-backed habit tracking</li>
            <li><span role="img" aria-label="check mark emoji">✅</span> Beautiful visualizations of growth and streaks</li>
            <li><span role="img" aria-label="check mark emoji">✅</span> Mantras, missions, and daily loops designed for rewiring</li>
            <li><span role="img" aria-label="check mark emoji">✅</span> Created by someone who&apos;s walked the hard road, not just read the books</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Powered by Purpose</h2>
          <p>
            Myelin Map is powered by Quantum Step Consultants LLC &mdash; a mission-driven business
            helping people and startups unlock clarity, systems, and soul.
          </p>
          <p>We&apos;re not just a tech company. We&apos;re a comeback story. And you&apos;re part of it.</p>
        </section>
      </main>

      <Footer />
    </>
  );
}
