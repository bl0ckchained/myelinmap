import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

/* ---------------- Navigation ---------------- */

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
        background:
          "linear-gradient(180deg, rgba(7,10,15,.85), rgba(7,10,15,.6)), radial-gradient(1000px 400px at 10% -10%, rgba(0,255,170,.12), transparent 60%)",
        color: "#eaf2ff",
        textAlign: "center",
        padding: "3rem 1rem",
        borderBottom: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: 800,
          margin: 0,
          background: "linear-gradient(90deg, #00ffaa, #8bd3ff, #d9a7ff)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          textShadow: "0 6px 30px rgba(0,255,170,.08)",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: "1.125rem",
            marginTop: "0.6rem",
            maxWidth: "44rem",
            marginInline: "auto",
            color: "#b7c5d6",
          }}
        >
          {subtitle}
        </p>
      )}

      <nav
        style={{
          marginTop: "2rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.75rem",
          fontSize: ".9rem",
        }}
      >
        {navLinks.map(({ href, label, hoverColor }) => (
          <Link
            key={href}
            href={href}
            style={{
              padding: "0.55rem 1rem",
              borderRadius: "9999px",
              color: "#ffffff",
              backgroundColor: "#1f2937",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,.08)",
              boxShadow: "0 10px 30px rgba(0,0,0,.25)",
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              const colorMap: { [k: string]: string } = {
                "hover:bg-emerald-500": "#10b981",
                "hover:bg-amber-400": "#fbbf24",
                "hover:bg-lime-400": "#a3e635",
                "hover:bg-cyan-500": "#06b6d4",
                "hover:bg-pink-400": "#f472b6",
                "hover:bg-rose-400": "#fb7185",
                "hover:bg-blue-400": "#60a5fa",
              };
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = colorMap[hoverColor] || "#10b981";
              el.style.color = "#000";
              el.style.transform = "translateY(-3px) scale(1.03)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = "#1f2937";
              el.style.color = "#fff";
              el.style.transform = "translateY(0) scale(1)";
            }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

/* ---------------- Footer ---------------- */

const Footer = () => {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "2rem",
        background: "linear-gradient(180deg, rgba(7,10,15,.4), rgba(7,10,15,.75))",
        color: "#b7c5d6",
        fontSize: "0.95rem",
        borderTop: "1px solid rgba(255,255,255,.08)",
        marginTop: "4rem",
      }}
    >
      <div style={{ marginBottom: "1.2rem" }}>
        <p style={{ color: "#9ca3af", marginTop: ".4rem" }}>
          Special thanks to Matt Stewart — your belief helped light this path.
        </p>
        <p style={{ color: "#eaf2ff" }}>🧠 Designed to wire greatness into your day 🧠</p>
      </div>

      <div style={{ marginBottom: "1.2rem", color: "#eaf2ff" }}>
        <p>
          &copy; {new Date().getFullYear()} MyelinMap.com — Made with 💙 in Michigan · Powered by
          Quantum Step Consultants LLC
        </p>
        <p>
          <Link href="/legalpage" style={{ textDecoration: "underline", color: "#8bd3ff" }}>
            Privacy Policy &amp; Terms
          </Link>
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: ".6rem",
          flexWrap: "wrap",
        }}
      >
        <span>Join our journey</span>
        <a
          href="https://www.youtube.com/@myelinmap"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube Channel"
          style={{
            transition: "opacity 0.3s",
            color: "#ef4444",
            display: "inline-flex",
            alignItems: "center",
            gap: ".35rem",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19.615 3.184c-1.007-.372-5.615-.372-5.615-.372s-4.608 0-5.615.372a3.21 3.21 0 0 0-2.262 2.262c-.373 1.007-.373 3.108-.373 3.108s0 2.101.373 3.108a3.21 3.21 0 0 0 2.262 2.262c1.007.372 5.615.372 5.615.372s4.608 0 5.615-.372a3.21 3.21 0 0 0 2.262-2.262c.373-1.007.373-3.108.373-3.108s0-2.101-.373-3.108a3.21 3.21 0 0 0-2.262-2.262zm-10.615 8.816v-5l5 2.5-5 2.5z" />
          </svg>
          <span>YouTube</span>
        </a>
      </div>
    </footer>
  );
};

