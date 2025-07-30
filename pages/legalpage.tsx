import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicies() {
  return (
    <>
      <Header
        title="Privacy & Terms 📜"
        subtitle="We respect your trust and are committed to protecting it"
      />

      <main className="max-w-4xl mx-auto p-6 bg-white text-gray-800 space-y-10">
        <p className="text-sm text-right">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
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
              <li><strong>Personal Info</strong> * Like your name, email, or anything you share with us directly</li>
              <li><strong>Usage Data</strong> * Pages visited, time on site, actions taken</li>
              <li><strong>Device Info</strong> * Browser, IP address, and device type</li>
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
