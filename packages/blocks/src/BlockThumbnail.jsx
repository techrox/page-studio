// SVG layout sketches for each block, shown in Puck's components panel.
// Each preview is a stylised mini-diagram of the block's visual structure,
// not a real render — fast, no AntD dependency, looks consistent across the
// picker. The thumbnail viewBox is fixed so all blocks line up at the same
// size in the picker.
//
// PRIMARY / PRIMARY_SOFT / ACCENT come from the active brand at render
// time (we read --tps-primary etc. off the nearest ancestor with a
// [data-brand] attribute, or :root otherwise). The thumbnails follow the
// rest of the UI when the host swaps brands.

import { useState, useEffect } from 'react';

const BG = '#F8FAFC';
const BORDER = '#E2E8F0';
const TEXT = '#0F172A';
const MUTED = '#94A3B8';

const DEFAULT_BRAND_COLORS = {
  PRIMARY: '#0F766E',
  PRIMARY_SOFT: '#CCFBF1',
  ACCENT: '#F59E0B',
};

function readBrandColors() {
  if (typeof window === 'undefined') return DEFAULT_BRAND_COLORS;
  const root =
    document.querySelector('[data-brand]') || document.documentElement;
  const style = getComputedStyle(root);
  const get = (name, fallback) =>
    style.getPropertyValue(name).trim() || fallback;
  return {
    PRIMARY: get('--tps-primary', DEFAULT_BRAND_COLORS.PRIMARY),
    PRIMARY_SOFT: get('--tps-primary-soft', DEFAULT_BRAND_COLORS.PRIMARY_SOFT),
    ACCENT: get('--tps-accent', DEFAULT_BRAND_COLORS.ACCENT),
  };
}

// Refresh when the [data-brand] attribute on the nearest ancestor flips —
// the showcase / host toggles it when the user picks a new brand, so the
// picker thumbnails need to follow.
function useBrandColors() {
  const [colors, setColors] = useState(DEFAULT_BRAND_COLORS);
  useEffect(() => {
    setColors(readBrandColors());
    if (typeof window === 'undefined') return;
    const target =
      document.querySelector('[data-brand]') || document.documentElement;
    const observer = new MutationObserver(() => setColors(readBrandColors()));
    observer.observe(target, {
      attributes: true,
      attributeFilter: ['data-brand', 'style', 'class'],
    });
    return () => observer.disconnect();
  }, []);
  return colors;
}

const FRAME_W = 120;
const FRAME_H = 70;

function Frame({ children, soft = false }) {
  return (
    <svg
      viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', borderRadius: 4 }}
    >
      <rect
        x="0.5"
        y="0.5"
        width={FRAME_W - 1}
        height={FRAME_H - 1}
        rx="3"
        fill={soft ? '#F1F5F9' : BG}
        stroke={BORDER}
        strokeWidth="1"
      />
      {children}
    </svg>
  );
}

