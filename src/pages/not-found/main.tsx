import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../js-flag";
import "../../enhance";
import "../../index.css";
import { person } from "../../content";
import { Footer } from "../../components/Footer";
import { Keycap } from "../../components/Keycap";
import { Nav } from "../../components/Nav";

function NotFound() {
  return (
    <>
      <Nav active={null} />
      <main id="main">
        <div className="not-found container">
          {/* Neutral copy: the site allows ONE keyboard/climbing metaphor,
              and the hero headline already spends it. */}
          <h1>That page doesn&rsquo;t exist.</h1>
          <p>The link you followed goes nowhere — here&rsquo;s everything that does:</p>
          <div className="cta-row">
            <Keycap href="/">Home</Keycap>
            <Keycap href="/experience/">Experience</Keycap>
            <Keycap href="/projects/">Projects</Keycap>
            <Keycap href={person.resumeUrl} external>
              Résumé (PDF)
            </Keycap>
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
