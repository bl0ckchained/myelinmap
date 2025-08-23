"use client";

import { useEffect, useRef } from "react";

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

    // -------- Configs (easy to tweak) --------
    const config = {
      maxDepth: 8,
      branchUnit: 10, // px per depth unit
      splitAngle: 0.3,
      trunkWidth: 8,
      leafAtDepth: 7,
      ivyAtDepth: 6,
      fruitDepthMin: 3,
      fruitDepthMax: 6,
      restartDelayMs: 3000,
      sparkleRays: 6,
      fruitRadius: 12,
      seedMidGrowthAt: 0.4, // when fruit popping starts (fraction of growth)
    } as const;

    // Motion preferences
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // DPR-aware sizing
    const setCanvasSize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setCanvasSize();

    // State
    let branches: Branch[] = [];
    let fruitPositions: { x: number; y: number }[] = [];
    let animationFrame = 0;
    let loopTimeout = 0 as unknown as ReturnType<typeof setTimeout>;
    let currentIndex = 0;
    let fruitStarted = false;
    let running = true; // pause/resume on visibility

    // Helpers
    const drawLeaf = (x: number, y: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = "rgba(144, 255, 203, 0.6)";
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    };

    const drawIvy = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = "rgba(104, 255, 185, 0.3)";
      ctx.lineWidth = 1.2;
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle + 1) * 8, y - Math.sin(angle + 1) * 8);
      ctx.stroke();
      ctx.restore();
    };

    const drawFruit = (x: number, y: number) => {
      ctx.save();
      // glow orb
      ctx.beginPath();
      ctx.fillStyle = "rgba(100, 220, 120, 0.9)";
      ctx.shadowColor = "rgba(180, 255, 180, 0.8)";
      ctx.shadowBlur = 18;
      ctx.arc(x, y, config.fruitRadius, 0, Math.PI * 2);
      ctx.fill();

      // Coach emoji centered
      ctx.font = "16px serif";
      ctx.fillStyle = "#ffffff";
      ctx.shadowBlur = 0;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🧘", x, y + 1); // tiny vertical nudge for balance
      ctx.restore();
    };

    const drawSparkle = (x: number, y: number) => {
      ctx.save();
      for (let i = 0; i < config.sparkleRays; i++) {
        const angle = (Math.PI * 2 * i) / config.sparkleRays;
        const x2 = x + Math.cos(angle) * 16;
        const y2 = y + Math.sin(angle) * 16;

        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 1;
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawBranch = (
      x: number,
      y: number,
      angle: number,
      depth: number,
      width: number
    ) => {
      if (depth === 0) return;

      const x2 = x + Math.cos(angle) * depth * config.branchUnit;
      const y2 = y - Math.sin(angle) * depth * config.branchUnit;

      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = "#8affc1"; // ivyColor
      ctx.lineWidth = width;
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(131, 255, 184, 0.4)"; // magicGlow
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();

      if (depth >= config.leafAtDepth) drawLeaf(x2, y2);
      if (depth >= config.ivyAtDepth) drawIvy(x2, y2, angle);

      // record possible fruit spots
      if (
        depth >= config.fruitDepthMin &&
        depth <= config.fruitDepthMax &&
        Math.random() > 0.7
      ) {
        fruitPositions.push({
          x: x2 + Math.random() * 12 - 6,
          y: y2 + Math.random() * 12 - 6,
        });
      }

      // split into two
      branches.push(
        { x: x2, y: y2, angle: angle - config.splitAngle, depth: depth - 1, width: width * 0.7 },
        { x: x2, y: y2, angle: angle + config.splitAngle, depth: depth - 1, width: width * 0.7 }
      );
    };

    const popFruits = (index: number) => {
      if (index >= fruitPositions.length || !running) return;

      const fp = fruitPositions[index];
      const jitterX = (Math.random() - 0.5) * 16;
      const jitterY = (Math.random() - 0.5) * 16;
      const fx = fp.x + jitterX;
      const fy = fp.y + jitterY;

      drawFruit(fx, fy);
      drawSparkle(fx, fy);

      setTimeout(() => popFruits(index + 1), prefersReducedMotion ? 0 : 120);
    };

    const animate = () => {
      if (!running) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      if (currentIndex < branches.length) {
        const { x, y, angle, depth, width } = branches[currentIndex];
        drawBranch(x, y, angle, depth, width);
        currentIndex++;

        // start fruit mid-growth
        if (!fruitStarted && currentIndex > branches.length * config.seedMidGrowthAt) {
          fruitStarted = true;
          popFruits(0);
        }

        animationFrame = requestAnimationFrame(animate);
      } else {
        // pause then restart the whole tree
        loopTimeout = setTimeout(() => {
          startDrawing();
        }, prefersReducedMotion ? 500 : config.restartDelayMs);
      }
    };

    const startDrawing = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      // clear + background once per loop
      ctx.clearRect(0, 0, w, h);
      const bgGrad = ctx.createRadialGradient(
        w / 2,
        h / 2,
        0,
        w / 2,
        h / 2,
        Math.max(w, h) / 2
      );
      bgGrad.addColorStop(0, "rgba(15, 23, 42, 0.95)");
      bgGrad.addColorStop(1, "rgba(7, 12, 20, 0.95)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      branches = [];
      fruitPositions = [];
      currentIndex = 0;
      fruitStarted = false;

      // seed trunk
      drawBranch(w / 2, h, Math.PI / 2, config.maxDepth, config.trunkWidth);
      animationFrame = requestAnimationFrame(animate);
    };

    // Pause/resume on tab visibility to save battery
    const handleVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) {
        // kick the loop if we paused during a timeout
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(animate);
      }
    };

    // Handle resize
    const handleResize = () => {
      setCanvasSize();
      // restart with fresh layout on resize
      cancelAnimationFrame(animationFrame);
      clearTimeout(loopTimeout);
      startDrawing();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("resize", handleResize);

    startDrawing();

    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
      clearTimeout(loopTimeout);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 960,
        height: 500,
        margin: "0 auto 4rem",
        borderRadius: "1rem",
        overflow: "hidden",
        boxShadow: "0 12px 24px rgba(0,0,0,0.5)",
        backgroundColor: "#000",
      }}
      aria-hidden // purely decorative
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
