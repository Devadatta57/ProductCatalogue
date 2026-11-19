const paths = {
  book: (
    <>
      <path d="M2 5.5C2 4.7 2.7 4 3.5 4H9c1.7 0 3 1.3 3 3v13c0-1.1-.9-2-2-2H3.5c-.8 0-1.5-.7-1.5-1.5v-11z" />
      <path d="M22 5.5c0-.8-.7-1.5-1.5-1.5H15c-1.7 0-3 1.3-3 3v13c0-1.1.9-2 2-2h6.5c.8 0 1.5-.7 1.5-1.5v-11z" />
    </>
  ),
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  download: <path d="M12 3v12M7 10l5 5 5-5M4 16v4h16v-4" />,

  /* ---- Explorer toolbar ---- */
  // Product families: stacked layers (the old box + down-arrow read as "download")
  sheets: (
    <>
      <path d="M12 3 3 7.5 12 12l9-4.5z" />
      <path d="m3 12 9 4.5 9-4.5" />
      <path d="m3 16.5 9 4.5 9-4.5" />
    </>
  ),
  productIndex: (
    <>
      <path d="M11.5 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5.5" />
      <path d="M17.6 3.4a2 2 0 0 1 2.9 2.9l-7.4 7.4-3.6.9.9-3.6z" />
    </>
  ),
  compare: <path d="M8 3.5 4 7.5l4 4M4 7.5h12M16 12.5l4 4-4 4M20 16.5H8" />,

  /* ---- Sheet viewer ---- */
  close: <path d="M6 6l12 12M18 6 6 18" />,
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  fit: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  copy: (
    <>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2.5" />
      <path d="M15.5 8.5V6a2.5 2.5 0 0 0-2.5-2.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5" />
    </>
  ),
  panel: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <path d="M14.5 4.5v15M17 8.5h0M17 11.5h0" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  linkOut: <path d="M14 4h6v6M20 4l-9 9M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h0" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  send: <path d="M21 3 10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5z" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  sort: <path d="M7 4v16M3.5 16.5 7 20l3.5-3.5M17 20V4M13.5 7.5 17 4l3.5 3.5" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
    </>
  ),
  grid: (
    <g fill="currentColor" stroke="none">
      <rect x="3" y="3" width="5" height="5" rx="1" />
      <rect x="9.5" y="3" width="5" height="5" rx="1" />
      <rect x="16" y="3" width="5" height="5" rx="1" />
      <rect x="3" y="9.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <rect x="16" y="9.5" width="5" height="5" rx="1" />
      <rect x="3" y="16" width="5" height="5" rx="1" />
      <rect x="9.5" y="16" width="5" height="5" rx="1" />
      <rect x="16" y="16" width="5" height="5" rx="1" />
    </g>
  ),
  table: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3.5H3z" fill="currentColor" stroke="none" />
      <path d="M3 14.75h18M9 9.5V20M15 9.5V20" />
    </>
  ),

  /* ---- Product groups (solid glyphs) ---- */
  allGroups: (
    <g fill="currentColor" stroke="none">
      <circle cx="12" cy="6.5" r="3" />
      <circle cx="5.2" cy="9.8" r="2.4" />
      <circle cx="18.8" cy="9.8" r="2.4" />
      <path d="M6.5 20a5.5 5.5 0 0 1 11 0z" />
      <path d="M1.2 17.8a4 4 0 0 1 6.4-3.4 7.4 7.4 0 0 0-2.3 3.4z" />
      <path d="M22.8 17.8a4 4 0 0 0-6.4-3.4 7.4 7.4 0 0 1 2.3 3.4z" />
    </g>
  ),
  fish: (
    <path
      fill="currentColor"
      stroke="none"
      fillRule="evenodd"
      d="M2 12c2.6-3.9 6.4-6 10.4-6 2.9 0 5.1 1.2 6.8 3.1L22.5 6v12l-3.3-3.1C17.5 16.8 15.3 18 12.4 18 8.4 18 4.6 15.9 2 12zm5.6-1.5a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2z"
    />
  ),
  leaf: (
    <path
      fill="currentColor"
      stroke="none"
      d="M20.5 3.5C11 3.5 4.5 8.5 4.5 15.5c0 1.6.4 3 1 4.1C7 13.7 10.5 10 15 8c-3.8 2.6-6.6 6.3-8 11.4 1.2.8 2.7 1.1 4.2 1.1 7.5 0 9.3-8.3 9.3-17z"
    />
  ),
  apple: (
    <g fill="currentColor" stroke="none">
      <path d="M12 7.6c1.3-1.1 3-1.6 4.6-1.2 2.8.7 4.2 3.6 3.6 7.1-.7 4-3.3 8.1-6.1 8.1-.9 0-1.3-.4-2.1-.4s-1.2.4-2.1.4c-2.8 0-5.4-4.1-6.1-8.1-.6-3.5.8-6.4 3.6-7.1 1.6-.4 3.3.1 4.6 1.2z" />
      <path d="M12.4 5.8c.2-2 1.6-3.5 3.6-3.8-.1 2-1.6 3.6-3.6 3.8z" />
    </g>
  ),
  chili: (
    <>
      <path
        fill="currentColor"
        stroke="none"
        d="M17.2 7.4c1.6 1 2.2 3 1.4 5.2-1.6 4.6-7.4 8.5-14.1 8.9-.6 0-.8-.7-.3-1 4.3-2.2 7.2-5.6 8.6-9.7.8-2.4 2.6-4.2 4.4-3.4z"
      />
      <path d="M16.6 7.4c0-1.7.8-3.1 2.4-3.9" />
    </>
  ),
  wheat: (
    <>
      <path d="M12 21.5V6.5" />
      <g fill="currentColor" stroke="none">
        <ellipse cx="12" cy="4.2" rx="1.6" ry="2.5" />
        <ellipse cx="9.2" cy="8.8" rx="1.5" ry="2.6" transform="rotate(-38 9.2 8.8)" />
        <ellipse cx="14.8" cy="8.8" rx="1.5" ry="2.6" transform="rotate(38 14.8 8.8)" />
        <ellipse cx="9.2" cy="12.8" rx="1.5" ry="2.6" transform="rotate(-38 9.2 12.8)" />
        <ellipse cx="14.8" cy="12.8" rx="1.5" ry="2.6" transform="rotate(38 14.8 12.8)" />
        <ellipse cx="9.2" cy="16.8" rx="1.5" ry="2.6" transform="rotate(-38 9.2 16.8)" />
        <ellipse cx="14.8" cy="16.8" rx="1.5" ry="2.6" transform="rotate(38 14.8 16.8)" />
      </g>
    </>
  ),
  drop: (
    <path fill="currentColor" stroke="none" d="M12 2.8s-6.3 7-6.3 11.4a6.3 6.3 0 0 0 12.6 0C18.3 9.8 12 2.8 12 2.8z" />
  ),
  sprout: (
    <>
      <path d="M12 21.5V12" strokeWidth="2.4" />
      <g fill="currentColor" stroke="none">
        <path d="M12 13.2C12 8.5 8.8 5.8 3.5 5.8c0 4.7 3.2 7.4 8.5 7.4z" />
        <path d="M12 11.2c0-4.2 2.9-6.9 8.5-6.9 0 4.2-2.9 6.9-8.5 6.9z" />
      </g>
    </>
  ),
  medical: (
    <path
      fill="currentColor"
      stroke="none"
      d="M9.5 3h5a1 1 0 0 1 1 1v4.5H20a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-4.5V20a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-4.5H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h4.5V4a1 1 0 0 1 1-1z"
    />
  ),
  cup: (
    <>
      <path fill="currentColor" stroke="none" d="M3.5 8.5h13v6A5.5 5.5 0 0 1 11 20H9a5.5 5.5 0 0 1-5.5-5.5z" />
      <path d="M16.5 10.5h1.2a2.6 2.6 0 0 1 0 5.2h-1.4M8 3v2.5M12 3v2.5" />
    </>
  ),
  flower: (
    <g fill="currentColor" stroke="none">
      <circle cx="12" cy="6.2" r="3.3" />
      <circle cx="17.6" cy="10.3" r="3.3" />
      <circle cx="15.5" cy="16.8" r="3.3" />
      <circle cx="8.5" cy="16.8" r="3.3" />
      <circle cx="6.4" cy="10.3" r="3.3" />
      <circle cx="12" cy="12" r="3" />
    </g>
  ),
};

export default function Icon({ name, size = 18, strokeWidth = 2, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
