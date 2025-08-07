import Link from "next/link";
import React from "react";

export default function Footer() {
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
        <p>
          🧠 Designed to wire greatness into your day 🧠
        </p>
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

      {/* Social Media Link */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span style={{ color: "#9ca3af" }}>Join our journey</span>
        <a
          href="https://www.youtube.com/@myelinmap"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube Channel"
          style={{
            transition: "opacity 0.3s",
            color: "#ef4444", // Tailwind's red-500
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
        </a>
      </div>
    </footer>
  );
}
