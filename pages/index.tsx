import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Myelin Map &ndash; Rewire Your Brain, One Rep at a Time</title>
        <meta
          name="description"
          content="Welcome to Myelin Nation! We can beat addiction together."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header
        title="Welcome to Myelin Nation!"
        subtitle="We can beat addiction together."
      />

      <main className="bg-gray-900 text-white min-h-screen">
        <section className="relative overflow-hidden pt-20 pb-40 text-center flex flex-col items-center justify-center min-h-[80vh] px-6">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-in">
              Rewire Your Brain.
              <br />
              One Rep at a Time 🧠
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mb-10 text-gray-300 animate-slide-up delay-200">
              Welcome to <strong>Myelin Map</strong> &mdash; a tool for transformation
              built on the neuroscience of action and repetition. This isn&apos;t
              motivation. This is wiring.
            </p>
          </div>
        </section>

        <section className="py-16 px-6 md:px-20 max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-emerald-400">🌟 The Mission Behind Myelin Map</h2>
          <p className="text-lg text-gray-300">
            My name is Chad, and I created Myelin Map for anyone stuck in cycles they
            don&apos;t want to repeat. This platform was born from pain — and built with purpose.
          </p>

          <p className="text-lg text-gray-300">
            I spent nearly 20 years caught in addiction and survival mode. I read every book, tried
            every program, and failed more times than I can count. What changed everything for me
            was discovering <strong>myelin</strong> — the biological process that wires
            habits into your brain.
          </p>

          <p className="text-lg text-gray-300">
            Myelin is the insulation that wraps around your brain’s neural circuits. The more
            you use a circuit — good or bad — the thicker the myelin becomes. That means the
            brain doesn&apos;t change because of motivation. It changes because of <em>repetition</em>.
          </p>

          <p className="text-lg text-gray-300">
            That’s what Myelin Map is: a visual habit-building platform that turns your daily
            actions into beautiful, brain-based progress. One rep at a time. One affirmation,
            breath, or pushup — whatever it is for you.
          </p>

          <p className="text-lg text-emerald-300 font-semibold">
            This is a new kind of recovery. One that starts with love, and builds with action.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
