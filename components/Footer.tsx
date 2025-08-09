import Link from "next/link";
import React, { useState } from "react";

export default function Footer() {
  const [loading, setLoading] = useState(false);

  // Fallback link if Stripe isn’t configured yet
  const buyMeACoffeeUrl = "https://www.buymeacoffee.com/YOUR_HANDLE";

  // Build-time flag to decide whether to use Stripe or fallback
  const hasStripe =
    typeof process.env.NEXT_PUBLIC_STRIPE_ENABLED !== "undefined" &&
    process.env.NEXT_PUBLIC_STRIPE_ENABLED === "true";

  const handleCoffee = async () => {
    // Fallback: open BMAC if Stripe isn’t enabled/configured
    if (!hasStripe) {
      window.open(buyMeACoffeeUrl, "_blank", "noopener,noreferrer");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "coffee" }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
        // graceful fallback if API returns no url
        window.open(buyMeACoffeeUrl, "_blank", "noopener,noreferrer");
      }
    } catch (e) {
      console.error("Coffee error:", e);
      setLoading(false);
      window.open(buyMeACoffeeUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <footer
      style={{
        textAlign: "center",
        padding: "2rem",
        backgroundColor: "#111827", // Tailwind's bg-gray-900
        color: "#fff",
        fontSize: "0.875rem",
      }}
    >
      {/* Dedication and Mission */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ color: "#9ca3af", marginTop: "0.5rem" }}>
          Special thanks to Matt Stewart — your belief helped light this path.
        </p>
        <p>🧠 Designed to wire greatness into your day 🧠</p>
      </div>

      {/* Copyright and Legal */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p>
          &copy; 2025 MyelinMap.com — Made with 💙 in Michigan · Powered by Quantum Step Consultants LLC
        </p>
        <p>
          <Link href="/legalpage" legacyBehavior>
            <a
              style={{
                textDecoration: "underline",
                color: "#bfdbfe", // Tailwind's blue-300
              }}
            >
              Privacy Policy & Terms
            </a>
          </Link>
        </p>
      </div>

      {/* Coffee + Social */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleCoffee}
          disabled={loading}
          aria-label="Buy me a coffee"
          style={{
            padding: "0.55rem 1rem",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.15)",
            backgroundColor: "#f59e0b", // amber-500
            color: "#111827",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "transform 0.15s ease, box-shadow 0.2s ease",
          }}
        >
          {loading ? "Opening…" : "☕ Buy me a coffee"}
        </button>

        <span style={{ color: "#9ca3af" }}>Join our journey</span>
        <a
          href="https://www.youtube.com/@myelinmap"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube Channel"
          style={{
            transition: "opacity 0.3s",
            color: "#ef4444", // Tailwind's red-500
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19.615 3.184c-1.007-.372-5.615-.372-5.615-.372s-4.608 0-5.615.372a3.21 3.21 0 0 0-2.262 2.262c-.373 1.007-.373 3.108-.373 3.108s0 2.101.373 3.108a3.21 3.21 0 0 0 2.262 2.262c1.007.372 5.615.372 5.615.372s4.608 0 5.615-.372a3.21 3.21 0 0 0 2.262-2.262c.373-1.007.373-3.108.373-3.108s0-2.101-.373-3.108a3.21 3.21 0 0 0-2.262-2.262zm-10.615 8.816v-5l5 2.5-5 2.5z" />
          </svg>
          <span>YouTube</span>
        </a>
      </div>
    </footer>
  );
}
