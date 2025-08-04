import Head from "next/head";
import Link from "next/link";
import React, { useState } from 'react';

// --- Embedded Header Component ---
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


// --- The Accordion Components (now embedded) ---
interface AccordionContent {
  title: string;
  description: string;
}

interface AccordionProps {
  title: string;
  content: AccordionContent[];
}

const SelfLoveAccordion: React.FC<AccordionProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-6 py-4 text-left font-bold text-white transition-colors duration-200 hover:bg-gray-700 rounded-xl"
      >
        <span>{title}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          ▼
        </span>
      </button>
      <div
        className={`overflow-y-auto transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[20rem] opacity-100 p-6' : 'max-h-0 opacity-0 p-0'
        }`}
      >
        <div className="space-y-4">
          {content.map((item, index) => (
            <div key={index}>
              <h3 className="font-semibold text-emerald-300">{item.title}</h3>
              <p className="text-gray-300 mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EssentialAdviceAccordion: React.FC<AccordionProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-6 py-4 text-left font-bold text-white transition-colors duration-200 hover:bg-gray-700 rounded-xl"
      >
        <span>{title}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          ▼
        </span>
      </button>
      <div
        className={`overflow-y-auto transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[20rem] opacity-100 p-6' : 'max-h-0 opacity-0 p-0'
        }`}
      >
        <div className="space-y-4">
          {content.map((item, index) => (
            <div key={index}>
              <h3 className="font-semibold text-emerald-300">{item.title}</h3>
              <p className="text-gray-300 mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Placeholder Components ---
interface MyelinButtonProps {
  href: string;
  color: string;
  size?: 'normal' | 'large';
  children: React.ReactNode;
}

const MyelinButton: React.FC<MyelinButtonProps> = ({ href, color, size = 'normal', children }) => {
  const sizeClasses = size === 'large' ? 'px-8 py-4 text-lg' : 'px-6 py-3';
  return (
    <Link href={href} legacyBehavior>
      <a
        className={`${color} text-black rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-md ${sizeClasses}`}
      >
        {children}
      </a>
    </Link>
  );
};

interface HomeSectionProps {
  title: string;
  children: React.ReactNode;
}

const HomeSection: React.FC<HomeSectionProps> = ({ title, children }) => {
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
  const selfLoveContent = [
    { title: "Forgive Yourself", description: "Acknowledge past behaviors as an outgrowth of illness, not a moral failing. Focus on staying well and moving forward without dwelling on past mistakes." },
    { title: "Develop Self-Compassion", description: "Practice treating oneself as a best friend—with gentler language and objective self-assessment. Challenge negative self-talk by asking how one would advise a loved one in the same situation." },
    { title: "Set Humble Goals", description: "Begin with achievable, narrow recovery goals (e.g., one day sober). Break larger goals into small, manageable action steps to build a sense of accomplishment and positive momentum." },
    { title: "Engage in Daily Reflection/Introspection", description: "Prioritize activities like meditating, taking walks, journaling, or writing daily gratitude lists. These practices focus thoughts, foster positive self-regard, process emotions, and help identify and replace negative self-talk." },
    { title: "Embrace Self-Care", description: "Prioritize physical health (healthy eating, regular exercise, adequate sleep) and mental well-being (engaging in enjoyable activities, relaxation). Self-care can include simple pleasures like sharing meals with friends or engaging in creative arts." },
    { title: "Be Mindful of Thoughts and Emotions", description: "Practice mindfulness to pay attention to the present moment without judgment, observing thoughts and feelings with kindness and understanding." },
    { title: "Focus on Strengths", description: "Consciously shift focus from past mistakes and shortcomings to current achievements and inherent strengths." },
    { title: "Practice Gratitude", description: "Regularly identify and appreciate the positive aspects of one's life, fostering a more positive mindset and self-compassionate outlook." },
    { title: "Connect with Others", description: "Actively combat isolation by connecting with supportive individuals through group therapy, discussions with a therapist or counselor, or spending time with friends and family." },
    { title: "Spend Time in Nature", description: "Engage with natural environments (e.g., walking in the woods, watching a sunset) to promote a sense of connection, calmness, and self-compassion during recovery." },
  ];

  const essentialAdviceContent = [
    { title: "Seeking and Accepting Help", description: "Open and honest communication with loved ones is vital; individuals should not be afraid to ask for their support. It is important to understand that overcoming addiction often requires support and the development of new coping skills; expecting to change without help is often unrealistic. Furthermore, it is advisable to avoid approaches involving lectures, threats, or emotional appeals, as these can exacerbate feelings of shame and lead to isolation." },
    { title: "Developing a Personalized Recovery Plan", description: "Setting realistic, specific, and measurable goals is a cornerstone of recovery. This includes establishing a start date for abstinence or setting limits on substance use. Identifying personal reasons for wanting to change and outlining concrete steps to take are also crucial elements of this plan. Reflecting on what worked and what did not work in past attempts can provide valuable insights for future strategies." },
    { title: "Practicing Self-Care and Healthy Habits", description: "Prioritizing physical health is essential. This involves maintaining a healthy diet rich in fruits, vegetables, and whole grains, while limiting processed and sugary foods and ensuring adequate hydration. Regular exercise, starting with low-intensity activities and setting realistic goals, is beneficial, with rest days incorporated for recovery. Sufficient sleep is also fundamental for both physical and mental well-being. Actively finding enjoyable activities, such as hobbies, sports, or volunteering, to replace addictive behaviors can create a fulfilling, substance-free life." },
    { title: "Managing Triggers and Cravings", description: "Identifying and actively avoiding triggers—people, places, or situations that provoke substance use—is a key strategy. Removing reminders of addiction from one's environment can also be highly effective. Keeping a detailed log of substance use patterns helps in identifying specific triggers. Learning and practicing various coping skills for cravings is paramount. Techniques include \"Urge Surfing,\" which involves mindfully observing the craving's sensations without acting on them. Mindfulness-based tools, such as deep breathing and progressive muscle relaxation, can also provide immediate relief. The SMART Recovery \"DENTS\" tool—Deny or Delay, Escape, Neutralize, Tasks, Swap—offers a structured approach to managing urges. \"Personify and Disarm\" encourages viewing urges as separate from oneself, making them more manageable. An \"Urge Log\" helps individuals identify when and why urges occur, allowing for pattern recognition and assessment of coping effectiveness." },
    { title: "Building a Strong Support System", description: "Leaning on close friends and family members provides invaluable support; relationship counseling may be beneficial if needed. Building a sober social network by connecting with new, supportive individuals is crucial. Regularly attending 12-step recovery support groups (AA, NA) or SMART Recovery meetings allows individuals to benefit from shared experiences and a sense of community." },
    { title: "Coping with Stress", description: "Developing healthy stress coping mechanisms is vital. This includes engaging in physical movement (e.g., brisk walks, yoga), practicing meditation, spending time in nature, or interacting with pets. Defining personal values and exploring new pursuits and passions can also help bring pleasure and meaning back into one's life." },
    { title: "Navigating Relapse", description: "It is important to understand that relapse can be a part of the recovery process, and it should not be a reason to abandon efforts. Continuously monitoring substance use and learning from any lapses is essential for long-term recovery." },
  ];

  return (
    <>
      <Head>
        <title>Myelin Map &ndash; Rewire Your Brain, One Habit at a Time</title>
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
              Welcome to <strong>Myelin Map</strong> &mdash; a tool for transformation
              built on the neuroscience of action and repetition. This isn&apos;t
              motivation. This is wiring.
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

        {/* New Accordion Section */}
        <section className="py-16 px-6 md:px-20 max-w-4xl mx-auto space-y-6">
          <SelfLoveAccordion title="Actionable Self-Love & Self-Compassion Practices" content={selfLoveContent} />
          <EssentialAdviceAccordion title="Essential Practical Advice for Overcoming Addiction" content={essentialAdviceContent} />
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
            Myelin is the brain&apos;s insulation. It speeds up signals, strengthens
            connections, and makes habits automatic.
            <br />
            Every time you take action, you build myelin. Every rep counts. This
            is how you change your life.
          </p>
        </HomeSection>

        <HomeSection title="📜 The Myelin Truth">
          <p className="text-lg text-gray-300">
            <strong>Myelin doesn&apos;t care about your intentions.</strong> It
            doesn&apos;t respond to promises, motivation, or positive thinking. It
            only cares about what you do &mdash; and how often you do it.
          </p>
          <p className="text-lg text-gray-300">
            Every time you take focused action, a neural circuit fires. When it
            fires, myelin wraps it &mdash; strengthening, speeding, locking it in.
            This is how skills form. This is how change happens. This is how you
            become unstoppable.
          </p>
        </HomeSection>

        <HomeSection title="⚡ My Story">
          <p className="text-lg text-gray-300">
            I&apos;m <strong>Chad Drummonds</strong> &mdash; a father, husband, and
            computer science student who lost everything to addiction... and
            clawed my way back.
          </p>
          <p className="text-lg text-gray-300">
            After nearly 20 years stuck in cycles I couldn&apos;t break, I found the
            truth in neuroscience: The brain can change. But only through
            action.
          </p>
          <p className="text-lg text-gray-300">
            I built Myelin Map to help people like me &mdash; people who are sick of
            failing silently &mdash; finally <em>see</em> their growth. Not with empty
            checkmarks, but with real, visual feedback grounded in how the brain
            works.
          </p>
        </HomeSection>

        <HomeSection title="💡 What You&apos;ll Find Here">
          <ul className="list-disc list-inside text-gray-300 text-lg space-y-2">
            <li>Neuroscience-backed habit reinforcement</li>
            <li>Visual progress that looks like the brain it rewires</li>
            <li>Tools built with purpose &mdash; and pain &mdash; behind them</li>
            <li>Challenges, loops, counters, affirmations&hellip; all aimed at change</li>
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
