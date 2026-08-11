import type { CSSProperties, ElementType, ReactNode, Ref } from "react";
import { useReveal } from "../hooks/useReveal";

/** Reveal. */
export function Reveal({
  as,
  delay = 0,
  className,
  style,
  children,
}: {
  as?: ElementType;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const Tag = as ?? "div";
  const ref = useReveal<HTMLElement>();
  return (
    <Tag
      ref={ref as Ref<never>}
      className={className ? `reveal ${className}` : "reveal"}
      style={
        {
          "--reveal-delay": `${Math.min(delay ?? 0, 5) * 60}ms`,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
