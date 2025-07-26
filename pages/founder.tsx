import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FounderPage() {
  return (
    <>
      <Head>
        <title>Message from the Founder | Myelin Map</title>
      </Head>
      <Header
  title="From Rock Bottom to Rewiring 🧠"
  subtitle="A message from Chad – founder of Myelin Map and a believer in your comeback"
/>


      <main className="px-6 py-12 max-w-3xl mx-auto text-white bg-gray-900 min-h-screen">
        <h1 className="text-4xl font-bold mb-6">💬 Message from the Founder</h1>

        <p className="mb-4">
          I really just want to reach others like me — those who were, or still are, stuck. People
          suffering with their own thoughts, not by any fault of their own, but because they were
          never taught how to change them.
        </p>

        <p className="mb-4">
          I believe most addicts and trauma survivors want better for themselves. But when you're in
          that state, it seems impossible to reach. You can see the light, but you don't believe
          it's for you — so you never try. And if no one shows you another way, you just stay there.
        </p>

        <p className="mb-4">
          I'm here to show another way. Not through lectures or empty motivation — but through a
          system. A visualizer. A mirror for your effort. A tool that proves to you, in real time,
          that you are changing.
        </p>

        <p className="mb-4">
          One quote hit me especially hard recently:
          <em className="block mt-2 italic text-amber-300">
            "Trauma isn’t what happens to you — it’s the label you put on the experience."
          </em>
          That shook me. If I had labeled my past differently, my life could have unfolded in an
          entirely different way.
        </p>

        <p className="mb-4">
          Experiences don’t need to be labeled good or bad — they’re just experiences. But when we
          label them, we unconsciously chain ourselves to the emotion that label carries.
        </p>

        <p className="mb-4">
          I want to give people what I never had: a tool to reframe their thinking, to track
          meaningful reps, and to see proof of their own comeback. That’s what Myelin Map is. Not a
          tracker. A transformation engine.
        </p>

        <p className="text-xl font-semibold text-yellow-400 mt-8">
          You are not broken. You are becoming.
        </p>
      </main>

      <Footer />
    </>
  );
}
