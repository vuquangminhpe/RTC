import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HistoricalEvent } from '../../types';
import '../../styles/event-card.css';

gsap.registerPlugin(ScrollTrigger);

interface EventCardProps {
  event: HistoricalEvent;
  onOpenModal: (event: HistoricalEvent) => void;
}

export const EventCard = ({ event, onOpenModal }: EventCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
        opacity: 0,
        x: event.position === 'left' ? -100 : 100,
        scale: 0.8,
      });

      gsap.to(cardRef.current, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
        opacity: 1,
        x: 0,
        scale: 1,
      });
    });

    return () => ctx.revert();
  }, [event.position]);

  return (
    <div
      ref={cardRef}
      className={`event-card event-card-${event.position}`}
      style={{ '--card-color': event.color } as React.CSSProperties}
    >
      <div className="event-card-inner">
        <div className="event-year" style={{ color: event.color }}>
          {event.year}
        </div>

        <h3 className="event-title">{event.title}</h3>
        <p className="event-subtitle">{event.subtitle}</p>

        <div className="event-image-wrapper">
          <img
            src={event.image}
            alt={event.title}
            className="event-image"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/400x300/333/fff?text=${event.year}`;
            }}
          />
          <div className="event-image-overlay"></div>
        </div>

        <p className="event-description">{event.description}</p>

        <button
          className="event-button"
          onClick={() => onOpenModal(event)}
          style={{ backgroundColor: event.color }}
        >
          <span>{event.buttonText}</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 10h12m0 0l-4-4m4 4l-4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="event-connector"></div>
    </div>
  );
};
