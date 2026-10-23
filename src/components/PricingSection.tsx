import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface PricingSectionProps {
  onOpenModal: (unitType?: string) => void
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenModal }) => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // 1. Floating card entrance
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 35, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 72%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // 2. Coordinated stagger of 1 BHK & 2 BHK boxes
      gsap.fromTo(
        '.pricing-box-anim',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.pricing-card',
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      )

      // 3. CTA emphasis reveal
      gsap.fromTo(
        '.pricing-cta-anim',
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.pricing-card',
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="pricing"
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: 'clamp(620px, 80vh, 840px)',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'clamp(4.5rem, 7vw, 6.5rem)',
        paddingBottom: 'clamp(4.5rem, 7vw, 6.5rem)',
        overflow: 'hidden',
      }}
    >
      {/* Background: High-Res Luxury Living Room Interior */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/assets/pricing_living_room.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          zIndex: 1,
        }}
      />

      {/* Subtle Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(250, 249, 245, 0.52) 0%, rgba(250, 249, 245, 0.16) 60%, rgba(0, 0, 0, 0.22) 100%)',
          zIndex: 2,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 3, width: '100%' }}>
        {/* Floating White Pricing Card Matching Page 5 */}
        <div ref={cardRef} className="pricing-card">
          <h2 className="pricing-title">
            Your home.{' '}
            <span style={{ color: 'var(--color-coral)' }}>Your budget.</span>
          </h2>

          {/* 1 BHK Pricing Box */}
          <div
            className="pricing-box pricing-box-anim"
            onClick={() => onOpenModal('1 BHK')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onOpenModal('1 BHK')}
            aria-label="1 BHK configuration starting from 54.99 Lacs plus"
          >
            <div className="unit-left">
              <span className="unit-type">1 BHK</span>
              <span className="unit-sub">Your own smart space.</span>
            </div>
            <div className="unit-right">
              <span className="price-tagline">STARTING FROM</span>
              <span className="unit-price">
                ₹54.99 <small>Lacs+</small>
              </span>
            </div>
          </div>

          {/* 2 BHK Pricing Box */}
          <div
            className="pricing-box pricing-box-anim"
            onClick={() => onOpenModal('2 BHK')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onOpenModal('2 BHK')}
            aria-label="2 BHK configuration starting from 84.99 Lacs plus"
          >
            <div className="unit-left">
              <span className="unit-type">2 BHK</span>
              <span className="unit-sub">More room for your family.</span>
            </div>
            <div className="unit-right">
              <span className="price-tagline">STARTING FROM</span>
              <span className="unit-price">
                ₹84.99 <small>Lacs+</small>
              </span>
            </div>
          </div>

          {/* Features check-strip */}
          <div className="pricing-perks">
            <div className="perk-item">
              <CheckCircle2 size={15} color="var(--color-forest)" />
              <span>Optimized Carpet Area</span>
            </div>
            <div className="perk-item">
              <CheckCircle2 size={15} color="var(--color-forest)" />
              <span>Vastu Compliant Layouts</span>
            </div>
            <div className="perk-item">
              <CheckCircle2 size={15} color="var(--color-forest)" />
              <span>Balcony Mountain Views</span>
            </div>
          </div>

          {/* Request Full Details Button */}
          <button
            type="button"
            onClick={() => onOpenModal('All Configurations')}
            className="btn-primary pricing-cta-btn pricing-cta-anim"
          >
            <span>Request full details</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .pricing-card {
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: var(--radius-xl);
          padding: clamp(2rem, 4.5vw, 3.5rem);
          max-width: 580px;
          box-shadow: 0 24px 64px rgba(16, 51, 35, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.65);
          will-change: transform, opacity;
        }

        .pricing-title {
          font-family: var(--font-heading);
          font-size: clamp(2.2rem, 3.8vw, 3.3rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.025em;
          color: var(--color-forest);
          margin-bottom: 2rem;
        }

        /* Creamy beige box container */
        .pricing-box {
          background-color: var(--color-beige-box);
          border: 1px solid var(--color-beige-border);
          border-radius: var(--radius-md);
          padding: 1.25rem 1.6rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.25s ease,
                      box-shadow 0.25s ease;
          will-change: transform, opacity;
        }

        .pricing-box:hover {
          transform: translateY(-2px);
          border-color: var(--color-coral);
          box-shadow: 0 8px 24px rgba(224, 64, 43, 0.12);
        }

        .unit-left {
          display: flex;
          flex-direction: column;
        }

        .unit-type {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--color-coral);
          line-height: 1.1;
        }

        .unit-sub {
          font-size: 0.88rem;
          color: var(--color-text-body);
          margin-top: 2px;
        }

        .unit-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
        }

        .price-tagline {
          font-family: var(--font-heading);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }

        .unit-price {
          font-family: var(--font-heading);
          font-size: clamp(1.6rem, 2.6vw, 2.2rem);
          font-weight: 800;
          color: var(--color-coral);
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .unit-price small {
          font-size: 1.05rem;
          font-weight: 700;
        }

        .pricing-perks {
          display: flex;
          flex-wrap: wrap;
          gap: 0.85rem;
          margin-top: 1.5rem;
          margin-bottom: 2rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(16, 51, 35, 0.08);
        }

        .perk-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: var(--color-text-body);
        }

        .pricing-cta-btn {
          width: 100%;
          padding: 1rem 2rem;
          font-size: 1.05rem;
          border-radius: var(--radius-sm);
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .pricing-card,
          .pricing-box,
          .pricing-cta-btn {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  )
}
