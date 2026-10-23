import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const LifestyleSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  const lifestyleCards = [
    {
      id: 1,
      image: '/assets/lifestyle_kids.jpg',
      title: 'A brighter tomorrow for your kids.',
      tag: 'Family & Children',
      alt: 'Children happily playing with a dog in lush greenery',
    },
    {
      id: 2,
      image: '/assets/lifestyle_tennis.jpg',
      title: 'Active living.',
      tag: 'Sports & Fitness',
      alt: 'Tennis court surrounded by trees with active players',
    },
    {
      id: 3,
      image: '/assets/lifestyle_nature.jpg',
      title: "Nature's backdrop.",
      tag: 'Scenic Mountain Views',
      alt: 'Lush green rolling hills with morning mist and serenity',
    },
  ]

  // GSAP ScrollTrigger Entrance & Card Stagger
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        ['.lifestyle-title-anim', '.lifestyle-intro-anim'],
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Cards staggered reveal with subtle clip-mask
      gsap.fromTo(
        '.lifestyle-card-anim',
        { opacity: 0, y: 35, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.lifestyle-cards-grid',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="lifestyle"
      ref={sectionRef}
      style={{
        position: 'relative',
        paddingTop: 'clamp(5rem, 8vw, 7.5rem)',
        paddingBottom: 'clamp(5rem, 8vw, 7.5rem)',
        backgroundColor: 'var(--color-cream)',
      }}
    >
      <div className="container">
        {/* Header Row: Heading on left, Description on right */}
        <div className="lifestyle-header">
          <h2 className="lifestyle-title lifestyle-title-anim">
            <span style={{ color: 'var(--color-forest)' }}>Live. </span>
            <span style={{ color: 'var(--color-coral)' }}>Shop.</span>
            <br />
            <span style={{ color: 'var(--color-forest)' }}>Play. Repeat.</span>
          </h2>

          <p className="lifestyle-intro lifestyle-intro-anim">
            More life, smart living, more reasons to look forward to coming home. Explore
            the lifestyle at Kharghar Hills.
          </p>
        </div>

        {/* 3 Lifestyle Cards Grid */}
        <div className="lifestyle-cards-grid">
          {lifestyleCards.map((card) => (
            <div key={card.id} className="lifestyle-card lifestyle-card-anim">
              <div className="lifestyle-image-wrap">
                <img
                  src={card.image}
                  alt={card.alt}
                  className="lifestyle-img"
                  loading="lazy"
                  decoding="async"
                  width="1200"
                  height="896"
                />
                <div className="lifestyle-overlay" />
                <div className="lifestyle-tag">{card.tag}</div>
              </div>
              <div className="lifestyle-caption">
                <h3 className="lifestyle-card-title">{card.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .lifestyle-header {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: clamp(2.5rem, 5vw, 4rem);
        }

        @media (min-width: 860px) {
          .lifestyle-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
          }
        }

        .lifestyle-title {
          font-family: var(--font-heading);
          font-size: clamp(2.4rem, 4.2vw, 3.8rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.025em;
          will-change: opacity, transform;
        }

        .lifestyle-intro {
          font-size: clamp(1rem, 1.3vw, 1.16rem);
          line-height: 1.6;
          color: var(--color-text-body);
          max-width: 480px;
          will-change: opacity, transform;
        }

        .lifestyle-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.75rem;
        }

        @media (min-width: 680px) {
          .lifestyle-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .lifestyle-cards-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
        }

        .lifestyle-card {
          background-color: #0A1E15;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 12px 32px rgba(16, 51, 35, 0.08);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          position: relative;
          will-change: opacity, transform;
        }

        .lifestyle-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(16, 51, 35, 0.16);
        }

        .lifestyle-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3.4;
          overflow: hidden;
        }

        .lifestyle-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .lifestyle-card:hover .lifestyle-img {
          transform: scale(1.03);
        }

        .lifestyle-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(10, 30, 21, 0.75) 100%);
          pointer-events: none;
        }

        .lifestyle-tag {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(16, 51, 35, 0.85);
          color: #D7F3E3;
          font-family: var(--font-heading);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.35rem 0.8rem;
          border-radius: var(--radius-pill);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(215, 243, 227, 0.25);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .lifestyle-caption {
          background-color: #0A1E15;
          padding: 1.25rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .lifestyle-card-title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.35;
        }

        @media (prefers-reduced-motion: reduce) {
          .lifestyle-card,
          .lifestyle-img,
          .lifestyle-title-anim,
          .lifestyle-intro-anim {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  )
}
