"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export default function Logo({ size = "md", showTagline = false }: LogoProps) {
  const sizes = {
    sm: { arch: 48, title: 14, tag: 10 },
    md: { arch: 72, title: 20, tag: 12 },
    lg: { arch: 96, title: 28, tag: 14 },
  };
  const s = sizes[size];

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <svg
          width={s.arch * 2.2}
          height={s.arch * 1.4}
          viewBox="0 0 220 140"
          fill="none"
          aria-hidden
        >
          <path
            d="M20 130 L20 60 Q20 20 110 20 Q200 20 200 60 L200 130"
            stroke="#C9A227"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M30 130 L30 65 Q30 30 110 30 Q190 30 190 65 L190 130"
            stroke="#8B1A1A"
            strokeWidth="1.5"
            fill="none"
            opacity="0.5"
          />
          <circle cx="110" cy="18" r="6" fill="#8B1A1A" />
        </svg>
        <div
          style={{
            marginTop: -8,
            fontFamily: "var(--font-display)",
            fontSize: s.title,
            fontWeight: 700,
            color: "var(--burgundy)",
            letterSpacing: "0.15em",
          }}
        >
          TURK SARAYI
        </div>
        {showTagline && (
          <div
            style={{
              marginTop: 6,
              fontSize: s.tag,
              color: "var(--text-muted)",
              fontStyle: "italic",
            }}
          >
            Turkish &amp; Middle Eastern Cuisine
          </div>
        )}
      </div>
    </div>
  );
}
