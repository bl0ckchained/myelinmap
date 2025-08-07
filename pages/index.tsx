import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TreeVisualizer from "@/components/TreeVisualizer";

// --- Accordion Types ---
interface AccordionContent {
  title: string;
  description: string;
}

interface AccordionProps {
  title: string;
  content: AccordionContent[];
  color: string;
}

const Accordion: React.FC<AccordionProps> = ({ title, content, color }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#1f2937",
        borderRadius: "1rem",
        marginBottom: "1.5rem",
        border: "1px solid #374151",
        boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1.5rem",
          textAlign: "left",
          fontWeight: "bold",
          background: "none",
          color: "#ffffff",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span style={{ color }}>{title}</span>
        <span
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          ▼
        </span>
      </button>
      <div
        style={{
          maxHeight: isOpen ? "320px" : "0",
          opacity: isOpen ? 1 : 0,
          overflow: "hidden",
          padding: isOpen ? "1rem 1.5rem" : "0",
          transition: "all 0.5s ease",
        }}
      >
        {content.map((item, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontWeight: "bold", color: "#ffffff" }}>{item.title}</h3>
            <p style={{ color: "#d1d5db", marginTop: "0.5rem" }}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
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
    { title: "Seeking and Accepting Help", description: "Open and honest communication with loved ones is vital; individuals should not be afraid to ask for their support..." },
    { title: "Developing a Personalized Recovery Plan", description: "Setting realistic, specific, and measurable goals is a cornerstone of recovery..." },
    { title: "Practicing Self-Care and Healthy Habits", description: "Prioritizing physical health is essential..." },
    { title: "Managing Triggers and Cravings", description: "Identifying and actively avoiding triggers—people, places, or situations that provoke substance use..." },
    { title: "Building a Strong Support System", description: "Leaning on close friends and family members provides invaluable support..." },
    { title: "Coping with Stress", description: "Developing healthy stress coping mechanisms is vital..." },
    { title: "Navigating Relapse", description: "It is important to understand that relapse can be a part of the recovery process..." },
  ];

  return (
    <>
      <Head>
        <title>Myelin Map – Rewire Your Brain, One Rep at a Time</title>
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

      <main
        style={{
          backgroundColor: "#111827",
          color: "#ffffff",
          minHeight: "100vh",
          paddingBottom: "4rem",
        }}
      >
        {/* 🌳 Tree Visualizer */}
        <TreeVisualizer />

        {/* 🧠 Hero Section */}
        <section
          style={{
            textAlign: "center",
            padding: "5rem 1rem",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "768px",
              margin: "0 auto",
              zIndex: 1,
            }}
          >
            <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}>
              Rewire Your Brain.
              <br />
              One Rep at a Time 🧠
            </h1>
            <p style={{ fontSize: "1.25rem", color: "#d1d5db" }}>
              Welcome to <strong>Myelin Map</strong> — a tool for transformation
              built on the neuroscience of action and repetition. This isn’t motivation.
              This is wiring.
            </p>
          </div>
        </section>

        {/* 💡 Mission Section */}
        <section
          style={{
            padding: "3rem 1.5rem",
            maxWidth: "768px",
            margin: "0 auto",
          }}
        >
          <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#34d399" }}>
            🌟 The Mission Behind Myelin Map
          </h2>
          <p style={{ fontSize: "1.125rem", color: "#d1d5db", marginTop: "1rem" }}>
            My name is Chad, and I created Myelin Map for anyone stuck in cycles they
            don’t want to repeat...
          </p>
          <p style={{ fontSize: "1.125rem", color: "#d1d5db" }}>
            I spent nearly 20 years caught in addiction and survival mode...
          </p>
          <p style={{ fontSize: "1.125rem", color: "#d1d5db" }}>
            Myelin is the insulation that wraps around your brain’s neural circuits...
          </p>
          <p style={{ fontSize: "1.125rem", color: "#d1d5db" }}>
            That’s what Myelin Map is: a visual habit-building platform...
          </p>
          <p style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#6ee7b7" }}>
            This is a new kind of recovery. One that starts with love, and builds with action.
          </p>
        </section>

        {/* ❤️ Accordions Section */}
        <section
          style={{
            padding: "3rem 1.5rem",
            maxWidth: "768px",
            margin: "0 auto",
          }}
        >
          <Accordion
            title="❤️ Actionable Self-Love & Compassion"
            content={selfLoveContent}
            color="#f472b6"
          />
          <Accordion
            title="🧭 Essential Advice for Overcoming Addiction"
            content={essentialAdviceContent}
            color="#fbbf24"
          />
        </section>
      </main>

      <Footer />
    </>
  );
}
// --- Footer Component ---