/* ---------------- Accordion (Tailwind-free) ---------------- */

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
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (innerRef.current) setHeight(innerRef.current.scrollHeight);
    };
    measure();
    if (isOpen) {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
  }, [isOpen, content]);

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,.01)), #0c121a",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 16,
        boxShadow:
          "0 10px 30px rgba(0,0,0,.35), 0 0 30px rgba(0,255,170,.12), 0 0 60px rgba(139,211,255,.08)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          background: "transparent",
          color: "#eaf2ff",
          fontWeight: 800,
          fontSize: "1.05rem",
          cursor: "pointer",
          border: "none",
        }}
      >
        <span>{title}</span>
        <span
          aria-hidden
          style={{
            display: "inline-block",
            transition: "transform .25s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            color: "#8bd3ff",
          }}
        >
          ▼
        </span>
      </button>

      <div
        style={{
          overflow: "hidden",
          maxHeight: isOpen ? height : 0,
          opacity: isOpen ? 1 : 0,
          transition: "max-height .45s ease, opacity .35s ease, padding .3s ease",
          padding: isOpen ? "0 20px 16px 20px" : "0 20px",
        }}
      >
        <div ref={innerRef} style={{ paddingTop: 6 }}>
          {content.map((item, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <h3 style={{ margin: 0, color: "#56ffa3", fontWeight: 700 }}>{item.title}</h3>
              <p style={{ margin: "6px 0 0", color: "#b7c5d6", lineHeight: 1.7 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------------- Resource Link ---------------- */

const ResourceLink = ({
  href,
  title,
  description,
  color,
}: {
  href: string;
  title: string;
  description: string;
  color: string; // expects tailwind-like keys; we map to hex
}) => {
  const colorMap: Record<string, string> = {
    "emerald-300": "#6ee7b7",
    "emerald-400": "#34d399",
    "blue-400": "#60a5fa",
    "cyan-400": "#22d3ee",
    "purple-400": "#c084fc",
  };
  const accent = colorMap[color] || "#8bd3ff";

  return (
    <li style={{ listStyle: "none" }}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          padding: "12px 14px",
          borderRadius: 12,
          textDecoration: "none",
          background:
            "linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,.01)), #0c121a",
          border: "1px solid rgba(255,255,255,.08)",
          boxShadow: "0 10px 20px rgba(0,0,0,.35)",
          transition: "transform .15s ease, border-color .2s ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.transform = "translateX(6px)";
          el.style.borderColor = "rgba(139,211,255,.35)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.transform = "translateX(0)";
          el.style.borderColor = "rgba(255,255,255,.08)";
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontWeight: 700,
            fontSize: "1.05rem",
            color: accent,
          }}
        >
          {title}
        </span>
        <p style={{ margin: "6px 0 0", color: "#9fb0c4", fontSize: ".95rem" }}>
          {description}
        </p>
      </a>
    </li>
  );
};

/* ---------------- Main Page ---------------- */

export default function Resources() {
  const selfLoveContent = [
    {
      title: "Forgive Yourself",
      description:
        "Acknowledge past behaviors as an outgrowth of illness, not a moral failing. Focus on staying well and moving forward without dwelling on past mistakes.",
    },
    {
      title: "Develop Self-Compassion",
      description:
        "Practice treating oneself as a best friend—with gentler language and objective self-assessment. Challenge negative self-talk by asking how one would advise a loved one in the same situation.",
    },
    {
      title: "Set Humble Goals",
      description:
        "Begin with achievable, narrow recovery goals (e.g., one day sober). Break larger goals into small, manageable action steps to build a sense of accomplishment and positive momentum.",
    },
    {
      title: "Engage in Daily Reflection/Introspection",
      description:
        "Prioritize activities like meditating, taking walks, journaling, or writing daily gratitude lists. These practices focus thoughts, foster positive self-regard, process emotions, and help identify and replace negative self-talk.",
    },
    {
      title: "Embrace Self-Care",
      description:
        "Prioritize physical health (healthy eating, regular exercise, adequate sleep) and mental well-being (engaging in enjoyable activities, relaxation). Self-care can include simple pleasures like sharing meals with friends or engaging in creative arts.",
    },
    {
      title: "Be Mindful of Thoughts and Emotions",
      description:
        "Practice mindfulness to pay attention to the present moment without judgment, observing thoughts and feelings with kindness and understanding.",
    },
    {
      title: "Focus on Strengths",
      description:
        "Consciously shift focus from past mistakes and shortcomings to current achievements and inherent strengths.",
    },
    {
      title: "Practice Gratitude",
      description:
        "Regularly identify and appreciate the positive aspects of one's life, fostering a more positive mindset and self-compassionate outlook.",
    },
    {
      title: "Connect with Others",
      description:
        "Actively combat isolation by connecting with supportive individuals through group therapy, discussions with a therapist or counselor, or spending time with friends and family.",
    },
    {
      title: "Spend Time in Nature",
      description:
        "Engage with natural environments (e.g., walking in the woods, watching a sunset) to promote a sense of connection, calmness, and self-compassion during recovery.",
    },
  ];

  const essentialAdviceContent = [
    {
      title: "Seeking and Accepting Help",
      description:
        "Open and honest communication with loved ones is vital; individuals should not be afraid to ask for their support. It is important to understand that overcoming addiction often requires support and the development of new coping skills; expecting to change without help is often unrealistic. Furthermore, it is advisable to avoid approaches involving lectures, threats, or emotional appeals, as these can exacerbate feelings of shame and lead to isolation.",
    },
    {
      title: "Developing a Personalized Recovery Plan",
      description:
        "Setting realistic, specific, and measurable goals is a cornerstone of recovery. This includes establishing a start date for abstinence or setting limits on substance use. Identifying personal reasons for wanting to change and outlining concrete steps to take are also crucial elements of this plan. Reflecting on what worked and what did not work in past attempts can provide valuable insights for future strategies.",
    },
    {
      title: "Practicing Self-Care and Healthy Habits",
      description:
        "Prioritizing physical health is essential. This involves maintaining a healthy diet rich in fruits, vegetables, and whole grains, while limiting processed and sugary foods and ensuring adequate hydration. Regular exercise, starting with low-intensity activities and setting realistic goals, is beneficial, with rest days incorporated for recovery. Sufficient sleep is also fundamental for both physical and mental well-being. Actively finding enjoyable activities, such as hobbies, sports, or volunteering, to replace addictive behaviors can create a fulfilling, substance-free life.",
    },
    {
      title: "Managing Triggers and Cravings",
      description:
        'Identifying and actively avoiding triggers—people, places, or situations that provoke substance use—is a key strategy. Removing reminders of addiction from one\'s environment can also be highly effective. Keeping a detailed log of substance use patterns helps in identifying specific triggers. Learning and practicing various coping skills for cravings is paramount. Techniques include "Urge Surfing," which involves mindfully observing the craving\'s sensations without acting on them. Mindfulness-based tools, such as deep breathing and progressive muscle relaxation, can also provide immediate relief. The SMART Recovery "DENTS" tool—Deny or Delay, Escape, Neutralize, Tasks, Swap—offers a structured approach to managing urges. "Personify and Disarm" encourages viewing urges as separate from oneself, making them more manageable. An "Urge Log" helps individuals identify when and why urges occur, allowing for pattern recognition and assessment of coping effectiveness.',
    },
    {
      title: "Building a Strong Support System",
      description:
        "Leaning on close friends and family members provides invaluable support; relationship counseling may be beneficial if needed. Building a sober social network by connecting with new, supportive individuals is crucial. Regularly attending 12-step recovery support groups (AA, NA) or SMART Recovery meetings allows individuals to benefit from shared experiences and a sense of community.",
    },
    {
      title: "Coping with Stress",
      description:
        "Developing healthy stress coping mechanisms is vital. This includes engaging in physical movement (e.g., brisk walks, yoga), practicing meditation, spending time in nature, or interacting with pets. Defining personal values and exploring new pursuits and passions can also help bring pleasure and meaning back into one's life.",
    },
    {
      title: "Navigating Relapse",
      description:
        "It is important to understand that relapse can be a part of the recovery process, and it should not be a reason to abandon efforts. Continuously monitoring substance use and learning from any lapses is essential for long-term recovery.",
    },
  ];

  const recoveryLinks = [
    { href: "https://www.samhsa.gov/find-help/national-helpline", title: "SAMHSA National Helpline", description: "Free, 24/7 treatment referral and information service." },
    { href: "https://988lifeline.org/", title: "988 Suicide & Crisis Lifeline", description: "Free and confidential support for people in distress." },
    { href: "https://www.aa.org/", title: "Alcoholics Anonymous", description: "Find meetings and support tools for alcohol addiction." },
    { href: "https://www.na.org/", title: "Narcotics Anonymous", description: "A non-profit fellowship for those recovering from drug addiction." },
    { href: "https://www.nami.org/Home", title: "National Alliance on Mental Illness (NAMI)", description: "A leading mental health advocacy organization." },
    { href: "https://smartrecovery.org/", title: "SMART Recovery", description: "A self-empowering addiction recovery support group." },
  ];

  const scienceLinks = [
    { href: "https://www.brainfacts.org/", title: "BrainFacts.org", description: "Explore how the brain works, builds skills, and heals itself." },
    { href: "https://charlesduhigg.com/the-power-of-habit/", title: "The Power of Habit", description: "Book and resources on how habits are formed and how to change them." },
    { href: "https://danielcoyle.com/the-talent-code/", title: "The Talent Code", description: "Daniel Coyle reveals how deep practice and myelin growth unlock skill mastery." },
    { href: "https://www.amazon.com/dp/1250223180", title: "What Happened to You?", description: "Oprah and Dr. Perry's groundbreaking book on understanding trauma and healing." },
  ];

  const educationLinks = [
    { href: "https://www.baycollege.edu/", title: "Bay de Noc Community College", description: "The place where my journey began to change. A beacon of hope, growth, and transformation." },
    { href: "https://www.khanacademy.org/", title: "Khan Academy", description: "Free, world-class education in math, science, and more." },
    { href: "https://www.coursera.org/", title: "Coursera", description: "Online courses from top universities and companies." },
    { href: "https://www.edx.org/", title: "edX", description: "High-quality online courses and programs from universities worldwide." },
  ];

  const supportLinks = [
    { href: "https://brenebrown.com", title: "Brené Brown", description: "Resources and research on shame, vulnerability, and courage." },
    { href: "https://insighttimer.com", title: "Insight Timer", description: "A free meditation app with thousands of guided meditations and talks." },
    { href: "https://www.mindful.org/", title: "Mindful.org", description: "Practical, helpful, and inspiring articles on mindfulness and well-being." },
  ];

  return (
    <>
      <Head>
        <title>Resources — Myelin Map</title>
        <meta
          name="description"
          content="A curated collection of support tools and resources for your growth journey."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header
        title="Support for the Whole Journey 💡"
        subtitle="Whether you&apos;re rewiring your brain, battling addiction, or building discipline, you&apos;re not alone."
      />

      <main
        style={{
          maxWidth: "64rem",
          margin: "0 auto",
          padding: "3rem 1.25rem",
          color: "#eaf2ff",
        }}
      >
        <section style={{ display: "grid", gap: 24 }}>
          <h1
            style={{
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: "0.5rem",
            }}
          >
            🧠 Just Some Great Advice
          </h1>

          <Accordion
            title="Actionable Self-Love & Self-Compassion Practices"
            content={selfLoveContent}
          />
          <Accordion
            title="Essential Practical Advice for Overcoming Addiction"
            content={essentialAdviceContent}
          />

          {/* Science & Brain Rewiring */}
          <div>
            <h2
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                margin: "1.2rem 0 .6rem",
                color: "#56ffa3",
              }}
            >
              🔬 Science & Brain Rewiring
            </h2>
            <ul style={{ display: "grid", gap: 12, padding: 0, margin: 0 }}>
              {scienceLinks.map((link, i) => (
                <ResourceLink
                  key={i}
                  href={link.href}
                  title={link.title}
                  description={link.description}
                  color="emerald-300"
                />
              ))}
            </ul>
          </div>

          {/* Addiction Recovery & Mental Health */}
          <div>
            <h2
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                margin: "1.2rem 0 .6rem",
                color: "#8bd3ff",
              }}
            >
              🧘‍♂️ Addiction Recovery & Mental Health
            </h2>
            <ul style={{ display: "grid", gap: 12, padding: 0, margin: 0 }}>
              {recoveryLinks.map((link, i) => (
                <ResourceLink
                  key={i}
                  href={link.href}
                  title={link.title}
                  description={link.description}
                  color="blue-400"
                />
              ))}
            </ul>
          </div>

          {/* Student & Self-Education Tools */}
          <div>
            <h2
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                margin: "1.2rem 0 .6rem",
                color: "#22d3ee",
              }}
            >
              📚 Student & Self-Education Tools
            </h2>
            <ul style={{ display: "grid", gap: 12, padding: 0, margin: 0 }}>
              {educationLinks.map((link, i) => (
                <ResourceLink
                  key={i}
                  href={link.href}
                  title={link.title}
                  description={link.description}
                  color="blue-400"
                />
              ))}
            </ul>
          </div>

          {/* Spiritual & Emotional Support */}
          <div>
            <h2
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                margin: "1.2rem 0 .6rem",
                color: "#d9a7ff",
              }}
            >
              🙏 Spiritual & Emotional Support
            </h2>
            <ul style={{ display: "grid", gap: 12, padding: 0, margin: 0 }}>
              {supportLinks.map((link, i) => (
                <ResourceLink
                  key={i}
                  href={link.href}
                  title={link.title}
                  description={link.description}
                  color="blue-400"
                />
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <p style={{ color: "#9fb0c4", fontSize: "1.05rem" }}>
              Know a great resource?{" "}
              <a
                href="mailto:chaddrummonds1976@gmail.com"
                style={{ color: "#8bd3ff", textDecoration: "underline" }}
              >
                Suggest it here
              </a>{" "}
              💌
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
// --- IGNORE ---
// This file defines the Resources page for Myelin Map.
// It includes a header, footer, accordions for advice, and resource links.
// The design avoids Tailwind CSS, using inline styles for a custom look. 