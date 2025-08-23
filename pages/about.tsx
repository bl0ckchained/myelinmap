// pages/about.tsx
import Head from "next/head";
import Link from "next/link";
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Uses your shared header with the global nav */}
      <Header
        title="About Myelin Map 🧠"
        subtitle="A visual growth engine powered by neuroscience, grit, and purpose"
      />

      <main className="px-6 py-12 max-w-4xl mx-auto text-gray-100 space-y-16">
        {/* Mission */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Our Mission</h2>
          <p className="text-lg leading-relaxed text-gray-300">
            Myelin Map exists to help people reclaim their lives through consistent, meaningful
            practice. Rooted in the science of myelination—the biological process that wires habits
            into the brain—our platform is a visual, interactive, and radically empowering system
            for personal transformation.
          </p>
          <p className="text-lg leading-relaxed text-gray-300">
            We believe that every action, thought, and habit you repeat is shaping who you&apos;re becoming—and that change is
            possible for anyone, no matter their past.
          </p>
          <p className="text-lg leading-relaxed text-gray-300">
            This isn&apos;t about perfection. It&apos;s about <strong>progress</strong>. You&apos;re not broken—you&apos;re mid-build. Let&apos;s grow forward.
          </p>
        </section>

        {/* Myelin Nation */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Myelin Nation Mission</h2>
          <p className="text-lg leading-relaxed text-gray-300">
            Myelin Nation is a community for doers, dreamers, rebuilders, and overcomers.
            We welcome anyone who&apos;s fighting to become their best self—whether you&apos;re escaping addiction,
            healing from trauma, or simply building better habits.
          </p>
          <p className="text-lg leading-relaxed text-gray-300">
            Our mission is to create a supportive, stigma-free space where daily reps lead to lifelong change.
            No shame. No judgment. Just growth—one wrap at a time. Together, we celebrate every step, every stumble, every comeback.
          </p>
          <p className="text-lg leading-relaxed text-gray-300">
            This is more than a movement. It&apos;s a <strong>rewiring revolution</strong>. Everyone&apos;s invited. Especially you.
          </p>
        </section>

        {/* Powered by Purpose */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Powered by Purpose</h2>
          <p className="text-lg leading-relaxed text-gray-300">
            Myelin Map is powered by Quantum Step Consultants LLC—a mission-driven business
            helping people and startups unlock clarity, systems, and soul.
          </p>
          <p className="text-lg leading-relaxed text-gray-300">
            We&apos;re not just a tech company. We&apos;re a comeback story. And you&apos;re part of it.
          </p>
          <p className="text-sm text-gray-400">
            Read our <Link href="/legalpage" className="underline hover:text-blue-300">Privacy Policy &amp; Terms</Link>.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
