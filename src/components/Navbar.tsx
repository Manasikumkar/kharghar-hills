import React, { useState, useEffect, useRef } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { KhargharLogo } from './BrandIcons'

interface NavbarProps {
  onOpenModal: () => void
}

const NAV_LINKS = [
  { name: 'Overview', href: '#hero', id: 'hero' },
  { name: 'Infrastructure', href: '#infrastructure', id: 'infrastructure' },
  { name: 'Lifestyle', href: '#lifestyle', id: 'lifestyle' },
  { name: 'Location', href: '#location', id: 'location' },
  { name: 'Pricing', href: '#pricing', id: 'pricing' },
  { name: 'Visit Us', href: '#enquiry', id: 'enquiry' },
]

export const Navbar: React.FC<NavbarProps> = ({ onOpenModal }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const headerRef = useRef<HTMLElement | null>(null)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)

  // Initial load entrance animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReducedMotion && headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )
    }
  }, [])

  // Scroll listener for frosted-glass state and active anchor detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)

      // Active section detection
      const scrollPos = window.scrollY + 200
      for (let i = NAV_LINKS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_LINKS[i].id)
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(NAV_LINKS[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mobile menu staggered entrance
  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!prefersReducedMotion) {
        gsap.fromTo(
          mobileMenuRef.current.querySelectorAll('.mobile-nav-item'),
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out' }
        )
      }
    }
  }, [isMobileMenuOpen])

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`main-navbar ${isScrolled ? 'is-scrolled' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: 'background-color 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, padding 0.3s ease',
          backgroundColor: isScrolled
            ? 'rgba(250, 249, 245, 0.94)'
            : 'rgba(250, 249, 245, 0.78)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: isScrolled
            ? '1px solid rgba(16, 51, 35, 0.1)'
            : '1px solid transparent',
          boxShadow: isScrolled ? '0 4px 24px rgba(16, 51, 35, 0.06)' : 'none',
          padding: isScrolled ? '0.65rem 0' : '1.1rem 0',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault()
              handleLinkClick('#hero')
            }}
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            aria-label="Kharghar Hills Home"
          >
            <KhargharLogo layout="horizontal" glyphSize={32} />
          </a>

          {/* Desktop Nav Links with Animated Underline */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '2.2rem',
            }}
            className="desktop-nav"
            aria-label="Primary Navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick(link.href)
                  }}
                  className={`nav-item-link ${isActive ? 'is-active-link' : ''}`}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: isActive ? 'var(--color-coral)' : '#243B30',
                    letterSpacing: '0.01em',
                    padding: '0.35rem 0',
                    position: 'relative',
                    transition: 'color 0.25s ease',
                  }}
                >
                  <span>{link.name}</span>
                  <span className="nav-link-underline" />
                </a>
              )
            })}
          </nav>

          {/* Right Action Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

            <button
              type="button"
              onClick={onOpenModal}
              className="btn-primary nav-cta-btn"
            >
              <span className="nav-cta-text-full">Advance Bookings</span>
              <span className="nav-cta-text-compact">Book Now</span>
              <ArrowUpRight size={15} />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                color: '#103323',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(16, 51, 35, 0.06)',
                transition: 'background-color 0.2s ease',
              }}
              className="mobile-hamburger-btn"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown with Staggered Entrance */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(250, 249, 245, 0.98)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            padding: '2.5rem 1.75rem',
            gap: '1rem',
            overflowY: 'auto',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          {NAV_LINKS.map((link) => (
            <div key={link.name} className="mobile-nav-item">
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick(link.href)
                }}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: activeSection === link.id ? 'var(--color-coral)' : '#103323',
                  padding: '0.65rem 0',
                  display: 'block',
                  borderBottom: '1px solid rgba(16, 51, 35, 0.08)',
                  transition: 'color 0.2s ease',
                }}
              >
                {link.name}
              </a>
            </div>
          ))}

          <div
            className="mobile-nav-item"
            style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
          >

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false)
                onOpenModal()
              }}
              className="btn-primary"
              style={{ width: '100%', padding: '0.95rem' }}
            >
              <span>Advance Bookings Open</span>
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-phone-btn {
            display: inline-flex !important;
          }
          .mobile-hamburger-btn {
            display: none !important;
          }
        }

        .desktop-phone-btn:hover {
          background-color: rgba(16, 51, 35, 0.12) !important;
        }

        /* Animated Navigation Underline */
        .nav-link-underline {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background-color: var(--color-coral);
          border-radius: 2px;
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-item-link:hover .nav-link-underline,
        .nav-item-link.is-active-link .nav-link-underline {
          width: 100%;
          left: 0;
        }

        .nav-item-link:hover {
          color: var(--color-coral) !important;
        }

        /* Navigation CTA Button */
        .nav-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          white-space: nowrap;
          flex-shrink: 0;
          padding: 0.65rem 1.35rem;
          font-size: 0.86rem;
          border-radius: var(--radius-sm);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .nav-cta-text-compact {
          display: none;
        }

        .nav-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(224, 64, 43, 0.35);
        }

        @media (max-width: 640px) {
          .nav-cta-btn {
            padding: 0.46rem 0.82rem !important;
            font-size: 0.78rem !important;
            gap: 0.25rem !important;
          }
          .nav-cta-text-full {
            display: none !important;
          }
          .nav-cta-text-compact {
            display: inline !important;
          }
          .brand-logo-text-large {
            font-size: 1.15rem !important;
          }
          .brand-logo-text-small {
            font-size: 0.88rem !important;
          }
        }

        @media (max-width: 380px) {
          .nav-cta-btn {
            padding: 0.4rem 0.6rem !important;
            font-size: 0.74rem !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nav-link-underline,
          .main-navbar,
          .desktop-phone-btn,
          .nav-cta-btn {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  )
}
