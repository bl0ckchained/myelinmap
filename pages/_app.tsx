// pages/_app.tsx
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

// Global CSS (applies to everything)
import "@/styles/basic.css";

// Load FloatingCoach client-side only (avoids SSR hydration issues)
const FloatingCoach = dynamic(() => import("@/components/FloatingCoach"), { ssr: false });

export default function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  // Add the aurora backdrop class to <body>
  useEffect(() => {
    document.body.classList.add("aurora");
    return () => document.body.classList.remove("aurora");
  }, []);

  // Avoid double-coach when the dedicated Coach page is open
  const showFloatingCoach = !pathname.startsWith("/coach");

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

      {/* Render the current page */}
      <Component {...pageProps} />

      {/* Calm, ever-present spotter (hidden on /coach) */}
      {showFloatingCoach && <FloatingCoach variant="floating" />}
    </>
  );
}
// This file is the custom App component for Next.js, which wraps all pages.
// It sets up global styles, metadata, and conditionally renders the FloatingCoach component.
// The FloatingCoach is dynamically imported to avoid SSR issues, and it only shows on pages other
// than the dedicated Coach page. The aurora backdrop class is added to the body for consistent
// theming across the app. The Head component is used to set default metadata and viewport settings
// for the application, ensuring a good user experience on both desktop and mobile devices.
// The useEffect hook is used to manage the addition and removal of the aurora class on the body element,
// ensuring it is applied correctly when the app loads and removed when the component unmounts.
// The useRouter hook is used to determine the current path and conditionally render the FloatingCoach
// component based on whether the user is on the Coach page or not.
// This setup provides a clean and efficient way to manage global styles and components in a Next.js
// application, enhancing both performance and user experience.
// The FloatingCoach component serves as a helpful guide for users, providing tips and support
// without being intrusive, and is designed to fit seamlessly into the overall design of the application. 
