import type { ReactNode } from "react";

/** Screen-reader-only note for target="_blank" links (WCAG G201): the
 *  context change gets announced instead of happening silently. */
function NewTabNote() {
  return <span className="visually-hidden"> (opens in new tab)</span>;
}

/** Keycap — interactive elements ONLY (nav tabs, CTA buttons, footer link
 *  buttons). `primary` renders the single accent-filled cap per page. */
export function Keycap({
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
  const classes = ["keycap", variant === "primary" ? "keycap-primary" : "", className ?? ""]
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
 *  screen-reader announcement as an external Keycap. */
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
