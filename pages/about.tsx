import React from "react";
import Head from "next/head";
import Link from "next/link";

// --- Embedded Header Component (centered with container) ---
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
    <header className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold">{title}</h1>
        {subtitle && <p className="text-lg mt-2 max-w-xl mx-auto">{subtitle}</p>}
        <nav className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          {navLinks.map(({ href, label, hoverColor }) => (
            <Link
              key={href}
              href={href}
              className={`
                px-4 py-2 rounded-full bg-gray-800 text-white
                ${hoverColor} hover:text-black
                transition-all duration-300 shadow-md
                transform hover:-translate-y-1 hover:scale-105
              `}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

// --- Embedded Footer Component (centered with container) ---
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm">
        <div className="space-y-2 mb-4">
          <p className="text-gray-400 mt-2">
            Special thanks to Matt Stewart &mdash; your belief helped light this path.
          </p>
          <p>
            <span role="img" aria-label="brain emoji">🧠</span> Designed to wire greatness into your day{" "}
            <span role="img" aria-label="brain emoji">🧠</span>
          </p>
        </div>
        <div className="space-y-2 mb-4">
          <p>
            &copy; {new Date().getFullYear()} MyelinMap.com Made with{" "}
            <span role="img" aria-label="blue heart emoji">💙</span> in Michigan &middot; Powered by Quantum Step
            Consultants LLC
          </p>
          <p>
            <Link href="/legalpage" className="underline hover:text-blue-300">
              Privacy Policy &amp; Terms
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
        {/* Mission */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Our Mission</h2>
          <p className="text-lg leading-relaxed text-gray-300">
            Myelin Map exists to help people reclaim their lives through consistent, meaningful
            practice. Rooted in the science of myelination &mdash; the biological process that wires habits
            into the brain &mdash; our platform is a visual, interactive, and radically empowering system
            for personal transformation.
          </p>
          <p className="text-lg leading-relaxed text-gray-300">
            We believe that every action, thought, and habit you repeat is shaping who you&apos;re becoming &mdash; and that change is possible for anyone, no matter their past.
          </p>
          <p className="text-lg leading-relaxed text-gray-300">
            This isn&apos;t about perfection. It&apos;s about <strong>progress.</strong>
            You&apos;re not broken &mdash; you&apos;re mid-build. Let&apos;s grow forward.
          </p>
        </section>

        {/* Myelin Nation */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Myelin Nation Mission</h2>
          <p className="text-lg leading-relaxed text-gray-300">
            Myelin Nation is a community for doers, dreamers, rebuilders, and overcomers.
            We welcome anyone who&apos;s fighting to become their best self &mdash; whether you&apos;re escaping addiction, healing from trauma, or simply trying to build better habits.
          </p>
          <p className="text-lg leading-relaxed text-gray-300">
            Our mission is to create a supportive, stigma-free space where daily reps lead to lifelong change. No shame. No judgment. Just growth &mdash; one wrap at a time.
            Together, we celebrate every step, every stumble, every comeback.
          </p>
          <p className="text-lg leading-relaxed text-gray-300">
            This is more than a movement. It&apos;s a <strong>rewiring revolution.</strong> Everyone&apos;s invited. Especially you.
          </p>
        </section>

        {/* Powered by Purpose */}
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
