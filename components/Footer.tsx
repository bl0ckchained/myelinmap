'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-center p-8 bg-gray-900 text-white text-sm space-y-2">
      <p>🧠 Designed to wire greatness into your day 🧠</p>
      <p>
        © 2025 MyelinMap.com – Made with 💙 in Michigan · Powered by Quantum Step Consultants LLC
      </p>
      <p>
        <Link href="/privacypolicies" className="underline hover:text-blue-300">
          Privacy Policy & Terms
        </Link>
      </p>
    </footer>
  );
}
