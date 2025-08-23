// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Match your deep-space theme */}
        <meta name="theme-color" content="#070a0f" />
        <meta name="color-scheme" content="dark" />

        {/* Font performance hints + Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* We apply the aurora backdrop at SSR to avoid flash on first paint */}
      <body className="aurora">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
// for building healthy habits and improving mental well-being.
// The use of dynamic imports and conditional rendering ensures that the app remains performant
// and user-friendly, while the global styles and metadata provide a consistent look and feel across
// the application. This setup is essential for creating a polished and engaging user experience
// in a Next.js application, especially one focused on personal development and mental health.