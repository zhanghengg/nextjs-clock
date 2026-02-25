import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);

      const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setDate(dateStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>Real-time Clock</title>
        <meta name="description" content="A beautiful real-time clock" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          .fade-in {
            animation: fadeIn 1s ease-out;
          }
          .pulse-dot {
            animation: pulse 1s ease-in-out infinite;
          }
        `}</style>
      </Head>
      <main style={styles.main}>
        <div style={styles.container}>
          <h1 style={styles.title}>Real-time Clock</h1>
          <div style={styles.clockCard}>
            <div style={styles.timeDisplay}>{time || '--:--:--'}</div>
            <div style={styles.dateDisplay}>{date || 'Loading...'}</div>
            <div style={styles.dotContainer}>
              <span style={{ ...styles.dot, ...styles.dot1 }} />
              <span style={{ ...styles.dot, ...styles.dot2 }} />
              <span style={{ ...styles.dot, ...styles.dot3 }} />
            </div>
          </div>
          <p style={styles.footer}>Updates every second</p>
        </div>
      </main>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: `
      linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)`,
    backgroundSize: '400% 400%',
    animation: 'gradient 15s ease infinite',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    color: '#fff',
    marginBottom: '2rem',
    textShadow: '0 4px 15px rgba(0,0,0,0.3)',
    fontWeight: 700,
  },
  clockCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: '30px',
    padding: '3rem 4rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    maxWidth: '500px',
    margin: '0 auto',
  },
  timeDisplay: {
    fontSize: '5rem',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.1em',
    fontFamily: "'Courier New', monospace",
    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
    marginBottom: '1rem',
  },
  dateDisplay: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '1.5rem',
    fontWeight: 500,
  },
  dotContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.8)',
    display: 'inline-block',
  },
  dot1: {
    animation: 'pulse 1s ease-in-out infinite',
  },
  dot2: {
    animation: 'pulse 1s ease-in-out 0.2s infinite',
  },
  dot3: {
    animation: 'pulse 1s ease-in-out 0.4s infinite',
  },
  footer: {
    marginTop: '2rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.95rem',
    fontStyle: 'italic',
  },
};
