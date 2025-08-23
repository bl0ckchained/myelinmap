// pages/science.tsx
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/** ---------- Starfield (HiDPI-sharp, subtle, no deps) ---------- */
function StarfieldCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const starsRef = useRef<Array<{ x: number; y: number; z: number }>>([]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));

    const seedStars = () => {
      const numStars = Math.min(140, Math.floor((width * height) / 18000));
      starsRef.current = Array.from({ length: numStars }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.7 + 0.3,
      }));
    };

    const resize = () => {
      dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      const w = window.innerWidth;
      const h = window.innerHeight;

      // CSS pixels (layout size)
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      // Device pixels (backing store)
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      // Draw in CSS pixel coordinates
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      width = w;
      height = h;
      seedStars();
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      const g = ctx.createRadialGradient(
        width / 2,
        height * 0.35,
        0,
        width / 2,
        height * 0.35,
        Math.max(width, height)
      );
      g.addColorStop(0, "rgba(15,23,42,0.0)");
      g.addColorStop(1, "rgba(2,6,23,0.15)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      for (const s of starsRef.current) {
        s.y += s.z * 0.25;
        if (s.y > height) {
          s.x = Math.random() * width;
          s.y = -2;
          s.z = Math.random() * 0.7 + 0.3;
        }
        const r = 0.4 + s.z * 0.8;
        ctx.globalAlpha = 0.15 + s.z * 0.1;
        ctx.fillStyle = Math.random() < 0.06 ? "#fbbf24" : "#93c5fd";
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    tick();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden={true}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.5,
      }}
    />
  );
}

/** ---------- Back-to-top button ---------- */
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        zIndex: 40,
        padding: "10px 12px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.15)",
        background: "#f59e0b",
        color: "#111827",
        fontWeight: 800,
        boxShadow: "0 10px 24px rgba(245,158,11,0.28)",
        cursor: "pointer",
        transition: "transform 160ms ease, box-shadow 220ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 14px 30px rgba(245,158,11,0.38)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 24px rgba(245,158,11,0.28)";
      }}
      onFocus={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 14px 30px rgba(245,158,11,0.38)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 24px rgba(245,158,11,0.28)";
      }}
    >
      ↑ Top
    </button>
  );
}

