import { Component, type ErrorInfo, type ReactNode } from "react";
import { errorFallback } from "../content";
import { markMountFailed } from "../js-flag";

/** THE STATIC SNAPSHOT — read at module evaluation, which is necessarily before
 *  the page entry's `createRoot(...).render(...)` (ES imports are evaluated
 *  before the importing module's body), and that ordering is the whole trick.
 *
 *  React 18's `createRoot` REPLACES the container's existing children on its
 *  first commit, so by the time an error boundary catches anything the
 *  prerendered markup is already gone — measured before this landed: a throw in
 *  one child of the Experience tree left `#root` at 0 children, 0 characters and
 *  0 visible elements, a blank white-on-near-black page, with the `.js` class
 *  still on. Reading the markup here, once, keeps the only copy of it.
 *
 *  It is a READ, not a mutation, so unlike `enableJs()` it is safe as an import
 *  side effect; and the class below references it, so no bundler can drop it. */
const staticMarkup =
  typeof document === "undefined"
    ? ""
    : (document.getElementById("root")?.innerHTML ?? "");

/** ErrorBoundary — wraps each page root. Its job is NOT to apologise; it is to
 *  put the document back into the configuration the prerendered HTML was built
 *  to be read in.
 *
 *  This site already ships a complete static render of every page (see
 *  scripts/prerender.mjs, which FAILS the build if a page renders no main or
 *  footer) and PRODUCT.md requires the no-JS page to carry everything that
 *  constitutes proof. So the correct fallback for a broken interactive layer is
 *  the no-JS page, not a message where the evidence used to be: a recruiter with
 *  ten seconds gets the whole timeline, every plate, the annotated figure and the
 *  contact band, all of which are real markup and none of which needed React.
 *  What is lost is the crosshair's pointer tracking, the copy-email receipt and
 *  the reveal fade — the three things the design system already documents as
 *  enhancements over a complete page.
 *
 *  Deliberately NO visible banner. The reader is looking at the finished page;
 *  telling them a layer they cannot see failed would report a defect that has no
 *  user-facing consequence and no action they can take. The failure is announced
 *  where it can be acted on — `console.error`, plus a `data-static-fallback`
 *  attribute on the container for a test to assert.
 *
 *  Three properties make this fallback unable to fail in turn:
 *   - it renders no component, so an error inside a shared component (Nav, a
 *     card, LabelButton) cannot re-throw from the fallback and unmount the tree;
 *   - the markup is React-owned via `dangerouslySetInnerHTML`, so there is no
 *     imperative write racing React's commit and no frame that paints empty;
 *   - `innerHTML` never executes `<script>` per the HTML spec, and the string is
 *     this document's own prerendered output regardless.
 *
 *  The wrapper is `display: contents` (see `.static-fallback` in index.css) so
 *  the restored `<main>` stays a flex item of `#root` and the footer keeps
 *  pinning on short pages. That rule ships with a paired
 *  `#root > .static-fallback > main` declaration, because a `>` selector is
 *  structural and `display: contents` does not make the wrapper disappear from
 *  it. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Strip the root `.js` class in the same commit as the fallback. Without it
    // `.js .reveal { opacity: 0 }` stays armed over restored markup that has no
    // useReveal hook left to add `.is-in` — an intact page, hidden, which is the
    // one failure mode that reads as a deliberately empty page. See js-flag.ts.
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
    // No snapshot to restore — the dev server (`npm run dev`) has no prerendered
    // markup, and every built page is asserted to have some. Plain anchors on the
    // shared `btn` class rather than <LabelButton>, so this branch depends on no
    // component either. `.not-found` is reused because it is exactly this object:
    // a page that cannot show what was asked for, plus the routes out of it.
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
