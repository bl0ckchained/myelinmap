import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Coach() {
  const [userInput, setUserInput] = useState("");
  const [chatLog, setChatLog] = useState([
    { role: "assistant", content: "Welcome back. How are you feeling today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newLog = [...chatLog, { role: "user", content: userInput }];
    setChatLog(newLog);
    setUserInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: newLog }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok || !data.message) {
        throw new Error("Invalid response from AI");
      }

      setChatLog([...newLog, { role: "assistant", content: data.message }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatLog([
        ...newLog,
        {
          role: "assistant",
          content:
            "Hmm, something went wrong. The Coach is taking a deep breath. Try again shortly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Coach | Myelin Map</title>
        <meta name="description" content="Chat with your calm, kind mental health AI Coach." />
      </Head>

      <Header title="Mental Health Coach 🤝" subtitle="Talk. Reflect. Grow." />

      <main className="bg-gray-900 text-white px-6 py-20 min-h-screen">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* 🧘 Floating Coach Emoji */}
          <div className="flex justify-center text-6xl animate-float drop-shadow-md">
            🧘
          </div>

          {/* 💬 Chat Area */}
          <div className="bg-black/20 p-4 rounded-md h-[400px] overflow-y-auto border border-white/10">
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 animate-fade-in ${
                  msg.role === "user" ? "text-right" : "text-left text-emerald-300"
                }`}
              >
                <p>
                  <span className="font-bold">
                    {msg.role === "user" ? "You" : "Coach"}:
                  </span>{" "}
                  {msg.content}
                </p>
              </div>
            ))}

            {loading && (
              <div className="text-left text-emerald-300 animate-fade-in">
                <p>
                  <span className="font-bold">Coach:</span>{" "}
                  <span className="inline-flex gap-1 animate-pulse">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </p>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* ✍️ Input Row */}
          <div className="flex gap-2">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type how you're feeling..."
              className="flex-1 px-4 py-2 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-300"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* 🔮 Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
