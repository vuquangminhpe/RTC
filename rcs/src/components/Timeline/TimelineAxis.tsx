import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TimelineAxisProps {
  length: number;
  progress: number;
}

export const TimelineAxis = ({ length, progress }: TimelineAxisProps) => {
  const lineRef = useRef<THREE.Mesh>(null);
  const progressLineRef = useRef<THREE.Mesh>(null);

  // Create gradient texture for the timeline
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createLinearGradient(0, 0, 256, 0);
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(0.25, '#4ecdc4');
    gradient.addColorStop(0.5, '#ffe66d');
    gradient.addColorStop(0.75, '#ff6b9d');
    gradient.addColorStop(1, '#a8e6cf');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 1);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useFrame(() => {
    if (progressLineRef.current) {
      // Update progress line scale based on scroll
      progressLineRef.current.scale.y = progress;
    }
  });

  return (
    <group>
      {/* Main timeline axis (background) */}
      <mesh ref={lineRef} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, length, 16]} />
        <meshStandardMaterial
          color="#333333"
          metalness={0.5}
          roughness={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Progress line (colored) */}
      <mesh
        ref={progressLineRef}
        rotation={[0, 0, Math.PI / 2]}
        position={[-length / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.08, 0.08, length, 16]} />
        <meshStandardMaterial
          map={gradientTexture}
          emissive="#ffffff"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Glow effect for progress line */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, length, 16]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};
