import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../js-flag";
import "../../enhance";
import "../../index.css";
import { Footer } from "../../components/Footer";
import { LabelButton } from "../../components/LabelButton";
import { Nav } from "../../components/Nav";

/** The 404 as an empty figure: drawn axes with nothing plotted, because there
 *  is no data for this path. The one climbing-flavored line is earned — the
 *  topo on the homepage is the site's FIG. 00. */
function NotFound() {
  return (
    <>
      <Nav active={null} />
      <main id="main">
        <div className="not-found container">
          <figure className="plate not-found-plate" aria-hidden="true">
            <p className="plate-label">FIG. 404 · this page</p>
            <svg className="not-found-axes" viewBox="0 0 320 180" role="presentation" focusable="false">
              <path className="nf-axis" d="M 36 12 L 36 150 L 306 150" />
              <path className="nf-tick" d="M 32 40 L 36 40" />
              <path className="nf-tick" d="M 32 76 L 36 76" />
              <path className="nf-tick" d="M 32 112 L 36 112" />
              <path className="nf-tick" d="M 96 150 L 96 154" />
              <path className="nf-tick" d="M 156 150 L 156 154" />
              <path className="nf-tick" d="M 216 150 L 216 154" />
              <path className="nf-tick" d="M 276 150 L 276 154" />
              <text className="nf-note" x="171" y="84" textAnchor="middle">
                no data for this path
              </text>
            </svg>
            <figcaption className="plate-footnote">0 samples · 404</figcaption>
          </figure>
          <h1>That page doesn&rsquo;t exist.</h1>
          <p>Off route. The holds that go somewhere:</p>
          <div className="cta-row">
            <LabelButton href="/">Home</LabelButton>
            <LabelButton href="/experience/">Experience</LabelButton>
            <LabelButton href="/projects/">Projects</LabelButton>
            <LabelButton href="/#contact">Contact</LabelButton>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NotFound />
  </StrictMode>,
);
