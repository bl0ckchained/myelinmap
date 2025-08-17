import React from "react";
import Head from "next/head";
import Link from "next/link";

// --- Embedded Header Component (centered with container) ---
const navLinks = [
  { href: "/", label: "🏠 Home", hoverColor: "hover:bg-emerald-500" },
  { href: "/rewire", label: "🔥 7-Day Challenge", hoverColor: "hover:bg-amber-400" },
  { href: "/about", label: "👤 About Us", hoverColor: "hover:bg-lime-400" },
  { href: "/visualizer", label: "🧬 Visualizer", hoverColor: "hover:bg-cyan-500" },
  { href: "/coach", label: "🧠 Coach", hoverColor: "hover:bg-pink-400" },
  { href: "/community", label: "🤝 Myelin Nation", hoverColor: "hover:bg-rose-400" },
  { href: "/dashboard", label: "📈 Dashboard", hoverColor: "hover:bg-blue-400" },
];

const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <header className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold">{title}</h1>
        {subtitle && <p className="text-lg mt-2 max-w-xl mx-auto">{subtitle}</p>}
        <nav className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          {navLinks.map(({ href, label, hoverColor }) => (
            <Link
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
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

// --- Embedded Footer Component (centered with container) ---
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm">
        <div className="space-y-2 mb-4">
          <p className="text-gray-400 mt-2">
            Special thanks to Matt Stewart &mdash; your belief helped light this path.
          </p>
          <p>
            <span role="img" aria-label="brain emoji">🧠</span> Designed to wire greatness into your day{" "}
            <span role="img" aria-label="brain emoji">🧠</span>
          </p>
        </div>
        <div className="space-y-2 mb-4">
          <p>
            &copy; {new Date().getFullYear()} MyelinMap.com Made with{" "}
            <span role="img" aria-label="blue heart emoji">💙</span> in Michigan &middot; Powered by Quantum Step
            Consultants LLC
          </p>
          <p>
            <Link href="/legalpage" className="underline hover:text-blue-300">
              Privacy Policy &amp; Terms
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
      </div>
    </footer>
  );
};

// --- Main Founder Page Component ---
export default function FounderPage() {
  return (
    <>
      <Head>
        <title>Message from the Founder | Myelin Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header
        title="From Rock Bottom to Rewiring 🧠"
        subtitle="A message from Chad &ndash; founder of Myelin Map and a believer in your comeback"
      />

      <main className="bg-gray-900 text-white min-h-screen">
        <div className="px-6 py-12 max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold mb-6 text-center text-yellow-400 animate-slide-up">
            💬 A Personal Message from the Founder
          </h1>

          <p className="text-lg text-gray-300 leading-relaxed animate-fade-in delay-200">
            Hi, I&apos;m Chad. This is my story &mdash; and what&apos;s worked for me. I want to start by saying this:{" "}
            <strong>Your story matters.</strong>
            What worked for me may not be the exact path for you, and I don&apos;t claim to have all the answers. I only know what pulled me
            out of the dark &mdash; and maybe, just maybe, it might spark something in you too.
          </p>

          <p className="text-lg text-gray-300 leading-relaxed animate-fade-in delay-400">
            When I was very young, between the ages of 5 and 10, I experienced trauma no child should go through. My father married a woman who
            brought deep harm into our home. Me and one of my brothers were abused &mdash; emotionally, physically, and sexually. I have
            memories of standing naked in a basement corner all night while my dad was working midnight shifts. I don&apos;t know all the details
            &mdash; trauma has a way of blurring time &mdash; but the pain stayed, even when the memories didn&apos;t. I buried it. For 40 years.
          </p>

          <p className="text-lg text-gray-300 leading-relaxed animate-fade-in delay-600">
            Fast-forward to 7th grade &mdash; I started acting out. I got in trouble constantly. I loved my dad, and I felt safe around him, but
            I never told him what was really going on inside me. I believed I was just a screw-up. That belief followed me into adulthood like a shadow.
          </p>

          <p className="text-lg text-gray-300 leading-relaxed animate-fade-in delay-800">
            By my twenties, I had already racked up two DUI charges in a single week. I lost my license, fell into a deep depression, and dove
            headfirst into drugs. Heroin, morphine, cocaine &mdash; you name it. Addiction became my identity. I couldn&apos;t hold a job for more
            than a year or two. I was either back in jail, back on drugs, or stranded with no ride to work. I tried all the traditional recovery
            methods. Some helped, most didn&apos;t. I started to believe I was just... broken. A loser. That this was just <strong>who I was</strong>.
          </p>

          <p className="text-xl font-bold text-emerald-400 italic text-center mt-8 animate-slide-up delay-1000">
            Then something unexpected happened.
          </p>

          <p className="text-lg text-gray-300 leading-relaxed animate-fade-in delay-1200">
            At around 45 years old, I met a woman who told me about self-kindness and affirmations. I remember thinking, this can&apos;t be real.
            But something in me listened. I&apos;d tried everything else, and I had nothing left to lose. So I started small:
            <em className="block mt-2 italic text-gray-300">
              &ldquo;No, Chad &mdash; you&apos;re not a loser. You&apos;re not your past. You&nbsp;can&nbsp;do this. But you have to start.&rdquo;
            </em>
            And so I did. I quit drugs. I quit smoking. I enrolled in college. I confronted my past. I picked up books.
          </p>

          <p className="text-lg text-gray-300 leading-relaxed animate-fade-in delay-1400">
            I read about trauma, the brain, healing, and hope. One book that changed everything was{" "}
            <a
              href="https://www.google.com/search?q=what+happened+to+you+oprah"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              &ldquo;What Happened to You?&rdquo;
            </a>{" "}
            by Oprah Winfrey and Dr. Bruce Perry. It taught me that the question isn&apos;t <em className="italic">“What&apos;s wrong with me?”</em>{" "}
            but <em className="italic">“What happened to me?”</em>
          </p>

          <p className="text-lg text-gray-300 leading-relaxed animate-fade-in delay-1600">
            I began to understand how trauma shaped my brain &mdash; and that healing was possible. It didn&apos;t matter that other people had
            &ldquo;worse&rdquo; trauma. What mattered was how my brain responded. I couldn&apos;t change what happened, but I{" "}
            <strong className="text-yellow-400">could</strong> change how I thought about it, how I treated myself, and what I did next.
          </p>

          <p className="text-lg text-gray-300 leading-relaxed animate-fade-in delay-1800">
            Then I read{" "}
            <a
              href="https://www.google.com/search?q=the+talent+code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              &ldquo;The Talent Code&rdquo;
            </a>
            , and my mind was blown again. It taught me that talent isn&apos;t born &mdash; it&apos;s <strong>built.</strong> Skill is built. Kindness
            is built. Recovery is built. Through repetition, our brain wires new pathways. These get wrapped in myelin, a substance that speeds up and
            strengthens signals in the brain. That means the more you repeat a thought or action &mdash; whether good or bad &mdash; the stronger it becomes.
          </p>

          <p className="text-2xl font-bold text-amber-400 italic text-center mt-8 animate-slide-up delay-2000">
            And here&apos;s the truth that changed everything for me:
            <br />
            You can rewire your mind. You can rebuild your life. One wrap at a time.
          </p>

          <p className="text-lg text-gray-300 leading-relaxed animate-fade-in delay-2200">
            I&apos;m 49 now. I&apos;m clean. I&apos;m sober. I&apos;m proud. I&apos;ll graduate with my first degree in December 2025. And, fingers crossed,
            I&apos;ll finally have my license back too.
          </p>

          <p className="text-lg text-gray-300 leading-relaxed animate-fade-in delay-2400">
            I still wake up and choose recovery every day. I practice self-love. I read, write affirmations, meditate, exercise, and keep learning.
            I&apos;m building this website to share the journey with you &mdash; not because I&apos;ve got it all figured out, but because I know what
            it&apos;s like to feel like you&apos;ll never change... and then <em className="text-yellow-400">change anyway.</em>
          </p>

          <div className="text-center mt-12 animate-fade-in delay-2600">
            <h2 className="text-3xl font-bold text-emerald-400">🧠 Welcome to Myelin Nation</h2>
            <p className="mt-2 text-gray-400">
              That&apos;s what I&apos;m calling this community. It&apos;s a pun on &ldquo;myelination&rdquo; &mdash; the process your brain uses to grow
              stronger with every rep. That&apos;s what we&apos;re doing here.
            </p>
          </div>

          <div className="text-center mt-8 animate-fade-in delay-2800">
            <h3 className="text-xl font-semibold text-white italic">
              We are not broken. We are mid-build.
              <br />
              We are not our past. We are our next rep.
            </h3>
          </div>

          <div className="text-center mt-8 animate-fade-in delay-3000">
            <p className="text-lg font-semibold text-gray-200">
              Even the worst addiction can be overcome with small, consistent actions in the right direction.
            </p>
          </div>

          <div className="text-center mt-8 animate-fade-in delay-3200">
            <p className="text-lg text-gray-300">So if you&apos;re reading this and still struggling, I want you to know:</p>
            <p className="text-xl font-bold text-yellow-400 mt-2">
              You&apos;re not alone.
              <br />
              You can rewire. You can heal. You can grow.
            </p>
            <p className="text-lg text-gray-300 mt-4">
              Start by forgiving yourself.
              <br />
              Start by telling yourself a new story.
              <br />
              Start by saying:
            </p>
            <p className="text-2xl font-extrabold text-emerald-400 italic mt-4">
              &ldquo;I&apos;m not my past. I&apos;m building something better.&rdquo;
            </p>
          </div>

          <p className="text-lg text-center text-gray-300 mt-12 animate-fade-in delay-3400">
            Thank you for your time, and for your heart. I hope to see you on the other side, friend.
          </p>
          <p className="text-lg text-center text-gray-300 animate-fade-in delay-3600">
            Let&apos;s beat our past &mdash; one wrap at a time.
          </p>
          <p className="text-2xl font-bold text-center text-yellow-400 animate-slide-up delay-3800">
            I believe in you.
          </p>

          <p className="text-sm text-center text-gray-400 mt-4">
            &mdash; Chad Adams Drummonds
            <br />
            Founder, Myelin Map &amp; Myelin Nation
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
