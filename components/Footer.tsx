// components/Footer.tsx
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./HeaderFooter.module.css";

type Notice = { type: "ok" | "cancel"; text: string } | null;

export default function Footer() {
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  // Show a small notice after returning from Stripe
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const result = url.searchParams.get("coffee");

    if (result === "success") {
      setNotice({
        type: "ok",
        text: "Thank you for the coffee — you’re fueling more healing tools. ☕💙",
      });
    } else if (result === "cancelled" || result === "canceled") {
      setNotice({
        type: "cancel",
        text: "Checkout canceled. No worries — you’re always welcome here. 🙏",
      });
    }

    const t = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(t);
  }, []);

  const handleCoffee = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", { method: "POST" });
      const data: { url?: string; error?: string } = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data?.error);
        alert("Sorry—couldn’t start checkout. Please try again in a moment.");
        setLoading(false);
      }
    } catch (e) {
      console.error("Coffee error:", e);
      alert("Network error starting checkout. Please try again.");
      setLoading(false);
    }
  };

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <p className={styles.footerTagline}>🧠 Designed to wire greatness into your day 🧠</p>
          <p className={styles.footerText}>
            Special thanks to Matt Stewart — your belief helped light this path.
          </p>
        </div>

        {notice && (
          <div
            role="status"
            aria-live="polite"
            className={`${styles.footerNotice} ${
              notice.type === "ok" ? styles.noticeSuccess : styles.noticeCancel
            } ${styles.fadeIn}`}
          >
            {notice.text}
          </div>
        )}

        <div className={styles.footerLinks}>
          <p className={styles.footerCopyright}>
            © {new Date().getFullYear()} MyelinMap.com — Made with 💙 in Michigan · Powered by
            {" "}Quantum Step Consultants LLC
          </p>
          <p>
            <Link href="/legalpage" className={styles.footerLink}>
              Privacy Policy &amp; Terms
            </Link>
          </p>
        </div>

        <div className={styles.footerSocial}>
          <button
            onClick={handleCoffee}
            disabled={loading}
            aria-label="Buy me a coffee to support Myelin Map"
            className={styles.coffeeButton}
          >
            {loading ? "Opening…" : "☕ Buy Me a Coffee — Support Myelin Map"}
          </button>

          <span className={styles.footerJoin}>Join our journey</span>

          <a
            href="https://www.youtube.com/@myelinmap"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube Channel"
            className={styles.youtubeLink}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              className={styles.youtubeIcon}
              aria-hidden="true"
            >
              <path d="M19.615 3.184c-1.007-.372-5.615-.372-5.615-.372s-4.608 0-5.615.372a3.21 3.21 0 0 0-2.262 2.262c-.373 1.007-.373 3.108-.373 3.108s0 2.101.373 3.108a3.21 3.21 0 0 0 2.262 2.262c1.007.372 5.615.372 5.615.372s4.608 0 5.615-.372a3.21 3.21 0 0 0 2.262-2.262c.373-1.007.373-3.108.373-3.108s0-2.101-.373-3.108a3.21 3.21 0 0 0-2.262-2.262zm-10.615 8.816v-5l5 2.5-5 2.5z" />
            </svg>
            <span>YouTube</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
// components/HeaderFooter.module.css
/* Footer styles */