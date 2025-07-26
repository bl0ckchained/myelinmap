// ✅ RepCounter Component – by Chad 💪🧠

import { useState } from "react";

export default function RepCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg text-center transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-2">💥 Synapse Reps</h2>

      <p className="text-4xl font-extrabold text-cyan-400 mb-4">
        {count}
      </p>

      <button
        onClick={() => setCount(count + 1)}
        className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-md hover:scale-105"
      >
        + Log a Rep
      </button>

      <p className="mt-4 text-sm text-gray-400 italic">
        Each rep reinforces your neural circuit — keep going.
      </p>
    </div>
  );
}
