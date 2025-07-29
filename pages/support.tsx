// pages/support.tsx

import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Support() {
    const handleDonate = async () => {
  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
  });

  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Something went wrong. Please try again.");
  }
};

  return (
    <>
      <Head>
        <title>Support Us – Myelin Map</title>
        <meta
          name="description"
          content="Help support Myelin Map and empower transformation through habit science."
        />
      </Head>

      <Header
        title="Support the Mission 💖"
        subtitle="If this project helps you grow, consider helping it grow too."
      />

      <main className="bg-gray-900 text-white px-6 py-20 min-h-screen">
        <section className="max-w-2xl mx-auto space-y-8 text-center">
          <p className="text-lg text-gray-300">
            Myelin Map is a labor of love — built to help people rewire their brains, one rep at a time.
            If you believe in what we&rsquo;re building, you can support development in a few small but powerful ways.
          </p>

          <div className="bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Crypto Tips</h2>
            <p className="mb-2 text-gray-300">ETH (Ethereum):</p>
            <code className="block break-all text-sm text-emerald-300">
              0x1990c29B1190184dE1Ed6C667f128CEb257b7BD9
            </code>
            <p className="mt-4 mb-2 text-gray-300">SOL (Solana):</p>
            <code className="block break-all text-sm text-cyan-300">
              F3KyAdfwXSawLuWumvdjFxXcERYSYQDD4dwZHghXHPgL
            </code>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-amber-400 mb-4">Buy Me a Coffee ☕</h2>
            <a
              href="https://www.buymeacoffee.com/chaddrummonds"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-amber-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-amber-400"
            >
              Tip with Card / PayPal
            </a>
          </div>

          <p className="text-gray-500 italic">
            Thank you for believing in the vision. Every little bit helps this tree grow. 🌱
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
