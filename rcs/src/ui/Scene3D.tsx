import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VietnamMap3D } from '../core/VietnamMap3D';
import { CameraController } from '../core/CameraController';
import { LoadingScreen } from './LoadingScreen';
import './Scene3D.css';

export const Scene3D = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const vietnamMapRef = useRef<VietnamMap3D | null>(null);
  const cameraControllerRef = useRef<CameraController | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentModel, setCurrentModel] = useState<string>('');
  const animationFrameRef = useRef<number>(0);

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

    // Load scene with progress
    vietnamMap
      .initialize((progress, current) => {
        setLoadingProgress(progress);
        setCurrentModel(current);
        console.log(`Loading: ${current} - ${progress.toFixed(0)}%`);
      })
      .then(() => {
        // Small delay to show 100%
        setTimeout(() => {
          setIsLoading(false);

          // Skip intro flight for now - just show the scene
          console.log('✅ Scene ready! Camera at:', camera.position);
          console.log('📍 Click on glowing pillars (markers) to fly to locations');
          console.log('🎮 Drag to rotate, scroll to zoom');

          // Reset camera to good viewing position
          camera.position.set(0, 80, 120);
          camera.lookAt(0, 0, 0);
          controls.update();

          // Add 3D instruction sprite
          const instructionCanvas = document.createElement('canvas');
          instructionCanvas.width = 1024;
          instructionCanvas.height = 512;
          const ctx = instructionCanvas.getContext('2d')!;

          // Background
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(20, 20, 984, 472);

          // Border
          ctx.strokeStyle = '#4ecdc4';
          ctx.lineWidth = 4;
          ctx.strokeRect(20, 20, 984, 472);

          // Title
          ctx.fillStyle = '#ff6b6b';
          ctx.font = 'bold 60px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('🎮 HƯỚNG DẪN TƯƠNG TÁC', 512, 100);

          // Instructions
          ctx.fillStyle = '#ffffff';
          ctx.font = '40px Arial';
          ctx.textAlign = 'left';
          ctx.fillText('🖱️  Kéo chuột để xoay camera', 80, 180);
          ctx.fillText('🔍 Scroll để zoom in/out', 80, 240);
          ctx.fillText('📍 Click vào CỘT SÁNG để bay đến địa điểm', 80, 300);
          ctx.fillText('✨ 5 địa điểm lịch sử đang chờ bạn!', 80, 360);

          ctx.fillStyle = '#4ecdc4';
          ctx.font = 'italic 32px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('(Tìm các cột sáng phát quang trên bản đồ)', 512, 440);

          const instructionTexture = new THREE.CanvasTexture(instructionCanvas);
          const instructionMaterial = new THREE.SpriteMaterial({
            map: instructionTexture,
            transparent: true,
          });
          const instructionSprite = new THREE.Sprite(instructionMaterial);
          instructionSprite.position.set(0, 50, -50); // In front of camera
          instructionSprite.scale.set(60, 30, 1);
          scene.add(instructionSprite);

          // Auto-hide after 8 seconds
          setTimeout(() => {
            scene.remove(instructionSprite);
            instructionTexture.dispose();
            instructionMaterial.dispose();
          }, 8000);
        }, 500);
      })
      .catch((error) => {
        console.error('Failed to initialize map:', error);
        setIsLoading(false);
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

    // Raycasting for click detection on 3D objects
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      if (!canvasRef.current || !camera || !scene) return;

      // Calculate mouse position in normalized device coordinates (-1 to +1)
      const rect = canvasRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      console.log('🖱️ Click at:', { x: mouse.x.toFixed(2), y: mouse.y.toFixed(2) });

      // Update raycaster
      raycaster.setFromCamera(mouse, camera);

      // Check for intersections with markers
      const markers = vietnamMap.getMarkers();
      if (!markers) {
        console.log('❌ No markers found');
        return;
      }

      const intersects = raycaster.intersectObjects(markers.children, true);
      console.log(`🎯 Found ${intersects.length} intersections`);

      if (intersects.length > 0) {
        // Find the marker group (parent of intersected object)
        let markerGroup = intersects[0].object;
        while (markerGroup.parent && markerGroup.parent !== markers) {
          markerGroup = markerGroup.parent;
        }

        // Get location from userData
        const location = markerGroup.userData.location;
        if (location) {
          console.log('✅ Clicked location:', location.name, location.year);

          // Hide all scenes first
          vietnamMap.hideAllScenes();

          // Fly to location
          cameraController.flyToLocation(location, 4).then(() => {
            // Show the 3D scene for this location
            vietnamMap.showScene(location.id);
            console.log('🎬 Showing scene:', location.name);
          });
        } else {
          console.log('⚠️ No location data in marker');
        }
      } else {
        console.log('💨 Clicked empty space');
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

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
      renderer.domElement.removeEventListener('click', handleClick);

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

  return (
    <div className="scene-3d-container">
      <div ref={canvasRef} className="scene-3d-canvas" />

      {isLoading && (
        <LoadingScreen progress={loadingProgress} currentModel={currentModel} />
      )}
    </div>
  );
};
