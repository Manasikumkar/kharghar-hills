import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play, ArrowRight, Sparkles, ExternalLink } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface PromotionalVideoSectionProps {
  onOpenModal: () => void
}

export const PromotionalVideoSection: React.FC<PromotionalVideoSectionProps> = ({ onOpenModal }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [imgSrc, setImgSrc] = useState('/assets/promo_video_thumbnail.jpg')
  const [hasError, setHasError] = useState(false)
  const [iframeLoading, setIframeLoading] = useState(false)

  const sectionRef = useRef<HTMLElement | null>(null)
  const headerRef = useRef<HTMLDivElement | null>(null)
  const videoWrapperRef = useRef<HTMLDivElement | null>(null)
  const infoBarRef = useRef<HTMLDivElement | null>(null)

  // Resilient fallback chain
  const handleImageError = () => {
    if (imgSrc === '/assets/promo_video_thumbnail.jpg') {
      setImgSrc('/assets/infra_cinematic_bg.jpg')
    } else {
      setImgSrc('/assets/hero_arch_hills.jpg')
    }
  }

  // Handle Play Click
  const handlePlayClick = () => {
    setIsPlaying(true)
    setIframeLoading(true)
  }

  // GSAP ScrollTrigger entrance animations
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // 1. Heading Elements Reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // 2. Video Container Reveal
      if (videoWrapperRef.current) {
        gsap.fromTo(
          videoWrapperRef.current,
          { opacity: 0, y: 35, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: videoWrapperRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // 3. Supporting Info Bar Reveal
      if (infoBarRef.current) {
        gsap.fromTo(
          infoBarRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: infoBarRef.current,
              start: 'top 90%',
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
      id="promotional-video"
      ref={sectionRef}
      className="promo-video-section"
      aria-label="Kharghar Hills Promotional Video"
    >
      {/* Background Ambience: Subtle Warm Neutral with very light organic gradient */}
      <div className="promo-bg-layer" aria-hidden="true" />

      <div className="container promo-container">
        {/* Section Header */}
        <div ref={headerRef} className="promo-header">
          <div className="promo-eyebrow">
            <span className="promo-eyebrow-dot" />
            <span className="promo-eyebrow-text">COMING SOON</span>
          </div>

          <h2 className="promo-title">
            A beautiful new address is on its way.
          </h2>

          <p className="promo-description">
            Discover Kharghar Hills — thoughtfully positioned for your next chapter in Navi Mumbai.
          </p>
        </div>

        {/* Video Presentation Container (Cinematic 16:9 Frame) */}
        <div ref={videoWrapperRef} className="promo-video-wrapper">
          <div className="promo-video-aspect">
            {!isPlaying ? (
              /* Pre-play Poster & Play Action */
              <div
                className="promo-poster-card"
                onClick={handlePlayClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handlePlayClick()
                  }
                }}
                aria-label="Play Kharghar Hills Promotional Video"
              >
                <img
                  src={imgSrc}
                  alt="Kharghar Hills Promotional Video Preview"
                  className="promo-poster-img"
                  loading="lazy"
                  onError={handleImageError}
                />

                {/* Subtle Cinematic Vignette Overlay */}
                <div className="promo-poster-overlay" />

                {/* Play Button Interface */}
                <div className="promo-play-btn-wrap">
                  <div className="promo-play-pulse-ring" aria-hidden="true" />
                  <button
                    type="button"
                    className="promo-play-btn"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <Play className="promo-play-icon" size={28} />
                  </button>
                  <span className="promo-play-label">Watch Project Film</span>
                </div>

                {/* Corner Film Tag */}
                <div className="promo-tag-badge">
                  <Sparkles size={14} className="promo-tag-icon" />
                  <span>Official Project Preview</span>
                </div>
              </div>
            ) : (
              /* Active YouTube Responsive Embed */
              <div className="promo-iframe-container">
                {iframeLoading && (
                  <div className="promo-iframe-spinner" aria-live="polite">
                    <div className="promo-spinner-circle" />
                    <span>Loading cinematic video...</span>
                  </div>
                )}

                <iframe
                  src="https://www.youtube-nocookie.com/embed/IyJn4-ZOI9s?autoplay=1&rel=0&modestbranding=1&playsinline=1"
                  title="Kharghar Hills Promotional Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="promo-iframe"
                  onLoad={() => setIframeLoading(false)}
                  onError={() => setHasError(true)}
                />

                {hasError && (
                  <div className="promo-error-fallback">
                    <p>Unable to load embedded video player in this browser.</p>
                    <a
                      href="https://www.youtube.com/watch?v=IyJn4-ZOI9s"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="promo-error-link"
                    >
                      <span>Watch directly on YouTube</span>
                      <ExternalLink size={15} />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Supporting Homebuyer Message Bar */}
        <div ref={infoBarRef} className="promo-info-strip">
          <div className="promo-info-left">
            <span className="promo-info-tagline">Your next home could be here.</span>
            <div className="promo-info-specs">
              <span className="promo-units-highlight">1 &amp; 2 BHK homes</span>
              <span className="promo-info-dot" aria-hidden="true">•</span>
              <span className="promo-price-highlight">from ₹54.99 lakhs+</span>
            </div>
          </div>

          <div className="promo-info-middle">
            <span className="promo-booking-badge">
              <span className="promo-booking-pulse" />
              Advance Bookings Open
            </span>
          </div>

          <div className="promo-info-right">
            <button
              type="button"
              onClick={onOpenModal}
              className="btn-primary promo-enquire-btn"
              aria-label="Enquire now about Kharghar Hills 1 and 2 BHK homes"
            >
              <span>Enquire Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* ─── Video Section Architecture ─── */
        .promo-video-section {
          position: relative;
          background-color: var(--color-cream);
          padding: clamp(4.25rem, 6.5vw, 6.5rem) 0 clamp(4rem, 6vw, 6rem);
          overflow: hidden;
        }

        .promo-bg-layer {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 20%,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(250, 249, 245, 0.4) 60%,
            var(--color-cream) 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        .promo-container {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ─── Header Styling ─── */
        .promo-header {
          text-align: center;
          max-width: 780px;
          margin-bottom: clamp(2rem, 3.8vw, 3.25rem);
        }

        .promo-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.95rem;
          background: rgba(16, 51, 35, 0.05);
          border: 1px solid rgba(16, 51, 35, 0.12);
          border-radius: var(--radius-pill);
          margin-bottom: 1.1rem;
        }

        .promo-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: var(--color-coral);
          box-shadow: 0 0 8px var(--color-coral-glow);
          display: inline-block;
        }

        .promo-eyebrow-text {
          font-family: var(--font-heading);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--color-forest);
        }

        .promo-title {
          font-size: clamp(2rem, 3.4vw, 2.85rem);
          font-weight: 700;
          line-height: 1.18;
          color: var(--color-forest);
          letter-spacing: -0.025em;
          margin-bottom: 1rem;
        }

        .promo-description {
          font-size: clamp(1rem, 1.25vw, 1.15rem);
          line-height: 1.6;
          color: var(--color-text-body);
          max-width: 620px;
          margin-left: auto;
          margin-right: auto;
        }

        /* ─── Cinematic Video Container ─── */
        .promo-video-wrapper {
          width: 100%;
          max-width: 1080px;
          border-radius: clamp(12px, 1.8vw, 22px);
          overflow: hidden;
          background-color: #071911;
          box-shadow:
            0 24px 64px -12px rgba(16, 51, 35, 0.16),
            0 8px 24px -6px rgba(0, 0, 0, 0.06),
            0 0 0 1px rgba(16, 51, 35, 0.08);
          transition: transform var(--transition-normal), box-shadow var(--transition-normal);
        }

        .promo-video-wrapper:hover {
          box-shadow:
            0 32px 76px -12px rgba(16, 51, 35, 0.22),
            0 12px 30px -6px rgba(0, 0, 0, 0.08),
            0 0 0 1px rgba(16, 51, 35, 0.12);
        }

        .promo-video-aspect {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
        }

        /* Poster Card (Pre-play) */
        .promo-poster-card {
          position: absolute;
          inset: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .promo-poster-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform: scale(1.01);
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease;
        }

        .promo-poster-card:hover .promo-poster-img {
          transform: scale(1.04);
          filter: brightness(0.95);
        }

        .promo-poster-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(7, 25, 17, 0.28) 0%,
            rgba(7, 25, 17, 0.15) 40%,
            rgba(7, 25, 17, 0.45) 80%,
            rgba(7, 25, 17, 0.72) 100%
          );
          transition: background-color 0.4s ease;
        }

        .promo-poster-card:hover .promo-poster-overlay {
          background: linear-gradient(
            180deg,
            rgba(7, 25, 17, 0.2) 0%,
            rgba(7, 25, 17, 0.08) 40%,
            rgba(7, 25, 17, 0.38) 80%,
            rgba(7, 25, 17, 0.65) 100%
          );
        }

        /* Play Button Cluster */
        .promo-play-btn-wrap {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.9rem;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .promo-poster-card:hover .promo-play-btn-wrap {
          transform: translate(-50%, -50%) scale(1.08);
        }

        .promo-play-pulse-ring {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(224, 64, 43, 0.35);
          animation: promoPulse 2.4s infinite cubic-bezier(0.4, 0, 0.6, 1);
          pointer-events: none;
        }

        @keyframes promoPulse {
          0% {
            transform: translateX(-50%) scale(0.9);
            opacity: 0.8;
          }
          70% {
            transform: translateX(-50%) scale(1.55);
            opacity: 0;
          }
          100% {
            transform: translateX(-50%) scale(1.55);
            opacity: 0;
          }
        }

        .promo-play-btn {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E0402B 0%, #C53421 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 12px 32px rgba(224, 64, 43, 0.45),
            0 0 0 4px rgba(255, 255, 255, 0.35);
          transition: background-color 0.25s ease, box-shadow 0.25s ease;
        }

        .promo-play-icon {
          margin-left: 4px; /* visually center play triangle */
          fill: #FFFFFF;
        }

        .promo-play-label {
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #FFFFFF;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
        }

        /* Tag Badge on Poster */
        .promo-tag-badge {
          position: absolute;
          top: 1.25rem;
          left: 1.25rem;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-pill);
          background: rgba(7, 25, 17, 0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: rgba(255, 255, 255, 0.92);
          font-family: var(--font-heading);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .promo-tag-icon {
          color: #E2B96D; /* warm luxury gold accent */
        }

        /* ─── Active Iframe ─── */
        .promo-iframe-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .promo-iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        .promo-iframe-spinner {
          position: absolute;
          inset: 0;
          background: #071911;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          z-index: 2;
        }

        .promo-spinner-circle {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.15);
          border-top-color: var(--color-coral);
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .promo-error-fallback {
          position: absolute;
          inset: 0;
          background: #071911;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: #FFFFFF;
          padding: 1.5rem;
          text-align: center;
          z-index: 3;
        }

        .promo-error-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--color-coral);
          font-weight: 600;
          text-decoration: underline;
        }

        /* ─── Supporting Info Strip ─── */
        .promo-info-strip {
          width: 100%;
          max-width: 1080px;
          margin-top: 1.5rem;
          padding: 1.15rem 1.75rem;
          background: #FFFFFF;
          border-radius: var(--radius-md);
          border: 1px solid rgba(16, 51, 35, 0.08);
          box-shadow: 0 8px 24px rgba(16, 51, 35, 0.04);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .promo-info-left {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .promo-info-tagline {
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-text-muted);
        }

        .promo-info-specs {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--color-forest);
        }

        .promo-units-highlight {
          color: var(--color-forest);
        }

        .promo-info-dot {
          color: rgba(16, 51, 35, 0.25);
          font-weight: 400;
        }

        .promo-price-highlight {
          color: var(--color-coral);
          font-weight: 700;
        }

        .promo-info-middle {
          display: flex;
          align-items: center;
        }

        .promo-booking-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 1rem;
          background: var(--color-mint-light);
          border: 1px solid rgba(61, 170, 115, 0.25);
          border-radius: var(--radius-pill);
          color: var(--color-forest-light);
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        .promo-booking-pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: var(--color-mint-accent);
          box-shadow: 0 0 6px var(--color-mint-glow);
        }

        .promo-info-right {
          display: flex;
          align-items: center;
        }

        .promo-enquire-btn {
          white-space: nowrap;
          padding: 0.75rem 1.6rem;
          font-size: 0.9rem;
        }

        /* ─── Responsive Layout Adjustments ─── */
        @media (max-width: 900px) {
          .promo-info-strip {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.1rem;
            padding: 1.25rem 1.4rem;
          }

          .promo-info-middle {
            align-self: flex-start;
          }

          .promo-info-right {
            width: 100%;
          }

          .promo-enquire-btn {
            width: 100%;
          }
        }

        @media (max-width: 600px) {
          .promo-header {
            margin-bottom: 1.75rem;
          }

          .promo-play-btn {
            width: 64px;
            height: 64px;
          }

          .promo-play-pulse-ring {
            width: 64px;
            height: 64px;
          }

          .promo-play-icon {
            width: 22px;
            height: 22px;
          }

          .promo-play-label {
            font-size: 0.8rem;
          }

          .promo-tag-badge {
            top: 0.75rem;
            left: 0.75rem;
            padding: 0.3rem 0.65rem;
            font-size: 0.68rem;
          }

          .promo-info-specs {
            flex-wrap: wrap;
            font-size: 0.98rem;
            gap: 0.35rem 0.5rem;
          }
        }
      `}</style>
    </section>
  )
}

export default PromotionalVideoSection
