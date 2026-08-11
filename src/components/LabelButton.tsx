import { useEffect, useState, type ReactNode } from "react";

/** Screen-reader-only note for target="_blank" links (WCAG G201): the
 *  context change gets announced instead of happening silently. */
function NewTabNote() {
  return <span className="visually-hidden"> (opens in new tab)</span>;
}

/** LabelButton. */
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

/** CopyEmailButton. */
export function CopyEmailButton({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  // Both outcomes are transient: each reads as a receipt, not as a new label. "Copy blocked" used to be
  // terminal (the guard returned early on anything but "copied"), so one denied clipboard permission renamed the.
  useEffect(() => {
    if (state === "idle") return;
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
      {/* The pointer cursor lives on `button.btn` in index.css — the primitive is shared with anchors, which
         are pointer-cursor by UA default, and a <button> is not. */}
      <button type="button" className="btn btn-copy-email" onClick={copy}>
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
