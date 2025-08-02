import React from "react";
import Link from "next/link";
import Head from "next/head";

// This is a self-contained version of the Support page, combining the main
// page logic with the Header and Footer components to resolve import issues.

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

// --- Main Support Component ---
const Support = () => {
  return (
    <>
      <Head>
        <title>Support Myelin Map | Myelin Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Help us grow Myelin Map &mdash; a tool for personal transformation and rewiring the brain."
        />
      </Head>
      <Header
        title="Support Our Mission 🚀"
        subtitle="Help us grow the world's greatest skill-building tool"
      />
      <main className="bg-white text-gray-800 min-h-screen">
        <div className="max-w-3xl mx-auto p-6 space-y-10">

          <section className="text-center bg-gray-50 p-8 rounded-2xl shadow-xl border-t-4 border-emerald-500">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              Fuel the Myelin. Fuel the Mission.
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Every day, Myelin Map helps people rediscover their strength and rewire their lives.
              Your support directly powers this mission, helping us reach more people and build more
              magical tools.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              How You Can Help Us Grow
            </h2>

            {/* Financial Support */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-amber-400">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <span role="img" aria-label="money bag emoji">💰</span> Support Us Financially
              </h3>
              <p className="text-gray-700">
                If you believe in our mission, your financial support helps us keep the lights on and build
                new features.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <a
                  href="#" // Placeholder for Stripe link
                  className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold text-lg shadow-md transition-all duration-300 transform hover:scale-105"
                >
                  Donate Now via Stripe (Coming Soon)
                </a>
                <a
                  href="mailto:support@myelinmap.com"
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold text-lg shadow-md transition-all duration-300 hover:bg-gray-300"
                >
                  Or Email Us
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                We're setting up our Stripe integration for seamless donations. Thank you for your patience!
              </p>
            </div>
            
            {/* Non-Financial Support */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-emerald-400">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <span role="img" aria-label="heart emoji">❤️</span> Share the Love
              </h3>
              <p className="text-gray-700">
                Your encouragement is priceless. Every share, every kind word, and every piece of feedback helps us more than you know.
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2 pl-4">
                <li>Share Myelin Map with friends and community members who need it.</li>
                <li>Send kind feedback or a testimonial to inspire others.</li>
                <li>Request a feature or report a bug to help us improve.</li>
              </ul>
            </div>
          </section>

          <section className="text-center pt-8 border-t border-gray-200">
            <p className="text-lg font-semibold text-gray-800">
              Myelin Map is a comeback story. Thank you for being a part of it.
            </p>
            <p className="mt-4">
              <Link href="/" legacyBehavior>
                <a className="text-blue-600 hover:underline">
                  ← Back to Home
                </a>
              </Link>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Support;
