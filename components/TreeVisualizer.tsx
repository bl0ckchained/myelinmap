"use client";

import { useRef, useEffect } from "react";

type Branch = {
  x: number;
  y: number;
  angle: number;
  depth: number;
  width: number;
};

export default function TreeVisualizer() {
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

    let branches: Branch[] = [];
    let fruitPositions: { x: number; y: number }[] = [];

    let animationFrame: number;
    let loopTimeout: ReturnType<typeof setTimeout>;
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
      // Glowing green orb for contrast
      ctx.beginPath();
      ctx.fillStyle = "rgba(100, 220, 120, 0.9)"; // bright green
      ctx.shadowColor = "rgba(180, 255, 180, 0.8)"; // soft glow
      ctx.shadowBlur = 18;
      ctx.arc(x, y, 12, 0, 2 * Math.PI);
      ctx.fill();

      // Coach emoji inside, white and crisp
      ctx.font = "16px serif";
      ctx.fillStyle = "#ffffff";
      ctx.shadowBlur = 0;
      ctx.fillText("🧘", x - 8, y + 6);
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

      if (depth >= 7) drawLeaf(x2, y2);
      if (depth >= 6) drawIvy(x2, y2, angle);

      if (depth >= 3 && depth <= 6 && Math.random() > 0.7) {
        fruitPositions.push({
          x: x2 + Math.random() * 12 - 6,
          y: y2 + Math.random() * 12 - 6,
        });
      }

      branches.push(
        {
          x: x2,
          y: y2,
          angle: angle - 0.3,
          depth: depth - 1,
          width: width * 0.7,
        },
        {
          x: x2,
          y: y2,
          angle: angle + 0.3,
          depth: depth - 1,
          width: width * 0.7,
        }
      );
    };

    const animate = () => {
      if (currentIndex < branches.length) {
        const { x, y, angle, depth, width } = branches[currentIndex];
        drawBranch(x, y, angle, depth, width);
        currentIndex++;
        animationFrame = requestAnimationFrame(animate);
      } else {
        // 🌳 Finished growing — start fruit popping
        loopTimeout = setTimeout(() => {
          popFruits(0);
        }, 1000); // Wait 1s before fruit starts
      }
    };

    const popFruits = (index: number) => {
      if (index >= fruitPositions.length) {
        // 🌱 Restart the tree after delay
        loopTimeout = setTimeout(() => {
          startDrawing();
        }, 6000); // wait 6s after fruit ends
        return;
      }

      const fp = fruitPositions[index];
      const jitterX = (Math.random() - 0.5) * 16; // ±8px
      const jitterY = (Math.random() - 0.5) * 16;
      drawFruit(fp.x + jitterX, fp.y + jitterY);

      setTimeout(() => {
        popFruits(index + 1);
      }, 200); // delay between each fruit pop
    };

    const startDrawing = () => {
      ctx.clearRect(0, 0, width, height);
      branches = [];
      fruitPositions = [];
      currentIndex = 0;

      drawBranch(width / 2, height, Math.PI / 2, 8, 8);
      animationFrame = requestAnimationFrame(animate);
    };

    startDrawing();

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(loopTimeout);
    };
  }, []);

  return (
    <div className="relative w-full max-w-4xl h-[500px] mb-16 mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
