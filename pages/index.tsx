import React from 'react';

// --- Embedded Header Component ---
const navLinks = [
  { href: "/", label: "🏠 Home", hoverColor: "hover:bg-emerald-500" },
  { href: "/rewire", label: "🔥 7-Day Challenge", hoverColor: "hover:bg-amber-400" },
  { href: "/about", label: "👤 About Us", hoverColor: "hover:bg-lime-400" },
  { href: "/visualizer", label: "🧬 Visualizer", hoverColor: "hover:bg-cyan-500" },
  { href: "/coach", label: "🧠 Coach", hoverColor: "hover:bg-pink-400" },
  { href: "/community", label: "🤝 Myelination", hoverColor: "hover:bg-rose-400" },
  { href: "/dashboard", label: "📈 Dashboard", hoverColor: "hover:bg-blue-400" },
];

const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <header className="bg-gray-900 text-white text-center py-12 px-4">
      <h1 className="text-4xl font-bold">{title}</h1>
      {subtitle && <p className="text-lg mt-2 max-w-xl mx-auto">{subtitle}</p>}
      <nav className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        {navLinks.map(({ href, label, hoverColor }) => (
          <a
            key={href}
            href={href}
            className={`
              px-4 py-2 rounded-full bg-gray-800 text-white
              ${hoverColor} hover:text-black
              transition-all duration-300 shadow-md
              transform hover:-translate-y-1 hover:scale-105
            `}
          >
            {label}
          </a>
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
          Special thanks to Matt Stewart — your belief helped light this path.
        </p>
        <p>
          <span role="img" aria-label="brain emoji">🧠</span> Designed to wire greatness into your day <span role="img" aria-label="brain emoji">🧠</span>
        </p>
      </div>
      <div className="space-y-2 mb-4">
        <p>
          © 2025 MyelinMap.com Made with <span role="img" aria-label="blue heart emoji">💙</span> in Michigan · Powered by Quantum Step
          Consultants LLC
        </p>
        <p>
          <a className="underline hover:text-blue-300">
              Privacy Policy & Terms
          </a>
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

const MyelinButton = ({ href, color, size = 'normal', children }: { href: string; color: string; size?: 'normal' | 'large'; children: React.ReactNode; }) => {
  const sizeClasses = size === 'large' ? 'px-8 py-4 text-lg' : 'px-6 py-3';
  return (
    <a
      href={href}
      className={`${color} text-black rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-md ${sizeClasses}`}
    >
      {children}
    </a>
  );
};

const HomeSection = ({ title, children }: { title: string; children: React.ReactNode; }) => {
  return (
    <section className="py-16 px-6 md:px-20 max-w-4xl mx-auto text-left space-y-6">
      <h2 className="text-3xl md:text-4xl font-bold text-white">
        {title}
      </h2>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <>
      <Header
        title="Welcome to Myelin Nation - Your transformation begins now! ⛈️⚡️"
        subtitle="This isn't just a habit tracker — it's a myelin visualizer."
      />

      <main className="bg-gray-900 text-white min-h-screen">
        <section className="relative overflow-hidden pt-20 pb-40 text-center flex flex-col items-center justify-center min-h-[80vh] px-6">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-in">
              Rewire Your Brain.<br />
              Build Your Life. 🧬
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mb-10 text-gray-300 animate-slide-up delay-200">
              Welcome to <strong>Myelin Map</strong> — a tool for transformation built on the neuroscience of action and repetition. This isn't motivation. This is wiring.
            </p>

            <div className="space-y-6 md:space-y-0 md:space-x-6 md:flex justify-center animate-slide-up delay-400">
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
            Myelin is the brain's insulation. It speeds up signals, strengthens
            connections, and makes habits automatic.
            <br />
            Every time you take action, you build myelin. Every rep counts. This
            is how you change your life.
          </p>
        </HomeSection>

        <HomeSection title="📜 The Myelin Truth">
          <p className="text-lg text-gray-300">
            <strong>Myelin doesn't care about your intentions.</strong> It
            doesn't respond to promises, motivation, or positive thinking. It
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
            I'm <strong>Chad Drummonds</strong> — a father, husband, and
            computer science student who lost everything to addiction... and
            clawed my way back.
          </p>
          <p className="text-lg text-gray-300">
            After nearly 20 years stuck in cycles I couldn't break, I found the
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

        <HomeSection title="💡 What You'll Find Here">
          <ul className="list-disc list-inside text-gray-300 text-lg space-y-2">
            <li>Neuroscience-backed habit reinforcement</li>
            <li>Visual progress that looks like the brain it rewires</li>
            <li>Tools built with purpose — and pain — behind them</li>
            <li>Challenges, loops, counters, affirmations… all aimed at change</li>
          </ul>
        </HomeSection>

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
