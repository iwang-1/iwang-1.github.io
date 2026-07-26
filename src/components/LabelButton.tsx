import { useEffect, useState, type ReactNode } from "react";

/** Screen-reader-only note for target="_blank" links (WCAG G201): the
 *  context change gets announced instead of happening silently. */
function NewTabNote() {
  return <span className="visually-hidden"> (opens in new tab)</span>;
}

/** LabelButton — the figure world's one interactive primitive: a flat plate
 *  with a hairline border and a set label. Nav tabs, CTA buttons, footer
 *  links. `primary` renders the single amber-filled button per page, and its
 *  label is --ground, never --ink (--ink on amber is 1.98:1).
 *
 *  The API is deliberately identical to the primitive it replaces, so the old
 *  module can re-export this as a drop-in while the pages switch over. */
export function LabelButton({
  href,
  variant = "default",
  external = false,
  ariaLabel,
  className,
  children,
}: {
  href: string;
  variant?: "default" | "primary";
  external?: boolean;
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
}) {
  const classes = ["btn", variant === "primary" ? "btn-primary" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
  // When an aria-label is set it overrides the content, so the new-tab note
  // is appended to the label text instead of rendered as a hidden span.
  const label = ariaLabel && external ? `${ariaLabel} (opens in new tab)` : ariaLabel;
  return (
    <a
      href={href}
      className={classes}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {external && !ariaLabel && <NewTabNote />}
    </a>
  );
}

/** ExternalLink — plain text anchor that opens in a new tab, with the same
 *  screen-reader announcement as an external LabelButton. */
export function ExternalLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
      <NewTabNote />
    </a>
  );
}

/** CopyEmailButton — one click puts the address on the clipboard, because the
 *  measured contact friction was a recruiter selecting 22 characters of mono
 *  text by hand.
 *
 *  No dependency: navigator.clipboard, one piece of state, one live region.
 *  The address itself always renders beside this button, so a blocked Clipboard
 *  API degrades to "read it and type it" rather than to a dead end — which is
 *  why the failure label points at the text instead of apologising.
 *
 *  Known limitation, stated rather than papered over: the pages are prerendered
 *  by a real browser, so this button is in the static HTML and is inert until the
 *  bundle lands. Gating it on mount was tried and does nothing — the prerenderer
 *  runs the effect too — and the honest mitigation is the one already in place:
 *  the mailto button and the address itself sit beside it, so the channel never
 *  depends on this control. Removing the affordance without JS needs a
 *  `.js`-scoped display rule in the stylesheet. */
export function CopyEmailButton({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  // The confirmation is transient: it reads as a receipt, not as a new label.
  useEffect(() => {
    if (state !== "copied") return;
    const t = window.setTimeout(() => setState("idle"), 2400);
    return () => window.clearTimeout(t);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn"
        onClick={copy}
        /* The primitive is shared with anchors, which are already pointer-cursor
           by default; a <button> is not. */
        style={{ cursor: "pointer" }}
      >
        {state === "copied" ? "Copied" : state === "failed" ? "Copy blocked" : "Copy email"}
      </button>
      {/* Live region, always present in the DOM so the announcement is an
          update to existing content rather than an insertion. */}
      <span className="visually-hidden" aria-live="polite">
        {state === "copied"
          ? `${email} copied to clipboard`
          : state === "failed"
            ? `Clipboard unavailable. The address is ${email}`
            : ""}
      </span>
    </>
  );
}
