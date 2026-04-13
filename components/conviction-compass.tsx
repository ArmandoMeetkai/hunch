"use client";

export function ConvictionCompass() {
  // Centered semicircle that fits cleanly in the tile
  const cx = 100;
  const cy = 95;
  const r = 80;

  // Sector angles (in radians, measured from left = π to right = 0)
  const sectors = [
    { startAngle: 0, endAngle: 0.25, fill: "var(--color-accent-signal)", opacity: 0.7 },    // Politics
    { startAngle: 0.25, endAngle: 0.5, fill: "var(--color-accent-ink)", opacity: 0.7 },      // Tech
    { startAngle: 0.5, endAngle: 0.78, fill: "var(--color-accent-cool)", opacity: 0.7 },     // Climate
    { startAngle: 0.78, endAngle: 1.0, fill: "var(--color-accent-highlight)", opacity: 1 },   // Culture
  ];

  function polarToCart(angle: number, radius: number) {
    const rad = Math.PI * (1 - angle); // map 0..1 to π..0 (left to right)
    return {
      x: cx + radius * Math.cos(rad),
      y: cy - radius * Math.sin(rad),
    };
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <svg viewBox="10 0 180 100" className="w-full max-w-[240px]">
        {/* Grid arcs */}
        {[80, 53, 26].map((rad) => (
          <path
            key={rad}
            d={`M ${cx - rad},${cy} A ${rad},${rad} 0 0,1 ${cx + rad},${cy}`}
            fill="none"
            stroke="var(--color-border-soft)"
            strokeWidth="0.8"
          />
        ))}

        {/* Sectors */}
        {sectors.map((s, i) => {
          const p1 = polarToCart(s.startAngle, r);
          const p2 = polarToCart(s.endAngle, r);
          const largeArc = s.endAngle - s.startAngle > 0.5 ? 1 : 0;
          return (
            <path
              key={i}
              d={`M ${cx},${cy} L ${p1.x},${p1.y} A ${r},${r} 0 ${largeArc},0 ${p2.x},${p2.y} Z`}
              fill={s.fill}
              opacity={s.opacity}
            />
          );
        })}

        {/* Baseline */}
        <line x1={cx - r - 5} y1={cy} x2={cx + r + 5} y2={cy} stroke="var(--color-border-soft)" strokeWidth="0.8" />
      </svg>
    </div>
  );
}
