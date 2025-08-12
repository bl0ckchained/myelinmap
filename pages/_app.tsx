// pages/_app.tsx
import type { AppProps } from "next/app";
import FloatingCoach from "@/components/FloatingCoach";
// If you have global CSS, keep this import:
import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      {/* Floating coach on every page */}
      <FloatingCoach variant="floating" />
    </>
  );
}
