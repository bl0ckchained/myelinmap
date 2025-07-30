import { useEffect, useState } from "react";

type RepCounterProps = {
  count: number;
  onRep: () => void;
};

export default function RepCounter({ count, onRep }: RepCounterProps) {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (clicked) {
      const timer = setTimeout(() => setClicked(false), 300);
      return () => clearTimeout(timer);
    }
  }, [clicked]);

  return (
    <div className="bg-gray-800 border border-cyan-600 rounded-2xl p-6 shadow-lg text-center transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-2">💥 Synapse Reps</h2>

      <p className="text-5xl font-extrabold text-cyan-400 mb-4 animate-pulse">
        {count}
      </p>

      <button
        onClick={() => {
          setClicked(true);
          onRep();
        }}
        className={`bg-gradient-to-br from-cyan-500 to-emerald-500 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-md transform ${
          clicked ? "scale-110 ring-2 ring-cyan-300" : "hover:scale-105"
        }`}
      >
        + Log a Rep
      </button>

      <p className="mt-4 text-sm text-gray-400 italic">
        Each rep strengthens your neural circuit — you're rewiring greatness.
      </p>
    </div>
  );
}
