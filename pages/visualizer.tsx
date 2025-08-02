import { useEffect, useRef, useState } from "react";
import Link from "next/link"; // Keeping Link for internal navigation, but it will work with basic <a> tags.
import React from 'react';

// This component uses a Canvas to render a dynamic, animated "Tree of Life"
// that visually represents the user's progress. It's now self-contained
// to resolve import errors in the current environment.

// Placeholder components to make the code compile and run.
// In your local environment, these would be separate files.
const HabitLoop = () => (
  <div className="bg-gray-800 text-center p-6 rounded-xl shadow-lg">
    <h3 className="text-xl font-bold mb-2 text-white">Habit Loop</h3>
    <p className="text-gray-400">Placeholder for your Habit Loop component.</p>
  </div>
);

const RepCounter = ({ count, onRep }: { count: number; onRep: () => void }) => (
  <div className="bg-emerald-600 text-center p-6 rounded-xl shadow-lg">
    <h3 className="text-xl font-bold mb-2 text-white">Rep Counter</h3>
    <p className="text-2xl font-extrabold text-white">{count}</p>
    <button onClick={onRep} className="mt-4 bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
      Log Rep
    </button>
  </div>
);

// Use a lookup table to provide Tailwind with full, static class names
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
      {/* Dynamic Title and Subtitle */}
      <h1 className="text-4xl font-bold">{title}</h1>
      {subtitle && <p className="text-lg mt-2 max-w-xl mx-auto">{subtitle}</p>}

      {/* Navigation */}
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

const Footer = () => {
  return (
    <footer className="text-center p-8 bg-gray-900 text-white text-sm">
      {/* Dedication and Mission */}
      <div className="space-y-2 mb-4">
        <p className="text-gray-400 mt-2">
          Special thanks to Matt Stewart &mdash; your belief helped light this path.
        </p>
        <p>
          <span role="img" aria-label="brain emoji">🧠</span> Designed to wire greatness into your day <span role="img" aria-label="brain emoji">🧠</span>
        </p>
      </div>

      {/* Copyright and Legal */}
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

      {/* Social Media Link */}
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


export default function Visualizer() {
  // Reference to the canvas element for drawing
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // State to keep track of the number of reps logged by the user
  const [repCount, setRepCount] = useState(0);
  // State to store the canvas context, so it doesn't need to be recreated on every render
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  
  // State to manage a queue of new branches to be drawn, creating an animated growth effect
  const [branchQueue, setBranchQueue] = useState<any[]>([]);

  // Function to initialize the canvas and context when the component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (context) {
      setCtx(context);
    }
    
    // Set up a resize listener to keep the canvas responsive
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set size

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main drawing and animation loop
  useEffect(() => {
    if (!ctx) return;

    let animationFrameId: number;

    // Drawing a single, magical branch
    const drawBranch = (x: number, y: number, angle: number, depth: number, width: number) => {
      if (depth === 0) return;

      const branchLength = depth * (10 + repCount * 0.5); // Branch length increases with reps
      const x2 = x + Math.cos(angle) * branchLength;
      const y2 = y - Math.sin(angle) * branchLength;

      ctx.beginPath();
      ctx.strokeStyle = `hsl(140, 100%, ${60 - depth * 3}%)`; // Green color with depth variation
      ctx.lineWidth = width;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsl(140, 100%, ${60 - depth * 2}%)`; // Glowing effect
      ctx.lineCap = 'round';
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Add new branches to the queue for the next frame
      if (depth > 1) {
        setBranchQueue(prevQueue => [
          ...prevQueue,
          { x: x2, y: y2, angle: angle - (0.3 + repCount * 0.01), depth: depth - 1, width: width * 0.75 },
          { x: x2, y: y2, angle: angle + (0.3 + repCount * 0.01), depth: depth - 1, width: width * 0.75 },
        ]);
      }
    };

    // Particles for a "myelin" effect
    const particles: any[] = [];
    const createParticles = (x: number, y: number) => {
      for (let i = 0; i < 5; i++) {
        particles.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 50,
          color: `hsl(140, 100%, 75%)`,
        });
      }
    };

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.shadowBlur = 0; // Reset shadow for background

      // Draw the tree from the branches array
      if (branchQueue.length > 0) {
        const nextBranchesToDraw = branchQueue.splice(0, 2); // Draw a few at a time for animation
        nextBranchesToDraw.forEach(b => {
          drawBranch(b.x, b.y, b.angle, b.depth, b.width);
        });
        setBranchQueue(prev => [...prev]); // Force a state update to trigger next frame
      }

      // Draw and update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life / 50;
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(animate);
    };

    // Re-draw the tree from scratch when repCount changes
    if (repCount > 0) {
      setBranchQueue([]);
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      drawBranch(width / 2, height, Math.PI / 2, 6, 12);
      createParticles(width / 2, height);
    }
    
    // Start the animation loop
    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [ctx, repCount]); // Depend on ctx and repCount to trigger redraws

  return (
    <>
      <head>
        <title>Myelin Map &mdash; Grow 🌱</title>
        <meta
          name="description"
          content="Train your brain and watch your myelin tree grow with every rep."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <Header
        title="Grow Your Mind 🌳"
        subtitle="Train with reps. Visualize your progress."
      />

      <main className="flex flex-col items-center justify-start px-4 py-16 min-h-[calc(100vh-200px)] bg-gray-900 text-white">
        {/* 🌳 Animated Tree Container */}
        <div className="relative w-full max-w-4xl h-[500px] mb-16 rounded-2xl overflow-hidden shadow-2xl bg-black">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* 🧠 Headline & Intro */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          <span role="img" aria-label="brain emoji">🧠</span> Rewire with Action
        </h1>
        <p className="text-lg max-w-2xl mb-10 text-gray-300 text-center">
          One click. One rep. One branch at a time. This is how myelin grows.
        </p>

        {/* 🔁 Habit Components */}
        <div className="w-full max-w-2xl space-y-8 mb-16">
          <HabitLoop />
          {/* onRep handler now increases the rep count and triggers the redraw */}
          <RepCounter count={repCount} onRep={() => setRepCount(prev => prev + 1)} />
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
            The tree will evolve with you. In the future, you&apos;ll see circuits
            form, energy pulse through, and the shape of your discipline come alive.
          </p>
          <h2 className="text-2xl font-semibold text-white">
            Built on Science. Fueled by You.
          </h2>
          <p>
            This isn&apos;t fantasy &mdash; it&apos;s neuroscience. Repetition
            wires your brain. The visualizer just lets you witness it.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
