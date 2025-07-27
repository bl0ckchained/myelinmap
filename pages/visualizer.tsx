import Head from "next/head";
import { useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    const ivyColor = "#8affc1";
    const magicGlow = "rgba(131, 255, 184, 0.4)";
    const branches: {
      x: number;
      y: number;
      angle: number;
      depth: number;
      width: number;
    }[] = [];

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

      branches.push({ x: x2, y: y2, angle, depth: depth - 1, width: width * 0.7 });
    };

    const drawTree = () => {
      ctx.clearRect(0, 0, width, height);
      branches.length = 0;

      drawBranch(width / 2, height, Math.PI / 2, 8, 8);

      for (let i = 0; i < branches.length; i++) {
        const { x, y, angle, depth, width } = branches[i];
        drawBranch(x, y, angle - 0.3, depth, width);
        drawBranch(x, y, angle + 0.3, depth, width);
      }
    };

    drawTree();
  }, []);

  return (
    <>
      <Head>
        <title>Visualizer | Myelin Map</title>
        <meta name="description" content="Visualize your brain's myelin growth in real time." />
      </Head>

      <Header
        title="Tree of Life Visualizer 🌱"
        subtitle="Magical growth, one rep at a time."
      />

      <main className="bg-gray-900 text-slate-100 min-h-[calc(100vh-200px)] px-4 py-12 flex flex-col items-center justify-start">
        <h1 className="text-4xl font-bold mb-6 text-center">
          🧠 Watch Your Myelin Tree Grow
        </h1>

        <div className="relative w-full max-w-4xl h-[500px] mb-12 rounded-2xl overflow-hidden shadow-2xl bg-black">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        <section className="max-w-3xl space-y-6 text-center text-slate-200">
          <p>
            Every time you log a rep, your mystical Tree of Life grows stronger — more branches, more light, more magic.
          </p>

          <h2 className="text-2xl font-semibold text-white">This Is Only the Beginning</h2>
          <p>
            The tree will evolve with you. In the future, you’ll see circuits form, energy pulse through, and the shape of your discipline come alive.
          </p>

          <h2 className="text-2xl font-semibold text-white">Built on Science. Fueled by You.</h2>
          <p>
            This isn’t fantasy — it’s neuroscience. Repetition wires your brain. The visualizer just lets you see it.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
