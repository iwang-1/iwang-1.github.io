import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { featuredSystems, projects } from "../content";
import { SystemFeature } from "./SystemFeature";

/** How long each project stays up before the switcher moves on, while nobody has touched it. */
const DWELL_MS = 7000;

/**
 * The featured projects as a row of keycaps. Press a key and that project swaps in, so a reader sees every
 * project without scrolling. Without JavaScript (the prerendered page) every project renders stacked and no
 * keys are drawn. While untouched it advances on its own every DWELL_MS; hover or focus pauses it, any key
 * press stops it for good, and it never moves on its own for a reader who asks for reduced motion.
 */
export function ProjectSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const keys = useRef<(HTMLButtonElement | null)[]>([]);
  const n = featuredSystems.length;

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) setStopped(true);
  }, []);

  useEffect(() => {
    if (!mounted || paused || stopped) return;
    const t = window.setTimeout(() => {
      if (!document.hidden) setActive((a) => (a + 1) % n);
      else setActive((a) => a); // re-arm the timer while the tab is in the background
    }, DWELL_MS);
    return () => window.clearTimeout(t);
  }, [mounted, paused, stopped, active, n]);

  const choose = useCallback((i: number, focus = false) => {
    setStopped(true);
    setActive(i);
    if (focus) keys.current[i]?.focus();
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (step) {
      e.preventDefault();
      choose((active + step + n) % n, true);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      choose(e.key === "Home" ? 0 : n - 1, true);
    }
  };

  const running = mounted && !paused && !stopped;

  return (
    <div
      className={mounted ? "switcher switcher--live" : "switcher"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {mounted && (
        <div className="switcher-keys" role="tablist" aria-label="Featured projects" onKeyDown={onKeyDown}>
          {featuredSystems.map((p, i) => (
            <button
              key={p.id}
              ref={(el) => {
                keys.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`switch-${p.id}`}
              aria-selected={i === active}
              aria-controls={`panel-${p.id}`}
              tabIndex={i === active ? 0 : -1}
              className={i === active ? "switch-key is-down" : "switch-key"}
              onClick={() => choose(i)}
            >
              <span className="switch-key-title">{p.title}</span>
              <span className="switch-key-sub">{p.eyebrow}</span>
              {i === active && running && <span className="switch-key-timer" style={{ animationDuration: `${DWELL_MS}ms` }} aria-hidden="true" />}
            </button>
          ))}
          <a className="switch-key switch-key--more" href="/projects/#selected">
            <span className="switch-key-title">+{projects.length} more</span>
            <span className="switch-key-sub">every project</span>
          </a>
        </div>
      )}
      <div className="system-list">
        {featuredSystems.map((project, i) => (
          <div
            key={project.id}
            className="switcher-panel"
            id={`panel-${project.id}`}
            role={mounted ? "tabpanel" : undefined}
            aria-labelledby={mounted ? `switch-${project.id}` : undefined}
            hidden={mounted && i !== active}
          >
            <SystemFeature project={project} index={i} variant="preview" reveal={!mounted} />
          </div>
        ))}
      </div>
    </div>
  );
}
