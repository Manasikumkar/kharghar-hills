import React from 'react'
import { Phone, MessageSquare, Calendar } from 'lucide-react'

interface FloatingContactBarProps {
  onOpenModal: () => void
}

export const FloatingContactBar: React.FC<FloatingContactBarProps> = ({ onOpenModal }) => {
  return (
    <aside className="floating-bar-wrap" aria-label="Quick contact and booking options">
      <div className="floating-bar">
        <a
          href="tel:+918045683700"
          className="floating-btn phone-btn"
          aria-label="Call property sales team"
        >
          <Phone size={17} />
          <span>Call Sales</span>
        </a>

        <div className="floating-divider" />

        <a
          href="https://wa.me/918045683700?text=Hi,%20I%20am%20interested%20in%20Kharghar%20Hills%201%20and%202%20BHK%20homes"
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn whatsapp-btn"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare size={17} />
          <span>WhatsApp</span>
        </a>

        <div className="floating-divider" />

        <button
          type="button"
          onClick={onOpenModal}
          className="floating-btn book-btn"
          aria-label="Open booking enquiry form"
        >
          <Calendar size={17} />
          <span>Enquire</span>
        </button>
      </div>

      <style>{`
        .floating-bar-wrap {
          position: fixed;
          bottom: 1.25rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          width: calc(100% - 2.5rem);
          max-width: 440px;
          pointer-events: none;
        }

        .floating-bar {
          pointer-events: auto;
          background: rgba(16, 51, 35, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-pill);
          padding: 0.45rem 0.65rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
        }

        .floating-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.6rem 0.5rem;
          border-radius: var(--radius-pill);
          color: #FFFFFF;
          transition: background-color 0.2s ease, transform 0.2s ease;
          text-decoration: none;
        }

        .phone-btn:hover {
          background-color: rgba(255, 255, 255, 0.12);
        }

        .whatsapp-btn {
          color: #25D366;
        }

        .whatsapp-btn:hover {
          background-color: rgba(37, 211, 102, 0.15);
        }

        .book-btn {
          background-color: var(--color-coral);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(224, 64, 43, 0.3);
        }

        .book-btn:hover {
          background-color: var(--color-coral-hover);
        }

        .floating-divider {
          width: 1px;
          height: 22px;
          background: rgba(255, 255, 255, 0.18);
        }

        @media (min-width: 900px) {
          .floating-bar-wrap {
            display: none;
          }
        }
      `}</style>
    </aside>
  )
}
