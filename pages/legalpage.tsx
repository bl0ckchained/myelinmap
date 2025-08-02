import React from "react";
import Link from "next/link";

// This is a self-contained version of the Legal page, combining the main
// page logic with the Header and Footer components to resolve import issues.

// --- Embedded Header Component ---
const navLinks = [
  { href: "/", label: "🏠 Home", hoverColor: "hover:bg-emerald-500" },
  { href: "/rewire", label: "🔥 7-Day Challenge", hoverColor: "hover:bg-amber-400" },
  { href: "/about", label: "👤 About Us", hoverColor: "hover:bg-lime-400" },
  { href: "/visualizer", label: "🧬 Visualizer", hoverColor: "hover:bg-cyan-500" },
  { href: "/coach", label: "🧠 Coach", hoverColor: "hover:bg-pink-400" },
];

const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <header className="bg-gray-900 text-white text-center py-12 px-4">
      <h1 className="text-4xl font-bold">{title}</h1>
      {subtitle && <p className="text-lg mt-2 max-w-xl mx-auto">{subtitle}</p>}
      <nav className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        {navLinks.map(({ href, label, hoverColor }) => (
          <Link key={href} href={href} legacyBehavior>
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
};

// --- Embedded Footer Component ---
const Footer = () => {
  return (
    <footer className="text-center p-8 bg-gray-900 text-white text-sm">
      <div className="space-y-2 mb-4">
        <p className="text-gray-400 mt-2">
          Special thanks to Matt Stewart &mdash; your belief helped light this path.
        </p>
        <p>
          <span role="img" aria-label="brain emoji">🧠</span> Designed to wire greatness into your day <span role="img" aria-label="brain emoji">🧠</span>
        </p>
      </div>
      <div className="space-y-2 mb-4">
        <p>
          &copy; 2025 MyelinMap.com Made with <span role="img" aria-label="blue heart emoji">💙</span> in Michigan &middot; Powered by Quantum Step
          Consultants LLC
        </p>
        <p>
          <Link href="/legalpage" legacyBehavior>
            <a className="underline hover:text-blue-300">
              Privacy Policy & Terms
            </a>
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
      </div>
    </footer>
  );
};

// --- Main Legal Page Component ---
export default function LegalPage() {
  return (
    <>
      <Header
        title="Privacy & Terms 📜"
        subtitle="We respect your trust and are committed to protecting it"
      />

      <main className="max-w-4xl mx-auto p-6 bg-white text-gray-800 space-y-10">
        <p className="text-sm text-right">
          <Link href="/" legacyBehavior>
            <a className="text-blue-600 hover:underline">
              ← Back to Home
            </a>
          </Link>
        </p>

        <section className="space-y-2">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Effective Date: July 27, 2025</p>
          <p>
            Your trust means everything to us. This page outlines what data we collect, how we use it, and what your rights are as a valued member of the Myelin Map community.
          </p>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">🔍 What We Collect</h2>
            <ul className="list-disc list-inside">
              <li><strong>Personal Info</strong> &mdash; Like your name, email, or anything you share with us directly</li>
              <li><strong>Usage Data</strong> &mdash; Pages visited, time on site, actions taken</li>
              <li><strong>Device Info</strong> &mdash; Browser, IP address, and device type</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold">📦 How We Use It</h2>
            <ul className="list-disc list-inside">
              <li>To power the tools and experience you came here for</li>
              <li>To send helpful updates (only if you opted in)</li>
              <li>To make Myelin Map better for everyone</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold">🤝 Who We Share It With</h2>
            <p>Never sold. Only shared with:</p>
            <ul className="list-disc list-inside">
              <li>Trusted service providers (like hosting or analytics)</li>
              <li>Authorities, but only if required by law</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold">🍪 Cookies</h2>
            <p>We use cookies to personalize and improve your experience. You can disable them in your browser at any time.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">🧭 Your Choices</h2>
            <ul className="list-disc list-inside">
              <li>Request, update, or delete your info</li>
              <li>Opt out of emails and tracking</li>
            </ul>
            <p>Just email us at <a href="mailto:support@myelinmap.com" className="text-blue-600 hover:underline">support@myelinmap.com</a>.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">🔐 Security</h2>
            <p>We use modern security practices to keep your data safe. Though no system is ever 100 percent perfect, we strive to protect your information.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">👶 Children Privacy</h2>
            <p>Myelin Map is not for users under 13. We do not knowingly collect info from children.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">📝 Changes</h2>
            <p>If this policy changes, we will let you know on the site or via email if you are subscribed.</p>
          </div>
        </section>

        <section className="space-y-2 border-t border-gray-300 pt-6">
          <h2 className="text-xl font-semibold">📬 Contact Us</h2>
          <p>
            Email: <a href="mailto:support@myelinmap.com" className="text-blue-600 hover:underline">support@myelinmap.com</a><br />
            Address: Myelin Map, N6890 Henry H Drive, Engadine, MI 49827
          </p>
        </section>

        <section className="space-y-6 border-t border-gray-300 pt-10">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-sm text-gray-500">Effective Date: July 27, 2025</p>

          <div>
            <h2 className="text-xl font-semibold">✅ Acceptance</h2>
            <p>By using Myelin Map, you agree to the following terms. If you disagree with any part, please do not use the platform.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">💡 Usage Guidelines</h2>
            <ul className="list-disc list-inside">
              <li>Use for personal growth only, unless given explicit permission</li>
              <li>Do not copy, clone, or reverse engineer our work</li>
              <li>Provide honest information when signing up</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold">🔐 Account Responsibilities</h2>
            <p>You are responsible for keeping your login credentials safe. Notify us immediately if your account is compromised.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">🧠 Intellectual Property</h2>
            <p>Everything on Myelin Map is protected. Do not use our content, code, or visuals without permission.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">🚫 Disclaimers</h2>
            <p>Myelin Map is provided as-is and as-available. We do not guarantee perfect uptime or accuracy, though we always strive for both.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">⚠️ Limitations of Liability</h2>
            <p>We are not liable for indirect or consequential damages from using the platform.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">🔚 Termination</h2>
            <p>We may suspend accounts that violate these terms or misuse the platform in any way.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">⚖️ Legal</h2>
            <p>These terms are governed by the laws of the State of Michigan, United States.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">📬 Contact</h2>
            <p>
              Email: <a href="mailto:support@myelinmap.com" className="text-blue-600 hover:underline">support@myelinmap.com</a><br />
              Address: Myelin Map, N6890 Henry H Drive, Engadine, MI 49827
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
