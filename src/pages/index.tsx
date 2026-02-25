import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';

type Tick = {
  hh: string;
  mm: string;
  ss: string;
  dateLine: string;
  tz: string;
};

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function formatTick(now: Date): Tick {
  const hh = pad2(now.getHours());
  const mm = pad2(now.getMinutes());
  const ss = pad2(now.getSeconds());

  const dateLine = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return { hh, mm, ss, dateLine, tz };
}

export default function Clock() {
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState<Tick>(() => formatTick(new Date()));

  useEffect(() => {
    setMounted(true);

    const update = () => setTick(formatTick(new Date()));
    update();

    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const greeting = useMemo(() => {
    const h = Number(tick.hh);
    if (h < 6) return 'Late Night';
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, [tick.hh]);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }, []);

  return (
    <>
      <Head>
        <title>Realtime Clock</title>
        <meta name="description" content="A realtime clock with a crisp, kinetic UI." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{css}</style>
      </Head>

      <main className="stage">
        <div className="bg" aria-hidden="true">
          <div className="grain" />
          <div className="orb orbA" />
          <div className="orb orbB" />
          <div className="orb orbC" />
          <div className="grid" />
        </div>

        <section className="wrap" aria-label="Realtime clock">
          <header className="header">
            <div className="badge">
              <span className={prefersReducedMotion ? '' : 'livePulse'} aria-hidden="true" />
              <span className="badgeText">LIVE</span>
            </div>
            <div className="meta">
              <div className="greet">{greeting}</div>
              <div className="sub">
                <span className="date">{mounted ? tick.dateLine : 'Loading…'}</span>
                <span className="dot">·</span>
                <span className="tz">{mounted ? tick.tz : ''}</span>
              </div>
            </div>
          </header>

          <div className={prefersReducedMotion ? 'card' : 'card floatIn'}>
            <div className="time" role="timer" aria-live="polite">
              <span className="hh">{mounted ? tick.hh : '--'}</span>
              <span className={prefersReducedMotion ? 'sep' : 'sep blink'} aria-hidden="true">
                :
              </span>
              <span className="mm">{mounted ? tick.mm : '--'}</span>
              <span className={prefersReducedMotion ? 'sep' : 'sep blink'} aria-hidden="true">
                :
              </span>
              <span className="ss">{mounted ? tick.ss : '--'}</span>
            </div>

            <div className="meter" aria-hidden="true">
              <div className="meterBar" style={{ ['--p' as any]: `${Number(tick.ss) / 60}` }} />
            </div>

            <div className="footer">
              <div className="hint">Updates every second</div>
              <div className="chips" aria-hidden="true">
                <span className="chip">Static Export</span>
                <span className="chip">Mobile Ready</span>
                <span className="chip">Kinetic UI</span>
              </div>
            </div>
          </div>

          <p className="fineprint">
            Tip: add this tab to your home screen for a clean desk clock.
          </p>
        </section>
      </main>
    </>
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

  .stage {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: clamp(18px, 4vw, 34px);
    position: relative;
  }

  .bg { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }

  .grain {
    position: absolute;
    inset: -50%;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/></filter><rect width="160" height="160" filter="url(%23n)" opacity="0.28"/></svg>');
    mix-blend-mode: overlay;
    opacity: 0.18;
    transform: rotate(8deg);
  }

  .grid {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(55% 55% at 50% 45%, rgba(0,0,0,0.9), transparent 75%);
    opacity: 0.25;
  }

  .orb {
    position: absolute;
    border-radius: 999px;
    filter: blur(28px);
    opacity: 0.55;
    transform: translate3d(0,0,0);
  }

  .orbA {
    width: 540px; height: 540px;
    left: -180px; top: -190px;
    background: radial-gradient(circle at 30% 30%, rgba(102,227,255,0.9), rgba(102,227,255,0.0) 60%);
    animation: driftA 14s ease-in-out infinite;
  }

  .orbB {
    width: 520px; height: 520px;
    right: -190px; top: 120px;
    background: radial-gradient(circle at 35% 35%, rgba(255,79,216,0.85), rgba(255,79,216,0.0) 62%);
    animation: driftB 16s ease-in-out infinite;
  }

  .orbC {
    width: 520px; height: 520px;
    left: 10%; bottom: -240px;
    background: radial-gradient(circle at 35% 35%, rgba(255,211,110,0.85), rgba(255,211,110,0.0) 62%);
    animation: driftC 18s ease-in-out infinite;
  }

  @keyframes driftA {
    0%, 100% { transform: translate(-6px, 6px) scale(1); }
    50% { transform: translate(18px, -10px) scale(1.04); }
  }
  @keyframes driftB {
    0%, 100% { transform: translate(6px, -8px) scale(1); }
    50% { transform: translate(-14px, 10px) scale(1.03); }
  }
  @keyframes driftC {
    0%, 100% { transform: translate(0px, 8px) scale(1); }
    50% { transform: translate(12px, -10px) scale(1.03); }
  }

  .wrap {
    width: min(780px, 100%);
    position: relative;
    z-index: 1;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 14px;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px solid var(--stroke);
    background: rgba(255,255,255,0.06);
    border-radius: 999px;
    box-shadow: 0 10px 30px var(--shadow);
    backdrop-filter: blur(10px);
  }

  .livePulse {
    width: 9px; height: 9px;
    border-radius: 99px;
    background: var(--a);
    box-shadow: 0 0 0 0 rgba(102,227,255,0.55);
    animation: ping 1.4s ease-out infinite;
  }

  @keyframes ping {
    0% { box-shadow: 0 0 0 0 rgba(102,227,255,0.55); }
    70% { box-shadow: 0 0 0 14px rgba(102,227,255,0.0); }
    100% { box-shadow: 0 0 0 0 rgba(102,227,255,0.0); }
  }

  .badgeText {
    font-size: 12px;
    letter-spacing: 0.22em;
    font-weight: 700;
    color: rgba(255,255,255,0.86);
  }

  .meta { display: grid; gap: 2px; }
  .greet { font-weight: 700; font-size: 18px; letter-spacing: -0.01em; }
  .sub {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    color: var(--muted);
    font-size: 13px;
  }
  .dot { opacity: 0.7; }

  .card {
    border-radius: var(--r);
    border: 1px solid var(--stroke);
    background: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.06));
    box-shadow: 0 30px 90px rgba(0,0,0,0.45);
    backdrop-filter: blur(16px);
    padding: clamp(18px, 4.6vw, 30px);
    position: relative;
    overflow: hidden;
  }

  .card::before {
    content: "";
    position: absolute;
    inset: -2px;
    background: radial-gradient(800px 220px at 20% 0%, rgba(102,227,255,0.14), transparent 55%),
                radial-gradient(700px 240px at 95% 35%, rgba(255,79,216,0.13), transparent 55%),
                radial-gradient(650px 250px at 40% 110%, rgba(255,211,110,0.11), transparent 55%);
    opacity: 1;
    pointer-events: none;
  }

  .floatIn {
    animation: pop 900ms cubic-bezier(.2, .9, .2, 1.0) both;
  }

  @keyframes pop {
    from { transform: translateY(10px) scale(0.98); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
  }

  .time {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: clamp(6px, 1.2vw, 12px);
    font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .hh, .mm {
    font-size: clamp(56px, 10vw, 112px);
    font-weight: 700;
  }

  .ss {
    font-size: clamp(22px, 3.6vw, 38px);
    font-weight: 700;
    color: rgba(255,255,255,0.70);
    transform: translateY(-10%);
  }

  .sep {
    font-size: clamp(40px, 7vw, 88px);
    font-weight: 600;
    color: rgba(255,255,255,0.72);
    transform: translateY(-2%);
  }

  .blink {
    animation: blink 1s steps(2, jump-none) infinite;
  }

  @keyframes blink {
    0%, 48% { opacity: 1; }
    52%, 100% { opacity: 0.25; }
  }

  .meter {
    position: relative;
    z-index: 1;
    margin-top: 18px;
    height: 10px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.06);
    overflow: hidden;
  }

  .meterBar {
    height: 100%;
    width: calc(var(--p) * 100%);
    background: linear-gradient(90deg, rgba(102,227,255,0.85), rgba(255,79,216,0.75), rgba(255,211,110,0.72));
    border-radius: 999px;
    box-shadow: 0 10px 25px rgba(102,227,255,0.15);
    transition: width 350ms cubic-bezier(.2, .8, .2, 1);
  }

  .footer {
    position: relative;
    z-index: 1;
    margin-top: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .hint {
    font-size: 13px;
    color: var(--muted2);
  }

  .chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .chip {
    font-size: 12px;
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(0,0,0,0.18);
    color: rgba(255,255,255,0.78);
  }

  .fineprint {
    margin: 14px 2px 0;
    color: rgba(255,255,255,0.52);
    font-size: 12px;
  }

  @media (max-width: 420px) {
    .badge { padding: 7px 10px; }
    .badgeText { letter-spacing: 0.18em; }
    .header { gap: 10px; }
    .greet { font-size: 16px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .orbA, .orbB, .orbC, .blink, .livePulse, .floatIn { animation: none !important; }
    .meterBar { transition: none; }
  }
`;
