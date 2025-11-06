import { useState } from 'react';
import { HistoricalLocation } from '../types';
import { historicalLocations } from '../data/locations';
import './Controls.css';

interface ControlsProps {
  currentLocation: HistoricalLocation | null;
  onLocationSelect: (location: HistoricalLocation) => void;
  onShowIllustration: () => void;
}

export const Controls = ({ currentLocation, onLocationSelect, onShowIllustration }: ControlsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Location markers */}
      <div className="location-markers">
        {historicalLocations.map((location) => {
          const isActive = currentLocation?.id === location.id;

          return (
            <button
              key={location.id}
              className={`location-marker ${isActive ? 'active' : ''}`}
              style={{ '--marker-color': location.color } as React.CSSProperties}
              onClick={() => onLocationSelect(location)}
              title={`${location.year} - ${location.name}`}
            >
              <span className="marker-year">{location.year}</span>
              <span className="marker-name">{location.name}</span>
            </button>
          );
        })}
      </div>

      {/* Current location info */}
      {currentLocation && (
        <div className="location-info">
          <div className="location-info-header">
            <div className="location-year" style={{ color: currentLocation.color }}>
              {currentLocation.year}
            </div>
            <h3 className="location-title">{currentLocation.title}</h3>
            <p className="location-subtitle">{currentLocation.subtitle}</p>
          </div>

          <p className="location-description">{currentLocation.description}</p>

          <button className="view-illustration-btn" onClick={onShowIllustration}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            <span>Xem minh họa</span>
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="instructions">
        <button className="instructions-toggle" onClick={() => setIsExpanded(!isExpanded)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M10 7v6M7 10h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {isExpanded && (
          <div className="instructions-panel">
            <h4>Hướng dẫn</h4>
            <ul>
              <li>
                <strong>Click</strong> vào các điểm đỏ để bay đến địa điểm lịch sử
              </li>
              <li>
                <strong>Kéo chuột</strong> để xoay camera
              </li>
              <li>
                <strong>Scroll</strong> để zoom in/out
              </li>
              <li>
                <strong>Click "Xem minh họa"</strong> để xem tranh minh họa chi tiết
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
