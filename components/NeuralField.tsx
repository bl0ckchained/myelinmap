// components/NeuralField.tsx
import React, { useEffect, useMemo, useRef } from "react";

type FieldNode = { x: number; y: number; vx: number; vy: number; charge: number };

type NeuralFieldProps = {
  /** total reps for the active habit — drives density/energy */
  repCount: number;
  /** wrap size; every completed wrap adds a badge pulse */
  wrapSize: number;
  /** bump this when a rep is logged to create a visible pulse */
  pulseKey: number;
  /** optional height (px) */
  height?: number;
};

export default function NeuralField({
  repCount,
  wrapSize,
  pulseKey,
  height = 260,
}: NeuralFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pulseRef = useRef<number>(0); // 0..1 pulse envelope
  const tRef = useRef<number>(0);

  // derive node count and range from reps (gentle growth)
  const nodesCount = useMemo(() => Math.min(60, 14 + Math.floor(repCount / 4)), [repCount]);

  // show a small wrap “burst” in the network
  const wrapBursts = useMemo(() => {
    if (wrapSize <= 0) return 0;
    return Math.floor(repCount / wrapSize);
  }, [repCount, wrapSize]);

  // trigger a short pulse when pulseKey changes (rep logged)
  useEffect(() => {
    pulseRef.current = 1; // kick to full, will decay in draw loop
  }, [pulseKey]);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    let width = cvs.clientWidth || 600;
    let heightPx = cvs.clientHeight || Math.max(220, height);
    const dpr = Math.max(1, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);

    const resize = () => {
      width = cvs.clientWidth || width;
      heightPx = cvs.clientHeight || heightPx;
      cvs.width = Math.floor(width * dpr);
      cvs.height = Math.floor(heightPx * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    // init nodes
    const nodes: FieldNode[] = new Array(nodesCount).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * heightPx,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      charge: 0.6 + Math.random() * 0.8,
    }));

    const linksThreshold = 110; // max distance for linking
    const maxLinks = 3; // keep it readable
    ctx.lineCap = "round";

    const draw = () => {
      tRef.current += 0.016;
      // gentle decay for rep pulse
      if (pulseRef.current > 0) {
        pulseRef.current = Math.max(0, pulseRef.current - 0.02);
      }

      ctx.clearRect(0, 0, width, heightPx);

      // background soft gradient
      const g = ctx.createLinearGradient(0, 0, width, heightPx);
      g.addColorStop(0, "rgba(15,23,42,0.75)");
      g.addColorStop(1, "rgba(11,18,32,0.75)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, heightPx);

      // animate nodes
      for (const n of nodes) {
        // a little flow noise
        const flow = Math.sin((n.x + n.y + tRef.current * 50) * 0.002) * 0.05;
        n.vx += flow * 0.03;
        n.vy += -flow * 0.03;

        // subtle attraction to center
        const cx = width / 2;
        const cy = heightPx / 2;
        n.vx += ((cx - n.x) / Math.max(width, heightPx)) * 0.002;
        n.vy += ((cy - n.y) / Math.max(width, heightPx)) * 0.002;

        // rep pulse = temporary extra energy
        const energyBoost = 1 + pulseRef.current * 1.5;
        n.x += n.vx * energyBoost;
        n.y += n.vy * energyBoost;

        // soft bounds
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = heightPx + 20;
        if (n.y > heightPx + 20) n.y = -20;

        // friction
        n.vx *= 0.98;
        n.vy *= 0.98;
      }

      // draw links
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        let linksDrawn = 0;
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linksThreshold && linksDrawn < maxLinks) {
            const alpha = 0.05 + 0.35 * (1 - d / linksThreshold) + pulseRef.current * 0.08;
            ctx.strokeStyle = `rgba(52, 211, 153, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            linksDrawn++;
          }
        }
      }

      // draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const r = 2.2 + n.charge * 1.6 + pulseRef.current * 0.9;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();

        // green halo
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 2.2, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(52, 211, 153, 0.35)";
        ctx.stroke();
      }

      // wrap badges (top-left)
      if (wrapBursts > 0) {
        const badge = Math.min(wrapBursts, 9); // cap visual clutter
        const bx = 12;
        const by = 12;
        const bw = 56;
        const bh = 26;
        ctx.fillStyle = "rgba(11,18,32,0.7)";
        ctx.strokeStyle = "rgba(35,49,71,1)";
        ctx.lineWidth = 1;
        roundRect(ctx, bx, by, bw, bh, 10);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#86efac";
        ctx.font = "bold 12px ui-sans-serif, system-ui, -apple-system";
        ctx.textBaseline = "middle";
        ctx.fillText(`wraps ${badge}`, bx + 10, by + bh / 2);
      }
    };

    const loop = () => {
      draw();
      if (!prefersReducedMotion) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    // kick off
    loop();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [nodesCount, repCount, wrapBursts, height]);

  return (
    <div
      style={{
        border: "1px solid #233147",
        borderRadius: 12,
        overflow: "hidden",
        background: "#0b1220",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height }}
        aria-label={`Neural field with ${nodesCount} nodes`}
      />
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
