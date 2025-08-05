import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import React, { useState } from "react";

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
        <section className="relative overflow-hidden pt-20 pb-40 text-center flex flex-col items-center justify-center min-h-[80vh] px-6">
          <div className="absolute inset-0 bg-black opacity-40"></div>
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
              <Link href="/rewire"><a className="bg-amber-500 text-black rounded-lg font-semibold px-6 py-3 hover:-translate-y-1 hover:scale-105 transition-all">🔥 7-Day Challenge</a></Link>
              <Link href="/visualizer"><a className="bg-cyan-600 text-black rounded-lg font-semibold px-6 py-3 hover:-translate-y-1 hover:scale-105 transition-all">🧬 Visualize & Grow</a></Link>
              <Link href="/resources"><a className="bg-lime-500 text-black rounded-lg font-semibold px-6 py-3 hover:-translate-y-1 hover:scale-105 transition-all">📚 Resources</a></Link>
              <Link href="/founder"><a className="bg-yellow-400 text-black rounded-lg font-semibold px-6 py-3 hover:-translate-y-1 hover:scale-105 transition-all">💬 Message from the Founder</a></Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 md:px-20 max-w-4xl mx-auto space-y-6">
          {/* Accordions can be modularized later if needed */}
        </section>
      </main>

      <Footer />
    </>
  );
}
