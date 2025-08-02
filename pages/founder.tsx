import Head from "next/head";
import Link from "next/link";
import React from "react";

// This page provides a direct, personal message from the founder,
// separate from the company's main "About" page. It's designed to
// be a raw, heartfelt appeal to users.

// --- Embedded Header Component ---
const navLinks = [
  { href: "/", label: "🏠 Home", hoverColor: "hover:bg-emerald-500" },
  { href: "/rewire", label: "🔥 7-Day Challenge", hoverColor: "hover:bg-amber-400" },
  { href: "/about", label: "👤 About Us", hoverColor: "hover:bg-lime-400" },
  { href: "/visualizer", label: "🧬 Visualizer", hoverColor: "hover:bg-cyan-500" },
  { href: "/coach", label: "🧠 Coach", hoverColor: "hover:bg-pink-400" },
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

// --- Main Founder Page Component ---
export default function FounderPage() {
  return (
    <>
      <Head>
        <title>Message from the Founder | Myelin Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Header
        title="From Rock Bottom to Rewiring 🧠"
        subtitle="A message from Chad &ndash; founder of Myelin Map and a believer in your comeback"
      />

      <main className="bg-gray-900 text-white min-h-screen">
        <div className="px-6 py-12 max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold mb-6 text-center text-yellow-400 animate-slide-up">
            💬 A Personal Message from the Founder
          </h1>

          <p className="text-lg text-gray-300 leading-relaxed animate-fade-in delay-200">
            I really just want to reach others like me &mdash; those who were, or still are, stuck. People
            suffering with their own thoughts, not by any fault of their own, but because they were
            never taught how to change them.
          </p>

          <p className="text-lg text-gray-300 leading-relaxed animate-fade-in delay-400">
            I believe most addicts and trauma survivors want better for themselves. But when you&apos;re in
            that state, it seems impossible to reach. You can see the light, but you don&apos;t believe
            it&apos;s for you &mdash; so you never try. And if no one shows you another way, you just stay there.
          </p>

          <p className="text-lg text-gray-300 leading-relaxed animate-fade-in delay-600">
            I&apos;m here to show another way. Not through lectures or empty motivation &mdash; but through a
            system. A visualizer. A mirror for your effort. A tool that proves to you, in real time,
            that you are changing.
          </p>
          
          {/* Highlighted Quote Section */}
          <div className="border-l-4 border-amber-300 pl-4 py-2 mt-8 animate-slide-up delay-800">
            <p className="text-2xl italic text-amber-300 font-medium">
              &quot;Trauma isn&apos;t what happens to you &mdash; it&apos;s the label you put on the experience.&quot;
            </p>
          </div>

          <p className="text-lg text-gray-300 leading-relaxed animate-fade-in delay-1000">
            That shook me. If I had labeled my past differently, my life could have unfolded in an
            entirely different way. Experiences don&apos;t need to be labeled good or bad &mdash; they&apos;re
            just experiences. But when we label them, we unconsciously chain ourselves to the
            emotion that label carries.
          </p>

          <p className="text-lg text-gray-300 leading-relaxed animate-fade-in delay-1200">
            I want to give people what I never had: a tool to reframe their thinking, to track
            meaningful reps, and to see proof of their own comeback. That&apos;s what Myelin Map is. Not a
            tracker. A transformation engine.
          </p>

          <div className="text-center mt-12 animate-fade-in delay-1400">
            <p className="text-2xl font-semibold text-emerald-400 leading-tight">
              You are not broken.<br /> You are becoming.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
