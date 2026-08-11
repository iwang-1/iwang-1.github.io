/** AxisRule. */
export function AxisRule({ className }: { className?: string }) {
  return (
    <div className={className ? `axis-rule ${className}` : "axis-rule"} aria-hidden="true" />
  );
}
