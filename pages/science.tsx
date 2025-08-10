// pages/science.tsx
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/** ---------- Starfield (subtle, low-alpha, no deps) ---------- */
function StarfieldCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const starsRef = useRef<Array<{ x: number; y: number; z: number }>>([]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const numStars = Math.min(140, Math.floor((width * height) / 18000)); // scale gently
    // init stars
    starsRef.current = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 0.7 + 0.3, // parallax-ish speed
    }));

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      // faint gradient wash for depth
      const g = ctx.createRadialGradient(width / 2, height * 0.35, 0, width / 2, height * 0.35, Math.max(width, height));
      g.addColorStop(0, "rgba(15,23,42,0.0)");   // slate-900-ish center
      g.addColorStop(1, "rgba(2,6,23,0.15)");    // near-black edges
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      // draw stars (low alpha to keep it classy)
      for (const s of starsRef.current) {
        s.y += s.z * 0.25;              // drift downward
        if (s.y > height) {             // recycle
          s.x = Math.random() * width;
          s.y = -2;
          s.z = Math.random() * 0.7 + 0.3;
        }
        const r = 0.4 + s.z * 0.8;      // subtle size
        ctx.globalAlpha = 0.15 + s.z * 0.1;
        ctx.fillStyle = Math.random() < 0.06 ? "#fbbf24" : "#93c5fd"; // rare warm twinkle
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(tick);
    };

    tick();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.5, // keep it subtle
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
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 14px 30px rgba(245,158,11,0.38)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 10px 24px rgba(245,158,11,0.28)";
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
        <title>Science of Healing | Myelin Map</title>
        <meta
          name="description"
          content="Discover how trauma reshapes the brain — and how myelin, repetition, and kindness can rewire it for healing. Learn the K.I.N.D. method and why tiny reps change everything."
        />
      </Head>

      {/* starfield lives behind everything */}
      <StarfieldCanvas />

      <Header title="The Science of Healing" subtitle="Why your brain is never beyond repair" />

      <main
        role="main"
        style={{
          position: "relative",
          zIndex: 1, // sit above the canvas
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
        {/* Hero Statement */}
        <section style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "2rem", color: "#fbbf24", marginBottom: 8 }}>
            No matter how deep the pain, your brain can grow new pathways. Every rep counts.
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#9ca3af", marginTop: 0 }}>
            The K.I.N.D. Method blends trauma science, brain rewiring, and self‑compassion so you can rebuild your
            habits — and your life — one small, repeatable action at a time.
          </p>
        </section>

        {/* Trauma & the Brain */}
        <section id="trauma-brain" style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#93c5fd" }}>Trauma and the Brain</h2>
          <div
            aria-hidden
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
            When we experience trauma, the brain optimizes for survival — not growth. The stress system can become
            over‑sensitive, the amygdala (threat detector) can dominate, and the hippocampus (context and memory) can
            struggle. That tilt toward vigilance can lock us into loops of avoidance, craving, shame, or collapse.
          </p>
          <p>
            Here’s the hope: your nervous system is plastic. Neuroplasticity means your brain rewires based on what you
            practice — attention, action, and emotion repeated over time. With the right conditions, the same mechanism
            that encoded your survival patterns can encode stability, confidence, and connection.
          </p>
        </section>

        {/* Myelin & Habits */}
        <section id="myelin" style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#93c5fd" }}>The Magic of Myelin</h2>
          <div
            aria-hidden
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
            Myelin is the brain’s insulation — a fatty layer that wraps neural fibers so signals travel faster and
            cleaner. Repetition tells oligodendrocytes “this circuit matters,” and they lay down more myelin. That’s why
            practice makes pathways powerful: the circuit literally becomes easier to fire.
          </p>
          <p>
            Translation: when you repeat a healthy behavior, you’re not just “being disciplined” — you’re{" "}
            <em>remodeling</em> the wiring that makes that behavior natural.
          </p>
        </section>

        {/* Habit Loop */}
        <section id="habit-loop" style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#93c5fd" }}>How Habits Form (Cue → Action → Reward → Rep)</h2>
          <div
            aria-hidden
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
            <li>
              <strong>Cue</strong> — a trigger you can predict (waking up, coffee, doorway, a feeling).
            </li>
            <li>
              <strong>Action</strong> — your tiny behavior (one breath reset, one sip of water, one push‑up).
            </li>
            <li>
              <strong>Reward</strong> — a quick, honest win (name it: “that was a rep,” “I keep promises to myself”).
            </li>
            <li>
              <strong>Rep</strong> — log it. The log is where the magic compounds.
            </li>
          </ul>
          <p style={{ color: "#cbd5e1", marginTop: 8 }}>
            Keep the action small enough that you can do it on your toughest day. Your job is not to crush it — it’s to
            <em> return</em>.
          </p>
        </section>

        {/* Why Tiny Wins Work */}
        <section id="why-tiny" style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#93c5fd" }}>Why Tiny Wins Work</h2>
          <div
            aria-hidden
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
            <li>
              <strong>Lower friction</strong> — small reps dodge the brain’s threat gate and reduce avoidance.
            </li>
            <li>
              <strong>State shift</strong> — a 20–120 second action can calm arousal or lift energy enough to act again.
            </li>
            <li>
              <strong>Identity builds</strong> — each rep is evidence: “I am someone who shows up.”
            </li>
            <li>
              <strong>Myelin grows</strong> — repetition + consistency = stronger, faster circuits.
            </li>
          </ul>

          {/* Pull-quote ribbon */}
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #233147",
              background:
                "linear-gradient(180deg, rgba(11,18,32,0.85) 0%, rgba(11,18,32,0.6) 100%)",
              boxShadow: "0 10px 20px rgba(0,0,0,0.35)",
            }}
          >
            <p style={{ margin: 0, color: "#cbd5e1", fontStyle: "italic" }}>
              “Rewiring isn’t a single breakthrough. It’s the quiet victory of today’s rep.”
            </p>
          </div>
        </section>

        {/* KIND Method */}
        <section id="kind" style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#93c5fd" }}>The K.I.N.D. Method</h2>
          <div
            aria-hidden
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
            <li>
              <strong>K — Knowledge</strong>: Understand trauma’s effects on attention, energy, and safety. Knowledge
              lowers shame and raises choice.
            </li>
            <li>
              <strong>I — Identification</strong>: Spot your loops (cues, urges, stories). Name them without judgment:
              “This is a threat response, not truth.”
            </li>
            <li>
              <strong>N — Neural Rewiring</strong>: Choose one tiny action you can repeat daily. Log every rep. Treat
              reps like bricks — small alone, unstoppable together.
            </li>
            <li>
              <strong>D — Daily Kindness</strong>: Compassion regulates the system that learns. Talk to yourself the way
              you’d talk to someone you love who’s trying.
            </li>
          </ul>
          <p style={{ marginTop: 8, color: "#cbd5e1" }}>
            K.I.N.D. is not about perfection. It’s about creating safety to practice, and practice to change.
          </p>
        </section>

        {/* How Reps Compound */}
        <section id="reps" style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#93c5fd" }}>Why Reps Are the Engine</h2>
          <div
            aria-hidden
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
            A single tiny rep won’t change your life. But a string of days where you did not abandon yourself — that
            changes everything. In Myelin Map, each rep lights a node, builds wraps, and moves your goal forward. It’s
            visual proof you’re coming back to yourself.
          </p>
          <ul style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
            <li><strong>1 rep</strong> today creates momentum.</li>
            <li><strong>7 reps</strong> = 1 wrap (example). You’ll feel the circuit getting easier.</li>
            <li><strong>21 reps</strong> often = a noticeable shift. You start doing it without the inner fight.</li>
          </ul>
        </section>

        {/* Gentle Safety Notes */}
        <section id="safety" style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#93c5fd" }}>Trauma‑Aware Notes</h2>
          <div
            aria-hidden
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
            <li>Your pace is right. If it feels too much, make the action smaller.</li>
            <li>Missing days isn’t failure — it’s data. Reset with one rep.</li>
            <li>
              If you’re processing acute trauma or crisis, consider pairing this with a licensed professional’s care.
            </li>
          </ul>
        </section>

        {/* Quick FAQ */}
        <section id="faq" style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#93c5fd" }}>Quick Questions</h2>
          <div
            aria-hidden
            style={{
              height: 2,
              width: 84,
              margin: "8px 0 14px",
              borderRadius: 999,
              background:
                "linear-gradient(90deg, rgba(147,197,253,0) 0%, rgba(147,197,253,0.8) 50%, rgba(147,197,253,0) 100%)",
            }}
          />
          <p style={{ marginBottom: 8 }}>
            <strong>How small should I start?</strong> — Small enough that you can do it on your hardest day. Then log
            it.
          </p>
          <p style={{ marginBottom: 8 }}>
            <strong>Do I need motivation first?</strong> — No. Action creates motivation more reliably than the other
            way around.
          </p>
          <p style={{ marginBottom: 0 }}>
            <strong>What if I feel shame?</strong> — Name it kindly and do a 20‑second rep. Shame shrinks when you act
            in alignment with the person you’re becoming.
          </p>
        </section>

        {/* CTA */}
        <section style={{ textAlign: "center", marginTop: "3rem" }}>
          <h2 style={{ color: "#fbbf24", fontSize: "1.5rem", marginBottom: 10 }}>
            You are not broken — you are rewiring.
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
              transition:
                "transform 160ms ease, box-shadow 220ms ease, background-color 220ms ease",
              boxShadow: "0 8px 20px rgba(245,158,11,0.25)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 12px 28px rgba(245,158,11,0.35)";
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 8px 20px rgba(245,158,11,0.25)";
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "translateY(0)";
            }}
          >
            Start My Healing Journey →
          </Link>
        </section>
      </main>

      {/* Back-to-top */}
      <BackToTop />

      <Footer />
    </>
  );
}
// Add any additional styles or components here if needed
// This page is designed to be simple and clean, focusing on the content and user experience.