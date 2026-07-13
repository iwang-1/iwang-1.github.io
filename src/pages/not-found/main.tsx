import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
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
          <h1>That page isn&rsquo;t on the bench.</h1>
          <p>The link you followed doesn&rsquo;t exist — here&rsquo;s everything that does:</p>
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
