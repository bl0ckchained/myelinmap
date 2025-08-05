"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import OpenAI from "openai";

// --- OpenAI Client Initialization ---
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true,
});

// --- Header Component ---
const navLinks = [
  { href: "/", label: "🏠 Home", hoverColor: "hover:bg-emerald-500" },
  { href: "/rewire", label: "🔥 7-Day Challenge", hoverColor: "hover:bg-amber-400" },
  { href: "/about", label: "👤 About Us", hoverColor: "hover:bg-lime-400" },
  { href: "/visualizer", label: "🧬 Visualizer", hoverColor: "hover:bg-cyan-500" },
  { href: "/coach", label: "🧠 Coach", hoverColor: "hover:bg-pink-400" },
  { href: "/community", label: "🤝 Myelin Nation", hoverColor: "hover:bg-rose-400" },
  { href: "/dashboard", label: "📈 Dashboard", hoverColor: "hover:bg-blue-400" },
];

const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <header className="bg-gray-900 text-white text-center py-12 px-4">
    <h1 className="text-4xl font-bold">{title}</h1>
    {subtitle && <p className="text-lg mt-2 max-w-xl mx-auto">{subtitle}</p>}
    <nav className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
      {navLinks.map(({ href, label, hoverColor }) => (
        <Link key={href} href={href}>
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

// --- Footer Component ---
const Footer = () => (
  <footer className="text-center p-8 bg-gray-900 text-white text-sm">
    <div className="space-y-2 mb-4">
      <p className="text-gray-400">Special thanks to Matt Stewart — your belief helped light this path.</p>
      <p>🧠 Designed to wire greatness into your day 🧠</p>
    </div>
    <div className="space-y-2 mb-4">
      <p>
        &copy; 2025 MyelinMap.com – Made with 💙 in Michigan · Powered by Quantum Step Consultants LLC
      </p>
      <p>
        <Link href="/legalpage">
          <a className="underline hover:text-blue-300">Privacy Policy & Terms</a>
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
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
          <path d="M19.615 3.184c-1.007-.372-5.615-.372-5.615-.372s-4.608 0-5.615.372a3.21 3.21 0 0 0-2.262 2.262c-.373 1.007-.373 3.108-.373 3.108s0 2.101.373 3.108a3.21 3.21 0 0 0 2.262 2.262c1.007.372 5.615.372 5.615.372s4.608 0 5.615-.372a3.21 3.21 0 0 0 2.262-2.262c.373-1.007.373-3.108.373-3.108s0-2.101-.373-3.108a3.21 3.21 0 0 0-2.262-2.262zm-10.615 8.816v-5l5 2.5-5 2.5z" />
        </svg>
      </a>
    </div>
  </footer>
);

// --- FloatingCoach Component ---
export default function FloatingCoach() {
  const [open, setOpen] = useState(false);
  const [chatLog, setChatLog] = useState([
    { role: "assistant", content: "✨ Welcome, brave soul. I'm here to walk beside you. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newLog = [...chatLog, { role: "user", content: input }];
    setChatLog(newLog);
    setInput("");
    setLoading(true);

    try {
      const messages = [
        {
          role: "system",
          content:
            "You are a gentle, compassionate AI coach. You help people recovering from trauma and addiction. Your words should be kind, hopeful, supportive, and never judgmental.",
        },
        ...newLog.map((msg) => ({ role: msg.role as "user" | "assistant" | "system", content: msg.content })),
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // <- Correct model
        messages,
      });

      const reply = response.choices[0].message.content;
      setChatLog([...newLog, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Error from OpenAI:", err);
      setChatLog([
        ...newLog,
        {
          role: "assistant",
          content:
            "⚡️ Hmm... Something interrupted our signal, but I’m still here. Let’s try again in a moment, okay?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="bg-emerald-600 text-white rounded-full p-4 shadow-xl hover:bg-emerald-700 transition transform hover:scale-110"
        aria-label="Toggle AI Coach"
      >
        <span className="text-2xl">🧘</span>
      </button>

      {open && (
        <div className="w-80 h-[440px] mt-2 bg-white text-gray-800 rounded-xl shadow-2xl p-4 border border-gray-200 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-3 pr-2">
            {chatLog.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-xl text-sm break-words shadow-sm ${
                    msg.role === "user"
                      ? "bg-emerald-500 text-white rounded-tr-none"
                      : "bg-gray-200 text-gray-800 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[75%] px-4 py-2 rounded-xl text-sm bg-gray-200 text-gray-800 rounded-tl-none">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-2 w-2 bg-gray-400 rounded-full" />
                    <div className="h-2 w-2 bg-gray-400 rounded-full" />
                    <div className="h-2 w-2 bg-gray-400 rounded-full" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="flex gap-2 mt-auto">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Your thoughts..."
              className="flex-1 px-4 py-2 rounded-md bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-300"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
