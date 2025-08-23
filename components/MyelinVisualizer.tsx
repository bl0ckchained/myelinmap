import React, { useEffect, useMemo, useRef, useState } from "react";

type Neuron = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  charge: number;
  myelinLevel: number; // 0-1
  pulsePhase: number;
};

type Pathway = {
  from: number;
  to: number;
  myelinProgress: number; // 0-1
  strength: number;       // 0-1
  lastActivated: number;
};

type MyelinVisualizerProps = {
  repCount: number;
  wrapSize: number;
  pulseKey: number;     // bump to trigger a pulse
  height?: number;
  title?: string;
};

export default function MyelinVisualizer({
  repCount,
  wrapSize,
  pulseKey,
  height = 300,
  title = "Neural Myelin Network",
}: MyelinVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const tRef = useRef<number>(0);

  const [repPulse, setRepPulse] = useState<number>(0);
  const [showMyelinMessage, setShowMyelinMessage] = useState(false);

  // Complexity scales with reps (stable memo)
  const networkStats = useMemo(() => {
    const baseNeurons = 12;
    const maxNeurons = 24;
    const neuronCount = Math.min(maxNeurons, baseNeurons + Math.floor(repCount / 3));

    const wrapsCompleted = Math.floor(repCount / Math.max(1, wrapSize));
    const myelinDensity = Math.min(0.9, repCount * 0.02);

    return { neuronCount, wrapsCompleted, myelinDensity };
  }, [repCount, wrapSize]);

  // Trigger the pulse & message when a rep is logged
  useEffect(() => {
    if (pulseKey === 0) return;
    setRepPulse(1);
    setShowMyelinMessage(true);

    const t1 = setTimeout(() => setRepPulse(0), 2000);
    const t2 = setTimeout(() => setShowMyelinMessage(false), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pulseKey]);

  // Main animation (initialize once per network complexity change)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = canvas.clientWidth || 600;
    let heightPx = canvas.clientHeight || Math.max(220, height);
    const dpr = Math.max(1, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);

    const resize = () => {
      width = canvas.clientWidth || width;
      heightPx = canvas.clientHeight || heightPx;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(heightPx * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS pixels
    };
    resize();

    // Create neurons
    const neurons: Neuron[] = Array.from({ length: networkStats.neuronCount }, (_, i) => ({
      x: 50 + Math.random() * Math.max(1, width - 100),
      y: 50 + Math.random() * Math.max(1, heightPx - 100),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      charge: 0.5 + Math.random() * 0.5,
      myelinLevel: Math.min(0.9, (i / Math.max(1, networkStats.neuronCount)) * networkStats.myelinDensity),
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    // Create pathways between nearby neurons
    const pathways: Pathway[] = [];
    const maxDistance = 120;
    for (let i = 0; i < neurons.length; i++) {
      for (let j = i + 1; j < neurons.length; j++) {
        const dx = neurons[i].x - neurons[j].x;
        const dy = neurons[i].y - neurons[j].y;
        const distance = Math.hypot(dx, dy);
        if (distance < maxDistance && pathways.length < neurons.length * 1.5) {
          pathways.push({
            from: i,
            to: j,
            myelinProgress: Math.min(0.95, Math.random() * networkStats.myelinDensity),
            strength: Math.max(0, 1 - distance / maxDistance),
            lastActivated: 0,
          });
        }
      }
    }

    const drawOnce = () => {
      tRef.current += 0.016;
      ctx.clearRect(0, 0, width, heightPx);

      // Background
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        heightPx / 2,
        0,
        width / 2,
        heightPx / 2,
        Math.max(width, heightPx) / 2
      );
      bgGrad.addColorStop(0, "rgba(15, 23, 42, 0.95)");
      bgGrad.addColorStop(1, "rgba(7, 12, 20, 0.95)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, heightPx);

      // Update neurons
      neurons.forEach((neuron, i) => {
        const flowX = Math.sin(tRef.current * 0.5 + i * 0.3) * 0.02;
        const flowY = Math.cos(tRef.current * 0.3 + i * 0.5) * 0.02;

        neuron.vx += flowX;
        neuron.vy += flowY;

        const pulseBoost = 1 + repPulse * 0.5;
        neuron.x += neuron.vx * pulseBoost;
        neuron.y += neuron.vy * pulseBoost;

        // wrap bounds
        if (neuron.x < 0) neuron.x = width;
        if (neuron.x > width) neuron.x = 0;
        if (neuron.y < 0) neuron.y = heightPx;
        if (neuron.y > heightPx) neuron.y = 0;

        neuron.vx *= 0.99;
        neuron.vy *= 0.99;

        neuron.pulsePhase += 0.03 + repPulse * 0.1;
      });

      // Pathways
      pathways.forEach((pathway) => {
        const fromNeuron = neurons[pathway.from];
        const toNeuron = neurons[pathway.to];
        if (!fromNeuron || !toNeuron) return;

        const dx = toNeuron.x - fromNeuron.x;
        const dy = toNeuron.y - fromNeuron.y;
        const distance = Math.hypot(dx, dy);

        // Base axon
        ctx.strokeStyle = `rgba(100, 116, 139, ${0.3 + pathway.strength * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(fromNeuron.x, fromNeuron.y);
        ctx.lineTo(toNeuron.x, toNeuron.y);
        ctx.stroke();

        // Myelin segments
        if (pathway.myelinProgress > 0.1) {
          const segments = Math.max(1, Math.floor(distance / 8));
          const alpha = pathway.myelinProgress * (0.6 + repPulse * 0.4);
          for (let i = 0; i < segments; i++) {
            const progress = i / segments;
            if (progress > pathway.myelinProgress) break;

            const x = fromNeuron.x + dx * progress;
            const y = fromNeuron.y + dy * progress;

            const segmentSize = 2 + pathway.myelinProgress * 3;
            const pulse = Math.sin(tRef.current * 2 + i * 0.5) * 0.3 + 0.7;

            ctx.fillStyle = `rgba(52, 211, 153, ${alpha * pulse})`;
            ctx.beginPath();
            ctx.arc(x, y, segmentSize, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.3 * pulse})`;
            ctx.beginPath();
            ctx.arc(x, y, segmentSize * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Signal pulse
        if (repPulse > 0.5) {
          const signalProgress = (tRef.current * 3) % 1;
          const sx = fromNeuron.x + dx * signalProgress;
          const sy = fromNeuron.y + dy * signalProgress;

          ctx.fillStyle = `rgba(251, 191, 36, ${repPulse})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = `rgba(251, 191, 36, ${repPulse * 0.5})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          const tx = fromNeuron.x + dx * Math.max(0, signalProgress - 0.1);
          const ty = fromNeuron.y + dy * Math.max(0, signalProgress - 0.1);
          ctx.lineTo(tx, ty);
          ctx.stroke();
        }
      });

      // Neurons
      neurons.forEach((neuron) => {
        const pulseSize = Math.sin(neuron.pulsePhase) * 0.3 + 0.7;
        const baseRadius = 3 + neuron.charge * 2;
        const radius = baseRadius * pulseSize * (1 + repPulse * 0.5);

        const bodyGrad = ctx.createRadialGradient(neuron.x, neuron.y, 0, neuron.x, neuron.y, radius);
        bodyGrad.addColorStop(0, `rgba(255, 255, 255, ${0.9 + repPulse * 0.1})`);
        bodyGrad.addColorStop(0.7, `rgba(148, 163, 184, 0.8)`);
        bodyGrad.addColorStop(1, `rgba(71, 85, 105, 0.6)`);

        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, radius, 0, Math.PI * 2);
        ctx.fill();

        if (neuron.myelinLevel > 0.3) {
          const glowRadius = radius + 4 + neuron.myelinLevel * 6;
          const glowAlpha = neuron.myelinLevel * (0.3 + repPulse * 0.2) * pulseSize;
          ctx.strokeStyle = `rgba(52, 211, 153, ${glowAlpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(neuron.x, neuron.y, glowRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // HUD
      const statsY = heightPx - 60;
      ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
      ctx.fillRect(10, statsY, 200, 50);
      ctx.strokeStyle = "rgba(52, 211, 153, 0.3)";
      ctx.strokeRect(10, statsY, 200, 50);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "12px ui-sans-serif, system-ui";
      ctx.fillText(`Neurons: ${networkStats.neuronCount}`, 20, statsY + 20);
      ctx.fillText(`Myelin Density: ${Math.round(networkStats.myelinDensity * 100)}%`, 20, statsY + 35);

      if (showMyelinMessage) {
        const msgAlpha = Math.sin(tRef.current * 4) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(52, 211, 153, ${msgAlpha})`;
        ctx.font = "bold 14px ui-sans-serif, system-ui";
        ctx.textAlign = "center";
        ctx.fillText("🧠 Myelin forming... Neural pathway strengthened!", width / 2, 40);
        ctx.textAlign = "left";
      }
    };

    const drawLoop = () => {
      drawOnce();
      if (!prefersReducedMotion) {
        rafRef.current = requestAnimationFrame(drawLoop);
      }
    };

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    // kick off
    drawLoop();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [networkStats, repPulse, showMyelinMessage, height]); // re-init only when complexity or canvas size likely changes

  return (
    <div
      style={{
        border: "1px solid #233147",
        borderRadius: 16,
        overflow: "hidden",
        background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00))",
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.02), 0 14px 28px rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          padding: "12px 16px 8px",
          borderBottom: "1px solid rgba(52, 211, 153, 0.2)",
          background: "rgba(15, 23, 42, 0.5)",
          textAlign: "center",
        }}
      >
        <div style={{ color: "#34d399", fontWeight: 700, fontSize: 14 }}>
          {title}
        </div>
        <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
          {repCount} reps • {networkStats.wrapsCompleted} wraps completed
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{ width: "100%", height }}
        aria-label={`Myelin visualization showing ${networkStats.neuronCount} neurons with ${Math.round(
          networkStats.myelinDensity * 100
        )}% myelin density`}
      />
    </div>
  );
}
