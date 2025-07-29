import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicies() {
  return (
    <>
      <Header title="Legal & Policies 📜" subtitle="Understand your rights, data, and trust" />

      <main
        className="max-w-4xl mx-auto p-6 bg-white text-gray-800"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        <p className="text-sm text-right mb-4">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </p>

        <h1 className="text-3xl font-bold mb-2">Privacy Policy for Myelin Map</h1>
        <p><strong>Effective Date:</strong> July 27, 2025</p>

        <section className="space-y-4 mt-4">
          <p>
            Myelin Map (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you visit our website{" "}
            <a href="https://myelinmap.com" className="text-blue-600 hover:underline">https://myelinmap.com</a> and use our services.
          </p>

          <h2 className="text-xl font-semibold">1. Information We Collect</h2>
          <ul className="list-disc list-inside">
            <li><strong>Personal Information</strong>: Name, email address, and any other data you provide when signing up or contacting us.</li>
            <li><strong>Usage Data</strong>: Pages visited, time on site, and user behavior through analytics tools.</li>
            <li><strong>Device Information</strong>: Browser type, IP address, device identifiers.</li>
          </ul>

          <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside">
            <li>Provide and maintain our services</li>
            <li>Send updates, newsletters, or promotional material (if opted in)</li>
            <li>Improve our platform and user experience</li>
            <li>Monitor usage trends and detect fraud or abuse</li>
          </ul>

          <h2 className="text-xl font-semibold">3. Sharing Your Information</h2>
          <p>
            We do <strong>not</strong> sell your personal data. We may share
            information with:
          </p>
          <ul className="list-disc list-inside">
            <li>Service providers that help us operate (e.g., hosting, email, analytics)</li>
            <li>Authorities if required by law or in defense of legal claims</li>
          </ul>

          <h2 className="text-xl font-semibold">4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies to improve your experience, remember preferences, and
            gather analytics. You can disable cookies in your browser settings.
          </p>

          <h2 className="text-xl font-semibold">5. Your Rights and Choices</h2>
          <ul className="list-disc list-inside">
            <li>Access or update your personal data</li>
            <li>Opt out of communications</li>
            <li>Request deletion of your information</li>
          </ul>
          <p>
            To make a request, email us at:{" "}
            <a href="mailto:support@myelinmap.com" className="text-blue-600 hover:underline">support@myelinmap.com</a>
          </p>

          <h2 className="text-xl font-semibold">6. Data Security</h2>
          <p>We use industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.</p>

          <h2 className="text-xl font-semibold">7. Children&apos;s Privacy</h2>
          <p>Myelin Map is not intended for individuals under the age of 13. We do not knowingly collect personal data from children.</p>

          <h2 className="text-xl font-semibold">8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy. We&apos;ll notify you of any significant changes via the site or email.</p>

          <h2 className="text-xl font-semibold">9. Contact Us</h2>
          <p>
            Email: <a href="mailto:support@myelinmap.com" className="text-blue-600 hover:underline">support@myelinmap.com</a>
            <br />
            Myelin Map, N6890 Henry H Drive, Engadine, MI. 49827
          </p>
        </section>

        <hr className="my-8" />

        <h1 className="text-3xl font-bold mb-2">Terms of Service for Myelin Map</h1>
        <p><strong>Effective Date:</strong> July 27, 2025</p>

        <section className="space-y-4 mt-4">
          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p>By using Myelin Map, you agree to comply with and be legally bound by these Terms of Service.</p>

          <h2 className="text-xl font-semibold">2. Use of the Platform</h2>
          <ul className="list-disc list-inside">
            <li>Use the service for personal, non-commercial use only unless authorized</li>
            <li>Not misuse, copy, or reverse-engineer any part of our platform</li>
            <li>Provide accurate information when registering</li>
          </ul>

          <h2 className="text-xl font-semibold">3. User Accounts</h2>
          <p>You&apos;re responsible for maintaining the confidentiality of your account and password. Notify us immediately if you suspect unauthorized use.</p>

          <h2 className="text-xl font-semibold">4. Intellectual Property</h2>
          <p>All content on Myelin Map (logos, text, visuals) is our intellectual property. You may not reproduce, distribute, or create derivative works without written permission.</p>

          <h2 className="text-xl font-semibold">5. Disclaimer of Warranties</h2>
          <p>Myelin Map is provided &quot;as is&quot; and &quot;as available.&quot; We do not guarantee accuracy or availability at all times.</p>

          <h2 className="text-xl font-semibold">6. Limitation of Liability</h2>
          <p>We are not liable for indirect, incidental, or consequential damages arising from your use of the service.</p>

          <h2 className="text-xl font-semibold">7. Termination</h2>
          <p>We may suspend or terminate your account if you violate these terms or misuse the platform.</p>

          <h2 className="text-xl font-semibold">8. Governing Law</h2>
          <p>These terms are governed by the laws of the State of Michigan, United States.</p>

          <h2 className="text-xl font-semibold">9. Contact</h2>
          <p>
            Email: <a href="mailto:support@myelinmap.com" className="text-blue-600 hover:underline">support@myelinmap.com</a>
            <br />
            Myelin Map, N6890 Henry H Drive, Engadine, MI. 49827
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
