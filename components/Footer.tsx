import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.css";

export default function Footer() {
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<null | { type: "ok" | "cancel"; text: string }>(null);

  // Show a small notice after returning from Stripe
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("coffee") === "success") {
      setNotice({ type: "ok", text: "Thank you for the coffee — you’re fueling more healing tools. ☕💙" });
    } else if (url.searchParams.get("coffee") === "cancelled") {
      setNotice({ type: "cancel", text: "Checkout canceled. No worries — you’re always welcome here. 🙏" });
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
        setLoading(false);
        alert("Sorry—couldn’t start checkout. Please try again in a moment.");
      }
    } catch (e) {
      console.error("Coffee error:", e);
      setLoading(false);
      alert("Network error starting checkout. Please try again.");
    }
  };

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            Special thanks to Matt Stewart — your belief helped light this path.
          </p>
          <p className={styles.footerTagline}>
            🧠 Designed to wire greatness into your day 🧠
          </p>
        </div>

        {notice && (
          <div
            role="status"
            aria-live="assertive"
            className={`${styles.footerNotice} ${styles.fadeIn} ${
              notice.type === "ok" ? styles.noticeSuccess : styles.noticeCancel
            }`}
          >
            {notice.text}
          </div>
        )}

        <div className={styles.footerLinks}>
          <p className={styles.footerCopyright}>
            &copy; {new Date().getFullYear()} MyelinMap.com — Made with 💙 in Michigan · Powered by Quantum Step Consultants LLC
          </p>
          <p>
            <Link href="/legalpage" legacyBehavior>
              <a className={styles.footerLink}>Privacy Policy &amp; Terms</a>
            </Link>
          </p>
        </div>

        <div className={styles.footerSocial}>
          <button
            onClick={handleCoffee}
            disabled={loading}
            aria-label="Support Myelin Map by buying a coffee"
            className={`${styles.coffeeButton} ${styles.fadeIn}`}
          >
            {loading ? "Opening…" : "☕ Buy Me a Coffee — Support Myelin Map"}
          </button>
          <span className={styles.footerJoin}>Join our journey</span>
          <a
            href="https://www.youtube.com/@myelinmap"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Myelin Map’s YouTube Channel"
            className={styles.youtubeLink}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={styles.youtubeIcon}
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