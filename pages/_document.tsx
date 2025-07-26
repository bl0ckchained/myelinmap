import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ✅ Custom Favicon (must be in /public) */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        
        {/* ✅ Theme color for mobile browsers */}
        <meta name="theme-color" content="#0f172a" />

        {/* ✅ Font preload (optional, if you use Inter) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased bg-gray-900 text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
