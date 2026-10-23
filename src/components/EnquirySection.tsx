import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Check, Phone, MessageSquare, Loader2, Info } from 'lucide-react'
import confetti from 'canvas-confetti'
import { submitEnquiry, type EnquiryResult } from '../services/enquiryAdapter'

gsap.registerPlugin(ScrollTrigger)

export const EnquirySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    interestedIn: 'Help me decide',
    agreed: false,
  })

  const [metricCounts, setMetricCounts] = useState({
    years: 20,
    landmarks: 30,
    families: 2500,
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [submissionResult, setSubmissionResult] = useState<EnquiryResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // GSAP ScrollTrigger for 2x2 Metrics Count-up and Staggered Entrance
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Metric boxes entrance & count-up
      ScrollTrigger.create({
        trigger: '.metrics-2x2-grid',
        start: 'top 80%',
        onEnter: () => {
          const counterObj = { years: 0, landmarks: 0, families: 0 }
          gsap.to(counterObj, {
            years: 20,
            landmarks: 30,
            families: 2500,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => {
              setMetricCounts({
                years: Math.round(counterObj.years),
                landmarks: Math.round(counterObj.landmarks),
                families: Math.round(counterObj.families),
              })
            },
          })
        },
      })

      // Form card entrance
      gsap.fromTo(
        '.enquiry-card-anim',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.enquiry-card',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  const validate = () => {
    const errs: { [key: string]: string } = {}
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please enter your full name'
    }

    const cleanPhone = formData.phone.replace(/\D/g, '')
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number'
    }

    if (!formData.agreed) {
      errs.agreed = 'Please consent to receive project details'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    const result = await submitEnquiry({
      name: formData.name,
      phone: formData.phone,
      interestedIn: formData.interestedIn,
      agreed: formData.agreed,
      source: 'Visit Us Callback Form',
    })

    setIsSubmitting(false)
    if (result.success) {
      setSubmissionResult(result)
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#E0402B', '#3DAA73', '#FAF9F5'],
        })
      } catch {
        // fallback
      }
    } else {
      setErrors({ form: result.message })
    }
  }

  return (
    <section
      id="enquiry"
      ref={sectionRef}
      style={{
        position: 'relative',
        backgroundColor: '#103323',
        color: '#FFFFFF',
        paddingTop: 'clamp(5rem, 8vw, 7.5rem)',
        paddingBottom: 'clamp(5rem, 8vw, 7.5rem)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
        }}
      />

      <div className="container">
        <div className="enquiry-grid">
          {/* Left Column: Heading, Advisory Copy, and 4 Metrics */}
          <div className="enquiry-info-col">
            <h2 className="enquiry-heading">Visit us.</h2>

            <p className="enquiry-subhead">
              Schedule a call with us. Our advisor will guide you on the next steps towards buying
              your own home in Navi Mumbai's First Future City at Kharghar Hills.
            </p>

            {/* 4 Metrics in 2x2 Grid with Animated Count-Up */}
            <div className="metrics-2x2-grid">
              {/* Metric 1 */}
              <div className="metric-box box-top-left">
                <span className="metric-big-num">{metricCounts.years || 20}+</span>
                <span className="metric-big-label">Years of Experience</span>
              </div>

              {/* Metric 2 */}
              <div className="metric-box box-top-right">
                <span className="metric-big-num">{metricCounts.landmarks || 30}+</span>
                <span className="metric-big-label">Landmarks Delivered</span>
              </div>

              {/* Metric 3 */}
              <div className="metric-box box-bottom-left">
                <span className="metric-big-num">1.5 MN</span>
                <span className="metric-big-label">sq.ft. Delivered</span>
              </div>

              {/* Metric 4 */}
              <div className="metric-box box-bottom-right">
                <span className="metric-big-num">
                  {metricCounts.families ? metricCounts.families.toLocaleString() : '2,500'}+
                </span>
                <span className="metric-big-label">Happy Families</span>
              </div>
            </div>

            {/* Direct Instant Action Links */}
            <div className="instant-actions">
              <a href="tel:+918045683700" className="instant-contact-btn">
                <Phone size={16} color="#48E08C" />
                <span>Call Sales Desk: +91 80 4568 3700</span>
              </a>
              <a
                href="https://wa.me/918045683700?text=Hi,%20I%20am%20interested%20in%20Kharghar%20Hills"
                target="_blank"
                rel="noopener noreferrer"
                className="instant-contact-btn"
              >
                <MessageSquare size={16} color="#25D366" />
                <span>WhatsApp Instant Brochure</span>
              </a>
            </div>
          </div>

          {/* Right Column: White Card Form matching Page 6 */}
          <div className="enquiry-form-col">
            <div className="enquiry-card enquiry-card-anim">
              <span className="card-sub-tag">GET IN TOUCH</span>
              <h3 className="card-main-title">Request a callback</h3>
              <p className="card-desc">
                Share your details and we'll help you explore the project.
              </p>

              {submissionResult ? (
                <div className="form-success-state">
                  <div className="success-badge">
                    <Check size={28} color="#FFFFFF" />
                  </div>
                  <h4 className="success-title">Callback Request Received</h4>
                  <p className="success-message">
                    Thank you, <strong>{formData.name}</strong>. Reference ID: <strong>{submissionResult.referenceId}</strong>.
                    Our designated Kharghar Hills property advisor will contact you regarding {formData.interestedIn}.
                  </p>
                  
                  {/* Transparent Webhook Status Notice */}
                  <div className="webhook-status-card">
                    <Info size={15} color="#184D35" />
                    <span>{submissionResult.message}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmissionResult(null)
                      setFormData({ name: '', phone: '', interestedIn: 'Help me decide', agreed: false })
                    }}
                    className="btn-forest"
                    style={{ marginTop: '1.25rem', width: '100%' }}
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="enquiry-form">
                  {errors.form && <div className="form-alert-error">{errors.form}</div>}

                  {/* Name Field */}
                  <div className="form-group">
                    <label htmlFor="fullName" className="form-label">
                      Your name *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value })
                        if (errors.name) setErrors({ ...errors, name: '' })
                      }}
                      className={`form-input ${errors.name ? 'has-error' : ''}`}
                      required
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  {/* Mobile Field */}
                  <div className="form-group">
                    <label htmlFor="mobileNumber" className="form-label">
                      Mobile number *
                    </label>
                    <div className={`phone-input-wrap ${errors.phone ? 'has-error' : ''}`}>
                      <span className="phone-prefix">+91</span>
                      <input
                        id="mobileNumber"
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '')
                          setFormData({ ...formData, phone: val })
                          if (errors.phone) setErrors({ ...errors, phone: '' })
                        }}
                        className="phone-input"
                        required
                      />
                    </div>
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  {/* Interested In Field */}
                  <div className="form-group">
                    <label htmlFor="interestedIn" className="form-label">
                      Interested in
                    </label>
                    <select
                      id="interestedIn"
                      value={formData.interestedIn}
                      onChange={(e) => setFormData({ ...formData, interestedIn: e.target.value })}
                      className="form-select"
                    >
                      <option value="Help me decide">Help me decide</option>
                      <option value="1 BHK (Starting ₹54.99 Lacs+)">1 BHK (Starting ₹54.99 Lacs+)</option>
                      <option value="2 BHK (Starting ₹84.99 Lacs+)">2 BHK (Starting ₹84.99 Lacs+)</option>
                      <option value="1 & 2 BHK Portfolio">1 &amp; 2 BHK Portfolio</option>
                    </select>
                  </div>

                  {/* Agreement Checkbox */}
                  <div className="form-checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.agreed}
                        onChange={(e) => {
                          setFormData({ ...formData, agreed: e.target.checked })
                          if (errors.agreed) setErrors({ ...errors, agreed: '' })
                        }}
                        className="checkbox-input"
                      />
                      <span className="checkbox-text">
                        I agree to be contacted by this independent channel partner about
                        Kharghar Hills by call, SMS or WhatsApp.{' '}
                        <a href="#footer" className="privacy-link">
                          Privacy information.
                        </a>
                      </span>
                    </label>
                    {errors.agreed && <span className="error-text">{errors.agreed}</span>}
                  </div>

                  {/* Submit Button with Loading State */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary form-submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={17} className="btn-spinner" />
                        <span>Verifying Details...</span>
                      </>
                    ) : (
                      <>
                        <span>Request callback</span>
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>

                  <p className="form-footer-note">
                    Your details are used to respond to your property enquiry.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .enquiry-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3.5rem;
          align-items: center;
        }

        @media (min-width: 980px) {
          .enquiry-grid {
            grid-template-columns: 1.15fr 0.85fr;
            gap: 4rem;
          }
        }

        .enquiry-heading {
          font-family: var(--font-heading);
          font-size: clamp(2.4rem, 4.4vw, 3.8rem);
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.1;
          letter-spacing: -0.025em;
          margin-bottom: 1.25rem;
        }

        .enquiry-subhead {
          font-size: clamp(1rem, 1.3vw, 1.15rem);
          line-height: 1.6;
          color: #D2DFD8;
          max-width: 520px;
          margin-bottom: 2.75rem;
        }

        /* 2x2 Metrics Grid */
        .metrics-2x2-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.75rem 2.5rem;
          position: relative;
          max-width: 500px;
          margin-bottom: 2.5rem;
        }

        .metric-box {
          display: flex;
          flex-direction: column;
        }

        .metric-big-num {
          font-family: var(--font-heading);
          font-size: clamp(2.2rem, 3.6vw, 3.1rem);
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1;
          margin-bottom: 0.35rem;
        }

        .metric-big-label {
          font-size: clamp(0.85rem, 1.1vw, 0.95rem);
          color: #A4B8AE;
          line-height: 1.3;
        }

        .box-top-left {
          border-bottom: 1px dashed rgba(255, 255, 255, 0.18);
          border-right: 1px dashed rgba(255, 255, 255, 0.18);
          padding-bottom: 1.5rem;
          padding-right: 1.5rem;
        }

        .box-top-right {
          border-bottom: 1px dashed rgba(255, 255, 255, 0.18);
          padding-bottom: 1.5rem;
          padding-left: 0.5rem;
        }

        .box-bottom-left {
          border-right: 1px dashed rgba(255, 255, 255, 0.18);
          padding-top: 0.5rem;
          padding-right: 1.5rem;
        }

        .box-bottom-right {
          padding-top: 0.5rem;
          padding-left: 0.5rem;
        }

        .instant-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-width: 480px;
        }

        @media (min-width: 580px) {
          .instant-actions {
            flex-direction: row;
          }
        }

        .instant-contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #FFFFFF;
          padding: 0.65rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          transition: all 0.25s ease;
        }

        .instant-contact-btn:hover {
          background: rgba(255, 255, 255, 0.16);
          border-color: #FFFFFF;
        }

        /* Right Column Form Card */
        .enquiry-card {
          background-color: #FFFFFF;
          color: var(--color-text-dark);
          border-radius: var(--radius-xl);
          padding: clamp(2rem, 4vw, 3.25rem);
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
          will-change: transform, opacity;
        }

        .card-sub-tag {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-coral);
          display: block;
          margin-bottom: 0.4rem;
        }

        .card-main-title {
          font-family: var(--font-heading);
          font-size: clamp(1.8rem, 2.5vw, 2.2rem);
          font-weight: 800;
          color: var(--color-forest);
          letter-spacing: -0.02em;
          margin-bottom: 0.45rem;
        }

        .card-desc {
          font-size: 0.92rem;
          color: var(--color-text-muted);
          margin-bottom: 1.75rem;
        }

        .enquiry-form {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .form-label {
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-forest);
        }

        .form-input, .form-select {
          width: 100%;
          padding: 0.8rem 1rem;
          border-radius: var(--radius-sm);
          border: 1px solid #D5DBD8;
          background-color: #FAF9F5;
          color: var(--color-text-dark);
          font-size: 0.92rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .form-input:focus, .form-select:focus {
          border-color: var(--color-coral);
          background-color: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(224, 64, 43, 0.12);
          outline: none;
        }

        .phone-input-wrap {
          display: flex;
          align-items: center;
          border-radius: var(--radius-sm);
          border: 1px solid #D5DBD8;
          background-color: #FAF9F5;
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .phone-input-wrap:focus-within {
          border-color: var(--color-coral);
          background-color: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(224, 64, 43, 0.12);
        }

        .phone-prefix {
          padding: 0.8rem 0.9rem;
          background-color: #EEEDE6;
          color: var(--color-forest);
          font-weight: 700;
          font-size: 0.88rem;
          border-right: 1px solid #D5DBD8;
        }

        .phone-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.8rem 1rem;
          font-size: 0.92rem;
          color: var(--color-text-dark);
          outline: none;
        }

        .form-input.has-error, .phone-input-wrap.has-error {
          border-color: #E0402B;
          background-color: #FFF6F5;
        }

        .error-text {
          font-size: 0.74rem;
          color: #E0402B;
          font-weight: 600;
        }

        .form-checkbox-group {
          margin-top: 0.25rem;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.55rem;
          font-size: 0.76rem;
          line-height: 1.45;
          color: var(--color-text-muted);
          cursor: pointer;
        }

        .checkbox-input {
          margin-top: 2px;
          accent-color: var(--color-coral);
          width: 15px;
          height: 15px;
          flex-shrink: 0;
        }

        .privacy-link {
          color: var(--color-coral);
          text-decoration: underline;
        }

        .form-submit-btn {
          width: 100%;
          padding: 0.95rem;
          font-size: 1rem;
          border-radius: var(--radius-sm);
          margin-top: 0.5rem;
        }

        .btn-spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .form-footer-note {
          text-align: center;
          font-size: 0.72rem;
          color: var(--color-text-muted);
          margin-top: 0.25rem;
        }

        .webhook-status-card {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          background: #EBF8F0;
          border: 1px solid #BBE8CE;
          color: #184D35;
          padding: 0.75rem 0.9rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          line-height: 1.4;
          text-align: left;
          margin-top: 0.5rem;
        }

        /* Success State */
        .form-success-state {
          padding: 1rem 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .success-badge {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: #3DAA73;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          box-shadow: 0 8px 24px rgba(61, 170, 115, 0.35);
        }

        .success-title {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--color-forest);
          margin-bottom: 0.5rem;
        }

        .success-message {
          font-size: 0.92rem;
          line-height: 1.55;
          color: var(--color-text-body);
          margin-bottom: 0.75rem;
        }

        @media (prefers-reduced-motion: reduce) {
          .instant-contact-btn,
          .form-submit-btn,
          .form-input,
          .phone-input-wrap,
          .enquiry-card {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  )
}
