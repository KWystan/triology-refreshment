/**
 * Section — generic wrapper with consistent padding and optional background.
 *
 * Props:
 *   background — CSS background value
 *   id         — optional section ID for anchor links
 *   className  — additional classes
 *   children   — content
 *   nested     — if true, skip container wrapper (for full-bleed sections)
 */
export default function Section({
  background,
  id,
  className = '',
  children,
  nested = false,
}) {
  return (
    <section
      id={id}
      className={className}
      style={{
        ...(background ? { background } : {}),
      }}
    >
      {nested ? (
        children
      ) : (
        <div className="container section-padding">{children}</div>
      )}
    </section>
  );
}
