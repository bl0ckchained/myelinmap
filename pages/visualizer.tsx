// ✅ Visualizer Page – Built by Chad + Ninja 🧠⚡

import Head from "next/head";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Visualizer() {
  useEffect(() => {
    const container = document.getElementById("visualizer");
    if (!container) return;

    const habits = [
      { x: 100, y: 100, completed: false },
      { x: 300, y: 120, completed: true },
      { x: 200, y: 250, completed: false },
      { x: 500, y: 200, completed: true },
      { x: 400, y: 350, completed: true },
      { x: 150, y: 400, completed: false },
    ];

    habits.forEach((habit) => {
      const node = document.createElement("div");
      node.className = `node absolute w-5 h-5 rounded-full ${
        habit.completed
          ? "bg-emerald-400 shadow-[0_0_20px_#34d399]"
          : "bg-sky-400 shadow-[0_0_10px_#38bdf8]"
      } animate-pulse z-10`;
      node.style.left = `${habit.x}px`;
      node.style.top = `${habit.y}px`;
      container.appendChild(node);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Visualizer | Myelin Map</title>
        <meta name="description" content="Visualize your brain's myelin growth in real time." />
      </Head>

      <Header
        title="Visualize Your Myelin Growth 🧠"
        subtitle="Watch your neural connections light up as you build better habits"
      />

      <main className="bg-gray-900 text-slate-100 min-h-[calc(100vh-200px)] px-4 py-12 flex flex-col items-center justify-start">
        <h1 className="text-4xl font-bold mb-6 text-center">🧠 Myelin Map Visualizer</h1>

        <div
          id="visualizer"
          className="relative w-full max-w-3xl h-[500px] rounded-2xl bg-gradient-radial from-slate-800 to-gray-900 shadow-2xl mb-12 overflow-hidden"
        />

        <section className="max-w-3xl space-y-6 text-center text-slate-200">
          <p>
            Our mission is to help you <strong>visualize your brain's growth</strong> and rewire it through consistent habits.
            By tracking your progress, you can reinforce positive changes and transform your life.
          </p>

          <h2 className="text-2xl font-semibold text-white">Our Vision</h2>
          <p>
            Every small habit contributes to a larger transformation. Myelin Map makes that process engaging and insightful,
            allowing you to see the connections between your habits and your brain’s development.
          </p>

          <h2 className="text-2xl font-semibold text-white">Join Us</h2>
          <p>
            Ready to start visualizing your growth? Join our community and be part of the journey toward a better you.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
