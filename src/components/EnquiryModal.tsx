import React, { useState, useEffect } from 'react'
import { X, ArrowRight, Check, ShieldCheck, Loader2, Info } from 'lucide-react'
import confetti from 'canvas-confetti'
import { submitEnquiry, type EnquiryResult } from '../services/enquiryAdapter'

interface EnquiryModalProps {
  isOpen: boolean
  onClose: () => void
  initialUnit?: string
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  initialUnit = 'Help me decide',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    unit: initialUnit,
    agreed: true,
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [submissionResult, setSubmissionResult] = useState<EnquiryResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

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
      errs.agreed = 'Please consent to receive project communication'
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
      interestedIn: formData.unit,
      agreed: formData.agreed,
      source: 'Modal Booking Dialog',
    })

    setIsSubmitting(false)
    if (result.success) {
      setSubmissionResult(result)
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
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
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-dialog">
        <button
          type="button"
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div className="modal-header">
          <span className="modal-badge">Advance Bookings Open</span>
          <h3 id="modal-title" className="modal-title">
            Unlock Full Details &amp; Pricing
          </h3>
          <p className="modal-subtitle">
            Receive detailed floor plans, cost breakdown, and priority booking benefits for Kharghar
            Hills.
          </p>
        </div>

        {submissionResult ? (
          <div className="modal-success">
            <div className="modal-success-icon">
              <Check size={28} color="#FFFFFF" />
            </div>
            <h4 className="modal-success-heading">Request Received</h4>
            <p className="modal-success-text">
              Thank you, <strong>{formData.name}</strong>. Reference: <strong>{submissionResult.referenceId}</strong>.
              Your interest in <strong>{formData.unit}</strong> has been logged.
            </p>
            
            <div className="modal-status-box">
              <Info size={15} color="#184D35" />
              <span>{submissionResult.message}</span>
            </div>


            <button
              type="button"
              onClick={onClose}
              className="modal-done-btn"
            >
              Done &amp; Return to Page
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="modal-form">
            {errors.form && <div className="modal-alert-error">{errors.form}</div>}

            <div className="form-group">
              <label htmlFor="modalName" className="form-label">
                Full Name *
              </label>
              <input
                id="modalName"
                type="text"
                placeholder="Enter your name"
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

            <div className="form-group">
              <label htmlFor="modalPhone" className="form-label">
                Mobile Number *
              </label>
              <div className={`phone-input-wrap ${errors.phone ? 'has-error' : ''}`}>
                <span className="phone-prefix">+91</span>
                <input
                  id="modalPhone"
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

            <div className="form-group">
              <label htmlFor="modalUnit" className="form-label">
                Preferred Configuration
              </label>
              <select
                id="modalUnit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="form-select"
              >
                <option value="1 BHK (Starting ₹54.99 Lacs+)">1 BHK (Starting ₹54.99 Lacs+)</option>
                <option value="2 BHK (Starting ₹84.99 Lacs+)">2 BHK (Starting ₹84.99 Lacs+)</option>
                <option value="All Configurations">All Configurations</option>
                <option value="Help me decide">Help me decide</option>
              </select>
            </div>

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
                  I consent to receive calls, SMS and WhatsApp messages with project information and
                  offers.
                </span>
              </label>
              {errors.agreed && <span className="error-text">{errors.agreed}</span>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary modal-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={17} className="modal-spinner" />
                  <span>Connecting to Advisor...</span>
                </>
              ) : (
                <>
                  <span>Get Instant Floor Plans &amp; Cost Sheet</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            <div className="modal-security-note">
              <ShieldCheck size={14} color="#3DAA73" />
              <span>Zero Spam. Your details are strictly confidential.</span>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(10, 24, 18, 0.78);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1.25rem;
          animation: modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-dialog {
          background-color: #FFFFFF;
          width: 100%;
          max-width: 500px;
          border-radius: var(--radius-xl);
          padding: clamp(1.75rem, 4vw, 2.75rem);
          position: relative;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
          animation: modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalSlideUp {
          from { transform: translateY(24px) scale(0.96); }
          to { transform: translateY(0) scale(1); }
        }

        .modal-close-btn {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(16, 51, 35, 0.06);
          color: #103323;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }

        .modal-close-btn:hover {
          background: rgba(16, 51, 35, 0.14);
        }

        .modal-badge {
          display: inline-block;
          font-family: var(--font-heading);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-coral);
          background: var(--color-coral-light);
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-pill);
          margin-bottom: 0.75rem;
        }

        .modal-title {
          font-family: var(--font-heading);
          font-size: clamp(1.4rem, 2.2vw, 1.75rem);
          font-weight: 800;
          color: var(--color-forest);
          letter-spacing: -0.02em;
          margin-bottom: 0.45rem;
          line-height: 1.2;
        }

        .modal-subtitle {
          font-size: 0.86rem;
          color: var(--color-text-muted);
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .modal-submit-btn {
          width: 100%;
          padding: 0.95rem;
          font-size: 0.95rem;
          margin-top: 0.5rem;
        }

        .modal-spinner {
          animation: spinModal 1s linear infinite;
        }

        @keyframes spinModal {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .modal-security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-size: 0.74rem;
          color: var(--color-text-muted);
          margin-top: 0.25rem;
        }

        .modal-status-box {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          background: #EBF8F0;
          border: 1px solid #BBE8CE;
          color: #184D35;
          padding: 0.7rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          line-height: 1.4;
          text-align: left;
          width: 100%;
        }

        .modal-success {
          text-align: center;
          padding: 1rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .modal-success-icon {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #3DAA73;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          box-shadow: 0 8px 20px rgba(61, 170, 115, 0.3);
        }

        .modal-success-heading {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--color-forest);
          margin-bottom: 0.5rem;
        }

        .modal-success-text {
          font-size: 0.9rem;
          color: var(--color-text-body);
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .modal-direct-call {
          width: 100%;
          margin-bottom: 0.85rem;
        }

        .modal-done-btn {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          text-decoration: underline;
          padding: 0.5rem;
        }

        @media (prefers-reduced-motion: reduce) {
          .modal-backdrop,
          .modal-dialog {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
