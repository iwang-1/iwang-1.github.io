import type { ReactNode } from "react";

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
  return (
    <a
      href={href}
      className={classes}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
