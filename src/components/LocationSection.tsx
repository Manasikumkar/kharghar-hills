import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  MapPin,
  Navigation,
  Plane,
  Train,
  Trees,
  Compass,
  Car,
  Clock,
  Sparkles,
  Route,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Landmark {
  name: string
  route: string
  time: string
  icon: React.ReactNode
}

const LANDMARKS: Landmark[] = [
  { name: 'Kharghar Valley Golf Course', route: 'Championship 18-hole greens', time: '7 mins', icon: <Compass size={15} /> },
  { name: 'Central Park (290 Acres)', route: 'Theme parks & jogging trails', time: '5 mins', icon: <Trees size={15} /> },
  { name: 'Navi Mumbai Metro Line 1', route: 'Sector 34 / Pendhar Station', time: '3 mins', icon: <Train size={15} /> },
  { name: 'Sion-Panvel Expressway', route: 'Direct Mumbai-Pune artery', time: '8 mins', icon: <Car size={15} /> },
  { name: "Navi Mumbai Int'l Airport", route: 'Amra Marg Airport corridor', time: '20 mins', icon: <Plane size={15} /> },
  { name: 'Atal Setu (MTHL Sea Link)', route: 'Direct bridge to South Mumbai', time: '25 mins', icon: <Navigation size={15} /> },
]

