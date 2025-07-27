// pages/resources.tsx
import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Resources() {
  return (
    <>
      <Head>
        <title>Resources – Myelin Map</title>
        <meta name="description" content="A curated collection of support tools and resources for your growth journey." />
      </Head>

      <Header
        title="Support for the Whole Journey 💡"
        subtitle="Whether you're rewiring your brain, battling addiction, or building discipline, you're not alone."
      />

      <main className="bg-gray-900 text-white px-6 py-20 min-h-screen">
        <section className="max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="text-3xl font-bold text-amber-400 mb-4">🧠 Brain & Habit Science</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><a href="https://www.brainfacts.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">BrainFacts.org</a> – Explore how the brain builds skills.</li>
              <li><a href="https://charlesduhigg.com/the-power-of-habit/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">The Power of Habit</a> – Book and tools by Charles Duhigg.</li>
              <li><a href="https://danielcoyle.com/the-talent-code/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">The Talent Code</a> – Daniel Coyle reveals how deep practice and myelin growth unlock skill mastery.</li>
              <li><a href="https://www.what-happened-to-you.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">What Happened to You</a> – Oprah & Dr. Perry explore trauma, healing, and brain rewiring through compassion.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-emerald-400 mb-4">🧘‍♂️ Addiction Recovery & Mental Health</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><a href="https://www.samhsa.gov/find-help/national-helpline" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">SAMHSA Helpline</a> – 1-800-662-HELP (Free, 24/7 treatment support)</li>
              <li><a href="https://www.aa.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Alcoholics Anonymous</a> – Find meetings and recovery tools.</li>
              <li><a href="https://988lifeline.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">988 Suicide & Crisis Lifeline</a> – Speak to someone now.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-cyan-400 mb-4">📚 Student & Self-Education Tools</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><a href="https://www.khanacademy.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Khan Academy</a> – Free education in math, science, and more.</li>
              <li><a href="https://www.coursera.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Coursera</a> – Learn from top universities.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-purple-400 mb-4">🙏 Spiritual & Emotional Support</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><a href="https://breneBrown.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Brené Brown</a> – Resources on shame, vulnerability, and courage.</li>
              <li><a href="https://insighttimer.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Insight Timer</a> – Free meditations and talks from spiritual teachers.</li>
            </ul>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 text-lg">Know a great resource? <a href="mailto:chaddrummonds1976@gmail.com" className="text-blue-400 hover:underline">Suggest it here</a> 💌</p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
