import React from "react";
import Head from "next/head";
import Link from "next/link";

// This is a self-contained version of the Rewire page, combining the main
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

// --- Main Rewire Page Component ---
const RewirePage = () => {
  return (
    <>
      <Head>
        <title>7-Day Brain Rewire Challenge | Myelin Map</title>
        <meta
          name="description"
          content="Rewire your brain in 7 days with habit loops, motivation, and visual growth."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header
        title="7-Day Brain Rewire Challenge ⚡"
        subtitle="Turn your daily habits into neural upgrades with science-backed rituals"
      />

      <main className="bg-white text-gray-800 px-4 md:px-8 py-12 min-h-screen">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Hero */}
          <section className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Join the 7-Day Brain Rewire Challenge
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Build better habits, boost your focus, and rewire your brain one
              powerful day at a time. The science of myelin meets the art of
              personal transformation.
            </p>
            <div className="mt-8">
              <a
                href="#signup"
                className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                🔥 Start Your Free Challenge Now
              </a>
            </div>
          </section>

          {/* What You'll Get */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">What You&apos;ll Get</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Daily Micro-Missions",
                  desc: "Unlock a new 5-10 minute action each day based on neuroscience to strengthen your willpower and neural pathways.",
                  icon: "🚀",
                },
                {
                  title: "Printable Habit Loop Map",
                  desc: "Visualize your myelin-building practice with a printable loop map you can post and power through.",
                  icon: "🗺️",
                },
                {
                  title: "Motivation Messages",
                  desc: "Encouraging daily emails with mindset shifts, support, and brain rewiring tips.",
                  icon: "💬",
                },
                {
                  title: "Bonus PDF Guide",
                  desc: "Download our &quot;Top 5 Myelin-Boosting Habits&quot; guide — free with the challenge.",
                  icon: "📚",
                },
              ].map(({ title, desc, icon }, i) => (
                <div
                  key={i}
                  className="bg-gray-50 shadow-lg rounded-2xl p-6 text-left border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{icon}</span>
                    <h3 className="font-bold text-xl text-gray-900">{title}</h3>
                  </div>
                  <p className="mt-2 text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              How It Works
            </h2>
            <div className="flex justify-center">
              <ol className="list-decimal list-outside text-left text-lg text-gray-700 space-y-4 max-w-xl">
                <li>Sign up with your email below and confirm to get started.</li>
                <li>Day 1 kicks off instantly &mdash; you get a micro-mission delivered to your inbox.</li>
                <li>Track your progress on the Myelin Map visualizer, earn streaks, and feel your brain transforming.</li>
              </ol>
            </div>
          </section>

          {/* Testimonials */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              What Others Are Saying
            </h2>
            <div className="space-y-6">
              <blockquote className="italic text-gray-700 bg-gray-100 p-6 rounded-xl shadow-inner border border-gray-200">
                &ldquo;The way Myelin Map helps visualize progress is next-level. I finally feel in control of my habits.&rdquo;
                <p className="mt-2 text-sm font-semibold text-gray-500">&mdash; Jordan, Beta Tester</p>
              </blockquote>
              <blockquote className="italic text-gray-700 bg-gray-100 p-6 rounded-xl shadow-inner border border-gray-200">
                &ldquo;This challenge gave me the momentum I&apos;ve been needing for <em>years.</em>&rdquo;
                <p className="mt-2 text-sm font-semibold text-gray-500">&mdash; Casey M.</p>
              </blockquote>
            </div>
          </section>

          {/* Email Signup */}
          <section id="signup" className="bg-gray-900 text-white rounded-3xl p-10 shadow-2xl">
            <h2 className="text-3xl font-bold text-amber-400 mb-4">
              Ready to Rewire?
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Enter your email below to start the 7-day challenge for free.
              You&apos;ll get Day 1 immediately.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="px-6 py-3 border border-gray-300 rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300 transform hover:scale-105"
              >
                Start Now
              </button>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default RewirePage;
