// components/TreeVisualizer.tsx
'use client';

import { useRef, useEffect } from "react";

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

      if (depth >= 7) drawLeaf(x2, y2);
      if (depth >= 6) drawIvy(x2, y2, angle);
      if (depth === 4 && Math.random() > 0.9) drawFruit(x2, y2);

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
  }, []);

  return (
    <div className="relative w-full max-w-4xl h-[500px] mb-16 mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
