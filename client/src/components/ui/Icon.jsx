/**
 * Material Symbols icon wrapper.
 * Maps to Google's Material Symbols Outlined variable font.
 *
 * Props:
 *   name       — icon name (e.g. 'menu', 'close')
 *   size       — font size in px (default 24)
 *   fill       — icon fill weight (0 = outlined, 1 = filled)
 *   weight     — stroke weight (100–700)
 *   grade      - grade (-25 to 200)
 *   className  — additional classes
 *   ariaLabel  — accessibility label (falls back to icon name)
 */

export default function Icon({
  name,
  size = 24,
  fill = 0,
  weight = 400,
  grade = 0,
  className = '',
  ariaLabel,
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`.trim()}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}`,
      }}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel || undefined}
      role={ariaLabel ? 'img' : undefined}
    >
      {name}
    </span>
  );
}
