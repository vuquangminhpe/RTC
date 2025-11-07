import { useState } from 'react';
import { Scene3D } from './ui/Scene3D';
import { IllustrationOverlay } from './ui/IllustrationOverlay';
import { Controls } from './ui/Controls';
import type { HistoricalLocation } from './types';
import './App.css';

function App() {
  const [currentLocation, setCurrentLocation] = useState<HistoricalLocation | null>(null);
  const [showIllustration, setShowIllustration] = useState(false);

  const handleLocationSelect = (location: HistoricalLocation) => {
    setCurrentLocation(location);
    setShowIllustration(false);
  };

  const handleLocationReached = (location: HistoricalLocation) => {
    // Camera has reached the location
    console.log('Reached:', location.name);
  };

  const handleShowIllustration = () => {
    setShowIllustration(true);
  };

  const handleCloseIllustration = () => {
    setShowIllustration(false);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">
          <span className="title-vietnam">VIỆT NAM</span>
          <span className="title-history">HÀNH TRÌNH LỊCH SỬ 3D</span>
        </h1>
      </header>

      {/* 3D Scene */}
      <Scene3D
        currentLocation={currentLocation}
        onLocationReached={handleLocationReached}
      />

      {/* Controls */}
      <Controls
        currentLocation={currentLocation}
        onLocationSelect={handleLocationSelect}
        onShowIllustration={handleShowIllustration}
      />

      {/* Illustration Overlay */}
      <IllustrationOverlay
        location={currentLocation}
        isVisible={showIllustration}
        onClose={handleCloseIllustration}
      />
    </div>
  );
}

export default App;
