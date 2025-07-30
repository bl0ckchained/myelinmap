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

    let branches: {
      x: number;
      y: number;
      angle: number;
      depth: number;
      width: number;
    }[] = [];
    let animationFrame: number;
    let currentIndex = 0;

    const drawLeaf = (x: number, y: number) => {
      ctx.beginPath();
      ctx.fillStyle = "rgba(144, 255, 203, 0.6)";
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    };

    const drawIvy = (x: number, y: number, angle: number) => {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(104, 255, 185, 0.3)";
      ctx.lineWidth = 1.2;
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle + 1) * 8, y - Math.sin(angle + 1) * 8);
      ctx.stroke();
    };

    const drawFruit = (x: number, y: number) => {
      ctx.beginPath();
      ctx.fillStyle = "rgba(255, 210, 120, 0.8)";
      ctx.shadowColor = "#ffe6b3";
      ctx.shadowBlur = 12;
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    };

    const drawBranch = (
      x: number,
      y: number,
      angle: number,
      depth: number,
      width: number
    ) => {
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

      // Growth effects based on rep count
      if (repCount >= 10) drawLeaf(x2, y2);
      if (repCount >= 25) drawIvy(x2, y2, angle);
      if (repCount >= 50 && Math.random() > 0.95) drawFruit(x2, y2);

      branches.push({
        x: x2,
        y: y2,
        angle: angle - 0.3,
        depth: depth - 1,
        width: width * 0.7,
      });
      branches.push({
        x: x2,
        y: y2,
        angle: angle + 0.3,
        depth: depth - 1,
        width: width * 0.7,
      });
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
  }, [repCount]);

  return (
    <>
      <Head>
        <title>Myelin Map * Grow 🌱</title>
        <meta
          name="description"
          content="Train your brain and watch your myelin tree grow with every rep."
        />
      </Head>

      <Header
        title="Grow Your Mind 🌳"
        subtitle="Train with reps. Visualize your progress."
      />

      <main className="flex flex-col items-center justify-start px-4 py-16 min-h-[calc(100vh-200px)] bg-gray-900 text-white">
        {/* 🌳 Animated Tree at Top */}
        <div className="relative w-full max-w-4xl h-[500px] mb-16 rounded-2xl overflow-hidden shadow-2xl bg-black">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* 🧠 Headline & Intro */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          🧠 Rewire with Action
        </h1>
        <p className="text-lg max-w-2xl mb-10 text-gray-300 text-center">
          One click. One rep. One branch at a time. This is how myelin grows.
        </p>

        {/* 🔁 Habit Components */}
        <div className="w-full max-w-2xl space-y-8 mb-16">
          <HabitLoop />
          <RepCounter />
        </div>

        {/* 🌌 Educational Section */}
        <section className="max-w-3xl space-y-6 text-center text-slate-200">
          <p>
            Every time you log a rep, your mystical Tree of Life grows stronger
            &mdash; more branches, more light, more magic.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            This Is Only the Beginning
          </h2>
          <p>
            The tree will evolve with you. In the future, you&rsquo;ll see circuits
            form, energy pulse through, and the shape of your discipline come alive.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            Built on Science. Fueled by You.
          </h2>
          <p>
            This isn&rsquo;t fantasy &mdash; it&rsquo;s neuroscience. Repetition
            wires your brain. The visualizer just lets you witness it.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
