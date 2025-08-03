import React, { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";

// This is a self-contained version of the Visualizer page.
// It combines the visualizer logic with the Header and Footer components
// to resolve import errors.

// --- Embedded Header Component ---
const navLinks = [
  { href: "/", label: "🏠 Home", hoverColor: "hover:bg-emerald-500" },
  { href: "/rewire", label: "� 7-Day Challenge", hoverColor: "hover:bg-amber-400" },
  { href: "/about", label: "👤 About Us", hoverColor: "hover:bg-lime-400" },
  { href: "/visualizer", label: "🧬 Visualizer", hoverColor: "hover:bg-cyan-500" },
  { href: "/coach", label: "🧠 Coach", hoverColor: "hover:bg-pink-400" },
  { href: "/community", label: "🤝 Myelin Nation", hoverColor: "hover:bg-rose-400" },
  { href: "/dashboard", label: "📈 Dashboard", hoverColor: "hover:bg-blue-400" },
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

// Placeholder components to make the code compile and run.
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

// --- Main Visualizer Page Component ---
export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [repCount, setRepCount] = useState(0);

  // Define types for the animation data
  interface Branch {
    x: number;
    y: number;
    angle: number;
    depth: number;
    width: number;
  }
  
  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
  }

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const branchesRef = useRef<Branch[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  // Function to draw a single branch
  const drawBranch = useCallback((b: Branch) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    const x2 = b.x + Math.cos(b.angle) * b.depth * (10 + repCount * 0.2);
    const y2 = b.y - Math.sin(b.angle) * b.depth * (10 + repCount * 0.2);
    ctx.beginPath();
    ctx.strokeStyle = `hsl(140, 100%, ${60 - b.depth * 3}%)`;
    ctx.lineWidth = b.width;
    ctx.shadowBlur = 15;
    ctx.shadowColor = `hsl(140, 100%, ${60 - b.depth * 2}%)`;
    ctx.lineCap = 'round';
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }, [repCount]);

  // Function to draw a single particle
  const drawParticle = useCallback((p: Particle) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life / 50;
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }, []);


  // The main animation loop logic
  const animate = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 0;

    // Draw all existing branches
    branchesRef.current.forEach(drawBranch);

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life > 0) {
        drawParticle(p);
        return true;
      }
      return false;
    });

    ctx.globalAlpha = 1;
    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, [drawBranch, drawParticle]);


  // Function to add new growth to the tree
  const addNewGrowth = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    
    // Find the end points of the current branches
    const endPoints = branchesRef.current.flatMap(b => {
      const x2 = b.x + Math.cos(b.angle) * b.depth * (10 + repCount * 0.2);
      const y2 = b.y - Math.sin(b.angle) * b.depth * (10 + repCount * 0.2);
      if (b.depth > 1) {
        return [{ x: x2, y: y2, angle: b.angle, depth: b.depth - 1, width: b.width * 0.7 }];
      }
      return [];
    });
    
    // Add new branches from these end points
    const newBranches = endPoints.flatMap(b => [
      { x: b.x, y: b.y, angle: b.angle - 0.3, depth: b.depth - 1, width: b.width * 0.7 },
      { x: b.x, y: b.y, angle: b.angle + 0.3, depth: b.depth - 1, width: b.width * 0.7 },
    ]);
    
    branchesRef.current.push(...newBranches);
    
    // Create new particles at the base of the tree
    for (let i = 0; i < 5; i++) {
      particlesRef.current.push({
        x: canvas.width / 2,
        y: canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
        life: 50,
        color: `hsl(${140 + Math.random() * 20}, 100%, 75%)`,
      });
    }
  }, [repCount]);


  // Effect for initial setup and animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    ctxRef.current = context;

    // Initial draw of the root tree
    const rootBranch = { x: canvas.width / 2, y: canvas.height, angle: Math.PI / 2, depth: 8, width: 8 };
    branchesRef.current.push(rootBranch);

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      // Re-initialize the tree on resize to keep it centered and visible
      initializeTree();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [animate, initializeTree]);

  // Effect to handle rep count change, triggering new growth
  useEffect(() => {
    if (repCount > 0) {
      addNewGrowth();
    }
  }, [repCount, addNewGrowth]);

  return (
    <>
      <Head>
        <title>Myelin Map &ndash; Visualize 🌱</title>
        <meta name="description" content="Watch your myelin tree grow with every rep." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header title="Visualize Your Growth 🌳" subtitle="Train with reps. Witness your progress." />

      <main className="flex flex-col items-center justify-start px-4 py-16 min-h-screen bg-gray-900 text-white">
        {/* 🌳 Animated Tree at Top */}
        <div className="relative w-full max-w-4xl h-[500px] mb-16 rounded-2xl overflow-hidden shadow-2xl bg-black">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* 🧠 Headline */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          <span role="img" aria-label="brain emoji">🧠</span> Rewire with Action
        </h1>
        <p className="text-lg max-w-2xl mb-10 text-gray-300 text-center">
          One click. One rep. One branch at a time. This is how myelin grows.
        </p>

        {/* 🔁 Habit Tracking Components */}
        <div className="w-full max-w-2xl space-y-8 mb-16">
          <HabitLoop />
          <RepCounter count={repCount} onRep={() => setRepCount((r) => r + 1)} />
        </div>

        {/* 📘 Explanation */}
        <section className="max-w-3xl space-y-6 text-center text-slate-200">
          <p>
            Every time you log a rep, your mystical Tree of Life grows stronger
            &mdash; more branches, more light, more magic.
          </p>
          <h2 className="text-2xl font-semibold text-white">This Is Only the Beginning</h2>
          <p>
            The tree will evolve with you. Soon, you will see leaves, glowing ivy, and even little fruit that reflect your consistency.
          </p>
          <h2 className="text-2xl font-semibold text-white">Built on Science. Fueled by You.</h2>
          <p>
            This is not fantasy &mdash; it is neuroscience. Repetition wires your brain. This visualizer lets you witness it.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
