import Head from "next/head";
import Link from "next/link";
import React from 'react';

// This is a self-contained version of the Resources page, combining the main
// page logic with the Header and Footer components to resolve import issues.

// --- Embedded Header Component ---
const navLinks = [
  { href: "/", label: "🏠 Home", hoverColor: "hover:bg-emerald-500" },
  { href: "/rewire", label: "🔥 7-Day Challenge", hoverColor: "hover:bg-amber-400" },
  { href: "/about", label: "👤 About Us", hoverColor: "hover:bg-lime-400" },
  { href: "/visualizer", label: "🧬 Visualizer", hoverColor: "hover:bg-cyan-500" },
  { href: "/coach", label: "🧠 Coach", hoverColor: "hover:bg-pink-400" },
];

const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <header className="bg-gray-900 text-white text-center py-12 px-4">
      <h1 className="text-4xl font-bold">{title}</h1>
      {subtitle && <p className="text-lg mt-2 max-w-xl mx-auto">{subtitle}</p>}
      <nav className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        {navLinks.map(({ href, label, hoverColor }) => (
          <Link key={href} href={href} legacyBehavior>
            <a
              className={`
                px-4 py-2 rounded-full bg-gray-800 text-white
                ${hoverColor} hover:text-black
                transition-all duration-300 shadow-md
                transform hover:-translate-y-1 hover:scale-105
              `}
            >
              {label}
            </a>
          </Link>
        ))}
      </nav>
    </header>
  );
};

// --- Embedded Footer Component ---
const Footer = () => {
  return (
    <footer className="text-center p-8 bg-gray-900 text-white text-sm">
      <div className="space-y-2 mb-4">
        <p className="text-gray-400 mt-2">
          Special thanks to Matt Stewart &mdash; your belief helped light this path.
        </p>
        <p>
          <span role="img" aria-label="brain emoji">🧠</span> Designed to wire greatness into your day <span role="img" aria-label="brain emoji">🧠</span>
        </p>
      </div>
      <div className="space-y-2 mb-4">
        <p>
          &copy; 2025 MyelinMap.com Made with <span role="img" aria-label="blue heart emoji">💙</span> in Michigan &middot; Powered by Quantum Step
          Consultants LLC
        </p>
        <p>
          <Link href="/legalpage" legacyBehavior>
            <a className="underline hover:text-blue-300">
              Privacy Policy & Terms
            </a>
          </Link>
        </p>
      </div>
      <div className="flex justify-center items-center gap-2">
        <span className="text-gray-400">Join our journey</span>
        <a
          href="https://www.youtube.com/@myelinmap"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition"
          aria-label="YouTube Channel"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-red-500"
          >
            <path d="M19.615 3.184c-1.007-.372-5.615-.372-5.615-.372s-4.608 0-5.615.372a3.21 3.21 0 0 0-2.262 2.262c-.373 1.007-.373 3.108-.373 3.108s0 2.101.373 3.108a3.21 3.21 0 0 0 2.262 2.262c1.007.372 5.615.372 5.615.372s4.608 0 5.615-.372a3.21 3.21 0 0 0 2.262-2.262c.373-1.007.373-3.108.373-3.108s0-2.101-.373-3.108a3.21 3.21 0 0 0-2.262-2.262zm-10.615 8.816v-5l5 2.5-5 2.5z" />
          </svg>
        </a>
      </div>
    </footer>
  );
};

