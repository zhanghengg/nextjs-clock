import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Realtime Clock',
  description: 'A realtime clock with a crisp, kinetic UI.',
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{css}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}

const css = String.raw`
  :root {
    --bg0: #070813;
    --bg1: #0b0e2a;
    --ink: rgba(255, 255, 255, 0.92);
    --muted: rgba(255, 255, 255, 0.68);
    --muted2: rgba(255, 255, 255, 0.54);
    --glass: rgba(255, 255, 255, 0.08);
    --stroke: rgba(255, 255, 255, 0.14);
    --shadow: rgba(0, 0, 0, 0.35);

    --a: #66e3ff;
    --b: #ff4fd8;
    --c: #ffd36e;

    --r: 22px;
  }

  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0;
    background: radial-gradient(1200px 800px at 20% 10%, rgba(102, 227, 255, 0.16), transparent 55%),
                radial-gradient(1100px 900px at 80% 30%, rgba(255, 79, 216, 0.14), transparent 58%),
                radial-gradient(900px 700px at 60% 90%, rgba(255, 211, 110, 0.12), transparent 55%),
                linear-gradient(180deg, var(--bg0), var(--bg1));
    color: var(--ink);
    font-family: "Space Grotesk", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    overflow-x: hidden;
  }

  @media (prefers-reduced-motion: reduce) {
    * { scroll-behavior: auto !important; }
  }
`;
