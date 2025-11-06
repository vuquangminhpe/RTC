import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { TimelineAxis } from '../Timeline/TimelineAxis';
import { TimelineMilestone } from '../Timeline/TimelineMilestone';
import { historicalEvents } from '../../data/events';
import '../../styles/scene.css';

interface SceneProps {
  scrollProgress: number;
  milestoneScales: number[];
}

export const Scene = ({ scrollProgress, milestoneScales }: SceneProps) => {
  const timelineLength = 20;
  const spacing = timelineLength / (historicalEvents.length - 1);

  return (
    <div className="scene-container">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={60} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4ecdc4" />
        <pointLight position={[10, -10, -5]} intensity={0.5} color="#ff6b6b" />

        {/* Environment for reflections */}
        <Environment preset="city" />

        {/* Timeline axis */}
        <TimelineAxis length={timelineLength} progress={scrollProgress} />

        {/* Milestones */}
        {historicalEvents.map((event, index) => {
          const xPosition = -timelineLength / 2 + index * spacing;
          return (
            <TimelineMilestone
              key={event.id}
              position={[xPosition, 0, 0]}
              year={event.year}
              color={event.color}
              scale={milestoneScales[index] || 1}
            />
          );
        })}

        {/* Fog for depth */}
        <fog attach="fog" args={['#0a0a0a', 10, 30]} />
      </Canvas>
    </div>
  );
};
