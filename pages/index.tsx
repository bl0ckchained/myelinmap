import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Myelin Map – Rewire Your Brain, One Habit at a Time</title>
        <meta
          name="description"
          content="This isn&rsquo;t just a habit tracker — it&rsquo;s a myelin visualizer. Build new pathways. Change your life."
        />
      </Head>

      <Header
        title="Train Your Brain, One Rep at a Time 🧠"
        subtitle="This isn&rsquo;t just a habit tracker — it&rsquo;s a myelin visualizer"
      />

      <main className="bg-gray-900 text-white px-6 py-20 text-center min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Rewire Your Brain. <br />One Rep at a Time 🧠
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mb-10 text-gray-300">
          Welcome to <strong>Myelin Map</strong> — a tool for transformation built on the neuroscience of action and repetition.
          This isn&rsquo;t motivation. This is wiring.
        </p>

        <div className="space-y-6 md:space-y-0 md:space-x-6 md:flex">
          <Link href="/rewire">
            <button className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-lg font-semibold transition">
              🔥 7-Day Challenge
            </button>
          </Link>
          <Link href="/train">
            <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold transition">
              🧠 Log Reps
            </button>
          </Link>
          <Link href="/visualizer">
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold transition">
              🧬 Visualizer
            </button>
          </Link>
          <Link href="/founder">
            <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-lg font-semibold transition">
              💬 Message from the Founder
            </button>
          </Link>
        </div>

        <section className="mt-20 max-w-3xl text-left space-y-6">
          <h2 className="text-3xl font-bold text-white">📜 The Myelin Truth</h2>
          <p className="text-lg text-gray-300">
            <strong>Myelin doesn&rsquo;t care about your intentions.</strong> It doesn&rsquo;t respond to promises, motivation, or positive thinking.
            <br />
            It only cares about what you do — and how often you do it.
          </p>
          <p className="text-lg text-gray-300">
            Every time you take focused action, a neural circuit fires. When it fires, myelin wraps it — strengthening, speeding, locking it in.
            <br />
            This is how skills form. This is how change happens. This is how you become unstoppable.
          </p>
        </section>

        <section className="mt-20 max-w-3xl text-left space-y-6">
          <h2 className="text-3xl font-bold text-white">⚡ My Story</h2>
          <p className="text-lg text-gray-300">
            I&rsquo;m <strong>Chad Adams Drummonds</strong> — a father, husband, and computer science student who lost everything to addiction...
            and clawed my way back.
          </p>
          <p className="text-lg text-gray-300">
            After nearly 20 years stuck in cycles I couldn&rsquo;t break, I found the truth in neuroscience:
            The brain can change. But only through action.
          </p>
          <p className="text-lg text-gray-300">
            I built Myelin Map to help people like me — people who are sick of failing silently — finally <em>see</em> their growth.
            Not with empty checkmarks, but with real, visual feedback grounded in how the brain works.
          </p>
        </section>

        <section className="mt-20 max-w-3xl text-left space-y-6">
          <h2 className="text-3xl font-bold text-white">💡 What You&rsquo;ll Find Here</h2>
          <ul className="list-disc list-inside text-gray-300 text-lg space-y-2">
            <li>Neuroscience-backed habit reinforcement</li>
            <li>Visual progress that looks like the brain it rewires</li>
            <li>Tools built with purpose — and pain — behind them</li>
            <li>Challenges, loops, counters, affirmations… all aimed at change</li>
          </ul>
        </section>

        <div className="mt-20 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-white">Are You Ready to See Your Growth?</h2>
          <Link href="/rewire">
            <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-lg font-semibold transition">
              🔁 Join the 7-Day Rewire Challenge
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
