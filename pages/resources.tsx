import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";

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
    <header
      style={{
        backgroundColor: "#111827", // gray-900
        color: "#ffffff",
        textAlign: "center",
        padding: "3rem 1rem",
      }}
    >
      {/* Title and Subtitle */}
      <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", margin: 0 }}>
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: "1.125rem",
            marginTop: "0.5rem",
            maxWidth: "40rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Navigation */}
      <nav
        style={{
          marginTop: "2rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.75rem",
          fontSize: "0.875rem",
        }}
      >
        {navLinks.map(({ href, label, hoverColor }) => (
          <Link key={href} href={href} legacyBehavior>
            <a
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                color: "#ffffff",
                backgroundColor: "#1f2937", // gray-800
                textDecoration: "none",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => {
                const colorMap: { [key: string]: string } = {
                  "hover:bg-emerald-500": "#10b981",
                  "hover:bg-amber-400": "#fbbf24",
                  "hover:bg-lime-400": "#a3e635",
                  "hover:bg-cyan-500": "#06b6d4",
                  "hover:bg-pink-400": "#f472b6",
                  "hover:bg-rose-400": "#fb7185",
                  "hover:bg-blue-400": "#60a5fa",
                };
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  colorMap[hoverColor] || "#10b981";
                (e.currentTarget as HTMLAnchorElement).style.color = "#000000";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(-4px) scale(1.05)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "#1f2937";
                (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(0) scale(1)";
              }}
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
    <footer
      style={{
        textAlign: "center",
        padding: "2rem",
        backgroundColor: "#111827",
        color: "#fff",
        fontSize: "0.875rem",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ color: "#9ca3af", marginTop: "0.5rem" }}>Special thanks to Matt Stewart — your belief helped light this path.</p>
        <p>🧠 Designed to wire greatness into your day 🧠</p>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <p>&copy; {new Date().getFullYear()} MyelinMap.com — Made with 💙 in Michigan · Powered by Quantum Step Consultants LLC</p>
        <p>
          <Link href="/legalpage" legacyBehavior>
            <a style={{ textDecoration: "underline", color: "#bfdbfe" }}>Privacy Policy & Terms</a>
          </Link>
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <span style={{ color: "#9ca3af" }}>Join our journey</span>
        <a
          href="https://www.youtube.com/@myelinmap"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube Channel"
          style={{ transition: "opacity 0.3s", color: "#ef4444", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.615 3.184c-1.007-.372-5.615-.372-5.615-.372s-4.608 0-5.615.372a3.21 3.21 0 0 0-2.262 2.262c-.373 1.007-.373 3.108-.373 3.108s0 2.101.373 3.108a3.21 3.21 0 0 0 2.262 2.262c1.007.372 5.615.372 5.615.372s4.608 0 5.615-.372a3.21 3.21 0 0 0 2.262-2.262c.373-1.007.373-3.108.373-3.108s0-2.101-.373-3.108a3.21 3.21 0 0 0-2.262-2.262zm-10.615 8.816v-5l5 2.5-5 2.5z" />
          </svg>
          <span>YouTube</span>
        </a>
      </div>
    </footer>
  );
};

// --- Helper Component for Accordion Menus ---
interface AccordionContent {
  title: string;
  description: string;
}
interface AccordionProps {
  title: string;
  content: AccordionContent[];
}
const Accordion: React.FC<AccordionProps> = ({ title, content }) => {
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

// --- Helper Component for Resource Links ---
const ResourceLink = ({
  href,
  title,
  description,
  color,
}: {
  href: string;
  title: string;
  description: string;
  color: string;
}) => (
  <li>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-lg block transition-transform duration-200 transform hover:translate-x-2"
    >
      {/* Note: if Tailwind purge removes dynamic colors, we can safelist or map fixed classes */}
      <span className={`text-${color} font-semibold hover:underline`}>{title}</span>
      <p className="text-gray-400 text-sm mt-1">{description}</p>
    </a>
  </li>
);

// --- Main Resources Component ---
export default function Resources() {
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

  const recoveryLinks = [
    { href: "https://www.samhsa.gov/find-help/national-helpline", title: "SAMHSA National Helpline", description: "Free, 24/7 treatment referral and information service." },
    { href: "https://988lifeline.org/", title: "988 Suicide & Crisis Lifeline", description: "Free and confidential support for people in distress." },
    { href: "https://www.aa.org/", title: "Alcoholics Anonymous", description: "Find meetings and support tools for alcohol addiction." },
    { href: "https://www.na.org/", title: "Narcotics Anonymous", description: "A non-profit fellowship for those recovering from drug addiction." },
    { href: "https://www.nami.org/Home", title: "National Alliance on Mental Illness (NAMI)", description: "A leading mental health advocacy organization." },
    { href: "https://smartrecovery.org/", title: "SMART Recovery", description: "A self-empowering addiction recovery support group." }
  ];

  const scienceLinks = [
    { href: "https://www.brainfacts.org/", title: "BrainFacts.org", description: "Explore how the brain works, builds skills, and heals itself." },
    { href: "https://charlesduhigg.com/the-power-of-habit/", title: "The Power of Habit", description: "Book and resources on how habits are formed and how to change them." },
    { href: "https://danielcoyle.com/the-talent-code/", title: "The Talent Code", description: "Daniel Coyle reveals how deep practice and myelin growth unlock skill mastery." },
    { href: "https://www.amazon.com/dp/1250223180", title: "What Happened to You?", description: "Oprah and Dr. Perry's groundbreaking book on understanding trauma and healing." }
  ];

  const educationLinks = [
    { href: "https://www.baycollege.edu/", title: "Bay de Noc Community College", description: "The place where my journey began to change. A beacon of hope, growth, and transformation." },
    { href: "https://www.khanacademy.org/", title: "Khan Academy", description: "Free, world-class education in math, science, and more." },
    { href: "https://www.coursera.org/", title: "Coursera", description: "Online courses from top universities and companies." },
    { href: "https://www.edx.org/", title: "edX", description: "High-quality online courses and programs from universities worldwide." }
  ];

  const supportLinks = [
    { href: "https://brenebrown.com", title: "Brené Brown", description: "Resources and research on shame, vulnerability, and courage." },
    { href: "https://insighttimer.com", title: "Insight Timer", description: "A free meditation app with thousands of guided meditations and talks." },
    { href: "https://www.mindful.org/", title: "Mindful.org", description: "Practical, helpful, and inspiring articles on mindfulness and well-being." }
  ];

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

          <h1 className="text-4xl font-bold mb-6 text-center text-white">
            <span role="img" aria-label="brain emoji">🧠</span> Just Some Great Advice
          </h1>

          <Accordion title="Actionable Self-Love & Self-Compassion Practices" content={selfLoveContent} />
          <Accordion title="Essential Practical Advice for Overcoming Addiction" content={essentialAdviceContent} />

          {/* Science & Brain Rewiring Section (uses scienceLinks) */}
          <div>
            <h2 className="text-3xl font-bold text-emerald-300 mb-6">
              <span role="img" aria-label="microscope emoji">🔬</span> Science & Brain Rewiring
            </h2>
            <ul className="list-none space-y-6">
              {scienceLinks.map((link, index) => (
                <ResourceLink
                  key={index}
                  href={link.href}
                  title={link.title}
                  description={link.description}
                  color="emerald-300"
                />
              ))}
            </ul>
          </div>

          {/* Addiction Recovery & Mental Health Section */}
          <div>
            <h2 className="text-3xl font-bold text-emerald-400 mb-6">
              <span role="img" aria-label="meditating person emoji">🧘‍♂️</span> Addiction Recovery & Mental Health
            </h2>
            <ul className="list-none space-y-6">
              {recoveryLinks.map((link, index) => (
                <ResourceLink key={index} href={link.href} title={link.title} description={link.description} color="blue-400" />
              ))}
            </ul>
          </div>

          {/* Student & Self-Education Tools Section */}
          <div>
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">
              <span role="img" aria-label="books emoji">📚</span> Student & Self-Education Tools
            </h2>
            <ul className="list-none space-y-6">
              {educationLinks.map((link, index) => (
                <ResourceLink key={index} href={link.href} title={link.title} description={link.description} color="blue-400" />
              ))}
            </ul>
          </div>

          {/* Spiritual & Emotional Support Section */}
          <div>
            <h2 className="text-3xl font-bold text-purple-400 mb-6">
              <span role="img" aria-label="praying hands emoji">🙏</span> Spiritual & Emotional Support
            </h2>
            <ul className="list-none space-y-6">
              {supportLinks.map((link, index) => (
                <ResourceLink key={index} href={link.href} title={link.title} description={link.description} color="blue-400" />
              ))}
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
// End of Resources Page Component
// --- IGNORE ---
// This is a Next.js page component that serves as the resources page for Myelin Map.
// It includes a header, main content with various resource sections, and a footer.