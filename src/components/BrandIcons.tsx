import React from 'react'

// Kharghar Hills Brand Logo Component
export const KhargharLogo: React.FC<{
  className?: string
  variant?: 'dark' | 'light'
  layout?: 'horizontal' | 'vertical'
  glyphSize?: number
  showTagline?: boolean
  fontSizeScale?: number
}> = ({
  className = '',
  variant = 'dark',
  layout = 'vertical',
  glyphSize,
  showTagline = false,
  fontSizeScale = 1,
}) => {
  const isDark = variant === 'dark'
  const primaryColor = isDark ? '#103323' : '#FFFFFF'
  const isHorizontal = layout === 'horizontal'
  const size = glyphSize || (isHorizontal ? 36 : 46)

  return (
    <div
      className={`brand-logo-wrap ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        alignItems: 'center',
        gap: isHorizontal ? '0.75rem' : '0.35rem',
      }}
    >
      {/* Mountain Architectural Glyph exactly matching user-supplied asset */}
      <svg
        width={size}
        height={Math.round((size * 135) / 132)}
        viewBox="0 0 132 135"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Solid block with twin mountain peak cutouts */}
        <path
          d="M0 0H132V91L80 37L62 60L36 37L0 67Z"
          fill={primaryColor}
        />
        {/* Diagonal architectural accent line */}
        <line
          x1="64"
          y1="63"
          x2="132"
          y2="135"
          stroke={primaryColor}
          strokeWidth="8"
          strokeLinecap="square"
        />
      </svg>

      {/* Brand Typography */}
      <div
        style={{
          textAlign: isHorizontal ? 'left' : 'center',
          lineHeight: 1.05,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <span
          className="brand-logo-text-large"
          style={{
            fontFamily: 'var(--font-brand-serif)',
            fontSize: isHorizontal ? `${1.35 * fontSizeScale}rem` : `${1.45 * fontSizeScale}rem`,
            fontWeight: 700,
            letterSpacing: '0.03em',
            color: primaryColor,
            display: 'block',
          }}
        >
          Kharghar
        </span>
        <span
          className="brand-logo-text-small"
          style={{
            fontFamily: 'var(--font-brand-serif)',
            fontSize: isHorizontal ? `${1.02 * fontSizeScale}rem` : `${1.1 * fontSizeScale}rem`,
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: primaryColor,
            display: 'block',
            marginTop: '-1px',
          }}
        >
          Hills
        </span>
      </div>

      {showTagline && (
        <span
          style={{
            fontSize: '0.62rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#E0402B',
            fontWeight: 700,
            marginTop: '3px',
          }}
        >
          Navi Mumbai
        </span>
      )}
    </div>
  )
}

// ==========================================
// PAGE 1: 5 Highlight Feature Icons
// ==========================================

export const VashiTransitIcon: React.FC<{ size?: number; color?: string }> = ({ size = 32, color = '#103323' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {/* Speedometer / Clock Highway Car */}
    <circle cx="18" cy="18" r="14" strokeDasharray="3 2" />
    <path d="M18 10V18L23 21" strokeWidth="2" stroke={color} />
    <path d="M8 26C10 23 14 22 18 22C22 22 26 23 28 26" />
    <circle cx="18" cy="18" r="2" fill={color} />
  </svg>
)

export const AcresDevelopmentIcon: React.FC<{ size?: number; color?: string }> = ({ size = 32, color = '#103323' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {/* Masterplan Township Plot */}
    <rect x="7" y="7" width="13" height="22" rx="1.5" />
    <rect x="20" y="14" width="10" height="15" rx="1.5" />
    <path d="M11 12H16M11 16H16M11 20H16M11 24H16" />
    <path d="M23 18H27M23 22H27" />
    <path d="M4 29H32" strokeWidth="2" />
  </svg>
)

export const BookingBenefitsIcon: React.FC<{ size?: number; color?: string }> = ({ size = 32, color = '#103323' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {/* Hand holding token / privilege star */}
    <circle cx="21" cy="13" r="6" stroke="#E0402B" strokeWidth="1.8" />
    <path d="M21 10.5V15.5M18.5 13H23.5" stroke="#E0402B" strokeWidth="1.5" />
    <path d="M6 25L13 21C15 20 18 20 21 21L27 24C29 25 31 25 32 23" />
    <path d="M6 22V28L15 27" />
  </svg>
)

export const BiggestLaunchIcon: React.FC<{ size?: number; color?: string }> = ({ size = 32, color = '#103323' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {/* Celebration Rocket / Ribbon Podium */}
    <path d="M18 5L21.5 13L30 14L23.5 20L25.5 28L18 23.5L10.5 28L12.5 20L6 14L14.5 13L18 5Z" fill="#103323" fillOpacity="0.08" />
    <path d="M18 6L20.8 12.5L28 13.3L22.6 18.2L24.2 25L18 21.5L11.8 25L13.4 18.2L8 13.3L15.2 12.5L18 6Z" strokeWidth="1.6" />
    <circle cx="18" cy="15" r="2.5" fill="#E0402B" />
  </svg>
)

export const TownshipIcon: React.FC<{ size?: number; color?: string }> = ({ size = 32, color = '#103323' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {/* Grand Township Towers */}
    <path d="M6 30V15L14 10V30" />
    <path d="M14 10L22 6V30" />
    <path d="M22 16L30 20V30" />
    <line x1="4" y1="30" x2="32" y2="30" strokeWidth="2" />
    <circle cx="18" cy="11" r="1" fill={color} />
    <circle cx="18" cy="16" r="1" fill={color} />
    <circle cx="18" cy="21" r="1" fill={color} />
    <circle cx="10" cy="18" r="1" fill={color} />
    <circle cx="26" cy="24" r="1" fill={color} />
  </svg>
)

// ==========================================
// PAGE 2: 7 Infrastructure Highlights Icons
// ==========================================

export const CorridorIcon: React.FC<{ size?: number; color?: string }> = ({ size = 28, color = '#103323' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {/* Emerging Growth Corridor / District Towers & Upward Growth */}
    <rect x="5" y="11" width="8" height="17" rx="1" />
    <rect x="13" y="6" width="10" height="22" rx="1" />
    <rect x="23" y="15" width="6" height="13" rx="1" />
    <path d="M18 10L18 15M18 19L18 22" strokeDasharray="1.5 1.5" />
    <path d="M9 15H9.01M9 19H9.01M9 23H9.01" strokeWidth="2.5" />
    {/* Growth upward arrow */}
    <path d="M22 6L28 2M28 2V5.5M28 2H24.5" stroke="#3DAA73" strokeWidth="2" />
  </svg>
)

export const RoadNetworkIcon: React.FC<{ size?: number; color?: string }> = ({ size = 28, color = '#103323' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {/* Internal Kharghar Road Network Interchanges */}
    <path d="M4 16H28" strokeWidth="2.2" />
    <path d="M16 4V28" strokeWidth="2.2" />
    <circle cx="16" cy="16" r="5" stroke="#3DAA73" strokeWidth="2" strokeDasharray="2 2" />
    <path d="M8 8L24 24" strokeWidth="1.3" opacity="0.6" />
    <path d="M24 8L8 24" strokeWidth="1.3" opacity="0.6" />
  </svg>
)

export const AirportIcon: React.FC<{ size?: number; color?: string }> = ({ size = 28, color = '#103323' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {/* Navi Mumbai International Airport Airplane */}
    <path
      d="M16 4L18.5 12L28 17L28 19.5L18.5 16.5L18.5 24L21.5 26.5V28.5L16 27L10.5 28.5V26.5L13.5 24L13.5 16.5L4 19.5L4 17L13.5 12L16 4Z"
      fill={color}
      fillOpacity="0.12"
      stroke={color}
      strokeWidth="1.6"
    />
  </svg>
)

export const HighwayIcon: React.FC<{ size?: number; color?: string }> = ({ size = 28, color = '#103323' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {/* Mumbra Panvel Highway Curves */}
    <path d="M7 28L13 4" strokeWidth="2" />
    <path d="M25 28L19 4" strokeWidth="2" />
    <path d="M16 8V12M16 16V20M16 24V28" stroke="#3DAA73" strokeWidth="2" strokeLinecap="square" />
  </svg>
)

export const MetroIcon: React.FC<{ size?: number; color?: string }> = ({ size = 28, color = '#103323' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {/* Metro Line 12 Elevated Corridor Train */}
    <rect x="7" y="5" width="18" height="20" rx="4" strokeWidth="2" />
    <path d="M10 10H22M10 15H22" strokeWidth="1.5" />
    <circle cx="11" cy="20" r="1.5" fill={color} />
    <circle cx="21" cy="20" r="1.5" fill={color} />
    <path d="M6 28L11 25" strokeWidth="2" />
    <path d="M26 28L21 25" strokeWidth="2" />
    <path d="M12 25H20" strokeWidth="2" />
  </svg>
)

export const TunnelIcon: React.FC<{ size?: number; color?: string }> = ({ size = 28, color = '#103323' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {/* Kharghar Turbhe Link Road with Twin Tunnels */}
    <path d="M4 27V16C4 10.5 8.5 6 14 6C19.5 6 24 10.5 24 16V27" strokeWidth="2" />
    <path d="M8 27V16C8 12.7 10.7 10 14 10C17.3 10 20 12.7 20 16V27" strokeWidth="1.5" />
    <path d="M14 14V27" stroke="#3DAA73" strokeWidth="1.5" strokeDasharray="2 2" />
    <path d="M24 14C26.5 15.5 28 18 28 21V27" strokeWidth="1.5" opacity="0.6" />
    <line x1="2" y1="27" x2="30" y2="27" strokeWidth="2" />
  </svg>
)

export const BulletTrainIcon: React.FC<{ size?: number; color?: string }> = ({ size = 28, color = '#103323' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {/* High-speed Bullet Train Aerodynamic Nose */}
    <path
      d="M4 20C4 20 10 20 16 19C22 18 26 15 28 12C26 9 22 9 16 9C10 9 4 10 4 10V20Z"
      strokeWidth="2"
      fill={color}
      fillOpacity="0.08"
    />
    <path d="M10 13H18C20 13 22 12.5 23 12" strokeWidth="1.5" />
    <line x1="2" y1="24" x2="30" y2="24" strokeWidth="2" strokeDasharray="4 2" />
    <circle cx="24" cy="15" r="1" fill="#E0402B" />
  </svg>
)

// ==========================================
// PAGE 7: Developer & Regulatory Logos
// ==========================================

export const TodayGroupLogo: React.FC<{ height?: number }> = ({ height = 48 }) => (
  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 900,
          fontSize: `${height * 0.65}px`,
          letterSpacing: '-0.04em',
          color: '#103323',
          lineHeight: 0.9,
          textTransform: 'uppercase',
        }}
      >
        To
      </span>
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 900,
          fontSize: `${height * 0.65}px`,
          letterSpacing: '-0.04em',
          color: '#E0402B',
          lineHeight: 0.9,
          textTransform: 'uppercase',
        }}
      >
        d
      </span>
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 900,
          fontSize: `${height * 0.65}px`,
          letterSpacing: '-0.04em',
          color: '#103323',
          lineHeight: 0.9,
          textTransform: 'uppercase',
        }}
      >
        ay
      </span>
    </div>
    <span
      style={{
        fontFamily: 'var(--font-heading)',
        fontSize: `${height * 0.17}px`,
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: '#103323',
        textTransform: 'uppercase',
        marginTop: '3px',
      }}
    >
      Bhadresh &amp; Bhavesh Group
    </span>
  </div>
)

export const PracharDevelopersLogo: React.FC<{ height?: number }> = ({ height = 48 }) => (
  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
    {/* Architectural Line Glyph */}
    <svg width={height * 1.6} height={height * 0.45} viewBox="0 0 90 28" fill="none" stroke="#103323" strokeWidth="1.4">
      <path d="M8 26V18L18 12V26M18 12L28 8V26M28 8L38 15V26M38 15L48 6V26M48 6L58 12V26M58 12L68 18V26M68 18L78 22V26" />
      <line x1="4" y1="26" x2="84" y2="26" strokeWidth="2" />
    </svg>
    <div
      style={{
        fontFamily: 'var(--font-heading)',
        fontWeight: 800,
        fontSize: `${height * 0.28}px`,
        letterSpacing: '0.3em',
        color: '#103323',
        textTransform: 'uppercase',
        marginTop: '2px',
      }}
    >
      Prachar
    </div>
    <div
      style={{
        fontFamily: 'var(--font-heading)',
        fontWeight: 600,
        fontSize: `${height * 0.16}px`,
        letterSpacing: '0.45em',
        color: '#55665D',
        textTransform: 'uppercase',
        marginTop: '1px',
      }}
    >
      Developers
    </div>
    <div
      style={{
        fontFamily: 'var(--font-brand-serif)',
        fontStyle: 'italic',
        fontSize: `${height * 0.18}px`,
        color: '#7A8C82',
        marginTop: '1px',
      }}
    >
      — Building with Passion —
    </div>
  </div>
)
