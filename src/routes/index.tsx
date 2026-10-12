import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AstronautStage } from "@/components/astronaut-stage";
import { CosmicBackdrop } from "@/components/cosmic-backdrop";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        setProgress(p);
        document.documentElement.style.setProperty("--scroll", p.toFixed(4));
      });
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  const pct = Math.round(progress * 100);

  return (
    <main className="stage">
      <CosmicBackdrop />
      <AstronautStage />
      <header className="hud">
        <p className="eyebrow">Scroll linked</p>
        <h1>Astronaut</h1>
        <p className="lede">
          Scroll down and the suit crosses the sky, turning a full circle. Scroll back up and the
          spin reverses.
        </p>
        <div className="meter" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
        <p className="meter-label">{pct}%</p>
      </header>
      <div className="runway" />
    </main>
  );
}
