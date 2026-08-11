import type { CSSProperties, ReactNode } from "react";

/** Plate. */
export function Plate({
  label,
  footnote,
  className,
  id,
  stripStyle,
  children,
}: {
  label?: string;
  footnote?: ReactNode;
  className?: string;
  id?: string;
  stripStyle?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className={className ? `plate ${className}` : "plate"} id={id}>
      {label && (
        <p className="plate-label" style={stripStyle}>
          {label}
        </p>
      )}
      {children}
      {footnote && (
        <p className="plate-footnote" style={stripStyle}>
          {footnote}
        </p>
      )}
    </div>
  );
}