// --- Main Resources Component ---
export default function Resources() {
  // A helper component for displaying a resource link with a description
  const ResourceLink = ({ href, title, description, color }: { href: string; title: string; description: string; color: string }) => (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-lg block transition-transform duration-200 transform hover:translate-x-2`}
      >
        <span className={`text-${color} font-semibold hover:underline`}>{title}</span>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      </a>
    </li>
  );

  return (
    <>
      <Head>
        <title>Resources &mdash; Myelin Map</title>
        <meta
          name="description"
          content="A curated collection of support tools and resources for your growth journey."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header
        title="Support for the Whole Journey 💡"
        subtitle="Whether you're rewiring your brain, battling addiction, or building discipline, you're not alone."
      />

      <main className="bg-gray-900 text-white px-6 py-20 min-h-screen">
        <section className="max-w-4xl mx-auto space-y-16">

          {/* Brain & Habit Science Section */}
          <div>
            <h2 className="text-3xl font-bold text-amber-400 mb-6">
              <span role="img" aria-label="brain emoji">🧠</span> Brain & Habit Science
            </h2>
            <ul className="list-none space-y-6">
              <ResourceLink
                href="https://www.brainfacts.org/"
                title="BrainFacts.org"
                description="Explore how the brain works, builds skills, and heals itself."
                color="blue-400"
              />
              <ResourceLink
                href="https://charlesduhigg.com/the-power-of-habit/"
                title="The Power of Habit"
                description="Book and resources on how habits are formed and how to change them."
                color="blue-400"
              />
              <ResourceLink
                href="https://danielcoyle.com/the-talent-code/"
                title="The Talent Code"
                description="Daniel Coyle reveals how deep practice and myelin growth unlock skill mastery."
                color="blue-400"
              />
              <ResourceLink
                href="https://www.amazon.com/dp/1250223180"
                title="What Happened to You?"
                description="Oprah and Dr. Perry's groundbreaking book on understanding trauma and healing."
                color="blue-400"
              />
            </ul>
          </div>

          {/* Addiction Recovery & Mental Health Section */}
          <div>
            <h2 className="text-3xl font-bold text-emerald-400 mb-6">
              <span role="img" aria-label="meditating person emoji">🧘‍♂️</span> Addiction Recovery & Mental Health
            </h2>
            <ul className="list-none space-y-6">
              <ResourceLink
                href="https://www.samhsa.gov/find-help/national-helpline"
                title="SAMHSA National Helpline"
                description="Free, 24/7 treatment referral and information service."
                color="blue-400"
              />
              <ResourceLink
                href="https://988lifeline.org/"
                title="988 Suicide & Crisis Lifeline"
                description="Free and confidential support for people in distress."
                color="blue-400"
              />
              <ResourceLink
                href="https://www.aa.org/"
                title="Alcoholics Anonymous"
                description="Find meetings and support tools for alcohol addiction."
                color="blue-400"
              />
              <ResourceLink
                href="https://www.na.org/"
                title="Narcotics Anonymous"
                description="A non-profit fellowship for those recovering from drug addiction."
                color="blue-400"
              />
              <ResourceLink
                href="https://www.nami.org/Home"
                title="National Alliance on Mental Illness (NAMI)"
                description="A leading mental health advocacy organization."
                color="blue-400"
              />
            </ul>
          </div>

          {/* Student & Self-Education Tools Section */}
          <div>
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">
              <span role="img" aria-label="books emoji">📚</span> Student & Self-Education Tools
            </h2>
            <ul className="list-none space-y-6">
              <ResourceLink
                href="https://www.baycollege.edu/"
                title="Bay de Noc Community College"
                description="The place where my journey began to change. A beacon of hope, growth, and transformation."
                color="blue-400"
              />
              <ResourceLink
                href="https://www.khanacademy.org/"
                title="Khan Academy"
                description="Free, world-class education in math, science, and more."
                color="blue-400"
              />
              <ResourceLink
                href="https://www.coursera.org/"
                title="Coursera"
                description="Online courses from top universities and companies."
                color="blue-400"
              />
              <ResourceLink
                href="https://www.edx.org/"
                title="edX"
                description="High-quality online courses and programs from universities worldwide."
                color="blue-400"
              />
            </ul>
          </div>

          {/* Spiritual & Emotional Support Section */}
          <div>
            <h2 className="text-3xl font-bold text-purple-400 mb-6">
              <span role="img" aria-label="praying hands emoji">🙏</span> Spiritual & Emotional Support
            </h2>
            <ul className="list-none space-y-6">
              <ResourceLink
                href="https://brenebrown.com"
                title="Brené Brown"
                description="Resources and research on shame, vulnerability, and courage."
                color="blue-400"
              />
              <ResourceLink
                href="https://insighttimer.com"
                title="Insight Timer"
                description="A free meditation app with thousands of guided meditations and talks."
                color="blue-400"
              />
              <ResourceLink
                href="https://www.mindful.org/"
                title="Mindful.org"
                description="Practical, helpful, and inspiring articles on mindfulness and well-being."
                color="blue-400"
              />
            </ul>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-gray-400 text-lg">
              Know a great resource?{" "}
              <a
                href="mailto:chaddrummonds1976@gmail.com"
                className="text-blue-400 hover:underline"
              >
                Suggest it here
              </a>{" "}
              <span role="img" aria-label="love letter emoji">💌</span>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
