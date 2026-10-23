import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  KhargharLogo,
  VashiTransitIcon,
  AcresDevelopmentIcon,
  BookingBenefitsIcon,
  BiggestLaunchIcon,
  TownshipIcon,
} from './BrandIcons'

gsap.registerPlugin(ScrollTrigger)

interface HeroSectionProps {
  onOpenModal: () => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenModal }) => {
  const [vashiMins, setVashiMins] = useState(20)
  const [acresCount, setAcresCount] = useState(30)
  const heroRef = useRef<HTMLElement | null>(null)
  const archFrameRef = useRef<HTMLDivElement | null>(null)
  const archImageRef = useRef<HTMLImageElement | null>(null)
  const bgRef = useRef<HTMLDivElement | null>(null)

  // Pointer-responsive parallax (desktop only, no touch)
  useEffect(() => {
    const hero = heroRef.current
    const bg = bgRef.current
    if (!hero || !bg) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if ('ontouchstart' in window) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect()
      const xFrac = (e.clientX - rect.left) / rect.width - 0.5
      const yFrac = (e.clientY - rect.top) / rect.height - 0.5
      gsap.to(bg, {
        x: xFrac * -18,
        y: yFrac * -12,
        duration: 1.8,
        ease: 'power2.out',
      })
    }

    hero.addEventListener('mousemove', handleMouseMove)
    return () => hero.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const heroEl = heroRef.current
    if (!heroEl) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // 0. Background image fades in first — atmospheric entrance
      tl.fromTo(
        '.hero-bg-layer',
        { opacity: 0 },
        { opacity: 1, duration: 1.4, ease: 'power2.inOut' },
        0
      )

      // 1. Line-by-line staggered headline reveal
      tl.fromTo(
        '.hero-line-inner',
        { y: '110%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.95, stagger: 0.13 },
        0.3
      )

      // 2. Supporting copy fade & slide
      tl.fromTo(
        '.hero-description-anim',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.75 },
        '-=0.45'
      )

      // 3. Price pill and advance booking badge
      tl.fromTo(
        ['.hero-price-pill-anim', '.hero-booking-notice-anim'],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.14 },
        '-=0.38'
      )

      // 4. Sequential Metric icons & count-up
      tl.fromTo(
        '.metric-item-anim',
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.52,
          stagger: 0.09,
          onStart: () => {
            const numObj = { vashi: 0, acres: 0 }
            gsap.to(numObj, {
              vashi: 20,
              acres: 30,
              duration: 1.4,
              ease: 'power2.out',
              onUpdate: () => {
                setVashiMins(Math.round(numObj.vashi))
                setAcresCount(Math.round(numObj.acres))
              },
            })
          },
        },
        '-=0.3'
      )

      // 5. Cinematic Image landing with dynamic scale, entrance and gentle floating
      if (archFrameRef.current) {
        tl.fromTo(
          archFrameRef.current,
          { opacity: 0, scale: 0.92, y: 45 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.3,
            ease: 'power3.out',
            onComplete: () => {
              // Gentle, luxurious organic floating motion so image isn't static
              gsap.to(archFrameRef.current, {
                y: -8,
                duration: 3.4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
              })
            },
          },
          0.2
        )
      }

      if (archImageRef.current) {
        tl.fromTo(
          archImageRef.current,
          { scale: 1.12, filter: 'blur(3px)' },
          { scale: 1.02, filter: 'blur(0px)', duration: 1.6, ease: 'power2.out' },
          0.25
        )
      }

      tl.fromTo(
        '.hero-arch-logo',
        { opacity: 0, y: -18, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power2.out' },
        0.5
      )

      // 6. Restrained parallax on hero image during scroll
      if (archImageRef.current) {
        gsap.to(archImageRef.current, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: heroEl,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.4,
          },
        })
      }

      // 7. Very subtle background parallax on scroll
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: heroEl,
            start: 'top top',
            end: 'bottom top',
            scrub: 2,
          },
        })
      }
    }, heroEl)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      style={{
        position: 'relative',
        paddingTop: 'clamp(7rem, 11vw, 9rem)',
        paddingBottom: 'clamp(4rem, 6.5vw, 6rem)',
        backgroundColor: 'var(--color-cream)',
        overflow: 'hidden',
      }}
    >
      {/* ─── Atmospheric Background Image Layer ─── */}
      <div
        ref={bgRef}
        className="hero-bg-layer"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-8%',
          backgroundImage: 'url(/assets/panorama_hills_web.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 55%',
          opacity: 0,          // starts at 0, GSAP fades in
          willChange: 'transform, opacity',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ─── Warm off-white overlay: preserves light premium look ─── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          // Stronger on left (text), lighter on right (arch image)
          // Soft transparent gradient so the landscape background flows naturally across both sides
          background: `
            linear-gradient(105deg,
              rgba(250,249,245,0.72) 0%,
              rgba(250,249,245,0.68) 38%,
              rgba(250,249,245,0.58) 58%,
              rgba(250,249,245,0.48) 78%,
              rgba(250,249,245,0.38) 100%
            ),
            linear-gradient(180deg,
              rgba(250,249,245,0.35) 0%,
              rgba(250,249,245,0.1) 40%,
              rgba(250,249,245,0.15) 70%,
              rgba(250,249,245,0.45) 100%
            )
          `,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* ─── Subtle radial green glow behind arch image ─── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '-5%',
          top: '5%',
          width: '55%',
          height: '90%',
          background: 'radial-gradient(ellipse at 65% 45%, rgba(16,51,35,0.06) 0%, rgba(16,51,35,0.03) 45%, transparent 72%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-grid">
          {/* ─── Left Column: Headlines, Highlights, and CTAs ─── */}
          <div className="hero-content">
            {/* Staggered Line Headline */}
            <h1 className="hero-title">
              <span className="hero-line-wrap">
                <span className="hero-line-inner">The future</span>
              </span>
              <span className="hero-line-wrap">
                <span className="hero-line-inner">has a beautiful</span>
              </span>
              <span className="hero-line-wrap">
                <span className="hero-line-inner">new address.</span>
              </span>
            </h1>

            <p className="hero-description hero-description-anim">
              Discover a bigger way of life at <strong>Kharghar Hills</strong>. Panoramic
              mountain &amp; city views, envisioned for the way tomorrow lives.
            </p>

            {/* Price Pill Banner */}
            <div
              className="hero-price-pill hero-price-pill-anim"
              onClick={onOpenModal}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onOpenModal()}
              aria-label="1 and 2 BHK Homes from 54.99 Lacs plus. Click to enquire."
            >
              <span className="price-label">1 &amp; 2 BHK HOMES FROM</span>
              <span className="price-amount">₹54.99 LACS+</span>
              <span className="price-pill-glint" aria-hidden="true" />
            </div>

            {/* Advance Bookings Open */}
            <div className="hero-booking-notice hero-booking-notice-anim">
              <span className="booking-title">Advance Bookings Open</span>
              <div className="booking-line" />
            </div>

            {/* 5 Project Highlight Metrics Strip with Sequential Reveal */}
            <div className="hero-metrics-strip">
              <div className="metric-item metric-item-anim">
                <div className="metric-icon">
                  <VashiTransitIcon size={26} color="#103323" />
                </div>
                <div className="metric-text">
                  <strong>{vashiMins || 20} mins</strong>
                  <span>from Vashi</span>
                </div>
              </div>

              <div className="metric-divider" />

              <div className="metric-item metric-item-anim">
                <div className="metric-icon">
                  <AcresDevelopmentIcon size={26} color="#103323" />
                </div>
                <div className="metric-text">
                  <strong>{acresCount || 30} acres of</strong>
                  <span>development</span>
                </div>
              </div>

              <div className="metric-divider" />

              <div className="metric-item metric-item-anim">
                <div className="metric-icon">
                  <BookingBenefitsIcon size={26} color="#103323" />
                </div>
                <div className="metric-text">
                  <strong>Advance booking</strong>
                  <span>benefits</span>
                </div>
              </div>

              <div className="metric-divider" />

              <div className="metric-item metric-item-anim">
                <div className="metric-icon">
                  <BiggestLaunchIcon size={26} color="#103323" />
                </div>
                <div className="metric-text">
                  <strong>Biggest launch</strong>
                  <span>of Navi Mumbai</span>
                </div>
              </div>

              <div className="metric-divider" />

              <div className="metric-item metric-item-anim">
                <div className="metric-icon">
                  <TownshipIcon size={26} color="#103323" />
                </div>
                <div className="metric-text">
                  <strong>Navi Mumbai's</strong>
                  <span>biggest township</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right Column: Architectural Arched Window with Parallax ─── */}
          <div className="hero-arch-column">
            {/* Subtle halo behind arch for depth */}
            <div className="hero-arch-halo" aria-hidden="true" />

            <div ref={archFrameRef} className="hero-arch-frame">
              {/* Top Brand Logo inside Arch */}
              <div className="hero-arch-logo">
                <KhargharLogo variant="dark" />
              </div>

              {/* Landscape Image with parallax within frame */}
              <div className="hero-arch-image-wrap">
                <img
                  ref={archImageRef}
                  src="/assets/hero_arch_hills.jpg"
                  alt="Kharghar Hills lush greenery and panoramic skyline view"
                  className="hero-arch-image"
                  fetchPriority="high"
                  loading="eager"
                  width="1376"
                  height="768"
                />
                <div className="hero-arch-overlay" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Grid Layout ── */
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }

        @media (min-width: 980px) {
          .hero-grid {
            grid-template-columns: 1.18fr 0.82fr;
            gap: clamp(2.5rem, 5vw, 5.5rem);
          }
        }

        /* ── Headline ── */
        .hero-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: clamp(2.5rem, 4.8vw, 4.25rem);
          line-height: 1.07;
          color: var(--color-forest);
          letter-spacing: -0.03em;
          margin-bottom: 1.65rem;
        }

        .hero-line-wrap {
          display: block;
          overflow: hidden;
          padding-bottom: 0.1em;
        }

        .hero-line-inner {
          display: block;
          will-change: transform, opacity;
        }

        /* ── Description ── */
        .hero-description {
          font-size: clamp(1.02rem, 1.4vw, 1.22rem);
          line-height: 1.6;
          color: #0E291B; /* dark, high-contrast forest */
          font-weight: 550;
          max-width: 530px;
          margin-bottom: 2.15rem;
          will-change: opacity, transform;
        }

        .hero-description strong {
          color: #071911;
          font-weight: 800;
        }

        /* ── Price Pill ── */
        .hero-price-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          background-color: var(--color-forest);
          color: #FFFFFF;
          padding: 0.85rem 1.75rem;
          border-radius: var(--radius-pill);
          box-shadow:
            0 4px 18px rgba(16, 51, 35, 0.22),
            inset 0 1px 0 rgba(255,255,255,0.08);
          margin-bottom: 1.85rem;
          cursor: pointer;
          transition:
            transform 0.32s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.32s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
          position: relative;
          overflow: hidden;
        }

        .hero-price-pill:hover {
          transform: translateY(-3px);
          box-shadow:
            0 10px 32px rgba(16, 51, 35, 0.3),
            inset 0 1px 0 rgba(255,255,255,0.12);
        }

        .hero-price-pill:active {
          transform: translateY(-1px);
        }

        /* Glint shimmer on the price pill */
        .price-pill-glint {
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            105deg,
            transparent 20%,
            rgba(255, 255, 255, 0.18) 50%,
            transparent 80%
          );
          animation: pillGlint 5s ease-in-out infinite 1.5s;
          pointer-events: none;
        }

        @keyframes pillGlint {
          0%    { left: -100%; }
          18%   { left: 120%; }
          100%  { left: 120%; }
        }

        .price-label {
          font-family: var(--font-heading);
          font-size: clamp(0.78rem, 1.05vw, 0.94rem);
          font-weight: 600;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.88);
        }

        .price-amount {
          font-family: var(--font-heading);
          font-size: clamp(0.98rem, 1.35vw, 1.28rem);
          font-weight: 800;
          letter-spacing: 0.02em;
          color: #FFFFFF;
        }

        /* ── Advance Bookings Open ── */
        .hero-booking-notice {
          margin-bottom: 2.15rem;
          max-width: 300px;
          will-change: opacity, transform;
        }

        .booking-title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: #081F14;
          display: block;
          margin-bottom: 0.45rem;
          letter-spacing: 0.01em;
        }

        .booking-line {
          width: 100%;
          height: 1.5px;
          background: linear-gradient(
            90deg,
            rgba(16, 51, 35, 0.85) 0%,
            rgba(16, 51, 35, 0.4) 55%,
            rgba(16, 51, 35, 0) 100%
          );
          border-radius: 2px;
        }

        /* ── Metrics Strip ── */
        .hero-metrics-strip {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.35rem;
          padding-top: 0.4rem;
        }

        @media (min-width: 640px) {
          .hero-metrics-strip {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: nowrap;
            gap: 0.6rem;
          }
        }

        .metric-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          will-change: opacity, transform;
        }

        .metric-icon {
          flex-shrink: 0;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(16, 51, 35, 0.18);
          box-shadow: 0 4px 12px rgba(16, 51, 35, 0.06);
          border-radius: 10px;
          transition: background 0.25s ease, transform 0.25s ease;
        }

        .metric-item:hover .metric-icon {
          background: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(16, 51, 35, 0.12);
        }

        .metric-text {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }

        .metric-text strong {
          font-family: var(--font-heading);
          font-size: 0.84rem;
          font-weight: 800;
          color: #071911; /* crisp pitch forest */
        }

        .metric-text span {
          font-size: 0.74rem;
          font-weight: 600;
          color: #123324; /* dark readable forest green */
        }

        .metric-divider {
          display: none;
          width: 1px;
          height: 32px;
          background-color: rgba(16, 51, 35, 0.14);
          border-radius: 1px;
          flex-shrink: 0;
          margin: 0 0.3rem;
        }

        @media (min-width: 640px) {
          .metric-divider {
            display: block;
          }
        }

        /* ── Arch Column ── */
        .hero-arch-column {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        /* Soft luminous halo behind arch */
        .hero-arch-halo {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 110%;
          height: 110%;
          background: radial-gradient(
            ellipse at 50% 50%,
            rgba(16, 51, 35, 0.1) 0%,
            rgba(16, 51, 35, 0.04) 50%,
            transparent 72%
          );
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .hero-arch-frame {
          width: 100%;
          max-width: 470px;
          aspect-ratio: 1 / 1.38;
          border-radius: 240px 240px 24px 24px;
          background-color: #EAF2EB;
          overflow: hidden;
          position: relative;
          z-index: 1;
          box-shadow:
            0 28px 70px rgba(16, 51, 35, 0.13),
            0 8px 24px rgba(16, 51, 35, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.55);
          display: flex;
          flex-direction: column;
          border: 1.5px solid rgba(16, 51, 35, 0.09);
          transition:
            transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }

        .hero-arch-frame:hover {
          transform: translateY(-5px);
          box-shadow:
            0 36px 80px rgba(16, 51, 35, 0.18),
            0 10px 28px rgba(16, 51, 35, 0.09),
            inset 0 1px 0 rgba(255, 255, 255, 0.55);
        }

        .hero-arch-logo {
          padding-top: 3rem;
          padding-bottom: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2;
          position: relative;
          background: linear-gradient(
            180deg,
            rgba(234, 242, 235, 1) 0%,
            rgba(234, 242, 235, 0.96) 60%,
            rgba(234, 242, 235, 0) 100%
          );
        }

        .hero-arch-image-wrap {
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .hero-arch-image {
          width: 100%;
          height: 115%;
          object-fit: cover;
          object-position: center bottom;
          will-change: transform;
          display: block;
        }

        .hero-arch-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(234, 242, 235, 0.2) 0%,
            rgba(16, 51, 35, 0.18) 100%
          );
          pointer-events: none;
        }

        /* ── Reduced Motion ── */
        @media (prefers-reduced-motion: reduce) {
          .hero-bg-layer,
          .hero-arch-frame,
          .hero-arch-image,
          .hero-price-pill,
          .hero-line-inner,
          .hero-description,
          .metric-item,
          .price-pill-glint {
            transition: none !important;
            transform: none !important;
            animation: none !important;
          }

          .hero-bg-layer {
            opacity: 1 !important;
          }
        }

        /* ── Mobile Responsive ── */
        @media (max-width: 768px) {
          .hero-title {
            font-size: clamp(2.1rem, 7.5vw, 2.85rem);
          }

          .hero-arch-frame {
            max-width: 340px;
            border-radius: 180px 180px 20px 20px;
          }

          .hero-arch-logo {
            padding-top: 2rem;
            padding-bottom: 1.5rem;
          }

          .hero-description {
            font-size: 0.97rem;
          }

          .hero-price-pill {
            padding: 0.75rem 1.4rem;
          }
        }

        @media (max-width: 480px) {
          .hero-arch-frame {
            max-width: 290px;
            border-radius: 145px 145px 16px 16px;
          }

          .hero-metrics-strip {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.1rem;
          }
        }
      `}</style>
    </section>
  )
}
