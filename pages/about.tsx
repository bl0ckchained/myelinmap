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
          content="Learn the story behind Myelin Map, our mission, and how we&apos;re helping people rewire their brains through habit-driven growth."
        />
      </Head>

      <Header
        title="About Myelin Map 🧠"
        subtitle="A visual growth engine powered by neuroscience, grit, and purpose"
      />

      <main className="px-6 py-12 max-w-4xl mx-auto text-gray-100 space-y-16">
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Our Mission</h2>
          <p>
            Myelin Map exists to help people reclaim their lives through consistent, meaningful
            practice. Rooted in the science of myelination &mdash; the biological process that wires habits
            into the brain &mdash; our platform is a visual, interactive, and radically empowering system
            for personal transformation.
          </p>
          <p>
            We believe growth shouldn&apos;t be reserved for the privileged few. We believe that no
            matter your past, you can shape your future. And we&apos;re building the greatest growth tool
            in the world to prove it.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">The Story Behind the Map</h2>
          <p>
            My name is Chad Adams Drummonds &mdash; I&apos;m a father, husband, computer science student, and a
            man who&apos;s been through hell and walked back with a mission.
          </p>
          <p>
            After losing my license in 2004, I spent nearly two decades in addiction. But since
            2019, I&apos;ve been clean, climbing back step by step. I returned to school, dove into
            blockchain and neuroscience, and discovered something extraordinary: the brain can heal.
            It can change. It can <em>re-map</em> itself &mdash; with effort, time, and repetition.
          </p>
          <p>
            That&apos;s what Myelin Map is. A system I wished existed when I was lost. A way to see your
            effort. A visual trail of proof that yes &mdash; you are changing. And you are not alone.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">What Makes Us Different</h2>
          <p>
            While most self-help tools shout &quot;just do it,&quot; we ask: <em>how does the brain actually change?</em> Then we build from there.
          </p>
          <ul className="list-disc list-inside space-y-2 text-left text-gray-300">
            <li>✅ Neuroscience-backed habit tracking</li>
            <li>✅ Beautiful visualizations of growth and streaks</li>
            <li>✅ Mantras, missions, and daily loops designed for rewiring</li>
            <li>✅ Created by someone who&apos;s walked the hard road, not just read the books</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Powered by Purpose</h2>
          <p>
            Myelin Map is powered by Quantum Step Consultants LLC &mdash; a mission-driven business
            helping people and startups unlock clarity, systems, and soul.
          </p>
          <p>We&apos;re not just a tech company. We&apos;re a comeback story. And you&apos;re part of it.</p>
        </section>
      </main>

      <Footer />
    </>
  );
}
