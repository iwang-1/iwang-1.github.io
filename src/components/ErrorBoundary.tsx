import { Component, type ErrorInfo, type ReactNode } from "react";
import { errorFallback } from "../content";
import { markMountFailed } from "../js-flag";

/** The static snapshot. */
const staticMarkup =
  typeof document === "undefined"
    ? ""
    : (document.getElementById("root")?.innerHTML ?? "");

/** ErrorBoundary. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Strip the root `.js` class in the same commit as the fallback.
    markMountFailed();
    document.getElementById("root")?.setAttribute("data-static-fallback", "");
    console.error("Page mount failed — serving the prerendered static page.", error, info);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    if (staticMarkup)
      return (
        <div className="static-fallback" dangerouslySetInnerHTML={{ __html: staticMarkup }} />
      );
    // No snapshot to restore.
    return (
      <main id="main">
        <div className="not-found container">
          <h1>{errorFallback.heading}</h1>
          <p>{errorFallback.body}</p>
          <div className="cta-row">
            {errorFallback.links.map((l) => (
              <a key={l.href} className="btn" href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </main>
    );
  }
}
