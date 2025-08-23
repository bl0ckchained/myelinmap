// pages/about.tsx
import React from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | Myelin Map</title>
        <meta
          name="description"
          content="Learn the story behind Myelin Map, our mission, and how we're helping people rewire their brains through habit-driven growth."
        />
        <meta property="og:title" content="About Myelin Map" />
        <meta
          property="og:description"
          content="A visual growth engine powered by neuroscience, grit, and purpose."
        />
      </Head>

      <Header
        title="About Myelin Map 🧠"
        subtitle="A visual growth engine powered by neuroscience, grit, and purpose"
      />

      <main className="px-6 py-12 max-w-4xl mx-auto text-gray-100 space-y-16">
        {/* Mission */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Our Mission</h2>
          <p className="text-lg leading-relaxed text-gray-300">
            Myelin Map exists to help people reclaim their lives through
            consistent, meaningful practice. Rooted in the science of myelination — the biological process that wires habits
            into the brain — our platform is a visual, interactive, and radically empowering system
            for personal transformation.
          </p>
          <p className="text-lg leading-relaxed text-gray-300">
            We believe that every action, thought, and habit you repeat is shaping who you're becoming — and that change is possible for anyone, no matter their past.
          </p>
          <p className="text-lg leading-relaxed text-gray-300">
            This isn't about perfection. It's about <strong>progress.</strong> You're not broken — you're mid-build. Let's grow forward.
          </p>
        </section>

        {/* Myelin Nation */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Myelin Nation Mission</h2>
          <p className="text-lg leading-relaxed text-gray-300">
            Myelin Nation is a community for doers, dreamers, rebuilders, and overcomers.
            We welcome anyone who's fighting to become their best self — whether you're escaping addiction, healing from trauma, or simply building better habits.
          </p>
          <p className="text-lg leading-relaxed text-gray-300">
            Our mission is to create a supportive, stigma-free space where daily reps lead to lifelong change. No shame. No judgment. Just growth — one wrap at a time. Together, we celebrate every step, every stumble, every comeback.
          </p>
          <p className="text-lg leading-relaxed text-gray-300">
            This is more than a movement. It's a <strong>rewiring revolution.</strong> Everyone's invited. Especially you.
          </p>
        </section>

        {/* Powered by Purpose */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Powered by Purpose</h2>
          <p>
            Myelin Map is powered by Quantum Step Consultants LLC — a mission-driven business
            helping people and startups unlock clarity, systems, and soul.
          </p>
          <p>We're not just a tech company. We're a comeback story. And you're part of it.</p>
        </section>
      </main>

      <Footer />
    </>
  );
}
