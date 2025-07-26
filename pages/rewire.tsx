// ✅ Rewire Challenge Page – Myelin Map ⚡️🧠

import React from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RewirePage = () => {
  return (
    <>
      <Head>
        <title>7-Day Brain Rewire Challenge | Myelin Map</title>
        <meta
          name="description"
          content="Rewire your brain in 7 days with habit loops, motivation, and visual growth."
        />
        {/* ✅ Favicon is handled globally in _document.tsx */}
      </Head>

      <Header
        title="7-Day Brain Rewire Challenge ⚡"
        subtitle="Turn your daily habits into neural upgrades with science-backed rituals"
      />

      <main className="px-4 md:px-8 py-12 max-w-5xl mx-auto text-center space-y-16">
        {/* Hero */}
        <section>
          <h1 className="text-4xl font-bold text-gray-900">
            Join the 7-Day Brain Rewire Challenge
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Build better habits, boost your focus, and rewire your brain one
            powerful day at a time. The science of myelin meets the art of
            personal transformation.
          </p>
          <div className="mt-6">
            <a
              href="#signup"
              className="inline-block bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
            >
              🔥 Start for Free Now
            </a>
          </div>
        </section>

        {/* What You'll Get */}
        <section>
          <h2 className="text-3xl font-semibold text-gray-800">What You'll Get</h2>
          <div className="grid gap-6 mt-8 sm:grid-cols-2">
            {[
              {
                title: "✅ Daily Micro-Missions",
                desc: "Unlock a new 5-10 minute action each day based on neuroscience to strengthen your willpower and neural pathways.",
              },
              {
                title: "✅ Printable Habit Loop Map",
                desc: "Visualize your myelin-building practice with a printable loop map you can post and power through.",
              },
              {
                title: "✅ Motivation Messages",
                desc: "Encouraging daily emails with mindset shifts, support, and brain rewiring tips.",
              },
              {
                title: "✅ Bonus PDF",
                desc: 'Download our "Top 5 Myelin-Boosting Habits" guide — free with the challenge.',
              },
            ].map(({ title, desc }, i) => (
              <div
                key={i}
                className="bg-white shadow-lg rounded-xl p-6 text-left border border-gray-100"
              >
                <h3 className="font-bold text-lg text-gray-900">{title}</h3>
                <p className="mt-2 text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            How It Works
          </h2>
          <ol className="space-y-4 text-lg text-gray-700">
            <li>1. Sign up and confirm your email</li>
            <li>2. Day 1 kicks off instantly — no waiting</li>
            <li>3. Track progress, earn streaks, and transform your brain</li>
          </ol>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            What Others Are Saying
          </h2>
          <blockquote className="italic text-gray-600">
            “The way Myelin Map helps visualize progress is next-level. I finally feel in control of my habits.”
            <br />— Jordan, Beta Tester
          </blockquote>
          <blockquote className="italic text-gray-600 mt-4">
            “This challenge gave me the momentum I’ve been needing for{" "}
            <em>years.</em>”
            <br />— Casey M.
          </blockquote>
        </section>

        {/* Email Signup */}
        <section id="signup">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Ready to Rewire?
          </h2>
          <p className="text-gray-700 mb-6">
            Enter your email below to start the 7-day challenge for free.
            You'll get Day 1 immediately.
          </p>
          <form className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 border border-gray-300 rounded-lg w-full max-w-md"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Start Now
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default RewirePage;
// ✅ Rewire Challenge Page – Myelin Map ⚡️ 🧠
// ✅ Uses Next.js Head for SEO and metadata
// ✅ Header component for title and subtitle 
