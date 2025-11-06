import { useEffect } from 'react';
import { HistoricalEvent } from '../../types';
import '../../styles/modal.css';

interface ModalProps {
  event: HistoricalEvent | null;
  onClose: () => void;
}

export const Modal = ({ event, onClose }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (event) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-header">
          <div className="modal-year" style={{ color: event.color }}>
            {event.year}
          </div>
          <h2 className="modal-title">{event.title}</h2>
          <p className="modal-subtitle">{event.subtitle}</p>
        </div>

        <div className="modal-body">
          <div className="modal-image-wrapper">
            <img
              src={event.image}
              alt={event.title}
              className="modal-image"
              onError={(e) => {
                e.currentTarget.src = `https://via.placeholder.com/600x400/333/fff?text=${event.year}`;
              }}
            />
          </div>

          <div className="modal-description">
            <h3>Bối cảnh</h3>
            <p>{event.description}</p>
          </div>

          <div className="modal-detailed">
            <h3>Ý nghĩa lịch sử</h3>
            <p>{event.detailedContent.meaning}</p>

            {event.detailedContent.lessons && (
              <>
                <h3>Bài học kinh nghiệm</h3>
                <p>{event.detailedContent.lessons}</p>
              </>
            )}

            {event.detailedContent.impact && (
              <>
                <h3>Tác động</h3>
                <p>{event.detailedContent.impact}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
