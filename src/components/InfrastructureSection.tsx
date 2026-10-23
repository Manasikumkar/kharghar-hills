import React, { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  CorridorIcon,
  RoadNetworkIcon,
  AirportIcon,
  HighwayIcon,
  MetroIcon,
  TunnelIcon,
  BulletTrainIcon,
} from './BrandIcons'
import { MapPin, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export interface InfraItem {
  id: number
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  tag: string
  baseAngle: number // degrees (0 = right, -90 = top)
  labelAlign: 'left' | 'right' | 'center'
  labelOffset: { x: number; y: number }
}

const infraData: InfraItem[] = [
  {
    id: 1,
    title: 'Emerging growth corridor',
    subtitle: '140-Hectare Corporate District',
    description: 'Planned 140-Hectare Kharghar corporate district.',
    icon: <CorridorIcon size={28} color="#103323" />,
    tag: 'Commercial Hub',
    baseAngle: -90, // Top (12 o'clock)
    labelAlign: 'center',
    labelOffset: { x: 380, y: 50 },
  },
  {
    id: 2,
    title: 'Road & transit upgrades',
    subtitle: 'Internal Road Network',
    description: 'Upcoming internal Kharghar road network.',
    icon: <RoadNetworkIcon size={28} color="#103323" />,
    tag: 'Connectivity',
    baseAngle: -38.57, // Top Right (~1:30)
    labelAlign: 'left',
    labelOffset: { x: 605, y: 155 },
  },
  {
    id: 3,
    title: 'Navi Mumbai international airport',
    subtitle: 'Domestic & International',
    description: 'Domestic and international flights operational.',
    icon: <AirportIcon size={28} color="#103323" />,
    tag: 'Global Transit',
    baseAngle: 12.86, // Mid Right (~3:30)
    labelAlign: 'left',
    labelOffset: { x: 635, y: 345 },
  },
  {
    id: 4,
    title: 'Mumbra Panvel highway expansion',
    subtitle: 'Smoother Commutes',
    description: 'Highway expansion for smoother commuting.',
    icon: <HighwayIcon size={28} color="#103323" />,
    tag: 'Highway Corridor',
    baseAngle: 64.29, // Bottom Right (~5:00)
    labelAlign: 'left',
    labelOffset: { x: 505, y: 570 },
  },
  {
    id: 5,
    title: 'Metro line 12',
    subtitle: 'Elevated Metro',
    description: '23.57 KM Kalyan-Taloja elevated Metro corridor.',
    icon: <MetroIcon size={28} color="#103323" />,
    tag: 'Rapid Transit',
    baseAngle: 115.71, // Bottom Left (~7:00)
    labelAlign: 'right',
    labelOffset: { x: 255, y: 570 },
  },
  {
    id: 6,
    title: 'Kharghar Turbhe link road',
    subtitle: 'Twin Tunnels',
    description: '5.9 KM road with twin tunnels.',
    icon: <TunnelIcon size={28} color="#103323" />,
    tag: 'Express Link',
    baseAngle: 167.14, // Mid Left (~8:30)
    labelAlign: 'right',
    labelOffset: { x: 125, y: 345 },
  },
  {
    id: 7,
    title: 'Bullet train',
    subtitle: 'High-Speed Rail',
    description: 'Mumbai-Ahmedabad high-speed rail via Thane.',
    icon: <BulletTrainIcon size={28} color="#103323" />,
    tag: 'High-Speed Rail',
    baseAngle: 218.57, // Top Left (~10:30)
    labelAlign: 'right',
    labelOffset: { x: 155, y: 155 },
  },
]

// Center hub and geometry parameters (760 x 660 coordinate space)
const CX = 380
const CY = 330
const R_INNER = 88
const R_OUTER = 200
const R_BADGE = 224
const HALF_SPAN_DEG = 23.8

// SVG Sector Petal Path Generator
function getPetalPath(
  cx: number,
  cy: number,
  r1: number,
  r2: number,
  centerAngleDeg: number,
  halfSpanDeg: number
): string {
  const rad = Math.PI / 180
  const a1 = (centerAngleDeg - halfSpanDeg) * rad
  const a2 = (centerAngleDeg + halfSpanDeg) * rad

  const x1 = cx + r1 * Math.cos(a1)
  const y1 = cy + r1 * Math.sin(a1)
  const x2 = cx + r2 * Math.cos(a1)
  const y2 = cy + r2 * Math.sin(a1)
  const x3 = cx + r2 * Math.cos(a2)
  const y3 = cy + r2 * Math.sin(a2)
  const x4 = cx + r1 * Math.cos(a2)
  const y4 = cy + r1 * Math.sin(a2)

  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} A ${r2} ${r2} 0 0 1 ${x3.toFixed(1)} ${y3.toFixed(1)} L ${x4.toFixed(1)} ${y4.toFixed(1)} A ${r1} ${r1} 0 0 0 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`
}

export const InfrastructureSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [isRotating, setIsRotating] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const sectionRef = useRef<HTMLElement | null>(null)
  const wheelRef = useRef<SVGGElement | null>(null)
  const continuousTweenRef = useRef<gsap.core.Tween | null>(null)
  const uprightTweenRef = useRef<gsap.core.Tween | null>(null)
  const transitionTweenRef = useRef<gsap.core.Tween | null>(null)
  const resumeTimeoutRef = useRef<number | null>(null)

  const isRotatingRef = useRef<boolean>(true)
  const isHoveredRef = useRef<boolean>(false)
  const isVisibleRef = useRef<boolean>(true)
  const prefersReducedMotionRef = useRef<boolean>(false)

  // Keep refs in sync with state
  useEffect(() => {
    isRotatingRef.current = isRotating
  }, [isRotating])

  useEffect(() => {
    isHoveredRef.current = isHovered
  }, [isHovered])

  // Continuous linear rotation launcher using GSAP
  const startContinuousSpin = useCallback((fromAngle = 0) => {
    if (!wheelRef.current || prefersReducedMotionRef.current) return

    continuousTweenRef.current?.kill()
    uprightTweenRef.current?.kill()

    gsap.set(wheelRef.current, { rotation: fromAngle, svgOrigin: `${CX} ${CY}` })
    gsap.set('.upright-node', { rotation: -fromAngle, transformOrigin: '0 0' })

    // 30 seconds for one full 360-degree rotation (elegant, smooth linear motion)
    continuousTweenRef.current = gsap.to(wheelRef.current, {
      rotation: '+=360',
      duration: 30,
      ease: 'none',
      repeat: -1,
      svgOrigin: `${CX} ${CY}`,
    })

    // Exact counter-rotation keeps all 7 number badges and icons upright at all times
    uprightTweenRef.current = gsap.to('.upright-node', {
      rotation: '-=360',
      duration: 30,
      ease: 'none',
      repeat: -1,
      transformOrigin: '0 0',
    })
  }, [])

  // Step transition handler: smoothly aligns the wheel, updates info card, and holds
  const goToStep = useCallback(
    (newIndex: number) => {
      if (newIndex === activeIndex) return

      setDirection(newIndex > activeIndex ? 'forward' : 'backward')
      setActiveIndex(newIndex)

      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current)
        resumeTimeoutRef.current = null
      }

      if (prefersReducedMotionRef.current) return

      // Pause continuous spin during selection
      continuousTweenRef.current?.pause()
      uprightTweenRef.current?.pause()

      if (!wheelRef.current) return

      const currentRot = Number(gsap.getProperty(wheelRef.current, 'rotation')) || 0
      // Calculate nearest aligned station (multiple of 360 brings segments to their designated station)
      const targetRot = Math.round(currentRot / 360) * 360

      transitionTweenRef.current?.kill()
      transitionTweenRef.current = gsap.to(wheelRef.current, {
        rotation: targetRot,
        duration: 0.75,
        ease: 'power2.out',
        svgOrigin: `${CX} ${CY}`,
        onUpdate: () => {
          if (!wheelRef.current) return
          const cur = Number(gsap.getProperty(wheelRef.current, 'rotation')) || 0
          gsap.set('.upright-node', { rotation: -cur, transformOrigin: '0 0' })
        },
        onComplete: () => {
          // If rotation is enabled and user is not hovering, resume rotation after 3.5s hold
          if (isRotatingRef.current && !isHoveredRef.current) {
            resumeTimeoutRef.current = window.setTimeout(() => {
              if (isRotatingRef.current && !isHoveredRef.current) {
                startContinuousSpin(targetRot)
              }
            }, 3500)
          }
        },
      })
    },
    [activeIndex, startContinuousSpin]
  )

  const handleNext = useCallback(() => {
    goToStep((activeIndex + 1) % infraData.length)
  }, [activeIndex, goToStep])

  const handlePrev = useCallback(() => {
    goToStep((activeIndex - 1 + infraData.length) % infraData.length)
  }, [activeIndex, goToStep])

  // Toggle Continuous Rotation
  const toggleRotation = useCallback(() => {
    const nextVal = !isRotating
    setIsRotating(nextVal)
    isRotatingRef.current = nextVal

    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current)
      resumeTimeoutRef.current = null
    }

    if (!nextVal) {
      continuousTweenRef.current?.pause()
      uprightTweenRef.current?.pause()
    } else {
      if (wheelRef.current) {
        const currentRot = Number(gsap.getProperty(wheelRef.current, 'rotation')) || 0
        startContinuousSpin(currentRot)
      }
    }
  }, [isRotating, startContinuousSpin])

  // Hover handlers: pause rotation on hover so user can easily read/click
  const handleMouseEnter = () => {
    setIsHovered(true)
    isHoveredRef.current = true
    if (isRotatingRef.current) {
      continuousTweenRef.current?.pause()
      uprightTweenRef.current?.pause()
    }
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current)
      resumeTimeoutRef.current = null
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    isHoveredRef.current = false
    if (isRotatingRef.current && wheelRef.current) {
      const currentRot = Number(gsap.getProperty(wheelRef.current, 'rotation')) || 0
      startContinuousSpin(currentRot)
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleNext()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      handlePrev()
    }
  }

  // Initialize continuous rotation on mount
  useEffect(() => {
    prefersReducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReducedMotionRef.current) {
      startContinuousSpin(0)
    }

    return () => {
      continuousTweenRef.current?.kill()
      uprightTweenRef.current?.kill()
      transitionTweenRef.current?.kill()
      if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current)
    }
  }, [startContinuousSpin])

  // Pause when section is scrolled out of viewport
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
        if (!entry.isIntersecting) {
          continuousTweenRef.current?.pause()
          uprightTweenRef.current?.pause()
        } else if (isRotatingRef.current && !isHoveredRef.current) {
          continuousTweenRef.current?.resume()
          uprightTweenRef.current?.resume()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // GSAP ScrollTrigger for section entrance & background parallax
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.to('.infra-bg-parallax', {
        yPercent: 7,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      })

      gsap.fromTo(
        '.infra-entrance-fade',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  const activeItem = infraData[activeIndex]
  const rad = Math.PI / 180

  return (
    <section
      id="infrastructure"
      ref={sectionRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Infrastructure Highlights Interactive Showcase. Use left/right arrow keys to navigate."
      style={{
        position: 'relative',
        backgroundColor: '#091510',
        color: '#FFFFFF',
        paddingTop: 'clamp(3.5rem, 6vw, 6.5rem)',
        paddingBottom: 'clamp(3.5rem, 6vw, 6.5rem)',
        overflow: 'hidden',
        outline: 'none',
      }}
    >
      {/* Cinematic Photorealistic Infrastructure Background with Subtle Parallax */}
      <div
        className="infra-bg-parallax"
        style={{
          position: 'absolute',
          inset: '-5%',
          backgroundImage: 'url(/assets/infra_cinematic_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 38%',
          opacity: 0.38,
          filter: 'saturate(1.25) contrast(1.05)',
          zIndex: 1,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />

      {/* Atmospheric Forest-Green Vignette & High-Contrast Gradient Wash */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(7, 18, 13, 0.96) 0%, rgba(7, 18, 13, 0.88) 42%, rgba(7, 18, 13, 0.45) 75%, rgba(7, 18, 13, 0.82) 100%), linear-gradient(180deg, #091510 0%, transparent 22%, transparent 78%, #091510 100%), radial-gradient(circle at 72% 50%, rgba(30, 88, 62, 0.38) 0%, transparent 68%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
        <div className="infra-grid">
          {/* Left Column: Heading, Subtitle and Compact Information Panel */}
          <div className="infra-text-col infra-entrance-fade">
            <div className="infra-section-tag">
              <span className="infra-tag-dot" />
              <span>STRATEGIC CONNECTIVITY & VALUE GROWTH</span>
            </div>

            <h2 className="infra-heading">
              Big infrastructure moves.
              <br />
              <span style={{ color: '#FFFFFF' }}>Bigger growth potential.</span>
            </h2>

            <p className="infra-subhead">
              Planned roads, metro links and business hubs bring more to look forward to—better
              connectivity and greater growth potential.
            </p>

            {/* Compact Information Panel (Synchronized with Diagram) */}
            <div
              className="infra-spotlight-card"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Synchronized Stage: All 7 items occupy exact same space */}
              <div className="spotlight-active-stage">
                {infraData.map((item, idx) => {
                  const isActive = idx === activeIndex
                  const isPast = idx < activeIndex

                  return (
                    <div
                      key={item.id}
                      className={`spotlight-slide ${
                        isActive ? 'slide-active' : isPast ? 'slide-past' : 'slide-future'
                      } dir-${direction}`}
                      aria-hidden={!isActive}
                    >
                      {/* Slide Header: Large Number + Continuous Rotation Control Pill */}
                      <div className="slide-header">
                        <div className="slide-counter-wrap">
                          <span className="slide-number">0{item.id}</span>
                          <span className="slide-total">/ 0{infraData.length}</span>
                        </div>

                        {/* Rotation Toggle Pill */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.currentTarget.blur()
                            toggleRotation()
                          }}
                          className={`rotation-toggle-btn ${isRotating ? 'is-active' : ''}`}
                          title={isRotating ? 'Pause continuous wheel rotation' : 'Resume continuous wheel rotation'}
                          aria-label={isRotating ? 'Pause wheel rotation' : 'Resume wheel rotation'}
                        >
                          <RotateCw size={12} className={isRotating ? 'rotate-icon-spin' : ''} />
                          <span>{isRotating ? 'Rotating' : 'Paused'}</span>
                        </button>
                      </div>

                      {/* Slide Body: Icon, Title, and Factual Description */}
                      <div className="slide-body">
                        <div className="slide-title-wrap">
                          <div className="slide-icon-circle">{item.icon}</div>
                          <div>
                            <h3 className="slide-title">{item.title}</h3>
                            <span className="slide-subtitle">{item.subtitle}</span>
                          </div>
                        </div>
                        <p className="slide-description">{item.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Navigation Controls Bar without Tour button */}
              <div className="spotlight-controls-bar">
                {/* 1-7 Number Selector Buttons */}
                <div className="step-pills-row" role="tablist" aria-label="Select Infrastructure Highlight">
                  {infraData.map((item, idx) => {
                    const isActive = idx === activeIndex
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={(e) => {
                          e.currentTarget.blur()
                          goToStep(idx)
                        }}
                        className={`step-num-btn ${isActive ? 'is-active' : ''}`}
                        title={`Select Item ${item.id}: ${item.title}`}
                        aria-label={`Highlight ${item.id}: ${item.title}`}
                      >
                        <span>{item.id}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Arrow Navigation Controls (Tour button removed) */}
                <div className="arrow-nav-group">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.blur()
                      handlePrev()
                    }}
                    className="arrow-btn"
                    title="Previous highlight (Left arrow key)"
                    aria-label="Previous highlight"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.blur()
                      handleNext()
                    }}
                    className="arrow-btn"
                    title="Next highlight (Right arrow key)"
                    aria-label="Next highlight"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Enlarged Interactive Circular Diagram with Continuous Orbital Rotation */}
          <div className="infra-diagram-col infra-entrance-fade">
            <div
              className="radial-diagram-wrap"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <svg
                className="radial-svg-master"
                viewBox="0 0 760 660"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Glowing Filter for Active Selection */}
                  <filter id="active-mint-glow" x="-35%" y="-35%" width="170%" height="170%">
                    <feGaussianBlur stdDeviation="4.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Gradient for Active Connecting Line */}
                  <linearGradient id="active-line-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2E8B57" />
                    <stop offset="60%" stopColor="#48E08C" />
                    <stop offset="100%" stopColor="#FFFFFF" />
                  </linearGradient>

                  {/* Gradient for Inactive Connecting Lines */}
                  <linearGradient id="orbit-dim-line" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(215, 243, 227, 0.05)" />
                    <stop offset="100%" stopColor="rgba(215, 243, 227, 0.18)" />
                  </linearGradient>

                  {/* Active Sector Petal Gradient */}
                  <linearGradient id="petal-active-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#E2F7EB" />
                  </linearGradient>

                  {/* Inactive Sector Petal Gradient */}
                  <linearGradient id="petal-idle-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#D9ECE0" />
                    <stop offset="100%" stopColor="#C4DFCD" />
                  </linearGradient>

                  {/* Focused Rotating Radial Sweep Beam Gradient */}
                  <radialGradient id="active-beam-sweep" cx="0%" cy="50%" r="100%">
                    <stop offset="0%" stopColor="rgba(72, 224, 140, 0.42)" />
                    <stop offset="50%" stopColor="rgba(61, 170, 115, 0.14)" />
                    <stop offset="100%" stopColor="rgba(43, 108, 79, 0)" />
                  </radialGradient>
                </defs>

                {/* CONTINUOUS ROTATING ORBITAL WHEEL GROUP (Rotates around CX, CY) */}
                <g ref={wheelRef} className="rotating-wheel-group">
                  {/* Decorative Outer Dashed Orbit Guide Rings */}
                  <circle
                    cx={CX}
                    cy={CY}
                    r="238"
                    stroke="rgba(72, 224, 140, 0.22)"
                    strokeWidth="1.5"
                    strokeDasharray="8 10"
                    fill="none"
                  />
                  <circle cx={CX + 238} cy={CY} r="4" fill="#48E08C" filter="url(#active-mint-glow)" />
                  <circle cx={CX - 238} cy={CY} r="3" fill="#48E08C" />
                  <circle cx={CX} cy={CY + 238} r="3" fill="rgba(72, 224, 140, 0.6)" />
                  <circle cx={CX} cy={CY - 238} r="3" fill="rgba(72, 224, 140, 0.6)" />

                  <circle
                    cx={CX}
                    cy={CY}
                    r="262"
                    stroke="rgba(215, 243, 227, 0.10)"
                    strokeWidth="1.2"
                    strokeDasharray="4 8"
                    fill="none"
                  />
                  <circle cx={CX + 262} cy={CY} r="2.5" fill="#FFFFFF" />
                  <circle cx={CX - 262} cy={CY} r="2.5" fill="#FFFFFF" />

                  {/* Focused Active Sweep Wedge for the selected petal (without outer square outline) */}
                  <g
                    transform={`rotate(${activeItem.baseAngle} ${CX} ${CY})`}
                    style={{
                      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                      pointerEvents: 'none',
                    }}
                  >
                    <path
                      d={`M ${CX} ${CY} L ${CX + R_OUTER + 26} ${CY - 26} A ${R_OUTER + 26} ${R_OUTER + 26} 0 0 1 ${CX + R_OUTER + 26} ${CY + 26} Z`}
                      fill="url(#active-beam-sweep)"
                    />
                  </g>

                  {/* Connecting Lines between Hub and Petals */}
                  {infraData.map((item, idx) => {
                    const isActive = idx === activeIndex
                    const itemRad = item.baseAngle * rad
                    const lineEnd = {
                      x: CX + R_INNER * Math.cos(itemRad),
                      y: CY + R_INNER * Math.sin(itemRad),
                    }

                    return (
                      <line
                        key={`line-${item.id}`}
                        x1={CX}
                        y1={CY}
                        x2={lineEnd.x}
                        y2={lineEnd.y}
                        stroke={isActive ? 'url(#active-line-gradient)' : 'url(#orbit-dim-line)'}
                        strokeWidth={isActive ? 3 : 1.2}
                        strokeDasharray={isActive ? 'none' : '3 3'}
                        filter={isActive ? 'url(#active-mint-glow)' : 'none'}
                        style={{ transition: 'all 0.4s ease' }}
                      />
                    )
                  })}

                  {/* 7 Rosette Petals */}
                  <g className="rosette-petals-group">
                    {infraData.map((item, idx) => {
                      const isActive = idx === activeIndex
                      const petalPath = getPetalPath(CX, CY, R_INNER, R_OUTER, item.baseAngle, HALF_SPAN_DEG)
                      const itemRad = item.baseAngle * rad
                      const iconPos = {
                        x: CX + ((R_INNER + R_OUTER) / 2) * Math.cos(itemRad),
                        y: CY + ((R_INNER + R_OUTER) / 2) * Math.sin(itemRad),
                      }
                      const badgePos = {
                        x: CX + R_BADGE * Math.cos(itemRad),
                        y: CY + R_BADGE * Math.sin(itemRad),
                      }

                      return (
                        <g
                          key={`petal-${item.id}`}
                          className={`infra-petal-segment ${isActive ? 'is-active-petal' : 'is-idle-petal'}`}
                          onClick={(e) => {
                            ;(e.currentTarget as SVGElement)?.blur()
                            goToStep(idx)
                          }}
                          role="button"
                          tabIndex={-1}
                          style={{ cursor: 'pointer', outline: 'none' }}
                          aria-label={`Select Infrastructure Node ${item.id}: ${item.title}`}
                        >
                          {/* Petal Wedge Path */}
                          <path
                            d={petalPath}
                            fill={isActive ? 'url(#petal-active-grad)' : 'url(#petal-idle-grad)'}
                            stroke={isActive ? '#3DAA73' : 'rgba(255, 255, 255, 0.45)'}
                            strokeWidth={isActive ? 3 : 1}
                            strokeLinejoin="round"
                            filter={isActive ? 'url(#active-mint-glow)' : 'none'}
                            className="petal-path-shape"
                            style={{ outline: 'none' }}
                          />

                          {/* Upright Icon Node (counter-rotates so icon is always upright) */}
                          <g transform={`translate(${iconPos.x}, ${iconPos.y})`}>
                            <g className="upright-node" style={{ transformOrigin: '0 0', outline: 'none' }}>
                              <foreignObject
                                x={-15}
                                y={-15}
                                width={30}
                                height={30}
                                style={{
                                  pointerEvents: 'none',
                                  transform: isActive ? 'scale(1.18)' : 'scale(1)',
                                  transition: 'transform 0.3s ease',
                                  outline: 'none',
                                }}
                              >
                                <div
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    outline: 'none',
                                  }}
                                >
                                  {item.icon}
                                </div>
                              </foreignObject>
                            </g>
                          </g>

                          {/* Upright Number Badge on Outer Rim (counter-rotates so number is always upright) */}
                          <g transform={`translate(${badgePos.x}, ${badgePos.y})`}>
                            <g className="upright-node" style={{ transformOrigin: '0 0', outline: 'none' }}>
                              {isActive && (
                                <circle
                                  r={21}
                                  fill="none"
                                  stroke="#48E08C"
                                  strokeWidth="1.8"
                                  className="petal-badge-pulse"
                                />
                              )}
                              <circle
                                r={15}
                                fill={isActive ? '#3DAA73' : '#FFFFFF'}
                                stroke={isActive ? '#FFFFFF' : '#B8D8C3'}
                                strokeWidth={isActive ? 2.4 : 1.5}
                                filter="drop-shadow(0 2px 8px rgba(0,0,0,0.35))"
                              />
                              <text
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill={isActive ? '#FFFFFF' : '#103323'}
                                fontSize="12.5"
                                fontWeight="800"
                                fontFamily="var(--font-heading)"
                              >
                                {item.id}
                              </text>
                            </g>
                          </g>
                        </g>
                      )
                    })}
                  </g>
                </g>

                {/* STATIONARY CENTER HUB (Does not rotate - perfectly rock-solid) */}
                <g className="center-hub-svg-group" transform={`translate(${CX}, ${CY})`}>
                  <defs>
                    <radialGradient id="hub-center-gradient" cx="50%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#1C5038" />
                      <stop offset="60%" stopColor="#0F3222" />
                      <stop offset="100%" stopColor="#071A10" />
                    </radialGradient>
                  </defs>

                  {/* Outer stationary depth accent ring */}
                  <circle
                    r="78"
                    fill="none"
                    stroke="rgba(72, 224, 140, 0.22)"
                    strokeWidth="1.2"
                    strokeDasharray="4 5"
                  />

                  {/* Breathing glow ring */}
                  <circle
                    r="72"
                    fill="none"
                    stroke="rgba(72, 224, 140, 0.35)"
                    strokeWidth="1.6"
                    className="hub-breathing-ring"
                  />

                  {/* Main hub circle */}
                  <circle
                    r="64"
                    fill="url(#hub-center-gradient)"
                    stroke="#2D6B50"
                    strokeWidth="2.8"
                    filter="drop-shadow(0 8px 32px rgba(0,0,0,0.65))"
                  />

                  {/* Inner subtle depth border */}
                  <circle r="56" fill="none" stroke="rgba(72, 224, 140, 0.18)" strokeWidth="1" />

                  {/* Stationary Pin Icon */}
                  <g transform="translate(0, -22)">
                    <MapPin size={24} color="#00C9FF" fill="#00C9FF" style={{ transform: 'translate(-12px, -12px)' }} />
                  </g>

                  {/* Stationary Brand Typography */}
                  <text
                    y="13"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="13.5"
                    fontWeight="800"
                    letterSpacing="0.12em"
                    fontFamily="var(--font-heading)"
                  >
                    KHARGHAR
                  </text>
                  <text
                    y="29"
                    textAnchor="middle"
                    fill="#7AD9A5"
                    fontSize="11.5"
                    fontWeight="700"
                    letterSpacing="0.24em"
                    fontFamily="var(--font-heading)"
                  >
                    HILLS
                  </text>
                </g>

                {/* STATIONARY OUTER CALLOUT LABELS (Upright, high contrast, readable, clickable) */}
                <g className="stationary-labels-layer">
                  {infraData.map((item, idx) => {
                    const isActive = idx === activeIndex
                    return (
                      <g
                        key={`label-${item.id}`}
                        className={`petal-callout-text ${isActive ? 'is-active-label' : ''}`}
                        onClick={(e) => {
                          ;(e.currentTarget as SVGElement)?.blur()
                          goToStep(idx)
                        }}
                        role="button"
                        tabIndex={-1}
                        style={{ cursor: 'pointer', outline: 'none' }}
                        aria-label={`Highlight ${item.title}`}
                      >
                        {/* Subtle connecting dot when active */}
                        {isActive && (
                          <circle
                            cx={
                              item.labelAlign === 'center'
                                ? item.labelOffset.x
                                : item.labelAlign === 'left'
                                  ? item.labelOffset.x - 8
                                  : item.labelOffset.x + 8
                            }
                            cy={item.labelOffset.y - 4}
                            r="3.5"
                            fill="#48E08C"
                            filter="url(#active-mint-glow)"
                          />
                        )}
                        <text
                          x={item.labelOffset.x}
                          y={item.labelOffset.y - 4}
                          textAnchor={item.labelAlign === 'center' ? 'middle' : item.labelAlign === 'left' ? 'start' : 'end'}
                          fill={isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.82)'}
                          fontSize={isActive ? '13.5' : '12'}
                          fontWeight={isActive ? '800' : '700'}
                          fontFamily="var(--font-heading)"
                          className="label-title-text"
                        >
                          {item.title}
                        </text>
                        <text
                          x={item.labelOffset.x}
                          y={item.labelOffset.y + 13}
                          textAnchor={item.labelAlign === 'center' ? 'middle' : item.labelAlign === 'left' ? 'start' : 'end'}
                          fill={isActive ? '#86E0AB' : 'rgba(215, 243, 227, 0.55)'}
                          fontSize={isActive ? '11.5' : '10.5'}
                          fontWeight={isActive ? '600' : '500'}
                          className="label-desc-text"
                        >
                          {item.description}
                        </text>
                      </g>
                    )
                  })}
                </g>
              </svg>

              {/* Mobile Fallback: Accessible Quick Highlight Selector (< 900px) */}
              <div className="mobile-highlights-list">
                {infraData.map((item, idx) => {
                  const isActive = idx === activeIndex
                  return (
                    <button
                      key={`mob-${item.id}`}
                      type="button"
                      onClick={(e) => {
                        e.currentTarget.blur()
                        goToStep(idx)
                      }}
                      className={`mobile-node-card ${isActive ? 'is-active' : ''}`}
                    >
                      <div className="mobile-node-badge">{item.id}</div>
                      <div className="mobile-node-icon">{item.icon}</div>
                      <div className="mobile-node-text">
                        <span className="mobile-node-title">{item.title}</span>
                        <span className="mobile-node-desc">{item.description}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Global & Element Level Focus Resets to Eliminate Bounding Box Squares */
        *:focus,
        *:focus-visible,
        *:active,
        button:focus,
        button:focus-visible,
        button:active,
        svg:focus,
        svg *:focus,
        svg *:focus-visible,
        svg *:active {
          outline: none !important;
          box-shadow: none !important;
          -webkit-tap-highlight-color: transparent !important;
          -webkit-focus-ring-color: transparent !important;
        }

        .infra-petal-segment,
        .infra-petal-segment:focus,
        .infra-petal-segment:focus-visible,
        .infra-petal-segment:active,
        .petal-path-shape,
        .petal-callout-text,
        .petal-callout-text:focus,
        .petal-callout-text:focus-visible,
        .step-num-btn,
        .step-num-btn:focus,
        .step-num-btn:focus-visible,
        .arrow-btn,
        .arrow-btn:focus,
        .arrow-btn:focus-visible,
        .rotation-toggle-btn,
        .rotation-toggle-btn:focus,
        .rotation-toggle-btn:focus-visible {
          outline: none !important;
          outline-width: 0 !important;
          -webkit-tap-highlight-color: transparent !important;
        }

        .infra-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
        }

        @media (min-width: 1040px) {
          .infra-grid {
            grid-template-columns: 0.82fr 1.18fr;
            gap: 3rem;
          }
        }

        .infra-section-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-heading);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #7AD9A5;
          margin-bottom: 0.85rem;
        }

        .infra-tag-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #48E08C;
          box-shadow: 0 0 8px #48E08C;
        }

        .infra-heading {
          font-family: var(--font-heading);
          font-size: clamp(2rem, 3.8vw, 3.4rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #FFFFFF;
          margin-bottom: 1rem;
        }

        .infra-subhead {
          font-size: clamp(0.95rem, 1.25vw, 1.1rem);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.78);
          max-width: 500px;
          margin-bottom: 2rem;
        }

        /* Compact Spotlight Information Panel */
        .infra-spotlight-card {
          background: rgba(12, 33, 23, 0.92);
          border: 1px solid rgba(215, 243, 227, 0.22);
          border-radius: var(--radius-lg);
          padding: clamp(1.2rem, 2.5vw, 1.85rem);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
          position: relative;
          overflow: hidden;
        }

        /* Active Stage: Fixed height container guarantees zero layout shift */
        .spotlight-active-stage {
          position: relative;
          width: 100%;
          min-height: 160px;
          overflow: hidden;
        }

        @media (min-width: 640px) {
          .spotlight-active-stage {
            min-height: 150px;
          }
        }

        /* Synchronized Slide Item Transitions */
        .spotlight-slide {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }

        .spotlight-slide.slide-active {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
          z-index: 2;
        }

        .spotlight-slide.slide-past {
          opacity: 0;
          transform: translateY(-14px);
          pointer-events: none;
          z-index: 1;
        }

        .spotlight-slide.slide-future {
          opacity: 0;
          transform: translateY(14px);
          pointer-events: none;
          z-index: 1;
        }

        .spotlight-slide.dir-backward.slide-past {
          transform: translateY(14px);
        }
        .spotlight-slide.dir-backward.slide-future {
          transform: translateY(-14px);
        }

        /* Slide Header */
        .slide-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.95rem;
        }

        .slide-counter-wrap {
          display: flex;
          align-items: baseline;
          gap: 0.3rem;
          font-family: var(--font-heading);
        }

        .slide-number {
          font-size: 2.1rem;
          font-weight: 800;
          color: #48E08C;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .slide-total {
          font-size: 0.88rem;
          color: rgba(255, 255, 255, 0.45);
        }

        /* Rotation Toggle Button */
        .rotation-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-heading);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.75);
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(215, 243, 227, 0.2);
          border-radius: 9999px;
          padding: 0.32rem 0.75rem;
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .rotation-toggle-btn:hover {
          color: #FFFFFF;
          background: rgba(72, 224, 140, 0.18);
          border-color: #48E08C;
        }

        .rotation-toggle-btn.is-active {
          color: #48E08C;
          border-color: rgba(72, 224, 140, 0.45);
          background: rgba(72, 224, 140, 0.12);
        }

        .rotate-icon-spin {
          animation: spinSmall 4s linear infinite;
        }

        @keyframes spinSmall {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Slide Body */
        .slide-body {
          display: flex;
          flex-direction: column;
        }

        .slide-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 0.45rem;
        }

        .slide-icon-circle {
          flex-shrink: 0;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(215, 243, 227, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
        }

        .slide-title {
          font-family: var(--font-heading);
          font-size: clamp(1.15rem, 1.6vw, 1.45rem);
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.25;
        }

        .slide-subtitle {
          font-size: 0.76rem;
          color: #7AD9A5;
          font-weight: 600;
          letter-spacing: 0.04em;
          display: block;
        }

        .slide-description {
          font-size: clamp(0.92rem, 1.15vw, 1.02rem);
          line-height: 1.55;
          color: #D2DFD8;
          max-width: 480px;
        }

        /* Controls Bar */
        .spotlight-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.15rem;
          margin-top: 0.85rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .step-pills-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .step-num-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.75);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.16);
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }

        .step-num-btn:hover {
          background: rgba(72, 224, 140, 0.25);
          color: #FFFFFF;
          border-color: #48E08C;
        }

        .step-num-btn.is-active {
          background: #3DAA73;
          color: #FFFFFF;
          border-color: #FFFFFF;
          box-shadow: 0 0 14px rgba(72, 224, 140, 0.7);
          transform: scale(1.08);
        }

        .arrow-nav-group {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .arrow-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.16);
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .arrow-btn:hover {
          background: rgba(72, 224, 140, 0.2);
          color: #FFFFFF;
          border-color: #48E08C;
        }

        /* Diagram Column & SVG Master */
        .radial-diagram-wrap {
          position: relative;
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .radial-svg-master {
          width: 100%;
          height: auto;
          display: block;
          overflow: visible;
        }

        /* Petal shapes and interactive states */
        .infra-petal-segment {
          transition: filter 0.3s ease;
        }

        .petal-path-shape {
          transition: fill 0.35s ease, stroke 0.35s ease, stroke-width 0.35s ease;
        }

        .infra-petal-segment:hover .petal-path-shape {
          fill: url(#petal-active-grad);
          stroke: #48E08C;
          stroke-width: 2.4;
        }

        .infra-petal-segment.is-active-petal .petal-path-shape {
          stroke: #48E08C;
          stroke-width: 3;
        }

        .petal-badge-pulse {
          animation: badgePulse 2s ease-in-out infinite;
        }

        @keyframes badgePulse {
          0%, 100% {
            stroke-opacity: 0.85;
            transform: scale(1);
          }
          50% {
            stroke-opacity: 0.35;
            transform: scale(1.15);
          }
        }

        /* Stationary Hub animations */
        .hub-breathing-ring {
          animation: hubRingPulse 3.5s ease-in-out infinite;
        }

        @keyframes hubRingPulse {
          0%, 100% {
            transform: scale(1);
            stroke-opacity: 0.25;
          }
          50% {
            transform: scale(1.05);
            stroke-opacity: 0.65;
          }
        }

        /* Stationary Callout Labels */
        .petal-callout-text {
          transition: all 0.25s ease;
        }

        .petal-callout-text:hover .label-title-text {
          fill: #48E08C;
        }

        .petal-callout-text.is-active-label .label-title-text {
          fill: #FFFFFF;
          filter: drop-shadow(0 0 6px rgba(72, 224, 140, 0.6));
        }

        /* Mobile Highlights List Fallback */
        .mobile-highlights-list {
          display: none;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1.5rem;
          width: 100%;
        }

        .mobile-node-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          background: rgba(12, 33, 23, 0.85);
          border: 1px solid rgba(215, 243, 227, 0.16);
          color: #FFFFFF;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          width: 100%;
        }

        .mobile-node-card.is-active {
          background: rgba(30, 88, 62, 0.9);
          border-color: #48E08C;
          box-shadow: 0 4px 16px rgba(72, 224, 140, 0.25);
        }

        .mobile-node-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #3DAA73;
          color: #FFFFFF;
          font-weight: 800;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mobile-node-icon {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(215, 243, 227, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-node-text {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .mobile-node-title {
          font-weight: 700;
          font-size: 0.92rem;
          color: #FFFFFF;
        }

        .mobile-node-desc {
          font-size: 0.78rem;
          color: rgba(215, 243, 227, 0.75);
        }

        /* Responsive Breakpoints - Strict Mobile Polish */
        @media (max-width: 900px) {
          .infra-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .infra-heading {
            font-size: clamp(1.85rem, 6.5vw, 2.4rem);
            margin-bottom: 0.75rem;
          }

          .infra-subhead {
            font-size: 0.94rem;
            margin-bottom: 1.5rem;
          }

          .infra-spotlight-card {
            padding: 1.25rem 1rem;
            border-radius: 16px;
          }

          .spotlight-active-stage {
            min-height: 140px;
          }

          .slide-number {
            font-size: 1.85rem;
          }

          .slide-title {
            font-size: 1.15rem;
          }

          .slide-description {
            font-size: 0.88rem;
            line-height: 1.5;
          }

          .spotlight-controls-bar {
            padding-top: 0.85rem;
            margin-top: 0.65rem;
            gap: 0.5rem;
          }

          .step-pills-row {
            gap: 0.35rem;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding-bottom: 2px;
          }

          .step-pills-row::-webkit-scrollbar {
            display: none;
          }

          .step-num-btn {
            width: 30px;
            height: 30px;
            font-size: 0.78rem;
            flex-shrink: 0;
          }

          .arrow-btn {
            width: 30px;
            height: 30px;
            flex-shrink: 0;
          }

          .radial-diagram-wrap {
            max-width: 480px;
            width: 100%;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow: visible;
          }

          .radial-svg-master {
            width: 100%;
            max-width: 420px;
            height: auto;
            margin: 0 auto;
            display: block;
          }

          .stationary-labels-layer {
            display: none;
          }

          .mobile-highlights-list {
            display: flex;
            width: 100%;
            max-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .radial-diagram-wrap {
            max-width: 100%;
            padding: 0 0.25rem;
          }

          .radial-svg-master {
            max-width: 330px;
          }

          .step-num-btn {
            width: 28px;
            height: 28px;
            font-size: 0.75rem;
          }

          .arrow-btn {
            width: 28px;
            height: 28px;
          }

          .slide-icon-circle {
            width: 36px;
            height: 36px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rotating-wheel-group,
          .upright-node,
          .rotate-icon-spin,
          .petal-badge-pulse,
          .hub-breathing-ring {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  )
}
