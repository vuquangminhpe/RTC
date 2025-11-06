import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface TimelineMilestoneProps {
  position: [number, number, number];
  year: number;
  color: string;
  scale: number;
}

export const TimelineMilestone = ({
  position,
  year,
  color,
  scale,
}: TimelineMilestoneProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Create gradient material
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
    });
  }, [color]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Subtle rotation animation
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    }

    if (glowRef.current) {
      // Pulsing glow effect
      const pulseScale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
      glowRef.current.scale.setScalar(pulseScale);
    }
  });

  return (
    <group position={position}>
      {/* Main milestone sphere */}
      <mesh ref={meshRef} scale={scale}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <primitive object={material} />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef} scale={scale * 1.5}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Year label */}
      <Text
        position={[1, 0, 0]}
        fontSize={0.4}
        color="white"
        anchorX="left"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {year}
      </Text>

      {/* Connecting line to timeline */}
      <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </group>
  );
};
