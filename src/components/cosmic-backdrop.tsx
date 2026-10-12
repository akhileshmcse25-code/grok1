const STARS = [
  { top: "8%", left: "12%", size: 2, delay: "0s" },
  { top: "14%", left: "42%", size: 3, delay: "0.4s" },
  { top: "22%", left: "78%", size: 2, delay: "1.1s" },
  { top: "31%", left: "18%", size: 2, delay: "0.2s" },
  { top: "28%", left: "63%", size: 4, delay: "1.6s" },
  { top: "46%", left: "8%", size: 2, delay: "0.8s" },
  { top: "52%", left: "88%", size: 3, delay: "0.3s" },
  { top: "61%", left: "34%", size: 2, delay: "1.4s" },
  { top: "70%", left: "72%", size: 3, delay: "0.6s" },
  { top: "78%", left: "16%", size: 2, delay: "1.8s" },
  { top: "84%", left: "54%", size: 2, delay: "0.9s" },
  { top: "18%", left: "91%", size: 2, delay: "1.2s" },
  { top: "40%", left: "48%", size: 2, delay: "0.5s" },
  { top: "66%", left: "92%", size: 2, delay: "1.5s" },
  { top: "90%", left: "28%", size: 3, delay: "0.1s" },
] as const;

export function CosmicBackdrop() {
  return (
    <div className="cosmic" aria-hidden="true">
      <div className="nebula nebula-a" />
      <div className="nebula nebula-b" />
      <div className="nebula nebula-c" />
      <div className="aurora" />
      <div className="grid-floor" />
      <svg className="constellation constellation-a" viewBox="0 0 100 100">
        <polygon points="50,6 94,78 6,78" />
        <polygon points="50,94 6,22 94,22" />
      </svg>
      <svg className="constellation constellation-b" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" />
        <circle cx="50" cy="50" r="30" />
        <circle cx="50" cy="50" r="14" />
      </svg>
      {STARS.map((star) => (
        <span
          key={`${star.top}-${star.left}`}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
          }}
        />
      ))}
      <div className="vignette" />
    </div>
  );
}