// PREVIEWS is a function so the brand-dependent colors (PRIMARY,
// PRIMARY_SOFT, ACCENT) can be passed in fresh on every render. The
// destructure makes the JSX below identical to the static form — no
// further per-element changes needed.
function getPreviews(c) {
  const { PRIMARY, PRIMARY_SOFT, ACCENT } = c;
  return {
  Hero: (
    <Frame>
      <rect x="14" y="14" width="20" height="3" rx="1" fill={PRIMARY} opacity="0.7" />
      <rect x="14" y="22" width="92" height="6" rx="1.5" fill={TEXT} />
      <rect x="14" y="32" width="80" height="3" rx="1" fill={MUTED} />
      <rect x="14" y="38" width="60" height="3" rx="1" fill={MUTED} />
      <rect x="14" y="50" width="32" height="9" rx="2" fill={PRIMARY} />
      <rect x="50" y="50" width="32" height="9" rx="2" fill="none" stroke={TEXT} strokeWidth="0.8" />
    </Frame>
  ),
  SectionHeader: (
    <Frame>
      <rect x="14" y="22" width="18" height="3" rx="1" fill={PRIMARY} opacity="0.7" />
      <rect x="14" y="30" width="78" height="6" rx="1.5" fill={TEXT} />
      <rect x="14" y="42" width="64" height="3" rx="1" fill={MUTED} />
    </Frame>
  ),
  StatsStrip: (
    <Frame soft>
      {[14, 38, 62, 86].map((x, i) => (
        <g key={i}>
          <rect x={x} y="22" width="20" height="6" rx="1.5" fill={PRIMARY} opacity="0.85" />
          <rect x={x + 2} y="32" width="16" height="3" rx="1" fill={MUTED} />
        </g>
      ))}
    </Frame>
  ),
  RichText: (
    <Frame>
      {[14, 21, 28, 35, 42, 49, 56].map((y, i) => (
        <rect
          key={i}
          x="14"
          y={y}
          width={i % 3 === 2 ? 64 : 92}
          height="2"
          rx="1"
          fill={i === 0 || i === 4 ? TEXT : MUTED}
          opacity={i === 0 || i === 4 ? 1 : 0.6}
        />
      ))}
    </Frame>
  ),
  PillarsRow: (
    <Frame soft>
      {[10, 44, 78].map((x, i) => (
        <g key={i}>
          <rect
            x={x}
            y="14"
            width="32"
            height="42"
            rx="2"
            fill="#fff"
            stroke={BORDER}
            strokeWidth="0.8"
          />
          <circle cx={x + 8} cy="22" r="3" fill={PRIMARY} opacity="0.85" />
          <rect x={x + 4} y="30" width="20" height="3" rx="1" fill={TEXT} />
          <rect x={x + 4} y="36" width="24" height="2" rx="1" fill={MUTED} />
          <rect x={x + 4} y="40" width="22" height="2" rx="1" fill={MUTED} />
          <rect x={x + 4} y="44" width="18" height="2" rx="1" fill={MUTED} />
        </g>
      ))}
    </Frame>
  ),
  ApproachSteps: (
    <Frame>
      {[10, 38, 66, 94].map((x, i) => (
        <g key={i}>
          <text
            x={x}
            y="22"
            fontSize="6"
            fontWeight="700"
            fill={ACCENT}
            fontFamily="system-ui"
          >
            {`0${i + 1}`}
          </text>
          <rect x={x} y="28" width="20" height="3.5" rx="1" fill={TEXT} />
          <rect x={x} y="36" width="22" height="2" rx="1" fill={MUTED} />
          <rect x={x} y="40" width="18" height="2" rx="1" fill={MUTED} />
        </g>
      ))}
    </Frame>
  ),
  ServicesGrid: (
    <Frame>
      {[
        [10, 12], [44, 12], [78, 12],
        [10, 38], [44, 38], [78, 38],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect
            x={x}
            y={y}
            width="32"
            height="20"
            rx="2"
            fill="#fff"
            stroke={BORDER}
            strokeWidth="0.8"
          />
          <circle cx={x + 5} cy={y + 6} r="2" fill={PRIMARY} opacity="0.85" />
          <rect x={x + 4} y={y + 11} width="22" height="2" rx="1" fill={TEXT} />
          <rect x={x + 4} y={y + 15} width="18" height="2" rx="1" fill={MUTED} />
        </g>
      ))}
    </Frame>
  ),
  CTABanner: (
    <Frame soft>
      <rect x="14" y="16" width="14" height="2.5" rx="1" fill={ACCENT} />
      <rect x="14" y="22" width="74" height="6" rx="1.5" fill={TEXT} />
      <rect x="14" y="32" width="92" height="3" rx="1" fill={MUTED} />
      <rect x="14" y="44" width="40" height="11" rx="2" fill={PRIMARY} />
    </Frame>
  ),
  PrinciplesList: (
    <Frame>
      <rect x="10" y="14" width="14" height="2.5" rx="1" fill={PRIMARY} opacity="0.7" />
      <rect x="10" y="20" width="40" height="5" rx="1.5" fill={TEXT} />
      <rect x="10" y="30" width="36" height="2" rx="1" fill={MUTED} />
      <rect x="10" y="34" width="34" height="2" rx="1" fill={MUTED} />
      <rect
        x="60"
        y="14"
        width="50"
        height="48"
        rx="2"
        fill={PRIMARY_SOFT}
        opacity="0.5"
      />
      {[20, 30, 40, 50].map((y, i) => (
        <g key={i}>
          <circle cx="66" cy={y + 2} r="2" fill={PRIMARY} />
          <rect x="71" y={y + 1} width="32" height="2" rx="1" fill={TEXT} opacity="0.8" />
        </g>
      ))}
    </Frame>
  ),
  TwoColumn: (
    <Frame>
      <rect x="10" y="14" width="48" height="3.5" rx="1" fill={TEXT} />
      <rect x="10" y="22" width="42" height="2" rx="1" fill={MUTED} />
      <rect x="10" y="26" width="46" height="2" rx="1" fill={MUTED} />
      <rect x="10" y="30" width="40" height="2" rx="1" fill={MUTED} />
      <rect x="62" y="14" width="48" height="3.5" rx="1" fill={TEXT} />
      <rect x="62" y="22" width="42" height="2" rx="1" fill={MUTED} />
      <rect x="62" y="26" width="46" height="2" rx="1" fill={MUTED} />
      <rect x="62" y="30" width="40" height="2" rx="1" fill={MUTED} />
    </Frame>
  ),
  ContactSection: (
    <Frame>
      <rect x="10" y="10" width="20" height="3" rx="1" fill={PRIMARY} opacity="0.7" />
      <rect x="10" y="16" width="80" height="5" rx="1.5" fill={TEXT} />
      <rect x="10" y="28" width="34" height="32" rx="2" fill={PRIMARY_SOFT} opacity="0.5" />
      <rect
        x="50"
        y="28"
        width="60"
        height="32"
        rx="2"
        fill="#fff"
        stroke={BORDER}
        strokeWidth="0.8"
      />
      <rect x="54" y="32" width="24" height="3" rx="1" fill={MUTED} />
      <rect x="54" y="38" width="52" height="3" rx="1" fill="#fff" stroke={BORDER} strokeWidth="0.5" />
      <rect x="54" y="44" width="52" height="3" rx="1" fill="#fff" stroke={BORDER} strokeWidth="0.5" />
      <rect x="54" y="50" width="20" height="6" rx="1.5" fill={PRIMARY} />
    </Frame>
  ),
  Spacer: (
    <Frame>
      <line
        x1="14"
        y1="35"
        x2="106"
        y2="35"
        stroke={MUTED}
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <text
        x="60"
        y="48"
        fontSize="6"
        fill={MUTED}
        textAnchor="middle"
        fontFamily="system-ui"
      >
        space
      </text>
    </Frame>
  ),
  RawHtml: (
    <Frame>
      <text
        x="14"
        y="42"
        fontSize="22"
        fontFamily="ui-monospace, monospace"
        fill={MUTED}
        opacity="0.85"
      >
        {'</>'}
      </text>
      <rect x="56" y="22" width="50" height="2" rx="1" fill={MUTED} />
      <rect x="56" y="28" width="42" height="2" rx="1" fill={MUTED} />
      <rect x="56" y="34" width="48" height="2" rx="1" fill={MUTED} />
      <rect x="56" y="40" width="40" height="2" rx="1" fill={MUTED} />
      <rect x="56" y="46" width="44" height="2" rx="1" fill={MUTED} />
    </Frame>
  ),
  ImageText: (
    <Frame>
      <rect x="10" y="14" width="44" height="42" rx="2" fill={PRIMARY_SOFT} />
      <line x1="20" y1="22" x2="44" y2="48" stroke={PRIMARY} strokeWidth="0.6" opacity="0.6" />
      <line x1="44" y1="22" x2="20" y2="48" stroke={PRIMARY} strokeWidth="0.6" opacity="0.6" />
      <rect x="62" y="18" width="14" height="2.5" rx="1" fill={PRIMARY} opacity="0.7" />
      <rect x="62" y="24" width="44" height="5" rx="1.5" fill={TEXT} />
      <rect x="62" y="34" width="46" height="2" rx="1" fill={MUTED} />
      <rect x="62" y="38" width="40" height="2" rx="1" fill={MUTED} />
      <rect x="62" y="42" width="42" height="2" rx="1" fill={MUTED} />
      <rect x="62" y="50" width="28" height="6" rx="1.5" fill={PRIMARY} />
    </Frame>
  ),
  VideoEmbed: (
    <Frame>
      <rect x="20" y="16" width="80" height="38" rx="2" fill="#0F172A" />
      <polygon points="55,26 55,44 70,35" fill="#fff" opacity="0.95" />
      <rect x="40" y="60" width="40" height="2" rx="1" fill={MUTED} />
    </Frame>
  ),
  LogoStrip: (
    <Frame soft>
      <rect x="48" y="14" width="24" height="2" rx="1" fill={MUTED} />
      {[14, 36, 58, 80, 102].map((cx, i) => (
        <rect
          key={i}
          x={cx - 8}
          y="36"
          width="16"
          height="10"
          rx="2"
          fill="#fff"
          stroke={BORDER}
          strokeWidth="0.5"
        />
      ))}
    </Frame>
  ),
  TestimonialQuote: (
    <Frame soft>
      <text
        x="20"
        y="26"
        fontSize="16"
        fontFamily="Georgia"
        fill={PRIMARY}
        opacity="0.6"
      >
        "
      </text>
      <rect x="14" y="28" width="92" height="3" rx="1" fill={TEXT} />
      <rect x="14" y="34" width="86" height="3" rx="1" fill={TEXT} />
      <rect x="14" y="40" width="60" height="3" rx="1" fill={TEXT} />
      <circle cx="42" cy="56" r="4" fill={PRIMARY} />
      <rect x="50" y="52" width="22" height="2.5" rx="1" fill={TEXT} />
      <rect x="50" y="56" width="34" height="2" rx="1" fill={MUTED} />
    </Frame>
  ),
  TestimonialGrid: (
    <Frame>
      {[10, 44, 78].map((x, i) => (
        <g key={i}>
          <rect
            x={x}
            y="14"
            width="32"
            height="42"
            rx="2"
            fill="#fff"
            stroke={BORDER}
            strokeWidth="0.8"
          />
          <text x={x + 4} y="22" fontSize="6" fontFamily="Georgia" fill={PRIMARY} opacity="0.6">"</text>
          <rect x={x + 4} y="24" width="22" height="2" rx="1" fill={TEXT} />
          <rect x={x + 4} y="28" width="24" height="2" rx="1" fill={TEXT} />
          <rect x={x + 4} y="32" width="20" height="2" rx="1" fill={TEXT} />
          <circle cx={x + 7} cy="46" r="3" fill={PRIMARY} />
          <rect x={x + 12} y="44" width="14" height="2" rx="1" fill={TEXT} />
          <rect x={x + 12} y="48" width="18" height="1.5" rx="0.5" fill={MUTED} />
        </g>
      ))}
    </Frame>
  ),
  FAQ: (
    <Frame>
      {[14, 30, 46].map((y, i) => (
        <g key={i}>
          <rect
            x="14"
            y={y}
            width="92"
            height="10"
            rx="2"
            fill={i === 0 ? PRIMARY_SOFT : '#fff'}
            stroke={BORDER}
            strokeWidth="0.6"
            opacity={i === 0 ? 0.7 : 1}
          />
          <rect x="20" y={y + 4} width="50" height="2" rx="1" fill={TEXT} />
          <text
            x="98"
            y={y + 7}
            fontSize="7"
            fill={MUTED}
            textAnchor="middle"
            fontFamily="system-ui"
          >
            {i === 0 ? '−' : '+'}
          </text>
        </g>
      ))}
    </Frame>
  ),
  Timeline: (
    <Frame>
      <line x1="22" y1="14" x2="22" y2="58" stroke={BORDER} strokeWidth="1" />
      {[16, 32, 48].map((y, i) => (
        <g key={i}>
          <circle cx="22" cy={y} r="3" fill={PRIMARY} />
          <rect x="32" y={y - 5} width="14" height="2" rx="1" fill={ACCENT} />
          <rect x="32" y={y - 1} width="40" height="3" rx="1" fill={TEXT} />
          <rect x="32" y={y + 4} width="60" height="2" rx="1" fill={MUTED} />
        </g>
      ))}
    </Frame>
  ),
  NewsletterSignup: (
    <Frame soft>
      <rect x="14" y="14" width="22" height="2.5" rx="1" fill={ACCENT} />
      <rect x="14" y="20" width="76" height="5" rx="1.5" fill={TEXT} />
      <rect x="14" y="30" width="92" height="2" rx="1" fill={MUTED} />
      <rect x="14" y="34" width="80" height="2" rx="1" fill={MUTED} />
      <rect
        x="14"
        y="44"
        width="64"
        height="9"
        rx="2"
        fill="#fff"
        stroke={BORDER}
        strokeWidth="0.6"
      />
      <rect x="82" y="44" width="24" height="9" rx="2" fill={PRIMARY} />
    </Frame>
  ),
  TeamGrid: (
    <Frame>
      {[10, 44, 78].map((x, i) => (
        <g key={i}>
          <rect
            x={x}
            y="12"
            width="32"
            height="48"
            rx="2"
            fill="#fff"
            stroke={BORDER}
            strokeWidth="0.6"
          />
          <rect x={x} y="12" width="32" height="22" rx="2" fill={PRIMARY_SOFT} />
          <circle cx={x + 16} cy="22" r="6" fill={PRIMARY} opacity="0.7" />
          <rect x={x + 4} y="38" width="20" height="2.5" rx="1" fill={TEXT} />
          <rect x={x + 4} y="44" width="14" height="2" rx="1" fill={ACCENT} />
          <rect x={x + 4} y="50" width="22" height="1.5" rx="0.5" fill={MUTED} />
          <rect x={x + 4} y="54" width="18" height="1.5" rx="0.5" fill={MUTED} />
        </g>
      ))}
    </Frame>
  ),
  Banner: (
    <Frame>
      <rect x="0" y="26" width={FRAME_W} height="18" fill={PRIMARY_SOFT} />
      <rect x="14" y="32" width="14" height="6" rx="1.5" fill={PRIMARY} />
      <rect x="32" y="33" width="32" height="3" rx="1" fill={TEXT} />
      <rect x="32" y="38" width="22" height="2" rx="1" fill={PRIMARY} opacity="0.7" />
      <rect x="80" y="33" width="22" height="3" rx="1" fill={PRIMARY} />
      <text
        x="100"
        y="38"
        fontSize="6"
        fill={PRIMARY}
        fontFamily="system-ui"
        fontWeight="700"
      >
        →
      </text>
    </Frame>
  ),
  ArticleFeatured: (
    <Frame>
      <rect x="62" y="14" width="44" height="42" rx="2" fill={PRIMARY_SOFT} />
      <line x1="68" y1="22" x2="100" y2="48" stroke={PRIMARY} strokeWidth="0.4" opacity="0.4" />
      <line x1="100" y1="22" x2="68" y2="48" stroke={PRIMARY} strokeWidth="0.4" opacity="0.4" />
      <rect x="14" y="14" width="20" height="4" rx="1" fill={PRIMARY} />
      <rect x="14" y="22" width="40" height="5" rx="1.5" fill={TEXT} />
      <rect x="14" y="30" width="44" height="2" rx="1" fill={MUTED} />
      <rect x="14" y="34" width="38" height="2" rx="1" fill={MUTED} />
      <rect x="14" y="42" width="32" height="2" rx="1" fill={MUTED} opacity="0.7" />
      <rect x="14" y="50" width="22" height="6" rx="1.5" fill={PRIMARY} />
    </Frame>
  ),
  ArticleGrid: (
    <Frame>
      {[10, 44, 78].map((x, i) => (
        <g key={i}>
          <rect
            x={x}
            y="12"
            width="32"
            height="48"
            rx="2"
            fill="#fff"
            stroke={BORDER}
            strokeWidth="0.6"
          />
          <rect x={x} y="12" width="32" height="20" rx="2" fill={PRIMARY_SOFT} />
          <rect x={x + 4} y="36" width="10" height="2" rx="1" fill={PRIMARY} opacity="0.7" />
          <rect x={x + 4} y="40" width="22" height="3" rx="1" fill={TEXT} />
          <rect x={x + 4} y="46" width="20" height="1.5" rx="0.5" fill={MUTED} />
          <rect x={x + 4} y="49" width="18" height="1.5" rx="0.5" fill={MUTED} />
          <rect x={x + 4} y="55" width="14" height="1.5" rx="0.5" fill={MUTED} opacity="0.7" />
        </g>
      ))}
    </Frame>
  ),
  ArticleList: (
    <Frame>
      {[14, 28, 42, 56].map((y, i) => (
        <g key={i}>
          <line
            x1="14"
            y1={y - 3}
            x2="106"
            y2={y - 3}
            stroke={BORDER}
            strokeWidth="0.5"
          />
          <rect x="14" y={y} width="14" height="2" rx="1" fill={MUTED} />
          <rect x="34" y={y - 1} width="10" height="2" rx="1" fill={PRIMARY} opacity="0.7" />
          <rect x="48" y={y - 1} width="50" height="2.5" rx="1" fill={TEXT} />
          <text x="106" y={y + 1} fontSize="6" fill={MUTED} textAnchor="end" fontFamily="system-ui">→</text>
        </g>
      ))}
    </Frame>
  ),
  IconCards: (
    <Frame>
      {[
        [10, 12], [38, 12], [66, 12], [94, 12],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect
            x={x - 4}
            y={y}
            width="24"
            height="46"
            rx="2"
            fill="#fff"
            stroke={BORDER}
            strokeWidth="0.6"
          />
          <rect x={x - 1} y={y + 4} width="10" height="10" rx="2" fill={PRIMARY_SOFT} />
          <circle cx={x + 4} cy={y + 9} r="2.5" fill={PRIMARY} />
          <rect x={x - 1} y={y + 18} width="14" height="2" rx="1" fill={TEXT} />
          <rect x={x - 1} y={y + 24} width="16" height="1.5" rx="0.5" fill={MUTED} />
          <rect x={x - 1} y={y + 28} width="14" height="1.5" rx="0.5" fill={MUTED} />
        </g>
      ))}
    </Frame>
  ),
  MetricCards: (
    <Frame>
      {[
        [10, 12], [38, 12], [66, 12], [94, 12],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect
            x={x - 4}
            y={y}
            width="24"
            height="46"
            rx="2"
            fill="#fff"
            stroke={BORDER}
            strokeWidth="0.6"
          />
          <text
            x={x + 8}
            y={y + 18}
            fontSize="11"
            fontWeight="800"
            fill={PRIMARY}
            textAnchor="middle"
            fontFamily="system-ui"
          >
            {['80%', '8wk', '4.8', '0'][i]}
          </text>
          <rect x={x - 1} y={y + 25} width="20" height="1.5" rx="0.5" fill={MUTED} />
          <rect x={x - 1} y={y + 29} width="16" height="1.5" rx="0.5" fill={MUTED} />
          <rect
            x={x}
            y={y + 36}
            width="14"
            height="5"
            rx="1.5"
            fill="#DCFCE7"
            opacity={i % 2 === 0 ? 1 : 0.5}
          />
        </g>
      ))}
    </Frame>
  ),
  ImageOverlayCards: (
    <Frame>
      {[10, 44, 78].map((x, i) => (
        <g key={i}>
          <defs>
            <linearGradient id={`oc-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PRIMARY} stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          <rect x={x} y="12" width="32" height="48" rx="2" fill={`url(#oc-grad-${i})`} />
          <rect x={x + 4} y="38" width="10" height="2" rx="1" fill={ACCENT} />
          <rect x={x + 4} y="44" width="22" height="3" rx="1" fill="#fff" />
          <rect x={x + 4} y="50" width="20" height="1.5" rx="0.5" fill="#fff" opacity="0.85" />
          <rect x={x + 4} y="53" width="14" height="1.5" rx="0.5" fill="#fff" opacity="0.85" />
        </g>
      ))}
    </Frame>
  ),
  PricingTable: (
    <Frame>
      {[10, 44, 78].map((x, i) => (
        <g key={i}>
          <rect x={x} y="10" width="32" height="50" rx="2" fill={i === 1 ? PRIMARY : '#fff'} stroke={BORDER} strokeWidth="0.6" />
          <rect x={x + 4} y="14" width="14" height="2" rx="1" fill={i === 1 ? '#fff' : MUTED} />
          <rect x={x + 4} y="20" width="18" height="6" rx="1.5" fill={i === 1 ? '#fff' : TEXT} />
          {[32, 38, 44].map((y, j) => (
            <rect key={j} x={x + 4} y={y} width="22" height="1.5" rx="0.5" fill={i === 1 ? '#fff' : MUTED} opacity={i === 1 ? 0.9 : 0.7} />
          ))}
          <rect x={x + 4} y="52" width="22" height="5" rx="1.5" fill={i === 1 ? '#fff' : PRIMARY} />
        </g>
      ))}
    </Frame>
  ),
  PricingComparison: (
    <Frame>
      <rect x="10" y="14" width="100" height="6" fill={PRIMARY_SOFT} />
      <rect x="14" y="16" width="22" height="2" rx="1" fill={TEXT} />
      <rect x="42" y="16" width="14" height="2" rx="1" fill={TEXT} />
      <rect x="62" y="16" width="14" height="2" rx="1" fill={TEXT} />
      <rect x="82" y="16" width="14" height="2" rx="1" fill={TEXT} />
      {[26, 34, 42, 50].map((y, i) => (
        <g key={i}>
          <rect x="14" y={y} width="22" height="1.5" rx="0.5" fill={MUTED} />
          {[42, 62, 82].map((cx, j) => (
            <text key={j} x={cx + 7} y={y + 2} fontSize="5" fill={(i + j) % 2 ? PRIMARY : MUTED} textAnchor="middle" fontFamily="system-ui">
              {(i + j) % 2 ? '✓' : '·'}
            </text>
          ))}
        </g>
      ))}
    </Frame>
  ),
  AwardsBar: (
    <Frame>
      {[24, 60, 96].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="22" r="6" fill={ACCENT} opacity="0.85" />
          <rect x={x - 12} y="32" width="24" height="2.5" rx="1" fill={TEXT} />
          <rect x={x - 8} y="38" width="16" height="2" rx="1" fill={MUTED} />
          <rect x={x - 5} y="44" width="10" height="1.5" rx="0.5" fill={MUTED} opacity="0.6" />
        </g>
      ))}
    </Frame>
  ),
  CountUpStats: (
    <Frame soft>
      {[24, 60, 96].map((x, i) => (
        <g key={i}>
          <text x={x} y="28" fontSize="14" fontWeight="800" fill={PRIMARY} textAnchor="middle" fontFamily="system-ui">{['80', '50', '14'][i]}{['%', '+', ''][i]}</text>
          <rect x={x - 16} y="36" width="32" height="2" rx="1" fill={MUTED} />
          <rect x={x - 12} y="42" width="24" height="2" rx="1" fill={MUTED} opacity="0.7" />
        </g>
      ))}
    </Frame>
  ),
  ImageGallery: (
    <Frame>
      {[
        [10, 12, 32, 22], [44, 12, 32, 22], [78, 12, 32, 22],
        [10, 36, 32, 22], [44, 36, 32, 22], [78, 36, 32, 22],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill={PRIMARY_SOFT} stroke={BORDER} strokeWidth="0.5" />
      ))}
    </Frame>
  ),
  ImageCaption: (
    <Frame>
      <rect x="20" y="12" width="80" height="34" rx="2" fill={PRIMARY_SOFT} stroke={BORDER} strokeWidth="0.6" />
      <line x1="30" y1="20" x2="90" y2="38" stroke={PRIMARY} strokeWidth="0.4" opacity="0.4" />
      <line x1="90" y1="20" x2="30" y2="38" stroke={PRIMARY} strokeWidth="0.4" opacity="0.4" />
      <rect x="34" y="52" width="52" height="2" rx="1" fill={MUTED} />
      <rect x="42" y="56" width="36" height="2" rx="1" fill={MUTED} opacity="0.7" />
    </Frame>
  ),
  InlineCTA: (
    <Frame soft>
      <rect x="10" y="22" width="100" height="26" rx="3" fill="#fff" stroke={BORDER} strokeWidth="0.6" />
      <rect x="16" y="28" width="50" height="3.5" rx="1" fill={TEXT} />
      <rect x="16" y="36" width="58" height="2" rx="1" fill={MUTED} />
      <rect x="80" y="30" width="24" height="10" rx="2" fill={PRIMARY} />
    </Frame>
  ),
  AnnouncementBar: (
    <Frame>
      <rect x="0" y="20" width={FRAME_W} height="14" fill="#0F172A" />
      <rect x="30" y="25" width="38" height="2" rx="1" fill="#fff" />
      <rect x="72" y="25" width="22" height="2" rx="1" fill={ACCENT} />
    </Frame>
  ),
  Quote: (
    <Frame>
      <text x="14" y="24" fontSize="14" fontFamily="Georgia" fill={PRIMARY} opacity="0.6">"</text>
      <rect x="22" y="24" width="80" height="3.5" rx="1" fill={TEXT} />
      <rect x="22" y="32" width="74" height="3.5" rx="1" fill={TEXT} />
      <rect x="22" y="40" width="58" height="3.5" rx="1" fill={TEXT} />
      <rect x="22" y="50" width="22" height="2" rx="1" fill={MUTED} />
    </Frame>
  ),
  CodeBlock: (
    <Frame>
      <rect x="10" y="12" width="100" height="48" rx="2" fill="#0F172A" />
      <rect x="10" y="12" width="100" height="8" fill="#1E293B" />
      <rect x="14" y="14" width="20" height="3" rx="0.5" fill={MUTED} />
      <text x="14" y="29" fontSize="6" fill="#7DD3FC" fontFamily="ui-monospace, monospace">$ make</text>
      <text x="14" y="38" fontSize="6" fill="#86EFAC" fontFamily="ui-monospace, monospace">  build</text>
      <text x="14" y="47" fontSize="6" fill="#FCA5A5" fontFamily="ui-monospace, monospace">  deploy</text>
      <text x="14" y="56" fontSize="6" fill="#E2E8F0" fontFamily="ui-monospace, monospace">{`{ ok: true }`}</text>
    </Frame>
  ),
  KeyValueList: (
    <Frame>
      {[18, 30, 42, 54].map((y, i) => (
        <g key={i}>
          <line x1="14" y1={y - 6} x2="106" y2={y - 6} stroke={BORDER} strokeWidth="0.5" />
          <rect x="14" y={y - 2} width="28" height="2" rx="1" fill={MUTED} />
          <rect x="50" y={y - 2} width="50" height="2" rx="1" fill={TEXT} />
        </g>
      ))}
    </Frame>
  ),
  StepsVertical: (
    <Frame>
      <line x1="22" y1="14" x2="22" y2="58" stroke={BORDER} strokeWidth="0.6" />
      {[16, 32, 48].map((y, i) => (
        <g key={i}>
          <circle cx="22" cy={y} r="5" fill={PRIMARY_SOFT} stroke={PRIMARY} strokeWidth="0.7" />
          <text x="22" y={y + 1.5} fontSize="5" fontWeight="700" fill={PRIMARY} textAnchor="middle" fontFamily="system-ui">{i + 1}</text>
          <rect x="34" y={y - 2} width="28" height="3" rx="1" fill={TEXT} />
          <rect x="34" y={y + 4} width="48" height="2" rx="1" fill={MUTED} />
        </g>
      ))}
    </Frame>
  ),
  TabsBlock: (
    <Frame>
      <rect x="14" y="14" width="20" height="6" rx="1" fill={PRIMARY} />
      <rect x="36" y="14" width="20" height="6" rx="1" fill="#fff" stroke={BORDER} strokeWidth="0.5" />
      <rect x="58" y="14" width="20" height="6" rx="1" fill="#fff" stroke={BORDER} strokeWidth="0.5" />
      <line x1="14" y1="22" x2="106" y2="22" stroke={BORDER} strokeWidth="0.5" />
      <rect x="14" y="28" width="78" height="2" rx="1" fill={TEXT} />
      <rect x="14" y="34" width="86" height="2" rx="1" fill={MUTED} />
      <rect x="14" y="40" width="80" height="2" rx="1" fill={MUTED} />
      <rect x="14" y="46" width="60" height="2" rx="1" fill={MUTED} />
    </Frame>
  ),
  AccordionBlock: (
    <Frame>
      {[14, 30, 46].map((y, i) => (
        <g key={i}>
          <rect x="14" y={y} width="92" height="10" rx="2" fill={i === 0 ? PRIMARY_SOFT : '#fff'} stroke={BORDER} strokeWidth="0.5" />
          <rect x="20" y={y + 4} width="44" height="2.5" rx="1" fill={TEXT} />
          <text x="100" y={y + 7} fontSize="6" fill={MUTED} textAnchor="middle" fontFamily="system-ui">{i === 0 ? '−' : '+'}</text>
          {i === 0 && (
            <>
              <rect x="20" y={y + 12} width="68" height="1.5" rx="0.5" fill={MUTED} />
              <rect x="20" y={y + 16} width="60" height="1.5" rx="0.5" fill={MUTED} />
            </>
          )}
        </g>
      ))}
    </Frame>
  ),
  SocialLinks: (
    <Frame>
      <rect x="40" y="22" width="40" height="2" rx="1" fill={MUTED} />
      {[42, 54, 66, 78].map((x, i) => (
        <circle key={i} cx={x} cy="42" r="5" fill={PRIMARY_SOFT} stroke={PRIMARY} strokeWidth="0.5" />
      ))}
    </Frame>
  ),
  ContactInfo: (
    <Frame>
      <rect x="10" y="14" width="100" height="46" rx="2" fill="#fff" stroke={BORDER} strokeWidth="0.6" />
      {[[18, 22], [62, 22], [18, 42], [62, 42]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x + 4} cy={y + 4} r="2.5" fill={PRIMARY} opacity="0.7" />
          <rect x={x + 10} y={y} width="14" height="2" rx="1" fill={MUTED} />
          <rect x={x + 10} y={y + 4} width="22" height="2.5" rx="1" fill={TEXT} />
        </g>
      ))}
    </Frame>
  ),
  MapEmbed: (
    <Frame>
      <rect x="10" y="12" width="100" height="44" rx="2" fill="#DCFCE7" stroke={BORDER} strokeWidth="0.5" />
      <path d="M 14 28 Q 30 14 50 28 T 90 28 L 106 22" stroke={MUTED} strokeWidth="0.5" fill="none" />
      <path d="M 14 42 Q 40 32 70 44 L 106 38" stroke={MUTED} strokeWidth="0.5" fill="none" />
      <circle cx="60" cy="32" r="3" fill="#DC2626" />
      <path d="M 60 35 L 58 40 L 62 40 Z" fill="#DC2626" />
    </Frame>
  ),
  EventsList: (
    <Frame>
      {[14, 30, 46].map((y, i) => (
        <g key={i}>
          <rect x="14" y={y} width="92" height="11" rx="2" fill="#fff" stroke={BORDER} strokeWidth="0.5" />
          <rect x="18" y={y + 2} width="14" height="7" rx="1" fill={PRIMARY_SOFT} />
          <text x="25" y={y + 7} fontSize="4" fontWeight="700" fill={PRIMARY} textAnchor="middle" fontFamily="system-ui">{['MAR', 'APR', 'MAY'][i]}</text>
          <rect x="36" y={y + 3} width="40" height="2" rx="1" fill={TEXT} />
          <rect x="36" y={y + 7} width="50" height="1.5" rx="0.5" fill={MUTED} />
          <text x="100" y={y + 7} fontSize="5" fill={PRIMARY} textAnchor="middle" fontFamily="system-ui">→</text>
        </g>
      ))}
    </Frame>
  ),
  Divider: (
    <Frame>
      <line x1="14" y1="35" x2="50" y2="35" stroke={BORDER} strokeWidth="0.8" />
      <text x="60" y="38" fontSize="6" fill={MUTED} textAnchor="middle" fontWeight="700" fontFamily="system-ui">— OR —</text>
      <line x1="70" y1="35" x2="106" y2="35" stroke={BORDER} strokeWidth="0.8" />
    </Frame>
  ),
  ThreeColumn: (
    <Frame>
      {[10, 44, 78].map((x, i) => (
        <g key={i}>
          <rect x={x} y="14" width="32" height="3.5" rx="1" fill={TEXT} />
          <rect x={x} y="22" width="28" height="2" rx="1" fill={MUTED} />
          <rect x={x} y="26" width="32" height="2" rx="1" fill={MUTED} />
          <rect x={x} y="30" width="26" height="2" rx="1" fill={MUTED} />
          <rect x={x} y="34" width="30" height="2" rx="1" fill={MUTED} />
          <rect x={x} y="38" width="22" height="2" rx="1" fill={MUTED} />
        </g>
      ))}
    </Frame>
  ),
  PressMentions: (
    <Frame soft>
      <rect x="40" y="14" width="40" height="2" rx="1" fill={MUTED} />
      {[20, 50, 80].map((cx, i) => (
        <text key={i} x={cx} y="42" fontSize="9" fontFamily="Georgia" fontStyle="italic" fontWeight="600" fill={MUTED} textAnchor="middle">{['Forbes', 'WSJ', 'TechCrunch'][i]}</text>
      ))}
    </Frame>
  ),
  Container: (
    <Frame>
      <rect x="14" y="14" width="92" height="46" rx="3" fill={PRIMARY_SOFT} stroke={PRIMARY} strokeWidth="0.5" strokeDasharray="2 2" />
      <rect x="22" y="22" width="20" height="2.5" rx="1" fill={PRIMARY} />
      <rect x="22" y="30" width="60" height="4" rx="1.5" fill={TEXT} />
      <rect x="22" y="40" width="76" height="2" rx="1" fill={MUTED} />
      <rect x="22" y="44" width="68" height="2" rx="1" fill={MUTED} />
      <rect x="22" y="48" width="50" height="2" rx="1" fill={MUTED} />
    </Frame>
  ),
  };
}

