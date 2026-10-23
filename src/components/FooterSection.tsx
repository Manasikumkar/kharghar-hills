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
        {/* ─── Top Brand & Value Strip ─── */}
        <div className="footer-brand-strip">
          <KhargharLogo layout="horizontal" glyphSize={36} />
          <div className="footer-brand-text">
            <span className="footer-tagline">30-Acre Hillside Residential Township</span>
            <span className="footer-price-tag">1 &amp; 2 BHK Homes from ₹54.99 Lacs+ • Advance Bookings Open</span>
          </div>
        </div>

        {/* ─── Clean Navigation Links ─── */}
        <nav className="footer-nav-strip" aria-label="Footer Navigation">
          <a href="#hero">Overview</a>
          <span className="footer-nav-dot" aria-hidden="true">•</span>
          <a href="#promotional-video">Project Film</a>
          <span className="footer-nav-dot" aria-hidden="true">•</span>
          <a href="#infrastructure">Infrastructure</a>
          <span className="footer-nav-dot" aria-hidden="true">•</span>
          <a href="#lifestyle">Lifestyle</a>
          <span className="footer-nav-dot" aria-hidden="true">•</span>
          <a href="#location">Location</a>
          <span className="footer-nav-dot" aria-hidden="true">•</span>
          <a href="#pricing">Pricing</a>
          <span className="footer-nav-dot" aria-hidden="true">•</span>
          <a href="#enquiry">Schedule Visit</a>
        </nav>

        {/* ─── Developer & MahaRERA Strip ─── */}
        <div className="footer-partners-strip">
          <div className="footer-partner-col">
            <span className="partners-label">DEVELOPED BY</span>
            <div className="partner-logo-item">
              <TodayGroupLogo height={38} />
            </div>
          </div>

          <div className="footer-partner-col">
            <span className="partners-label">PRESENTED BY</span>
            <div className="partner-logo-item">
              <PracharDevelopersLogo height={38} />
            </div>
          </div>

          <div className="maharera-simple-box">
            <div className="maharera-qr-wrap">
              <img
                src="/assets/maharera_qr.png"
                alt="MahaRERA Registration QR"
                className="maharera-qr-img"
                width="64"
                height="64"
              />
            </div>
            <div className="maharera-info">
              <span className="maharera-label">MahaRERA Registered</span>
              <strong className="maharera-number">P51800055726</strong>
              <a
                href="https://maharera.maharashtra.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="maharera-link"
              >
                <span>maharera.maharashtra.gov.in</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>

        {/* ─── Concise Legal Disclaimer ─── */}
        <div className="footer-disclaimer-wrap">
          <p className="disclaimer-text">
            <strong>Disclaimer:</strong> Artistic impressions, specifications, and project details are
            for representation purposes only. *₹54.99 Lacs+ reflects the advertised starting price from
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
          padding-top: clamp(3rem, 5vw, 4.25rem);
          padding-bottom: clamp(1.75rem, 3vw, 2.5rem);
          border-top: 1px solid #ECE7D9;
        }

        /* Brand Strip */
        .footer-brand-strip {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.85rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 768px) {
          .footer-brand-strip {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }

        .footer-brand-text {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .footer-tagline {
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-forest);
          letter-spacing: 0.04em;
        }

        .footer-price-tag {
          font-size: 0.78rem;
          color: var(--color-text-muted);
        }

        /* Navigation Strip */
        .footer-nav-strip {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.75rem 1rem;
          padding: 1.1rem 0;
          margin-bottom: 2rem;
          border-top: 1px solid #F0ECE1;
          border-bottom: 1px solid #F0ECE1;
        }

        .footer-nav-strip a {
          font-family: var(--font-heading);
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--color-forest);
          transition: color var(--transition-fast);
        }

        .footer-nav-strip a:hover {
          color: var(--color-coral);
        }

        .footer-nav-dot {
          color: rgba(16, 51, 35, 0.2);
          font-size: 0.8rem;
        }

        /* Partners & MahaRERA Strip */
        .footer-partners-strip {
          display: grid;
          grid-template-columns: 1fr;
          align-items: center;
          gap: 1.5rem;
          padding: 1.25rem 1.6rem;
          background: #FAFAF7;
          border-radius: var(--radius-lg);
          border: 1px solid #ECE7D8;
          margin-bottom: 1.75rem;
          text-align: center;
        }

        @media (min-width: 768px) {
          .footer-partners-strip {
            grid-template-columns: 1.05fr 1.05fr 1.35fr;
            align-items: center;
            text-align: left;
            gap: 1.75rem;
          }
        }

        .footer-partner-col {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        }

        @media (min-width: 768px) {
          .footer-partner-col {
            align-items: flex-start;
          }
        }

        .partners-label {
          font-family: var(--font-heading);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--color-text-muted);
        }

        .partner-logo-item {
          display: flex;
          align-items: center;
          height: 42px;
        }

        /* MahaRERA Box */
        .maharera-simple-box {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          padding: 0.65rem 1rem;
          background: #FFFFFF;
          border-radius: var(--radius-md);
          border: 1px solid #E4E0D2;
        }

        .maharera-qr-wrap {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border: 1px solid #ECE7D9;
          border-radius: 4px;
          padding: 2px;
          background: #FFFFFF;
        }

        .maharera-qr-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .maharera-info {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .maharera-label {
          font-size: 0.64rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
          font-weight: 600;
        }

        .maharera-number {
          font-family: var(--font-heading);
          font-size: 0.92rem;
          font-weight: 800;
          color: var(--color-forest);
        }

        .maharera-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.72rem;
          color: var(--color-coral);
          font-weight: 600;
          text-decoration: underline;
        }

        /* Disclaimer */
        .footer-disclaimer-wrap {
          margin-bottom: 1.5rem;
          padding: 1rem 1.25rem;
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

        /* Bottom Bar */
        .footer-bottom-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 0.85rem;
          padding-top: 1.25rem;
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
          font-size: 0.76rem;
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
