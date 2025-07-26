// ✅ Updated by Chad 🧠⚡

import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HabitLoop from "@/components/HabitLoop";
import RepCounter from "@/components/RepCounter";

export default function Train() {
  return (
    <>
      <Head>
        <title>Myelin Map – Rewire Your Brain, One Rep at a Time</title>
        <meta
          name="description"
          content="Visualize your myelin growth and track habits with our neural reinforcement engine."
        />
        {/* ✅ Favicon handled globally in _document.tsx */}
      </Head>

      <Header
        title="Visualize Your Myelin Growth 🧠"
        subtitle="Watch your neural connections light up as you build better habits"
      />

      <main className="flex flex-col items-center justify-center px-4 py-16 min-h-[calc(100vh-200px)] text-center bg-gray-900 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Train Your Brain, One Rep at a Time 🧠
        </h1>
        <p className="text-lg max-w-2xl mb-10 text-gray-300">
          This isn’t just a habit tracker — it’s a myelin visualizer. See your
          brain evolve. One focused repetition at a time.
        </p>

        <div className="w-full max-w-2xl space-y-8">
          <HabitLoop />
          <RepCounter />
        </div>
      </main>

      <Footer />
    </>
  );
}
// ✅ Footer component is imported and used at the bottom
// ✅ Head component is used to set page title and description
// ✅ Header component is used to display the title and subtitle
// ✅ Main content is structured with a title, description, and components for habit tracking
// ✅ Responsive design with Tailwind CSS classes
// ✅ Uses Next.js Head for SEO and metadata