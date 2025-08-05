"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import OpenAI, { ChatCompletionMessageParam } from "openai";

// --- OpenAI Client Initialization ---
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true,
});

export default function FloatingCoach() {
  const [open, setOpen] = useState(false);
  const [chatLog, setChatLog] = useState([
    {
      role: "assistant",
      content:
        "✨ Welcome, brave soul. I'm here to walk beside you. How are you feeling today?",
    },
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
      const messages: ChatCompletionMessageParam[] = [
        {
          role: "system",
          content:
            "You are a gentle, compassionate AI coach. You help people recovering from trauma and addiction. Your words should be kind, hopeful, supportive, and never judgmental.",
        },
        ...newLog.map((msg) => ({
          role: msg.role as "system" | "user" | "assistant",
          content: msg.content,
        })),
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
      });

      const assistantMessage = response.choices[0].message.content;
      setChatLog([...newLog, { role: "assistant", content: assistantMessage }]);
    } catch (err) {
      console.error("OpenAI error:", err);
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
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-xl text-sm break-words shadow-sm transition-all duration-300 ${
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
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
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
