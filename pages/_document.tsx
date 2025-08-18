// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon(s) */}
        <link rel="icon" href="/favicon.ico" />
        {/* If you have a 180×180 PNG, prefer this over reusing the .ico */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Themed browser UI to match your deep-space background */}
        <meta name="theme-color" content="#070a0f" />
        <meta name="color-scheme" content="dark" />

        {/* Font performance hints + Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Tailwind classes removed; we use your CSS. "aurora" activates the nebula glow. */}
      <body className="aurora">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
// --- IGNORE ---
// This file is for Next.js document-level customizations.
// It allows you to modify the HTML structure and add global metadata.
// The "aurora" class is added to the body for your nebula glow effect.
// You can also add favicons, fonts, and other global resources here.
// The FloatingCoach component is loaded client-side in _app.tsx to avoid SSR issues.
// This file does not need to import React or Next.js components directly.
// It is processed by Next.js to generate the final HTML document structure.
// --- IGNORE --- */