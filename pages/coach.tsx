// pages/coach.tsx
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Coach() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const askAI = async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResponse(data.reply);
  };

  return (
    <>
      <Header title="AI Habit Coach 🤖" subtitle="Talk to your virtual coach" />
      <main className="bg-gray-900 text-white px-6 py-20 min-h-screen flex flex-col items-center">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full max-w-xl p-4 rounded bg-gray-800 text-white mb-4"
          rows={4}
          placeholder="Ask something like: How can I stick to my morning routine?"
        />
        <button
          onClick={askAI}
          className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded text-white font-bold"
        >
          Ask
        </button>
        {response && (
          <div className="mt-8 bg-gray-800 p-4 rounded w-full max-w-xl">
            <p>{response}</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
