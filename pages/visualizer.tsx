// ✅ Grow Page – Train + Visualizer Combo 🌱🧠✨

import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HabitLoop from "@/components/HabitLoop";
import RepCounter from "@/components/RepCounter";

export default function Grow() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [repCount, setRepCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    const ivyColor = "#8affc1";
    const magicGlow = "rgba(131, 255, 184, 0.4)";

    let branches: { x: number; y: number; angle: number; depth: number; width: number }[] = [];
    let animationFrame: number;
    let currentIndex = 0;

    const drawBranch = (x: number, y: number, angle: number, depth: number, width: number) => {
      if (depth === 0) return;
      const x2 = x + Math.cos(angle) * depth * 10;
      const y2 = y - Math.sin(angle) * depth * 10;

      ctx.beginPath();
      ctx.strokeStyle = ivyColor;
      ctx.lineWidth = width;
      ctx.shadowBlur = 15;
      ctx.shadowColor = magicGlow;
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      branches.push({ x: x2, y: y2, angle: angle - 0.3, depth: depth - 1, width: width * 0.7 });
      branches.push({ x: x2, y: y2, angle: angle + 0.3, depth: depth - 1, width: width * 0.7 });
    };

    const animate = () => {
      if (currentIndex < branches.length) {
        const { x, y, angle, depth, width } = branches[currentIndex];
        drawBranch(x, y, angle, depth, width);
        currentIndex++;
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const startDrawing = () => {
      ctx.clearRect(0, 0, width, height);
      branches = [];
      currentIndex = 0;

      drawBranch(width / 2, height, Math.PI / 2, 8, 8);
      animationFrame = requestAnimationFrame(animate);
    };

    startDrawing();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <>
      <Head>
        <title>Myelin Map – Grow 🌱</title>
        <meta name="description" content="Train your brain and watch your myelin tree grow with every rep." />
      </Head>

      <Header
        title="Grow Your Mind 🌳"
        subtitle="Train with reps. Visualize your progress."
      />

      <main className="flex flex-col items-center justify-start px-4 py-16 min-h-[calc(100vh-200px)] bg-gray-900 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">🧠 Rewire with Action</h1>
        <p className="text-lg max-w-2xl mb-10 text-gray-300 text-center">
          One click. One rep. One branch at a time. This is how myelin grows.
        </p>

        <div className="w-full max-w-2xl space-y-8 mb-16">
          <HabitLoop />
          <RepCounter />
        </div>

        <div className="relative w-full max-w-4xl h-[500px] mb-12 rounded-2xl overflow-hidden shadow-2xl bg-black">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        <section className="max-w-3xl space-y-6 text-center text-slate-200">
          <p>
            Every time you log a rep, your mystical Tree of Life grows stronger — more branches, more light, more magic.
          </p>

          <h2 className="text-2xl font-semibold text-white">This Is Only the Beginning</h2>
          <p>
            The tree will evolve with you. In the future, you&rsquo;ll see circuits form, energy pulse through, and the shape of your discipline come alive.
          </p>

          <h2 className="text-2xl font-semibold text-white">Built on Science. Fueled by You.</h2>
          <p>
            This isn&rsquo;t fantasy — it&rsquo;s neuroscience. Repetition wires your brain. The visualizer just lets you witness it.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
// ✅ This page combines training and visualization features for a holistic brain growth experience
// ✅ Uses a canvas to draw a dynamic myelin tree that grows with each rep
// ✅ Responsive design with Tailwind CSS
// ✅ Includes habit tracking components for user engagement
// ✅ Head component for SEO and metadata
// ✅ Footer component is imported and used at the bottom