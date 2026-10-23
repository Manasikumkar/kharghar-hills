import React from 'react'
import { Calendar } from 'lucide-react'

interface FloatingContactBarProps {
  onOpenModal: () => void
}

export const FloatingContactBar: React.FC<FloatingContactBarProps> = ({ onOpenModal }) => {
  return (
    <aside className="floating-bar-wrap" aria-label="Quick booking option">
      <div className="floating-bar">
        <button
          type="button"
          onClick={onOpenModal}
          className="floating-btn book-btn"
          aria-label="Open booking enquiry form"
        >
          <Calendar size={17} />
          <span>Enquire Now &bull; Schedule Visit</span>
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
          max-width: 340px;
          pointer-events: none;
        }

        .floating-bar {
          pointer-events: auto;
          background: rgba(16, 51, 35, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-pill);
          padding: 0.35rem;
          display: flex;
          align-items: center;
          width: 100%;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
        }

        .floating-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-family: var(--font-heading);
          font-size: 0.86rem;
          font-weight: 700;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-pill);
          color: #FFFFFF;
          transition: background-color 0.2s ease, transform 0.2s ease;
          text-decoration: none;
        }

        .book-btn {
          background-color: var(--color-coral);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(224, 64, 43, 0.3);
        }

        .book-btn:hover {
          background-color: var(--color-coral-hover);
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

