// pages/support.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Support() {
  return (
    <>
      <Header title="Support Myelin Map 🧠" subtitle="Help us grow the world's greatest skill-building tool" />
      <main className="max-w-3xl mx-auto p-6 text-gray-800">
        <p className="mb-4">
          Myelin Map is a passion project built to help people rewire their brains, habits, and lives. 💪
        </p>

        <p className="mb-4">
          If you&apos;d like to support the mission, thank you 🙏 Your encouragement is just as valuable as your dollars.
        </p>

        <p className="mb-4">
          <strong>Ways to support:</strong>
        </p>
        <ul className="list-disc list-inside mb-6">
          <li>Share Myelin Map with friends &amp; community</li>
          <li>Send kind feedback or a testimonial</li>
          <li>Request a feature or report a bug</li>
          <li>
            If you really want to help financially,{" "}
            <a href="mailto:support@myelinmap.com" className="text-blue-600 underline">
              email us
            </a>{" "}
            and we&apos;ll set it up!
          </li>
        </ul>

        <p className="text-sm text-gray-500">
          Stripe donations coming soon — we&apos;re building with love and transparency ❤️
        </p>

        <p className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
