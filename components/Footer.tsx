import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./HeaderFooter.module.css"; // reuse the same inner container
export default function Footer() {
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<null | {
    type: "ok" | "cancel";
    text: string;
  }>(null); // Show a small notice after returning from Stripe
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("coffee") === "success") {
      setNotice({
        type: "ok",
        text: "Thank you for the coffee — you’re fueling more healing tools. ☕💙",
      });
    } else if (url.searchParams.get("coffee") === "cancelled") {
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
    <footer className={styles.section} role="contentinfo">
            
      <div
        className={styles.inner}
        style={{ textAlign: "center", fontSize: "0.875rem" }}
      >
                
        <div style={{ marginBottom: "1.5rem" }}>
                    
          <p style={{ color: "#9ca3af", marginTop: "0.5rem" }}>
                        Special thanks to Matt Stewart — your belief helped
            light this path.           
          </p>
                    <p>🧠 Designed to wire greatness into your day 🧠</p>
                  
        </div>
                
        {notice && (
          <div
            role="status"
            aria-live="polite"
            style={{
              margin: "0 auto 1rem",
              maxWidth: 680,
              padding: "0.75rem 1rem",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background:
                notice.type === "ok"
                  ? "rgba(16,185,129,0.15)"
                  : "rgba(239,68,68,0.12)",
            }}
          >
                        {notice.text}
                      
          </div>
        )}
                
        <div style={{ marginBottom: "1.5rem", color: "#fff" }}>
                    
          <p>
                        © {new Date().getFullYear()} MyelinMap.com — Made with
            💙 in Michigan · Powered by Quantum Step Consultants LLC           
          </p>
                    
          <p>
                       
            <Link href="/legalpage" className="underline hover:text-blue-300">
              <span>Privacy Policy &amp; Terms</span>
            </Link>
                      
          </p>
                  
        </div>
                
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
            aria-label="Buy me a coffee to support Myelin Map"
            style={{
              padding: "0.6rem 1.1rem",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.15)",
              backgroundColor: "#f59e0b",
              color: "#111827",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "transform 0.15s ease, box-shadow 0.2s ease",
            }}
          >
                        
            {loading ? "Opening…" : "☕ Buy Me a Coffee — Support Myelin Map"}
                      
          </button>
                    <span style={{ color: "#9ca3af" }}>Join our journey</span>
                    
          <a
            href="https://www.youtube.com/@myelinmap"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube Channel"
            style={{
              transition: "opacity 0.3s",
              color: "#ef4444",
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
              
      </div>
          
    </footer>
  );
}
