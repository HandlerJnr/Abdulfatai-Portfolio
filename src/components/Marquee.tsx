type Props = {
  items: string[];
  className?: string;
  duration?: number;
  reverse?: boolean;
  separator?: string;
  ariaLabel?: string;
};

/**
 * Infinite horizontal text band. Track is duplicated so translateX(-50%)
 * loops seamlessly. Pauses on hover; disabled under reduced motion (CSS).
 */
export function Marquee({
  items,
  className = "",
  duration = 40,
  reverse = false,
  separator = "✹",
  ariaLabel,
}: Props) {
  const sequence = [...items, ...items];
  return (
    <div
      className={`marquee ${reverse ? "marquee--reverse" : ""} ${className}`}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
      aria-label={ariaLabel ?? items.join(" — ")}
      role="marquee"
    >
      <div className="marquee__track" aria-hidden="true">
        {sequence.map((text, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="px-[0.4em]">{text}</span>
            <span className="px-[0.4em] text-accent">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
