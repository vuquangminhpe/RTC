import * as THREE from 'three';
import gsap from 'gsap';
import type { HistoricalLocation } from '../types';
import { geoTo3D, createCameraPath, createSplinePath } from '../utils/geoUtils';

// ============================================
// CAMERA CONTROLLER
// Controls camera flying tour through Vietnam
// ============================================

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private currentPath: THREE.CatmullRomCurve3 | null = null;
  private currentAnimation: gsap.core.Timeline | null = null;
  private isFlying = false;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }

  /**
   * Fly camera to a specific location
   */
  public async flyToLocation(
    location: HistoricalLocation,
    duration: number = 4
  ): Promise<void> {
    if (this.isFlying) {
      this.stopCurrentFlight();
    }

    this.isFlying = true;

    const target3D = geoTo3D(location.coordinates);

    // Calculate camera position (above and in front of location)
    const cameraOffset = new THREE.Vector3(
      target3D.x + 15,
      target3D.y + 25,
      target3D.z + 20
    );

    // Create smooth path
    const startPos = this.camera.position.clone();
    const pathPoints = createCameraPath(
      startPos,
      cameraOffset,
      20,
      30 // Arc height
    );

    this.currentPath = createSplinePath(pathPoints);

    // Animate camera along path
    const tl = gsap.timeline({
      onComplete: () => {
        this.isFlying = false;
        this.currentAnimation = null;
      },
    });

    const lookAtTarget = new THREE.Vector3(target3D.x, target3D.y + 5, target3D.z);
    const self = this;

    tl.to(
      { progress: 0 },
      {
        progress: 1,
        duration: duration,
        ease: 'power2.inOut',
        onUpdate: function () {
          const target = this.targets()[0];
          if (!target) return;

          const progress = target.progress;
          const position = self.currentPath!.getPoint(progress);
          self.camera.position.copy(position);
          self.camera.lookAt(lookAtTarget);
        },
      }
    );

    this.currentAnimation = tl;

    return new Promise((resolve) => {
      tl.eventCallback('onComplete', resolve);
    });
  }

  /**
   * Fly through multiple locations in sequence
   */
  public async flyTour(locations: HistoricalLocation[], pauseDuration: number = 3): Promise<void> {
    for (const location of locations) {
      await this.flyToLocation(location, 5);
      await this.pause(pauseDuration);
    }
  }

  /**
   * Orbit around current location
   */
  public orbitLocation(location: HistoricalLocation, radius: number = 20, speed: number = 1): void {
    if (this.currentAnimation) {
      this.currentAnimation.kill();
    }

    const target3D = geoTo3D(location.coordinates);
    const lookAtTarget = new THREE.Vector3(target3D.x, target3D.y + 5, target3D.z);

    const tl = gsap.timeline({ repeat: -1 });
    const self = this;

    tl.to(
      { progress: 0 },
      {
        progress: 1,
        duration: 10 / speed,
        ease: 'none',
        onUpdate: function () {
          const progress = this.targets()[0].progress;
          const time = progress * Math.PI * 2;
          const x = target3D.x + Math.cos(time) * radius;
          const z = target3D.z + Math.sin(time) * radius;
          const y = target3D.y + 20 + Math.sin(time * 2) * 5;

          self.camera.position.set(x, y, z);
          self.camera.lookAt(lookAtTarget);
        },
      }
    );

    this.currentAnimation = tl;
  }

  /**
   * Cinematic intro flight (fly over entire Vietnam)
   */
  public async introFlight(): Promise<void> {
    // Start from high above north
    const startPos = new THREE.Vector3(0, 80, 80);
    this.camera.position.copy(startPos);

    // Create path going south
    const waypoints = [
      new THREE.Vector3(0, 80, 80), // North
      new THREE.Vector3(-20, 60, 40), // Central
      new THREE.Vector3(10, 70, 0), // Central Highlands
      new THREE.Vector3(20, 50, -40), // South
      new THREE.Vector3(0, 60, -20), // Final overview
    ];

    const path = createSplinePath(waypoints, 0.3);
    const lookAtTarget = new THREE.Vector3(0, 0, 0);

    const tl = gsap.timeline();
    const self = this;

    tl.to(
      { progress: 0 },
      {
        progress: 1,
        duration: 10,
        ease: 'power1.inOut',
        onUpdate: function () {
          const progress = this.targets()[0].progress;
          const position = path.getPoint(progress);
          self.camera.position.copy(position);

          // Gradually look at center
          lookAtTarget.y = 10 - progress * 10;
          self.camera.lookAt(lookAtTarget);
        },
      }
    );

    this.currentAnimation = tl;

    return new Promise((resolve) => {
      tl.eventCallback('onComplete', resolve);
    });
  }

  /**
   * Stop current flight
   */
  public stopCurrentFlight(): void {
    if (this.currentAnimation) {
      this.currentAnimation.kill();
      this.currentAnimation = null;
    }
    this.isFlying = false;
  }

  /**
   * Pause for duration
   */
  private pause(duration: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, duration * 1000);
    });
  }

  /**
   * Reset camera to default position
   */
  public resetCamera(): void {
    this.stopCurrentFlight();

    gsap.to(this.camera.position, {
      x: 0,
      y: 60,
      z: 80,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        this.camera.lookAt(0, 0, 0);
      },
    });
  }

  /**
   * Shake camera (for dramatic effects)
   */
  public shake(intensity: number = 1, duration: number = 0.5): void {
    const originalPos = this.camera.position.clone();

    const tl = gsap.timeline();

    for (let i = 0; i < 10; i++) {
      tl.to(this.camera.position, {
        x: originalPos.x + (Math.random() - 0.5) * intensity,
        y: originalPos.y + (Math.random() - 0.5) * intensity,
        z: originalPos.z + (Math.random() - 0.5) * intensity,
        duration: duration / 10,
        ease: 'none',
      });
    }

    tl.to(this.camera.position, {
      x: originalPos.x,
      y: originalPos.y,
      z: originalPos.z,
      duration: 0.1,
    });
  }

  /**
   * Get camera state
   */
  public getState() {
    return {
      position: this.camera.position.clone(),
      rotation: this.camera.rotation.clone(),
      isFlying: this.isFlying,
    };
  }

  /**
   * Set camera state
   */
  public setState(position: THREE.Vector3, lookAt: THREE.Vector3): void {
    this.camera.position.copy(position);
    this.camera.lookAt(lookAt);
  }
}
