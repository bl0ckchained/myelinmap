// pages/science.tsx
import React from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Science() {
  return (
    <>
      <Head>
        <title>Science of Healing | Myelin Map</title>
        <meta
          name="description"
          content="Discover how trauma reshapes the brain — and how myelin, habit repetition, and kindness can rewire it for healing."
        />
      </Head>

      <Header title="The Science of Healing" subtitle="Why your brain is never beyond repair" />

      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "2rem 1rem",
          lineHeight: "1.8",
          color: "#f0f0f0",
          background: "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
          borderRadius: "12px",
        }}
      >
        {/* Hero Statement */}
        <section style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "2rem", color: "#fbbf24" }}>
            No matter how deep the pain, your brain can grow new pathways. Every rep counts.
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#9ca3af", marginTop: "0.5rem" }}>
            The KIND Method blends trauma science, brain rewiring, and self-compassion so you can rebuild your habits — and your life — one small, repeatable action at a time.
          </p>
        </section>

        {/* Trauma & the Brain */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#93c5fd" }}>Trauma and the Brain</h2>
          <p>
            When we experience trauma, our brain rewires itself for survival — not growth.
            The stress response floods our system, shrinking areas like the hippocampus (memory)
            and over-activating the amygdala (fear center). This can keep us in cycles of reaction
            and self-sabotage.
          </p>
          <p>
            But here’s the truth: your brain is neuroplastic. It can adapt, change, and grow — at any age.
            Understanding this is the first step toward reclaiming your life.
          </p>
        </section>

        {/* Myelin & Habits */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#93c5fd" }}>The Magic of Myelin</h2>
          <p>
            Myelin is the brain’s insulation — a fatty layer that wraps around your neural pathways,
            making signals travel faster and stronger. The more you repeat an action, thought, or skill,
            the more myelin you build.
          </p>
          <p>
            This means you can literally wire kindness, resilience, and confidence into your brain —
            the same way old habits were wired in. Every rep you take is physical proof you are changing.
          </p>
        </section>

        {/* KIND Method */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#93c5fd" }}>The KIND Method</h2>
          <ul style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
            <li><strong>Knowledge</strong> – Learn how trauma impacts your brain and body.</li>
            <li><strong>Identification</strong> – Notice harmful patterns without judgment.</li>
            <li><strong>Neural Rewiring</strong> – Use repetition to build healthy habits and dissolve old ones.</li>
            <li><strong>Daily Kindness</strong> – Practice self-compassion every single day.</li>
          </ul>
        </section>

        {/* CTA */}
        <section style={{ textAlign: "center", marginTop: "3rem" }}>
          <h2 style={{ color: "#fbbf24", fontSize: "1.5rem" }}>You are not broken — you are rewiring.</h2>
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
              transition: "background-color 0.3s ease",
            }}
          >
            Start My Healing Journey →
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
// pages/science.tsx