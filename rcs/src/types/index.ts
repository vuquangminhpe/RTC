import * as THREE from 'three';
import { Stage } from 'konva/lib/Stage';

// ============================================
// GEOGRAPHIC TYPES
// ============================================

export interface GeoCoordinates {
  lat: number;
  lng: number;
  alt?: number; // altitude in meters
}

export interface Vietnam3DCoords {
  x: number;
  y: number;
  z: number;
}

// ============================================
// HISTORICAL EVENT TYPES
// ============================================

export interface HistoricalLocation {
  id: string;
  name: string;
  year: number;
  coordinates: GeoCoordinates;

  // Content
  title: string;
  subtitle: string;
  description: string;
  detailedContent: {
    context: string;
    event: string;
    significance: string;
    impact: string;
    legacy: string;
  };

  // Visual
  color: string;
  markerType: 'flag' | 'monument' | 'battle' | 'city';

  // Camera settings for this location
  cameraPath: CameraKeyframe[];

  // Konva illustration
  illustrationType: 'dien-bien-phu' | 'ba-dinh' | 'saigon-1975' | 'ho-chi-minh' | 'doi-moi';
}

export interface CameraKeyframe {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  duration: number;
  ease?: string;
}

// ============================================
// 3D SCENE TYPES
// ============================================

export interface SceneConfig {
  fogColor: number;
  fogNear: number;
  fogFar: number;
  ambientLightIntensity: number;
  directionalLightIntensity: number;
  particleCount: number;
}

export interface TerrainConfig {
  segments: number;
  elevationScale: number;
  textureRepeat: number;
  wireframe: boolean;
}

// ============================================
// KONVA ILLUSTRATION TYPES
// ============================================

export interface IllustrationConfig {
  width: number;
  height: number;
  backgroundColor: string;
  animationDuration: number;
}

export interface KonvaScene {
  stage: Stage | null;
  layers: Map<string, any>;
  animations: Map<string, any>;
}

export interface DrawingElement {
  type: 'soldier' | 'flag' | 'tank' | 'building' | 'person' | 'text' | 'decoration';
  id: string;
  props: Record<string, any>;
  animations?: AnimationKeyframe[];
}

export interface AnimationKeyframe {
  property: string;
  from: any;
  to: any;
  duration: number;
  delay?: number;
  ease?: string;
}

// ============================================
// PARTICLE SYSTEM TYPES
// ============================================

export interface ParticleSystemConfig {
  count: number;
  lifetime: number;
  size: number;
  color: THREE.Color;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  spread: number;
  emissionRate: number;
}

export interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  lifetime: number;
  age: number;
  size: number;
  color: THREE.Color;
  alpha: number;
}

// ============================================
// CAMERA & CONTROLS TYPES
// ============================================

export interface CameraState {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
  near: number;
  far: number;
}

export interface FlyingTourConfig {
  locations: HistoricalLocation[];
  currentIndex: number;
  isPlaying: boolean;
  speed: number;
  autoAdvance: boolean;
}

// ============================================
// UI STATE TYPES
// ============================================

export interface AppState {
  currentLocation: HistoricalLocation | null;
  isLoading: boolean;
  showIllustration: boolean;
  showInfo: boolean;
  tourProgress: number;
  cameraMode: 'tour' | 'free' | 'locked';
}

// ============================================
// MARKER TYPES
// ============================================

export interface Marker3D {
  id: string;
  position: THREE.Vector3;
  mesh: THREE.Mesh | THREE.Group;
  location: HistoricalLocation;
  isActive: boolean;
  isHovered: boolean;
}

// ============================================
// SHADER TYPES
// ============================================

export interface ShaderConfig {
  vertexShader: string;
  fragmentShader: string;
  uniforms: {
    [key: string]: {
      value: any;
    };
  };
}

// ============================================
// POST PROCESSING TYPES
// ============================================

export interface PostProcessingConfig {
  bloom: {
    enabled: boolean;
    strength: number;
    radius: number;
    threshold: number;
  };
  depthOfField: {
    enabled: boolean;
    focusDistance: number;
    focalLength: number;
    bokehScale: number;
  };
  chromaticAberration: {
    enabled: boolean;
    offset: number;
  };
  vignette: {
    enabled: boolean;
    darkness: number;
    offset: number;
  };
}

// ============================================
// AUDIO TYPES
// ============================================

export interface AudioConfig {
  bgMusic: string;
  locationSounds: Map<string, string>;
  volume: number;
  enabled: boolean;
}
