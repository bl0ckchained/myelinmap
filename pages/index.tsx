import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

// Using a custom component for the main section for better readability and reusability
import HomeSection from "@/components/HomeSection";

export default function Home() {
  return (
    <>
      <Head>
        <title>Myelin Map – Rewire Your Brain, One Habit at a Time</title>
        <meta
          name="description"
          content="This isn’t just a habit tracker — it’s a myelin visualizer. Build new pathways. Change your life."
        />
        {/* Optional: Add a viewport meta tag for better mobile responsiveness */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header
        title="Train Your Brain, One Rep at a Time 🧠"
        subtitle="This isn’t just a habit tracker — it’s a myelin visualizer"
      />

      <main className="bg-gray-900 text-white min-h-screen">
        {/* Main hero section with improved visuals */}
        <section className="relative overflow-hidden pt-20 pb-40 text-center flex flex-col items-center justify-center min-h-[80vh] px-6">
          {/* Background element for a more dynamic feel */}
          <div className="absolute inset-0 bg-black opacity-40"></div>
          {/* Content with higher z-index to be on top of the background */}
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-in">
              Rewire Your Brain.
              <br />
              One Rep at a Time 🧠
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mb-10 text-gray-300 animate-slide-up delay-200">
              Welcome to <strong>Myelin Map</strong> — a tool for transformation
              built on the neuroscience of action and repetition. This isn’t
              motivation. This is wiring.
            </p>

            <div className="space-y-6 md:space-y-0 md:space-x-6 md:flex justify-center animate-slide-up delay-400">
              {/* Added a custom component for buttons to make them reusable and consistent */}
              <MyelinButton href="/rewire" color="bg-amber-500">
                🔥 7-Day Challenge
              </MyelinButton>
              <MyelinButton href="/visualizer" color="bg-cyan-600">
                🧬 Visualize & Grow
              </MyelinButton>
              <MyelinButton href="/resources" color="bg-lime-500">
                📚 Resources
              </MyelinButton>
              <MyelinButton href="/founder" color="bg-yellow-400">
                💬 Message from the Founder
              </MyelinButton>
            </div>
          </div>
        </section>

        {/* Use a consistent component for sections to keep the design clean */}
        <HomeSection title="🎥 The Myelination Process">
          <p className="text-lg text-gray-300 mb-6">
            Watch how your brain wires itself for speed, skill, and
            transformation.
          </p>
          <video
            controls
            preload="auto"
            className="w-full rounded-xl shadow-xl transition-transform duration-500 hover:scale-105"
          >
            <source src="/myelinmap_video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </HomeSection>

        <HomeSection title="🧠 Why Myelin Matters">
          <p className="text-lg text-gray-300">
            Myelin is the brain’s insulation. It speeds up signals, strengthens
            connections, and makes habits automatic.
            <br />
            Every time you take action, you build myelin. Every rep counts. This
            is how you change your life.
          </p>
        </HomeSection>

        <HomeSection title="📜 The Myelin Truth">
          <p className="text-lg text-gray-300">
            <strong>Myelin doesn’t care about your intentions.</strong> It
            doesn’t respond to promises, motivation, or positive thinking. It
            only cares about what you do — and how often you do it.
          </p>
          <p className="text-lg text-gray-300">
            Every time you take focused action, a neural circuit fires. When it
            fires, myelin wraps it — strengthening, speeding, locking it in.
            This is how skills form. This is how change happens. This is how you
            become unstoppable.
          </p>
        </HomeSection>

        <HomeSection title="⚡ My Story">
          <p className="text-lg text-gray-300">
            I’m <strong>Chad Drummonds</strong> — a father, husband, and
            computer science student who lost everything to addiction... and
            clawed my way back.
          </p>
          <p className="text-lg text-gray-300">
            After nearly 20 years stuck in cycles I couldn’t break, I found the
            truth in neuroscience: The brain can change. But only through
            action.
          </p>
          <p className="text-lg text-gray-300">
            I built Myelin Map to help people like me — people who are sick of
            failing silently — finally <em>see</em> their growth. Not with empty
            checkmarks, but with real, visual feedback grounded in how the brain
            works.
          </p>
        </HomeSection>

        <HomeSection title="💡 What You’ll Find Here">
          <ul className="list-disc list-inside text-gray-300 text-lg space-y-2">
            <li>Neuroscience-backed habit reinforcement</li>
            <li>Visual progress that looks like the brain it rewires</li>
            <li>Tools built with purpose — and pain — behind them</li>
            <li>Challenges, loops, counters, affirmations… all aimed at change</li>
          </ul>
        </HomeSection>

        {/* Final call-to-action section */}
        <section className="text-center py-20 px-6 bg-gray-800">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Are You Ready to See Your Growth?
          </h2>
          <p className="text-lg text-gray-300 mb-6 max-w-xl mx-auto">
            Take the first step toward building the life you want. The journey
            starts with a single rep.
          </p>
          <MyelinButton href="/rewire" color="bg-emerald-500" size="large">
            🔁 Join the 7-Day Rewire Challenge
          </MyelinButton>
        </section>
      </main>

      <Footer />
    </>
  );
}

// ---------------------------------------------------------------------------------------------------
// New components to be added to your components/ directory
// ---------------------------------------------------------------------------------------------------


