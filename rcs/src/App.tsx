import { Scene3D } from './ui/Scene3D';
import './App.css';

function App() {
  return (
    <div className="app">
      {/* Header - only title */}
      <header className="app-header">
        <h1 className="app-title">
          <span className="title-vietnam">VIỆT NAM</span>
          <span className="title-history">HÀNH TRÌNH LỊCH SỬ 3D</span>
        </h1>
      </header>

      {/* Pure 3D Scene - all interaction in 3D */}
      <Scene3D />
    </div>
  );
}

export default App;
