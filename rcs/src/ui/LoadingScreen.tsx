import { useEffect, useState } from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  progress: number;
  currentModel?: string;
}

export const LoadingScreen = ({ progress, currentModel }: LoadingScreenProps) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      {/* Vietnam map outline animated */}
      <div className="loading-map">
        <svg viewBox="0 0 200 400" className="vietnam-outline">
          <path
            d="M100 20 L120 40 L125 60 L130 80 L140 100 L145 120 L150 140 L155 160 L150 180 L140 200 L130 220 L125 240 L120 260 L115 280 L110 300 L105 320 L100 340 L95 360 L90 380 L85 370 L80 350 L75 330 L70 310 L65 290 L60 270 L55 250 L50 230 L55 210 L60 190 L65 170 L70 150 L75 130 L80 110 L85 90 L90 70 L95 50 L100 20"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animated-path"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff6b6b" />
              <stop offset="50%" stopColor="#4ecdc4" />
              <stop offset="100%" stopColor="#ffe66d" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Loading content */}
      <div className="loading-content">
        <h2 className="loading-title">
          <span className="title-vietnam">VIỆT NAM</span>
          <span className="title-3d">3D LỊCH SỬ</span>
        </h2>

        <div className="loading-progress">
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            >
              <div className="progress-bar-glow" />
            </div>
          </div>

          <div className="progress-text">
            <span className="progress-percent">{Math.round(progress)}%</span>
            <span className="progress-label">
              {currentModel ? `Đang tải: ${currentModel}${dots}` : `Đang khởi tạo${dots}`}
            </span>
          </div>
        </div>

        {/* Loading hints */}
        <div className="loading-hints">
          <p className="hint-text">
            💡 Đang tải các mô hình 3D chi tiết...
          </p>
          <p className="hint-text small">
            Xe tăng 390 • Dinh Độc Lập • Bác Hồ • Hầm Điện Biên
          </p>
        </div>
      </div>

      {/* Particles background */}
      <div className="loading-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
