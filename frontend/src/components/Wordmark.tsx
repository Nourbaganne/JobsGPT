/**
 * Lynceus wordmark — x-ray split.
 *
 * `lyn` is solid, `ceus` is outline only. Lynceus was the Argonauts' lookout,
 * the one who could see through walls; the mark says that rather than
 * illustrating it.
 *
 * Styling lives in globals.css under `.wordmark` so the stroke has a
 * `@supports` fallback. Colour is inherited — set `text-ink`, `text-muted` or
 * anything else on the caller. Size with a font-size utility.
 */
export default function Wordmark({
  className = "",
  as: Tag = "span",
}: {
  className?: string;
  /** Render as a heading when the mark is the page's title. */
  as?: "span" | "h1";
}) {
  return (
    <Tag className={`wordmark ${className}`.trim()}>
      {/* aria-hidden on the halves + a single accessible name on the wrapper:
          otherwise a screen reader announces "lyn" and "ceus" separately. */}
      <span aria-hidden="true" className="wordmark__solid">
        lyn
      </span>
      <span aria-hidden="true" className="wordmark__ghost">
        ceus
      </span>
      <span className="sr-only">Lynceus</span>
    </Tag>
  );
}
