export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 60"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="INVERTA"
    >
      {/* Hex cube icon */}
      <g transform="translate(4, 4)">
        <path
          d="M0 12 L0 32 L16 42 L32 32 L32 12 L16 2 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M0 12 L16 22 L32 12 M16 22 L16 42"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>
      {/* Wordmark INVERTA */}
      <text
        x="46"
        y="38"
        fontFamily="var(--font-display)"
        fontSize="26"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        INVERTA
      </text>
      <circle cx="186" cy="36" r="3" fill="#D4FF00" />
    </svg>
  );
}
