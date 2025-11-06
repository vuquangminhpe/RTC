import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VietnamMap3D } from '../core/VietnamMap3D';
import { CameraController } from '../core/CameraController';
import { HistoricalLocation } from '../types';
import './Scene3D.css';

interface Scene3DProps {
  onLocationReached?: (location: HistoricalLocation) => void;
  currentLocation?: HistoricalLocation | null;
}

export const Scene3D = ({ onLocationReached, currentLocation }: Scene3DProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const vietnamMapRef = useRef<VietnamMap3D | null>(null);
  const cameraControllerRef = useRef<CameraController | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#87ceeb');
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      60,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 60, 80);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Setup controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 20;
    controls.maxDistance = 200;
    controls.maxPolarAngle = Math.PI / 2.2;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);

    // Hemisphere light for natural lighting
    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x3a5f3a, 0.5);
    scene.add(hemisphereLight);

    // Point lights for drama
    const pointLight1 = new THREE.PointLight(0xffd700, 0.5, 100);
    pointLight1.position.set(30, 50, 30);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff6b6b, 0.3, 100);
    pointLight2.position.set(-30, 40, -30);
    scene.add(pointLight2);

    // Initialize Vietnam Map
    const vietnamMap = new VietnamMap3D(scene);
    vietnamMapRef.current = vietnamMap;

    // Initialize Camera Controller
    const cameraController = new CameraController(camera);
    cameraControllerRef.current = cameraController;

    // Load scene
    vietnamMap.initialize().then(() => {
      setIsLoading(false);

      // Play intro flight
      cameraController.introFlight();
    });

    // Animation loop
    let lastTime = 0;
    const animate = (time: number) => {
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      controls.update();
      vietnamMap.update(deltaTime);

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate(0);

    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current || !camera || !renderer) return;

      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (controls) {
        controls.dispose();
      }

      if (renderer) {
        renderer.dispose();
      }

      if (canvasRef.current && renderer.domElement) {
        canvasRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Handle location changes
  useEffect(() => {
    if (currentLocation && cameraControllerRef.current) {
      cameraControllerRef.current.flyToLocation(currentLocation, 4).then(() => {
        if (onLocationReached) {
          onLocationReached(currentLocation);
        }
      });
    }
  }, [currentLocation, onLocationReached]);

  return (
    <div className="scene-3d-container">
      <div ref={canvasRef} className="scene-3d-canvas" />

      {isLoading && (
        <div className="scene-3d-loading">
          <div className="loading-spinner" />
          <p>Đang tải bản đồ Việt Nam...</p>
        </div>
      )}
    </div>
  );
};
