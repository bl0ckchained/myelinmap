import React, { useEffect, useMemo, useState } from "react";

type HabitLoopProps = {
  /** total reps for the active habit */
  repCount: number;
  /** wrap size for the active habit (e.g., 7) */
  wrapSize: number;
  /** bump this number after each successful rep to trigger a pulse */
  trigger: number;
  /** set true briefly when a wrap completes to celebrate */
  celebrate: boolean;
  /** optional title (e.g., habit name) */
  title?: string;
};

export default function HabitLoop({
  repCount,
  wrapSize,
  trigger,
  celebrate,
  title = "Myelin Habit Loop",
}: HabitLoopProps) {
  // Base spin speed (seconds per full rotation)
  const [speed, setSpeed] = useState<number>(22);

  // Affirmation visibility when a rep is logged
  const [showAffirm, setShowAffirm] = useState(false);

  // Thickness grows as wraps accumulate (soft cap for aesthetics)
  const wrapsDone = useMemo(() => Math.floor(repCount / Math.max(1, wrapSize)), [repCount, wrapSize]);
  const ringThickness = useMemo(() => 6 + Math.min(14, wrapsDone), [wrapsDone]);

  // When trigger changes (a rep was logged), speed up briefly + show affirmation
  useEffect(() => {
    if (trigger === 0) return;
    setSpeed(6);
    setShowAffirm(true);
    const t1 = setTimeout(() => setSpeed(12), 1600);
    const t2 = setTimeout(() => setSpeed(22), 3600);
    const t3 = setTimeout(() => setShowAffirm(false), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [trigger]);

  // Arcs / wheel geometry
  const size = 280; // svg viewbox size
  const cx = size / 2;
  const cy = size / 2;
  const r = 90; // main loop radius

  // Labels
  const steps = [
    { label: "Cue", angle: -90 },
    { label: "Action", angle: 0 },
    { label: "Reward", angle: 90 },
    { label: "Rep", angle: 180 },
  ];

  // Accessibility label
  const aria = `Your habit loop: cue, action, reward, rep — ${repCount} total reps. Wrap size ${wrapSize}. Wraps completed ${wrapsDone}.`;

  return (
    <div
      aria-label={aria}
      style={{
        border: "1px solid #233147",
        borderRadius: 16,
        background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00))",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02), 0 14px 28px rgba(0,0,0,0.35)",
        padding: 16,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 8, color: "#93c5fd", fontWeight: 700 }}>{title}</div>

      <div style={{ position: "relative", width: "100%", maxWidth: 520, margin: "0 auto" }}>
        {/* celebration burst (no deps) */}
        {celebrate && <BurstOverlay />}

        {/* slow spin wrapper with variable speed */}
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            margin: "0 auto",
            display: "grid",
            placeItems: "center",
            animation: `spin linear infinite`,
            animationDuration: `${speed}s`,
          }}
        >
          <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" style={{ maxWidth: 520 }}>
            {/* subtle outer halo */}
            <circle cx={cx} cy={cy} r={r + 24} fill="none" stroke="rgba(52, 211, 153, 0.15)" strokeWidth={18} />
            {/* main loop (myelin thickness grows) */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="url(#grad)"
              strokeWidth={ringThickness}
              strokeLinecap="round"
              filter="url(#glow)"
            />

            {/* four ticks to anchor the concepts */}
            {steps.map((s, i) => {
              const rad = (s.angle * Math.PI) / 180;
              const x1 = cx + Math.cos(rad) * (r - 10);
              const y1 = cy + Math.sin(rad) * (r - 10);
              const x2 = cx + Math.cos(rad) * (r + 14);
              const y2 = cy + Math.sin(rad) * (r + 14);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#64748b"
                  strokeOpacity={0.8}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              );
            })}

            {/* labels (static, counter-rotated) */}
            {steps.map((s, i) => {
              const rad = (s.angle * Math.PI) / 180;
              const lx = cx + Math.cos(rad) * (r + 34);
              const ly = cy + Math.sin(rad) * (r + 34);
              return (
                <g key={i} transform={`translate(${lx}, ${ly})`}>
                  <rect
                    x={-34}
                    y={-14}
                    width={68}
                    height={28}
                    rx={12}
                    fill="#0b1220"
                    stroke="#233147"
                    strokeWidth={1}
                  />
                  <text
                    x={0}
                    y={4}
                    textAnchor="middle"
                    style={{ fill: "#e5e7eb", fontSize: 12, fontWeight: 700 }}
                  >
                    {s.label}
                  </text>
                </g>
              );
            })}

            {/* defs for gradients & glow */}
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>

        {/* center stats + affirmations (fixed, not spinning) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              textAlign: "center",
              background: "rgba(11, 18, 32, 0.65)",
              border: "1px solid #233147",
              padding: "10px 14px",
              borderRadius: 12,
              minWidth: 200,
              boxShadow: "0 10px 20px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ color: "#9CA3AF", fontSize: 12, marginBottom: 2 }}>Wraps</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{wrapsDone}</div>
            <div style={{ color: "#9CA3AF", fontSize: 12, marginTop: 6 }}>
              {repCount} total • wrap size {wrapSize}
            </div>

            {showAffirm && (
              <div
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: "#86efac",
                  fontWeight: 700,
                  animation: "fadeInOut 2.4s ease both",
                }}
              >
                Another wrap in progress. You’re wiring greatness.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* styles */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
}

/* Tiny no-deps celebration burst */
function BurstOverlay() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        pointerEvents: "none",
      }}
    >
      <div style={{ position: "relative", width: 0, height: 0 }}>
        {[...Array(18)].map((_, i) => {
          const angle = (i / 18) * Math.PI * 2;
          const x = Math.cos(angle);
          const y = Math.sin(angle);
          const delay = (i % 6) * 30;
          // how far each dot travels
          const tx = x * 40;
          const ty = y * 40;
          const style: React.CSSProperties = {
            position: "absolute",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: i % 2 ? "#34d399" : "#fbbf24",
            transform: `translate(${x * 6}px, ${y * 6}px) scale(0.6)`,
            animation: "burst 800ms ease-out both",
            animationDelay: `${delay}ms`,
            boxShadow: "0 0 8px rgba(255,255,255,0.6)",
            // set vars the keyframes will read
            // @ts-expect-error – CSS custom props
            ["--tx" as any]: `${tx}px`,
            // @ts-expect-error – CSS custom props
            ["--ty" as any]: `${ty}px`,
          };
          return <span key={i} style={style} />;
        })}
        <style jsx>{`
          @keyframes burst {
            0% {
              opacity: 0.9;
              transform: translate(0, 0) scale(0.6);
            }
            100% {
              opacity: 0;
              transform: translate(var(--tx), var(--ty)) scale(1.2);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

