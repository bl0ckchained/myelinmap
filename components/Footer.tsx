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

      <p className="flex justify-center items-center gap-2">
        🌩️ Join our journey
        <a
          href="https://www.youtube.com/@myelinmap"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-red-500"
          >
            <path d="M19.615 3.184c-1.007-.372-5.615-.372-5.615-.372s-4.608 0-5.615.372a3.21 3.21 0 0 0-2.262 2.262c-.373 1.007-.373 3.108-.373 3.108s0 2.101.373 3.108a3.21 3.21 0 0 0 2.262 2.262c1.007.372 5.615.372 5.615.372s4.608 0 5.615-.372a3.21 3.21 0 0 0 2.262-2.262c.373-1.007.373-3.108.373-3.108s0-2.101-.373-3.108a3.21 3.21 0 0 0-2.262-2.262zm-10.615 8.816v-5l5 2.5-5 2.5z" />
          </svg>
        </a>
      </p>
    </footer>
  );
}