export const BLOCK_DESCRIPTIONS = {
  Hero: 'Eyebrow, large heading, lede, and two CTAs. The opening section of any page.',
  SectionHeader: 'Eyebrow + heading + lede that introduces a major section.',
  StatsStrip: 'Horizontal row of 3–5 stat cards (number + label).',
  RichText: 'Body copy with HTML formatting — paragraphs, lists, links, headings.',
  PillarsRow: '2–4 column grid of icon + title + body cards.',
  ApproachSteps: 'Numbered step-by-step breakdown (e.g. 01 Diagnose / 02 Design).',
  ServicesGrid: 'Auto-rendered grid of all (or first N) service capability cards.',
  CTABanner: 'Full-width call-to-action with tagline, heading, body, and button.',
  PrinciplesList: 'Two-column layout: heading on the left, checkmark bullet list on the right.',
  TwoColumn: 'Generic side-by-side text columns with editable headings + body.',
  ContactSection: 'Hero + sidebar info cards + lead-capture form. Drops a working contact section in one block.',
  Spacer: 'Pure vertical whitespace between blocks.',
  RawHtml: 'Escape hatch — paste in any HTML when you need something the library doesn’t cover.',
  ImageText: 'Image on one side, eyebrow + heading + body + CTA on the other. Flip the image side per section.',
  VideoEmbed: 'Responsive YouTube or Vimeo embed with optional caption.',
  LogoStrip: '"Trusted by" row of client/partner logos. Falls back to brand-name text when no image is set.',
  TestimonialQuote: 'One large pull-quote with author photo, name, role, and company.',
  TestimonialGrid: '2- or 3-column grid of testimonial cards. Use for multi-voice social proof.',
  FAQ: 'Accordion of question / answer items. HTML allowed in answers; one open at a time.',
  Timeline: 'Vertical chronological list — date + title + body. Useful for company history or "what happens next".',
  NewsletterSignup: 'Single-field email capture. Submits to the leads endpoint with source="newsletter".',
  TeamGrid: '2/3/4-column team cards with photo, role, short bio, and LinkedIn link.',
  Banner: 'Full-width announcement strip — info / success / warning / dark variants. Optional CTA link.',
  ArticleFeatured: 'Hero-style featured article — large image + tag + headline + excerpt + byline + CTA.',
  ArticleGrid: '2- or 3-column article cards (cover + tag + headline + excerpt + byline).',
  ArticleList: 'Text-heavy article list (date + tag + headline + excerpt). Best for archives.',
  IconCards: 'Compact icon + title + 1-line body cards. 2/3/4-col layouts.',
  MetricCards: 'Big-number cards with optional trend arrow + delta. The "by the numbers" section.',
  ImageOverlayCards: 'Full-bleed image cards with text overlay. Click-through "category" / "explore" pattern.',
  PricingTable: '3-tier pricing cards with feature lists and per-tier CTAs. Highlight one tier as popular.',
  PricingComparison: 'Feature × tier comparison table — checkmarks/Xs or values per cell.',
  AwardsBar: 'Row of certifications/awards with title + body + year. Trust signals for accreditations.',
  CountUpStats: 'Animated stat counters that tick from 0 to value when scrolled into view.',
  ImageGallery: 'Photo grid with click-to-enlarge lightbox. 2/3/4-col layouts.',
  ImageCaption: 'Single image with caption and optional photo credit.',
  InlineCTA: 'Compact one-line CTA strip — sits between content sections without dominating.',
  AnnouncementBar: 'Slim full-width strip for announcements, beta access, event invites — dark / primary / accent variants.',
  Quote: 'Editorial pull-quote with optional attribution. Left-bordered or centered.',
  CodeBlock: 'Monospace code snippet with title bar and language label.',
  KeyValueList: 'Definition list / specs table — for "what\'s included", deal terms, technical specs.',
  StepsVertical: 'Large vertical numbered steps with title + body. Heavier than ApproachSteps.',
  TabsBlock: 'Tabbed content panel — switch between named sections of HTML content.',
  AccordionBlock: 'Generic accordion (one or many open). For multi-section content beyond strict FAQ.',
  SocialLinks: 'Row of social-network icon links — LinkedIn, X, YouTube, etc.',
  ContactInfo: 'Office address + email + phone + hours card. No form, just info.',
  MapEmbed: 'Google Maps iframe embed with caption.',
  EventsList: 'Upcoming events with date pill + title + venue + RSVP CTA.',
  Divider: 'Horizontal divider with optional centered label. Hairline / dashed / thick / dot styles.',
  ThreeColumn: 'Generic 3-col text layout. Lighter than PillarsRow.',
  PressMentions: '"As featured in" press logos. Italic serif text fallback when no logos.',
  Container: 'Decorative box (soft / primary / dark / white) wrapping a single titled callout.',
};

export default function BlockThumbnail({ name }) {
  const colors = useBrandColors();
  const previews = getPreviews(colors);
  return (
    previews[name] || (
      <Frame>
        <text
          x="60"
          y="40"
          fontSize="8"
          fill={MUTED}
          textAnchor="middle"
          fontFamily="system-ui"
        >
          {name}
        </text>
      </Frame>
    )
  );
}
