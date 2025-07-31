"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-center p-8 bg-gray-900 text-white text-sm space-y-2">
      
      <p className="text-gray-400 mt-2">
        Special thanks to Matt Stewart — your belief helped light this path.
      </p>

      <p>🧠 Designed to wire greatness into your day 🧠</p>
      
      <p>
        © 2025 MyelinMap.com Made with 💙 in Michigan · Powered by Quantum Step
        Consultants LLC
      </p>

      <p>
        <Link href="/legalpage" className="underline hover:text-blue-300">
          Privacy Policy & Terms
        </Link>
      </p>

      <p>
        🌩️ Join our journey on{" "}
        <a
          href="https://www.youtube.com/@myelinmap"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline"
        >
          YouTube
        </a>
      </p>
    </footer>
  );
}
