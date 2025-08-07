import type { AppProps } from "next/app";
import FloatingCoach from "@/components/FloatingCoach"; // 🧠 Add this

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <FloatingCoach /> {/* 🧠 Loads on every page */}
    </>
  );
}
// ✅ This is the main app component for Next.js
// ✅ It wraps every page with global styles and the FloatingCoach component
// ✅ The FloatingCoach component provides a persistent mental health coaching feature
// ✅ Uses TypeScript for type safety