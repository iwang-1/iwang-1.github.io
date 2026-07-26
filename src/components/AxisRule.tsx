/** AxisRule — a 1px rule carrying four ticks: the only decorative line on the
 *  site, and the thing that opens a section the way an axis opens a plot. It
 *  replaces the page-head tile texture and the clipped ghost bar, both of which
 *  were decoration that meant nothing.
 *
 *  The ticks come from the CSS (a repeating hairline at the quarter marks), so
 *  this is markup with no content: aria-hidden, and never a heading's
 *  substitute. */
export function AxisRule({ className }: { className?: string }) {
  return (
    <div className={className ? `axis-rule ${className}` : "axis-rule"} aria-hidden="true" />
  );
}
