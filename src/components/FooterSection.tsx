import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { KhargharLogo, TodayGroupLogo, PracharDevelopersLogo } from './BrandIcons'
import { ArrowUp, ExternalLink, ShieldCheck } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const CURRENT_YEAR = 2026

export const FooterSection: React.FC = () => {
  const footerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = footerRef.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.footer-brand-strip', '.footer-nav-strip', '.footer-partners-strip', '.footer-bottom-bar'],
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="simple-footer"
      aria-label="Kharghar Hills Footer"
    >
      <div className="container">
        {/* ─── Top Brand & Navigation Row ─── */}
        <div className="footer-top-row">
          <div className="footer-brand-block">
            <KhargharLogo layout="horizontal" glyphSize={38} />
          </div>

          <nav className="footer-nav-menu" aria-label="Footer Navigation">
            <a href="#hero">Overview</a>
            <span className="footer-dot" aria-hidden="true">•</span>
            <a href="#promotional-video">Film</a>
            <span className="footer-dot" aria-hidden="true">•</span>
            <a href="#infrastructure">Infrastructure</a>
            <span className="footer-dot" aria-hidden="true">•</span>
            <a href="#lifestyle">Lifestyle</a>
            <span className="footer-dot" aria-hidden="true">•</span>
            <a href="#location">Location</a>
            <span className="footer-dot" aria-hidden="true">•</span>
            <a href="#pricing">Pricing</a>
            <span className="footer-dot" aria-hidden="true">•</span>
            <a href="#enquiry">Schedule Visit</a>
          </nav>
        </div>

        {/* ─── Unified Trust & MahaRERA Credentials Card ─── */}
        <div className="footer-trust-card">
          {/* Left: MahaRERA Registered */}
          <div className="trust-item trust-item-rera">
            <div className="maharera-qr-wrap">
              <img
                src="/assets/maharera_qr.png"
                alt="MahaRERA Registration QR"
                className="maharera-qr-img"
                width="54"
                height="54"
              />
            </div>
            <div className="maharera-text-group">
              <span className="maharera-label">MahaRERA Registered</span>
              <strong className="maharera-reg-num">P51800055726</strong>
              <a
                href="https://maharera.maharashtra.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="maharera-portal-link"
              >
                <span>maharera.maharashtra.gov.in</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>

          <div className="trust-divider" aria-hidden="true" />

          {/* Center: PRESENTED BY Prachar Developers */}
          <div className="trust-item trust-item-promoter">
            <span className="trust-label">PRESENTED BY</span>
            <div className="trust-logo-box">
              <PracharDevelopersLogo height={38} />
            </div>
          </div>

          <div className="trust-divider" aria-hidden="true" />

          {/* Right: DEVELOPED BY Today Group */}
          <div className="trust-item trust-item-developer">
            <span className="trust-label">DEVELOPED BY</span>
            <div className="trust-logo-box">
              <TodayGroupLogo height={38} />
            </div>
          </div>
        </div>

        {/* ─── Concise Legal Disclaimer ─── */}
        <div className="footer-disclaimer-card">
          <p className="disclaimer-text">
            <strong>Disclaimer:</strong> Artistic impressions, specifications, and project details are
            for representation purposes only. *₹54.99 Lacs+ reflects advertised starting prices from
            promotional materials. Taxes, floor-rise, statutory charges, and availability are subject to
            confirmation upon formal booking. Official details available on MahaRERA portal under
            registration P51800055726.
          </p>
        </div>

        {/* ─── Bottom Copyright & Back to Top Strip ─── */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            <ShieldCheck size={15} color="var(--color-forest)" />
            <span>&copy; {CURRENT_YEAR} Kharghar Hills. Authorized Channel Partner Portal.</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="back-to-top-btn"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>

      <style>{`
        .simple-footer {
          background-color: #FFFFFF;
          color: #1D2622;
          padding-top: clamp(2.25rem, 4vw, 3rem);
          padding-bottom: clamp(1.25rem, 2.5vw, 2rem);
          border-top: 1px solid #ECE7D9;
        }

        /* ── Top Row: Brand & Navigation ── */
        .footer-top-row {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 960px) {
          .footer-top-row {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 2rem;
          }
        }

        .footer-brand-block {
          display: flex;
          align-items: center;
        }

        .footer-nav-menu {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem 0.85rem;
        }

        .footer-nav-menu a {
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-forest);
          transition: color var(--transition-fast);
        }

        .footer-nav-menu a:hover {
          color: var(--color-coral);
        }

        .footer-dot {
          color: rgba(16, 51, 35, 0.22);
          font-size: 0.75rem;
        }

        /* ── Middle Row: Unified Trust & Credentials Card ── */
        .footer-trust-card {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          padding: 1.15rem 1.65rem;
          background: #FAFAF7;
          border-radius: var(--radius-md);
          border: 1px solid #ECE7D8;
          margin-bottom: 1.25rem;
          align-items: center;
        }

        @media (min-width: 860px) {
          .footer-trust-card {
            grid-template-columns: 1.35fr auto 1fr auto 1fr;
            gap: 1.5rem;
          }
        }

        .trust-item {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .trust-label {
          font-family: var(--font-heading);
          font-size: 0.64rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--color-text-muted);
          text-transform: uppercase;
        }

        .trust-logo-box {
          display: flex;
          align-items: center;
          height: 40px;
        }

        .trust-divider {
          display: none;
          width: 1px;
          height: 52px;
          background-color: #E6E1D2;
        }

        @media (min-width: 860px) {
          .trust-divider {
            display: block;
          }
        }

        .trust-item-rera {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.95rem;
        }

        .maharera-qr-wrap {
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          border: 1px solid #ECE7D9;
          border-radius: 6px;
          padding: 3px;
          background: #FFFFFF;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .maharera-qr-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .maharera-text-group {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .maharera-label {
          font-size: 0.64rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted);
          font-weight: 600;
        }

        .maharera-reg-num {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--color-forest);
          letter-spacing: 0.02em;
        }

        .maharera-portal-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.72rem;
          color: var(--color-coral);
          font-weight: 600;
          text-decoration: underline;
          transition: opacity 0.2s ease;
        }

        .maharera-portal-link:hover {
          opacity: 0.85;
        }

        /* ── Lower Row: Disclaimer ── */
        .footer-disclaimer-card {
          margin-bottom: 1.15rem;
          padding: 0.85rem 1.15rem;
          background: #FDFCF9;
          border-radius: var(--radius-sm);
          border: 1px solid #ECE7D8;
        }

        .disclaimer-text {
          font-size: 0.72rem;
          line-height: 1.6;
          color: var(--color-text-muted);
        }

        .disclaimer-text strong {
          color: var(--color-forest);
        }

        /* ── Bottom Bar ── */
        .footer-bottom-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid #ECE7D8;
        }

        @media (min-width: 600px) {
          .footer-bottom-bar {
            flex-direction: row;
          }
        }

        .footer-copyright {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.76rem;
          color: var(--color-text-muted);
        }

        .back-to-top-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-pill);
          border: 1px solid #DCD8CA;
          background: #FFFFFF;
          color: var(--color-forest);
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 700;
          transition: all var(--transition-fast);
        }

        .back-to-top-btn:hover {
          background: var(--color-forest);
          color: #FFFFFF;
          border-color: var(--color-forest);
          transform: translateY(-2px);
        }
      `}</style>
    </footer>
  )
}

export default FooterSection
