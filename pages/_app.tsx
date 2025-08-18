// pages/_app.tsx
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import dynamic from "next/dynamic";

// Global CSS first so it applies to everything
import "@/styles/basic.css";

// Load FloatingCoach client-side only (avoids SSR hydration weirdness)
const FloatingCoach = dynamic(() => import("@/components/FloatingCoach"), { ssr: false });

export default function MyApp({ Component, pageProps }: AppProps) {
  // Add the aurora class from your CSS (and clean up on unmount)
  useEffect(() => {
    document.body.classList.add("aurora");
    return () => document.body.classList.remove("aurora");
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Subtle PWA/Android navbar harmony */}
        <meta name="theme-color" content="#070a0f" />
        {/* Sensible defaults — individual pages can override */}
        <title>Myelin Map</title>
        <meta
          name="description"
          content="Myelin Map — a science-based habit and healing platform that turns tiny reps into lasting wiring."
        />
      </Head>

      {/* Render the page */}
      <Component {...pageProps} />

      {/* Calm, ever-present spotter */}
      <FloatingCoach variant="floating" />
    </>
  );
}
// --- IGNORE ---