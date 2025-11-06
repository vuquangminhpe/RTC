import * as THREE from 'three';
import { GeoCoordinates, Vietnam3DCoords } from '../types';
import { VIETNAM_BOUNDS, MAP_CONFIG } from '../data/locations';

// ============================================
// GEOGRAPHIC UTILITIES
// ============================================

/**
 * Convert GPS coordinates (lat, lng) to 3D coordinates
 * Using Mercator projection with custom scaling
 */
export function geoTo3D(geo: GeoCoordinates): Vietnam3DCoords {
  const { lat, lng, alt = 0 } = geo;
  const { centerLat, centerLng } = VIETNAM_BOUNDS;
  const { scale, elevationScale } = MAP_CONFIG;

  // Mercator projection
  const x = (lng - centerLng) * scale;
  const z = -(lat - centerLat) * scale; // Negative Z for correct orientation
  const y = alt * elevationScale;

  return { x, y, z };
}

/**
 * Convert 3D coordinates back to GPS coordinates
 */
export function threeDToGeo(coords: Vietnam3DCoords): GeoCoordinates {
  const { x, y, z } = coords;
  const { centerLat, centerLng } = VIETNAM_BOUNDS;
  const { scale, elevationScale } = MAP_CONFIG;

  const lng = x / scale + centerLng;
  const lat = -z / scale + centerLat;
  const alt = y / elevationScale;

  return { lat, lng, alt };
}

/**
 * Calculate distance between two geographic points (in km)
 * Using Haversine formula
 */
export function geoDistance(p1: GeoCoordinates, p2: GeoCoordinates): number {
  const R = 6371; // Earth's radius in km

  const lat1 = toRadians(p1.lat);
  const lat2 = toRadians(p2.lat);
  const dLat = toRadians(p2.lat - p1.lat);
  const dLng = toRadians(p2.lng - p1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate bearing between two points (in degrees)
 */
export function getBearing(p1: GeoCoordinates, p2: GeoCoordinates): number {
  const lat1 = toRadians(p1.lat);
  const lat2 = toRadians(p2.lat);
  const dLng = toRadians(p2.lng - p1.lng);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

/**
 * Create smooth camera path between two points
 */
export function createCameraPath(
  start: THREE.Vector3,
  end: THREE.Vector3,
  numPoints: number = 20,
  heightArc: number = 50
): THREE.Vector3[] {
  const path: THREE.Vector3[] = [];

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;

    // Interpolate X and Z
    const x = THREE.MathUtils.lerp(start.x, end.x, t);
    const z = THREE.MathUtils.lerp(start.z, end.z, t);

    // Create arc for Y using sine curve
    const arcProgress = Math.sin(t * Math.PI);
    const baseY = THREE.MathUtils.lerp(start.y, end.y, t);
    const y = baseY + arcProgress * heightArc;

    path.push(new THREE.Vector3(x, y, z));
  }

  return path;
}

/**
 * Create Catmull-Rom spline path for smooth camera movement
 */
export function createSplinePath(points: THREE.Vector3[], tension: number = 0.5): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(points, false, 'catmullrom', tension);
}

/**
 * Get point on path at normalized position (0-1)
 */
export function getPointOnPath(path: THREE.CatmullRomCurve3, t: number): THREE.Vector3 {
  return path.getPoint(Math.max(0, Math.min(1, t)));
}

/**
 * Get tangent (direction) on path at normalized position (0-1)
 */
export function getTangentOnPath(path: THREE.CatmullRomCurve3, t: number): THREE.Vector3 {
  return path.getTangent(Math.max(0, Math.min(1, t))).normalize();
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Smooth step interpolation
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Smoother step interpolation
 */
export function smootherstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Map value from one range to another
 */
export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Random number between min and max
 */
export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random point in circle
 */
export function randomInCircle(radius: number): { x: number; y: number } {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * radius;
  return {
    x: Math.cos(angle) * r,
    y: Math.sin(angle) * r,
  };
}

/**
 * Random point in sphere
 */
export function randomInSphere(radius: number): THREE.Vector3 {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;

  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
}

/**
 * Ease functions for animations
 */
export const easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  easeInOutQuart: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  easeInElastic: (t: number) => {
    if (t === 0 || t === 1) return t;
    return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * ((2 * Math.PI) / 3));
  },
  easeOutElastic: (t: number) => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
  },
  easeInOutElastic: (t: number) => {
    if (t === 0 || t === 1) return t;
    const c = (2 * Math.PI) / 4.5;
    return t < 0.5
      ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c)) / 2
      : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c)) / 2 + 1;
  },
};
