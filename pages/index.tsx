import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TreeVisualizer from "@/components/TreeVisualizer";

// --- Accordion Types ---
interface AccordionContent {
  title: string;
  description: string;
}

interface AccordionProps {
  title: string;
  content: AccordionContent[];
  color: string;
}

const Accordion: React.FC<AccordionProps> = ({ title, content, color }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#1f2937",
        borderRadius: "1rem",
        marginBottom: "1.5rem",
        border: "1px solid #374151",
        boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1.5rem",
          textAlign: "left",
          fontWeight: "bold",
          background: "none",
          color: "#ffffff",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span style={{ color }}>{title}</span>
        <span
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          ▼
        </span>
      </button>
      <div
        style={{
          maxHeight: isOpen ? "320px" : "0",
          opacity: isOpen ? 1 : 0,
          overflow: "hidden",
          padding: isOpen ? "1rem 1.5rem" : "0",
          transition: "all 0.5s ease",
        }}
      >
        {content.map((item, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontWeight: "bold", color: "#ffffff" }}>
              {item.title}
            </h3>
            <p style={{ color: "#d1d5db", marginTop: "0.5rem" }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const selfLoveContent = [
    {
      title: "Forgive Yourself",
      description:
        "Acknowledge past behaviors as an outgrowth of illness, not a moral failing. Focus on staying well and moving forward without dwelling on past mistakes.",
    },
    {
      title: "Develop Self-Compassion",
      description:
        "Practice treating oneself as a best friend—with gentler language and objective self-assessment. Challenge negative self-talk by asking how one would advise a loved one in the same situation.",
    },
    {
      title: "Set Humble Goals",
      description:
        "Begin with achievable, narrow recovery goals (e.g., one day sober). Break larger goals into small, manageable action steps to build a sense of accomplishment and positive momentum.",
    },
    {
      title: "Engage in Daily Reflection/Introspection",
      description:
        "Prioritize activities like meditating, taking walks, journaling, or writing daily gratitude lists. These practices focus thoughts, foster positive self-regard, process emotions, and help identify and replace negative self-talk.",
    },
    {
      title: "Embrace Self-Care",
      description:
        "Prioritize physical health (healthy eating, regular exercise, adequate sleep) and mental well-being (engaging in enjoyable activities, relaxation). Self-care can include simple pleasures like sharing meals with friends or engaging in creative arts.",
    },
    {
      title: "Be Mindful of Thoughts and Emotions",
      description:
        "Practice mindfulness to pay attention to the present moment without judgment, observing thoughts and feelings with kindness and understanding.",
    },
    {
      title: "Focus on Strengths",
      description:
        "Consciously shift focus from past mistakes and shortcomings to current achievements and inherent strengths.",
    },
    {
      title: "Practice Gratitude",
      description:
        "Regularly identify and appreciate the positive aspects of one's life, fostering a more positive mindset and self-compassionate outlook.",
    },
    {
      title: "Connect with Others",
      description:
        "Actively combat isolation by connecting with supportive individuals through group therapy, discussions with a therapist or counselor, or spending time with friends and family.",
    },
    {
      title: "Spend Time in Nature",
      description:
        "Engage with natural environments (e.g., walking in the woods, watching a sunset) to promote a sense of connection, calmness, and self-compassion during recovery.",
    },
  ];

  const essentialAdviceContent = [
    {
      title: "Seeking and Accepting Help",
      description:
        "Open and honest communication with loved ones is vital; individuals should not be afraid to ask for their support...",
    },
    {
      title: "Developing a Personalized Recovery Plan",
      description:
        "Setting realistic, specific, and measurable goals is a cornerstone of recovery...",
    },
    {
      title: "Practicing Self-Care and Healthy Habits",
      description: "Prioritizing physical health is essential...",
    },
    {
      title: "Managing Triggers and Cravings",
      description:
        "Identifying and actively avoiding triggers—people, places, or situations that provoke substance use...",
    },
    {
      title: "Building a Strong Support System",
      description:
        "Leaning on close friends and family members provides invaluable support...",
    },
    {
      title: "Coping with Stress",
      description: "Developing healthy stress coping mechanisms is vital...",
    },
    {
      title: "Navigating Relapse",
      description:
        "It is important to understand that relapse can be a part of the recovery process...",
    },
  ];

  return (
    <>
      <Head>
        <title>Myelin Map – Rewire Your Brain, One Rep at a Time</title>
        <meta
          name="description"
          content="Welcome to Myelin Nation! Time to leave trauma and addiction behind us."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header
        title="Welcome to Myelin Nation!"
        subtitle="Time to leave trauma and addiction behind us."
      />

      <main
        style={{
          backgroundColor: "#111827",
          color: "#ffffff",
          minHeight: "100vh",
          paddingBottom: "4rem",
        }}
      >
        {/* 🧠 New Landing Section (between Header & Tree) */}
        <section className="landing-wrap">
          <div className="landing-overlay" />
          <div className="landing-inner">
            <h1 className="landing-headline">
              No matter how deep the pain, your brain can grow new pathways.
              <br />
              <span className="glow">Every rep counts.</span>
            </h1>

            <p className="landing-sub">
              The <strong>KIND Method</strong> blends trauma science, brain
              rewiring, and self-compassion so you can rebuild your habits — and
              your life — one small, repeatable action at a time.
            </p>

            <div className="cta-row">
              <Link href="/dashboard">
                <a className="btn btn-primary">🌱 Start My Healing Journey</a>
              </Link>
              <Link href="/science">
                <a className="btn btn-secondary">🔬 Learn the Science</a>
              </Link>
            </div>
          </div>
        </section>

        {/* 🌳 Tree Visualizer with science side-panels */}
        <section className="tree-grid">
          {/* Left science card */}
          <aside className="science-card">
            <h3>Trauma & the Brain</h3>
            <ul>
              <li>
                Trauma trains survival circuits; the brain adapts to keep you
                safe.
              </li>
              <li>
                Repeated stress signals strengthen pathways you don’t actually
                want.
              </li>
              <li>
                Safety + repetition lets the brain prune old routes and grow new
                ones.
              </li>
            </ul>
            <p className="micro-note">
              You’re not broken. You’re adaptive — and adaptable.
            </p>
          </aside>

          {/* Center tree */}
          <div className="tree-wrap">
            <TreeVisualizer />
          </div>

          {/* Right science card */}
          <aside className="science-card">
            <h3>Myelin & Habits</h3>
            <ul>
              <li>
                Myelin is insulation that makes signals faster and more
                reliable.
              </li>
              <li>
                Reps = more myelin. Good or bad, repetition wires the pathway.
              </li>
              <li>
                Small daily reps compound into automatic, healthier defaults.
              </li>
            </ul>
            <p className="micro-note">
              Kindness lowers friction so reps become doable.
            </p>
          </aside>
        </section>

        {/* 🎥 Intro Video + Healing Coach Callout (moved below tree + sidebars) */}
        <section style={{ padding: "1.5rem 1rem 0", textAlign: "center" }}>
          <div className="video-frame" aria-label="Intro to Myelin video">
            <iframe
              title="Intro to Myelin"
              src="https://www.youtube.com/embed/VIDEO_ID?rel=0&modestbranding=1&playsinline=1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <p
            style={{ marginTop: "0.75rem", color: "#ccc", fontSize: "0.95rem" }}
          >
            ⏳ 2 minutes: How myelin makes habits stick
          </p>

          {/* Healing Coach Callout */}
          <div className="coach-callout">
            <span className="coach-dot" aria-hidden />
            <p style={{ margin: 0 }}>
              🌟 Meet your <strong>Healing Coach</strong> — floating in the
              corner, ready with daily tips, motivation, and science‑backed
              micro‑wins. Tap it anytime.
            </p>
          </div>
        </section>

        {/* 🧠 Hero Section (kept) */}
        <section
          style={{
            textAlign: "center",
            padding: "5rem 1rem",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "768px",
              margin: "0 auto",
              zIndex: 1,
            }}
          >
            <h1
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              Rewire Your Brain.
              <br />
              One Rep at a Time 🧠
            </h1>
            <p style={{ fontSize: "1.25rem", color: "#d1d5db" }}>
              Welcome to <strong>Myelin Map</strong> — a tool for transformation
              built on the neuroscience of action and repetition. This isn’t
              motivation. This is wiring.
            </p>
          </div>
        </section>

        {/* 💡 Mission Section (kept) */}
        <section
          style={{
            padding: "3rem 1.5rem",
            maxWidth: "768px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{ fontSize: "2rem", fontWeight: "bold", color: "#34d399" }}
          >
            🌟 The Mission Behind Myelin Map
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#d1d5db",
              marginTop: "1rem",
            }}
          >
            My name is Chad, and I created Myelin Map for anyone stuck in cycles
            they don’t want to repeat...
          </p>
          <p style={{ fontSize: "1.125rem", color: "#d1d5db" }}>
            I spent nearly 20 years caught in addiction and survival mode...
          </p>
          <p style={{ fontSize: "1.125rem", color: "#d1d5db" }}>
            Myelin is the insulation that wraps around your brain’s neural
            circuits...
          </p>
          <p style={{ fontSize: "1.125rem", color: "#d1d5db" }}>
            That’s what Myelin Map is: a visual habit-building platform...
          </p>
          <p
            style={{
              fontSize: "1.125rem",
              fontWeight: "bold",
              color: "#6ee7b7",
            }}
          >
            This is a new kind of recovery. One that starts with love, and
            builds with action.
          </p>
        </section>

        {/* ❤️ Accordions Section (kept) */}
        <section
          style={{
            padding: "3rem 1.5rem",
            maxWidth: "768px",
            margin: "0 auto",
          }}
        >
          <Accordion
            title="❤️ Actionable Self-Love & Compassion"
            content={selfLoveContent}
            color="#f472b6"
          />
          <Accordion
            title="🧭 Essential Advice for Overcoming Addiction"
            content={essentialAdviceContent}
            color="#fbbf24"
          />
        </section>
      </main>

      <Footer />

      {/* Inline styles for the new sections */}
      <style jsx>{`
        .landing-wrap {
          position: relative;
          overflow: hidden;
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 1rem 2rem;
          background: radial-gradient(
              1200px 600px at 70% -10%,
              rgba(255, 184, 108, 0.15),
              transparent 60%
            ),
            radial-gradient(
              800px 500px at 20% 10%,
              rgba(255, 221, 170, 0.12),
              transparent 60%
            ),
            linear-gradient(180deg, #0f172a, #111827 40%, #0b1220 100%);
        }
        /* Optional: swap the above for a real sunrise image behind a gradient overlay */
        .landing-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(17, 24, 39, 0.2),
            rgba(17, 24, 39, 0.85)
          );
          pointer-events: none;
        }
        .landing-inner {
          position: relative;
          z-index: 1;
          max-width: 960px;
          text-align: center;
        }
        .landing-headline {
          font-size: clamp(1.8rem, 3.5vw, 3rem);
          line-height: 1.2;
          margin: 0 0 0.5rem 0;
          font-weight: 800;
          letter-spacing: 0.2px;
        }
        .glow {
          display: inline-block;
          position: relative;
        }
        .glow::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -0.35em;
          height: 8px;
          border-radius: 999px;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 200, 120, 0.9),
            rgba(255, 200, 120, 0) 70%
          );
          filter: blur(8px);
          opacity: 0.75;
          animation: pulse 3.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scaleX(0.95);
            opacity: 0.6;
          }
          50% {
            transform: scaleX(1);
            opacity: 0.9;
          }
        }
        .landing-sub {
          color: #d1d5db;
          font-size: clamp(1rem, 2vw, 1.25rem);
          margin: 0.75rem auto 1.5rem;
          max-width: 820px;
        }
        .cta-row {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .btn {
          display: inline-block;
          padding: 0.8rem 1.2rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          text-decoration: none;
          font-weight: 700;
          transition: transform 0.15s ease, box-shadow 0.2s ease,
            background 0.2s ease;
        }
        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 18px rgba(0, 0, 0, 0.25);
        }
        .btn-primary {
          background: #10b981;
          color: #062019;
        }
        .btn-primary:hover {
          background: #34d399;
        }
        .btn-secondary {
          background: #0b1220;
          color: #e5e7eb;
        }
        .btn-secondary:hover {
          background: #111827;
        }

        .video-frame {
          margin: 0 auto;
          width: min(900px, 92vw);
          aspect-ratio: 16 / 9;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #26324a;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
        }
        .video-frame iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }

        .tree-grid {
          display: grid;
          grid-template-columns: 1fr minmax(280px, 820px) 1fr;
          gap: 1rem;
          align-items: start;
          padding: 2rem 1rem 0;
          max-width: 1400px;
          margin: 0 auto;
        }
        @media (max-width: 1100px) {
          .tree-grid {
            grid-template-columns: 1fr;
          }
          .science-card {
            order: 2;
          }
          .tree-wrap {
            order: 1;
          }
        }
        .tree-wrap {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.02),
            rgba(255, 255, 255, 0)
          );
          border-radius: 16px;
          border: 1px solid #253244;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02),
            0 14px 28px rgba(0, 0, 0, 0.35);
          padding: 0.5rem;
        }
        .science-card {
          background: #0f172a;
          border: 1px solid #233147;
          border-radius: 16px;
          padding: 1.25rem;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
          position: sticky;
          top: 1rem;
          align-self: start;
        }
        .science-card h3 {
          margin: 0 0 0.75rem 0;
          font-size: 1.1rem;
          color: #93c5fd;
        }
        .science-card ul {
          margin: 0 0 0.75rem 1.1rem;
          padding: 0;
          color: #d1d5db;
          line-height: 1.5;
        }
        .science-card li {
          margin-bottom: 0.35rem;
        }
        .micro-note {
          font-size: 0.9rem;
          color: #9ca3af;
          border-top: 1px dashed #2b3a52;
          padding-top: 0.5rem;
        }

        /* Healing Coach callout */
        .coach-callout {
          margin: 1.25rem auto 0;
          background: rgba(255, 255, 255, 0.05);
          padding: 1rem 1.1rem 1rem 0.9rem;
          border-radius: 12px;
          display: inline-flex;
          gap: 0.6rem;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
        }
        .coach-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #34d399;
          position: relative;
          display: inline-block;
        }
        .coach-dot::after {
          content: "";
          position: absolute;
          inset: -6px;
          border-radius: 999px;
          border: 2px solid rgba(52, 211, 153, 0.55);
          animation: coachPulse 2.4s ease-in-out infinite;
        }
        @keyframes coachPulse {
          0% {
            transform: scale(0.85);
            opacity: 0.6;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.85);
            opacity: 0.6;
          }
        }
      `}</style>
    </>
  );
}