export default function Science() {
  return (
    <>
      <Head>
        <title>The Science of Healing | Myelin Map</title>
        <meta
          name="description"
          content="Healing is neuroplastic: myelin, repetition, and compassionate practice rewire circuits shaped by trauma and addiction. Learn how amygdala, PFC, and hippocampus heal — and simple ways to start."
        />
      </Head>

      <StarfieldCanvas />

      <Header
        title="The Science of Healing"
        subtitle="You are wired to heal — tiny, kind reps change the brain."
      />

      <main
        role="main"
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "900px",
          margin: "0 auto",
          padding: "2rem 1rem",
          lineHeight: 1.8,
          color: "#f0f0f0",
          background: "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
          borderRadius: 12,
          boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
        }}
      >
        {/* TL;DR */}
        <section aria-label="Summary" style={{ marginBottom: "1.75rem" }}>
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #233147",
              background:
                "linear-gradient(180deg, rgba(11,18,32,0.85) 0%, rgba(11,18,32,0.6) 100%)",
            }}
          >
            <p style={{ margin: 0, color: "#d1d5db" }}>
              Neuroplasticity means your brain remodels with what you repeat. Trauma and addiction carve reactive loops;
              gentle, consistent reps &mdash; logged and celebrated &mdash; lay myelin on healthier pathways.
            </p>
          </div>
        </section>

        {/* Rewiring overview */}
        <section id="rewiring" style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#93c5fd" }}>You Are Wired to Heal</h2>
          <div
            aria-hidden={true}
            style={{
              height: 2,
              width: 84,
              margin: "8px 0 14px",
              borderRadius: 999,
              background:
                "linear-gradient(90deg, rgba(147,197,253,0) 0%, rgba(147,197,253,0.8) 50%, rgba(147,197,253,0) 100%)",
            }}
          />
          <p>
            Healing is not willpower alone; it is biology. Your brain is a dynamic map that changes with experience.
            Neuroplasticity &mdash; the brain&apos;s capacity to rewire &mdash; lets you build new, kinder routes while
            old pathways quiet with disuse.
          </p>
        </section>

        {/* Brain systems */}
        <section id="brain" style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#93c5fd" }}>Trauma and Addiction in the Brain</h2>
          <div
            aria-hidden={true}
            style={{
              height: 2,
              width: 84,
              margin: "8px 0 14px",
              borderRadius: 999,
              background:
                "linear-gradient(90deg, rgba(147,197,253,0) 0%, rgba(147,197,253,0.8) 50%, rgba(147,197,253,0) 100%)",
            }}
          />
          <h3 style={{ marginBottom: 6 }}>Amygdala &mdash; the &ldquo;smoke detector&rdquo;</h3>
          <p style={{ marginTop: 0 }}>
            Rapid threat detection triggers fight/flight/freeze via stress hormones. After trauma, the detector becomes
            overly sensitive and can alarm in safe contexts. Healing practices teach safety again and turn down the gain.
          </p>

          <h3 style={{ marginBottom: 6 }}>Prefrontal Cortex (PFC) &mdash; the &ldquo;thinking center&rdquo;</h3>
          <p style={{ marginTop: 0 }}>
            The PFC governs planning and emotional regulation. When alarms blare, the brain routes energy away from slow,
            reflective control toward fast survival. Recovery strengthens PFC influence so it can soothe the amygdala and
            guide choices.
          </p>

          <h3 style={{ marginBottom: 6 }}>Hippocampus &mdash; the &ldquo;memory librarian&rdquo;</h3>
          <p style={{ marginTop: 0 }}>
            Stress can disrupt memory filing, leaving fragments that intrude as if the past is present. Healing helps
            integrate and time-stamp memories so they can be known as over.
          </p>
        </section>

        {/* Myelin & Hebb */}
        <section id="myelin" style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#93c5fd" }}>Myelination: Paving New Neural Highways</h2>
          <div
            aria-hidden={true}
            style={{
              height: 2,
              width: 84,
              margin: "8px 0 14px",
              borderRadius: 999,
              background:
                "linear-gradient(90deg, rgba(147,197,253,0) 0%, rgba(147,197,253,0.8) 50%, rgba(147,197,253,0) 100%)",
            }}
          />
          <p>
            Repetition signals oligodendrocytes to wrap used axons in myelin, the brain&apos;s insulation. Signals then
            travel cleaner and up to orders-of-magnitude faster. This is why new behaviors feel effortful at first and
            easier with practice: the wiring changes.
          </p>
          <p>
            Hebb&apos;s principle &mdash; &ldquo;neurons that fire together, wire together&rdquo; &mdash; is the engine.
            Consistency beats intensity. A 2-minute practice daily outgrows a heroic session done rarely.
          </p>
        </section>

        {/* Habit loop */}
        <section id="loop" style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#93c5fd" }}>Cue &rarr; Action &rarr; Reward &rarr; Rep</h2>
          <div
            aria-hidden={true}
            style={{
              height: 2,
              width: 84,
              margin: "8px 0 14px",
              borderRadius: 999,
              background:
                "linear-gradient(90deg, rgba(147,197,253,0) 0%, rgba(147,197,253,0.8) 50%, rgba(147,197,253,0) 100%)",
            }}
          />
          <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", marginTop: 0 }}>
            <li><strong>Cue</strong>: predictable trigger (coffee, doorway, a feeling).</li>
            <li><strong>Action</strong>: tiny behavior (one breath reset, one text to a friend).</li>
            <li><strong>Reward</strong>: name the win: &ldquo;that was a rep&rdquo; / &ldquo;I keep promises to myself&rdquo;.</li>
            <li><strong>Rep</strong>: log it; the log compounds the habit loop.</li>
          </ul>
          <p style={{ color: "#cbd5e1", marginTop: 8 }}>
            Keep the bar low enough for your hardest day. The job is not to never miss; it&apos;s to return.
          </p>
          <p style={{ marginTop: 10 }}>
            <Link
              href="/dashboard"
              style={{ color: "#fbbf24", textDecoration: "underline" }}
            >
              Try one tiny rep now &rarr;
            </Link>
          </p>
        </section>

        {/* Practical steps */}
        <section id="practices" style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#93c5fd" }}>Practical Steps to Rewire</h2>
          <div
            aria-hidden={true}
            style={{
              height: 2,
              width: 84,
              margin: "8px 0 14px",
              borderRadius: 999,
              background:
                "linear-gradient(90deg, rgba(147,197,253,0) 0%, rgba(147,197,253,0.8) 50%, rgba(147,197,253,0) 100%)",
            }}
          />
          <h3>Mindfulness and Meditation 🧘</h3>
          <p>
            Focus training strengthens PFC regulation and quiets amygdala reactivity over time. Observe thoughts and
            feelings without getting swept away; that stance is itself neuroplastic practice.
          </p>

          <h3>Somatic (Body-Based) Practices</h3>
          <p>
            You cannot think your way out of a body stuck in survival. Bottom-up work (somatic experiencing, yoga,
            tai chi/Qigong, progressive muscle relaxation) releases tension and signals safety to brainstem and amygdala.
          </p>

          <h3>Cognitive &amp; Behavioral Skills (CBT/DBT)</h3>
          <p>
            Top-down skills engage the PFC to notice and reframe automatic patterns. Rehearsing kinder, more accurate
            thoughts fires new circuits that become more automatic with myelination.
          </p>

          <h3>Connection and Co-regulation ❤️</h3>
          <p>
            Nervous systems synchronize. Safe others down-shift threat and expand capacity. Isolation feeds alarms;
            healthy connection is a biological resource, not a luxury.
          </p>

          <h3>Nutrition, Sleep, and Exercise 🍎</h3>
          <p>
            These are the non-negotiable substrate: omega-3s support myelin; good sleep consolidates memory and restores
            control; movement lowers cortisol and boosts BDNF, the growth fertilizer for circuits.
          </p>
          <p style={{ marginTop: 10 }}>
            <Link
              href="/dashboard"
              style={{ color: "#fbbf24", textDecoration: "underline" }}
            >
              Set a 2-minute daily rep &rarr;
            </Link>
          </p>
        </section>

        {/* KIND method */}
        <section id="kind" style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#93c5fd" }}>The K.I.N.D. Method</h2>
          <div
            aria-hidden={true}
            style={{
              height: 2,
              width: 84,
              margin: "8px 0 14px",
              borderRadius: 999,
              background:
                "linear-gradient(90deg, rgba(147,197,253,0) 0%, rgba(147,197,253,0.8) 50%, rgba(147,197,253,0) 100%)",
            }}
          />
          <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", marginTop: 0 }}>
            <li><strong>K &mdash; Knowledge</strong>: understanding lowers shame and expands choice.</li>
            <li><strong>I &mdash; Identification</strong>: name loops and cues kindly: &ldquo;this is a threat response, not truth.&rdquo;</li>
            <li><strong>N &mdash; Neural Rewiring</strong>: one tiny daily action; log every rep.</li>
            <li><strong>D &mdash; Daily Kindness</strong>: compassion regulates the system that learns.</li>
          </ul>
        </section>

        {/* Safety notes */}
        <section id="safety" style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#93c5fd" }}>Trauma-Aware Notes</h2>
          <div
            aria-hidden={true}
            style={{
              height: 2,
              width: 84,
              margin: "8px 0 14px",
              borderRadius: 999,
              background:
                "linear-gradient(90deg, rgba(147,197,253,0) 0%, rgba(147,197,253,0.8) 50%, rgba(147,197,253,0) 100%)",
            }}
          />
          <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", marginTop: 0 }}>
            <li>Your pace is right. If it feels like too much, shrink the action.</li>
            <li>Missed days are data, not failure. Reset with one rep.</li>
            <li>If you&apos;re in acute crisis, pair this with a licensed professional&apos;s care.</li>
          </ul>
        </section>

        {/* Closing / CTA */}
        <section style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <h2 style={{ color: "#fbbf24", fontSize: "1.5rem", marginBottom: 10 }}>
            You are not broken &mdash; you are rewiring.
          </h2>
          <p style={{ marginBottom: "1.5rem", color: "#d1d5db" }}>
            Start today. Repeat tomorrow. Then again. Every rep strengthens your new path.
          </p>

          <Link
            href="/dashboard"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#f59e0b",
              color: "#111827",
              borderRadius: "999px",
              fontWeight: 700,
              textDecoration: "none",
              transition: "transform 160ms ease, box-shadow 220ms ease, background-color 220ms ease",
              boxShadow: "0 8px 20px rgba(245,158,11,0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 28px rgba(245,158,11,0.35)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(245,158,11,0.25)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 28px rgba(245,158,11,0.35)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(245,158,11,0.25)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Start My Healing Journey &rarr;
          </Link>
        </section>
      </main>

      <BackToTop />
      <Footer />
    </>
  );
}
