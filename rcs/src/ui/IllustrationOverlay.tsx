import { useEffect, useRef, useState } from 'react';
import type { HistoricalLocation } from '../types';
import { DienBienPhuScene } from '../illustrations/DienBienPhuScene';
import { BaDinhScene } from '../illustrations/BaDinhScene';
import { Saigon1975Scene } from '../illustrations/Saigon1975Scene';
import { BaseIllustration } from '../illustrations/BaseIllustration';
import './IllustrationOverlay.css';

interface IllustrationOverlayProps {
  location: HistoricalLocation | null;
  isVisible: boolean;
  onClose?: () => void;
}

export const IllustrationOverlay = ({ location, isVisible, onClose }: IllustrationOverlayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const illustrationRef = useRef<BaseIllustration | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!location || !isVisible || !containerRef.current) {
      return;
    }

    // Cleanup previous illustration
    if (illustrationRef.current) {
      illustrationRef.current.destroy();
      illustrationRef.current = null;
    }

    // Clear container
    const containerId = 'illustration-canvas';
    let container = document.getElementById(containerId);
    if (container) {
      container.remove();
    }

    // Create new container
    container = document.createElement('div');
    container.id = containerId;
    containerRef.current.appendChild(container);

    // Create appropriate illustration
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.7;

    let illustration: BaseIllustration;

    switch (location.illustrationType) {
      case 'dien-bien-phu':
        illustration = new DienBienPhuScene({
          container: containerId,
          width,
          height,
          backgroundColor: '#1a1a2e',
        });
        break;

      case 'ba-dinh':
        illustration = new BaDinhScene({
          container: containerId,
          width,
          height,
          backgroundColor: '#1a1a2e',
        });
        break;

      case 'saigon-1975':
        illustration = new Saigon1975Scene({
          container: containerId,
          width,
          height,
          backgroundColor: '#1a1a2e',
        });
        break;

      default:
        // Fallback illustration
        illustration = new DienBienPhuScene({
          container: containerId,
          width,
          height,
          backgroundColor: '#1a1a2e',
        });
    }

    illustrationRef.current = illustration;

    // Initialize and play
    illustration.initialize().then(() => {
      setIsReady(true);
      setTimeout(() => {
        illustration.play();
      }, 500);
    });

    // Cleanup
    return () => {
      if (illustrationRef.current) {
        illustrationRef.current.destroy();
        illustrationRef.current = null;
      }
      setIsReady(false);
    };
  }, [location, isVisible]);

  if (!location || !isVisible) {
    return null;
  }

  return (
    <div className={`illustration-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="illustration-content">
        {/* Close button */}
        <button className="illustration-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" />
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

        {/* Header */}
        <div className="illustration-header">
          <div className="illustration-year" style={{ color: location.color }}>
            {location.year}
          </div>
          <h2 className="illustration-title">{location.title}</h2>
          <p className="illustration-subtitle">{location.subtitle}</p>
        </div>

        {/* Canvas container */}
        <div
          ref={containerRef}
          className={`illustration-canvas-wrapper ${isReady ? 'ready' : ''}`}
        />

        {/* Info panel */}
        <div className="illustration-info">
          <div className="info-section">
            <h3>Bối cảnh</h3>
            <p>{location.detailedContent.context}</p>
          </div>

          <div className="info-section">
            <h3>Sự kiện</h3>
            <p>{location.detailedContent.event}</p>
          </div>

          <div className="info-section">
            <h3>Ý nghĩa</h3>
            <p>{location.detailedContent.significance}</p>
          </div>

          <div className="info-section">
            <h3>Tác động</h3>
            <p>{location.detailedContent.impact}</p>
          </div>

          <div className="info-section">
            <h3>Di sản</h3>
            <p>{location.detailedContent.legacy}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