export const LocationSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const leftCardRef = useRef<HTMLDivElement | null>(null)
  const rightCardRef = useRef<HTMLDivElement | null>(null)
  const bgRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // 1. Panoramic background subtle parallax scale
      if (bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { scale: 1.08 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          }
        )
      }

      // 2. Coordinated smooth entrance for both small cards
      const cards = [leftCardRef.current, rightCardRef.current].filter(Boolean)
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="location"
      ref={sectionRef}
      className="location-section"
      aria-label="Kharghar Hills Location and Strategic Connectivity"
    >
      {/* Full-bleed Panoramic Mountain Background with subtle parallax */}
      <div
        ref={bgRef}
        className="location-bg-layer"
        aria-hidden="true"
        style={{
          backgroundImage: 'url(/assets/panorama_hills_web.jpg)',
        }}
      />

      {/* Balanced natural gradient overlay letting mountain scenery show through */}
      <div className="location-overlay" aria-hidden="true" />

      <div className="container location-container">
        {/* ─── Two Compact Balanced Boxes (Horizontal Side-by-Side) ─── */}
        <div className="location-boxes-grid">
          {/* Box 1: Story, Foothills & Microclimate */}
          <div ref={leftCardRef} className="location-small-card story-card">
            <div className="location-badge">
              <MapPin size={14} color="var(--color-coral)" />
              <span>Sector 36, Upper Kharghar • Foothills</span>
            </div>

            <h2 className="location-title">
              The hills. The city.
              <br />
              <span className="text-coral">The best of</span> both worlds.
            </h2>

            <p className="location-lead-text">
              Nestled at the verdant base of the Sahyadri mountains, Kharghar Hills provides a calm,
              clean natural sanctuary without ever detaching you from Navi Mumbai&apos;s rapidly growing
              economic corridors.
            </p>

            <div className="location-highlights-row">
              <div className="highlight-tag-box">
                <Sparkles size={15} color="var(--color-coral)" className="highlight-icon" />
                <div>
                  <strong>Clean Air Microclimate</strong>
                  <span>Hillside green living with cooler mountain breezes</span>
                </div>
              </div>
              <div className="highlight-tag-box">
                <Navigation size={15} color="var(--color-forest)" className="highlight-icon" />
                <div>
                  <strong>Future-Ready Hub</strong>
                  <span>Minutes from Metro, Airport &amp; Atal Setu link</span>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Key Connectivity Landmarks */}
          <div ref={rightCardRef} className="location-small-card landmarks-card">
            <div className="card-header-bar">
              <div className="card-header-title-wrap">
                <Route size={16} color="var(--color-coral)" />
                <h3 className="card-header-title">Key Connectivity</h3>
              </div>
              <span className="card-header-badge">Direct Access</span>
            </div>

            <div className="landmarks-compact-list">
              {LANDMARKS.map((item, idx) => (
                <div key={idx} className="landmark-compact-item">
                  <div className="landmark-item-icon">{item.icon}</div>
                  <div className="landmark-item-info">
                    <span className="landmark-item-name">{item.name}</span>
                    <span className="landmark-item-route">{item.route}</span>
                  </div>
                  <div className="landmark-item-time">
                    <Clock size={11} />
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ─── Section Base ─── */
        .location-section {
          position: relative;
          min-height: clamp(560px, 72vh, 720px);
          display: flex;
          align-items: center;
          padding: clamp(3rem, 5vw, 5rem) 0;
          overflow: hidden;
        }

        .location-bg-layer {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 35%;
          z-index: 1;
          will-change: transform;
        }

        .location-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(250, 249, 245, 0.72) 0%,
            rgba(250, 249, 245, 0.48) 50%,
            rgba(250, 249, 245, 0.75) 100%
          );
          z-index: 2;
        }

        .location-container {
          position: relative;
          z-index: 3;
          width: 100%;
        }

        /* ─── Two Compact Boxes Grid (Horizontal Layout) ─── */
        .location-boxes-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(1.25rem, 2vw, 2rem);
          align-items: stretch;
          max-width: 1140px;
          margin: 0 auto;
        }

        @media (min-width: 920px) {
          .location-boxes-grid {
            grid-template-columns: 1.08fr 1fr;
          }
        }

        /* ─── Shared Compact Card Styling ─── */
        .location-small-card {
          background-color: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-radius: var(--radius-lg);
          padding: clamp(1.5rem, 2.5vw, 2.25rem);
          box-shadow: 0 16px 45px rgba(16, 51, 35, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.85);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          will-change: transform, opacity;
          box-sizing: border-box;
        }

        /* ─── Box 1: Story Details ─── */
        .location-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-heading);
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-forest);
          background: rgba(16, 51, 35, 0.06);
          padding: 0.32rem 0.75rem;
          border-radius: var(--radius-pill);
          margin-bottom: 1rem;
          align-self: flex-start;
        }

        .location-title {
          font-family: var(--font-heading);
          font-size: clamp(1.75rem, 2.6vw, 2.35rem);
          font-weight: 800;
          line-height: 1.15;
          color: var(--color-forest);
          letter-spacing: -0.02em;
          margin-bottom: 0.9rem;
        }

        .location-lead-text {
          font-size: clamp(0.9rem, 1.1vw, 0.98rem);
          line-height: 1.6;
          color: var(--color-text-body);
          margin-bottom: 1.25rem;
        }

        .location-highlights-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.65rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(16, 51, 35, 0.08);
        }

        @media (min-width: 500px) {
          .location-highlights-row {
            grid-template-columns: 1fr 1fr;
          }
        }

        .highlight-tag-box {
          display: flex;
          align-items: flex-start;
          gap: 0.55rem;
          padding: 0.65rem 0.75rem;
          background: #FAF8F2;
          border: 1px solid #ECE7D8;
          border-radius: var(--radius-md);
        }

        .highlight-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .highlight-tag-box strong {
          display: block;
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-forest);
          line-height: 1.2;
        }

        .highlight-tag-box span {
          display: block;
          font-size: 0.7rem;
          color: var(--color-text-muted);
          line-height: 1.35;
          margin-top: 0.15rem;
        }

        /* ─── Box 2: Landmarks List ─── */
        .card-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.8rem;
          margin-bottom: 0.85rem;
          border-bottom: 1px solid rgba(16, 51, 35, 0.08);
        }

        .card-header-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .card-header-title {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 750;
          color: var(--color-forest);
          letter-spacing: -0.01em;
          margin: 0;
        }

        .card-header-badge {
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-coral);
          background: var(--color-coral-light);
          padding: 0.22rem 0.6rem;
          border-radius: var(--radius-pill);
          letter-spacing: 0.02em;
        }

        .landmarks-compact-list {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .landmark-compact-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.5rem 0.75rem;
          background: #FAF8F2;
          border: 1px solid #ECE7D8;
          border-radius: var(--radius-sm);
          transition: background-color var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast);
        }

        .landmark-compact-item:hover {
          background-color: #FFFFFF;
          border-color: rgba(16, 51, 35, 0.22);
          transform: translateY(-1px);
        }

        .landmark-item-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: rgba(16, 51, 35, 0.06);
          color: var(--color-forest);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .landmark-item-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .landmark-item-name {
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-forest);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .landmark-item-route {
          font-size: 0.69rem;
          color: var(--color-text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .landmark-item-time {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-family: var(--font-heading);
          font-weight: 700;
          color: var(--color-coral);
          background: var(--color-coral-light);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.72rem;
          flex-shrink: 0;
          white-space: nowrap;
        }

        /* ─── Responsive Optimizations ─── */
        @media (max-width: 640px) {
          .location-section {
            min-height: auto;
            padding: 2.75rem 0;
          }

          .location-small-card {
            padding: 1.25rem 1rem;
            border-radius: var(--radius-md);
          }

          .location-title {
            font-size: 1.65rem;
          }

          .landmark-compact-item {
            padding: 0.45rem 0.6rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .location-small-card,
          .landmark-compact-item,
          .location-bg-layer {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  )
}

export default LocationSection
