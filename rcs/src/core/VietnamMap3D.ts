import * as THREE from 'three';
import { historicalLocations, VIETNAM_BOUNDS, MAP_CONFIG } from '../data/locations';
import { geoTo3D } from '../utils/geoUtils';
import { modelManager } from './ModelManager';

// ============================================
// VIETNAM 3D MAP
// Core 3D terrain and geography with REAL MODELS
// ============================================

export class VietnamMap3D {
  private scene: THREE.Scene;
  private terrain: THREE.Mesh | null = null;
  private markers: THREE.Group;
  private water: THREE.Mesh | null = null;
  private historicalScenes: Map<string, THREE.Group> = new Map();
  private currentScene: THREE.Group | null = null;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.markers = new THREE.Group();
    this.scene.add(this.markers);
  }

  /**
   * Initialize the Vietnam map (now with models!)
   */
  public async initialize(onProgress?: (progress: number, current: string) => void): Promise<void> {
    // Load all models first
    await modelManager.loadAll(onProgress);

    // Create terrain
    this.createTerrain();

    // Create water (sea around Vietnam)
    this.createWater();

    // Create location markers
    this.createLocationMarkers();

    // Add atmospheric effects
    this.addAtmosphere();

    // Pre-create all scenes (hidden)
    this.createHistoricalScenes();
  }

  /**
   * Create 3D terrain for Vietnam
   */
  private createTerrain(): void {
    const { scale, elevationScale, terrainSegments } = MAP_CONFIG;

    // Calculate dimensions
    const latRange = VIETNAM_BOUNDS.north - VIETNAM_BOUNDS.south;
    const lngRange = VIETNAM_BOUNDS.east - VIETNAM_BOUNDS.west;
    const width = lngRange * scale;
    const height = latRange * scale;

    // Create geometry with elevation
    const geometry = new THREE.PlaneGeometry(
      width,
      height,
      terrainSegments,
      terrainSegments
    );

    // Apply elevation (simplified - in real app, use heightmap)
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 1];

      // Simplified elevation (mountains in north/center, lowlands in south)
      const normalizedX = x / width;
      const normalizedZ = z / height;

      // Create mountain ranges
      let elevation = 0;

      // Northern mountains (near China border)
      if (normalizedZ > 0.3) {
        elevation += Math.sin(normalizedX * 10) * Math.cos(normalizedZ * 8) * 3;
      }

      // Central Highlands
      if (normalizedZ > -0.1 && normalizedZ < 0.2) {
        elevation += Math.sin(normalizedX * 15 + normalizedZ * 10) * 2.5;
      }

      // Truong Son range (Annamite Mountains)
      if (normalizedX < -0.1) {
        elevation += Math.cos(normalizedZ * 12) * 2;
      }

      // Add some noise for natural look
      elevation += (Math.random() - 0.5) * 0.5;

      vertices[i + 2] = elevation * elevationScale;
    }

    geometry.computeVertexNormals();

    // Create material with texture
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#3a5f3a'), // Green for land
      roughness: 0.8,
      metalness: 0.2,
      flatShading: false,
    });

    // Apply gradient (greener in south, more brown in mountains)
    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        varying vec3 vPosition;
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        vPosition = position;
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
        #include <common>
        varying vec3 vPosition;
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `
        #include <color_fragment>

        // Elevation-based coloring
        float normalizedHeight = vPosition.z / 5.0;
        vec3 lowlandColor = vec3(0.2, 0.6, 0.2);  // Green
        vec3 highlandColor = vec3(0.4, 0.3, 0.2); // Brown
        vec3 mountainColor = vec3(0.5, 0.5, 0.5); // Gray

        vec3 terrainColor = mix(lowlandColor, highlandColor, smoothstep(0.0, 1.0, normalizedHeight));
        terrainColor = mix(terrainColor, mountainColor, smoothstep(1.0, 2.5, normalizedHeight));

        diffuseColor.rgb *= terrainColor;
        `
      );
    };

    this.terrain = new THREE.Mesh(geometry, material);
    this.terrain.rotation.x = -Math.PI / 2;
    this.terrain.receiveShadow = true;
    this.terrain.castShadow = true;

    this.scene.add(this.terrain);
  }

  /**
   * Create water around Vietnam (sea)
   */
  private createWater(): void {
    const { scale } = MAP_CONFIG;
    const latRange = VIETNAM_BOUNDS.north - VIETNAM_BOUNDS.south;
    const lngRange = VIETNAM_BOUNDS.east - VIETNAM_BOUNDS.west;
    const width = lngRange * scale * 1.5;
    const height = latRange * scale * 1.5;

    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1e40af'),
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.9,
    });

    this.water = new THREE.Mesh(geometry, material);
    this.water.rotation.x = -Math.PI / 2;
    this.water.position.y = -0.5;
    this.water.receiveShadow = true;

    this.scene.add(this.water);

    // Animate water (subtle wave)
    const animateWater = () => {
      if (this.water) {
        this.water.position.y = -0.5 + Math.sin(Date.now() * 0.001) * 0.1;
      }
      requestAnimationFrame(animateWater);
    };
    animateWater();
  }

  /**
   * Create 3D markers for historical locations
   */
  private createLocationMarkers(): void {
    historicalLocations.forEach((location) => {
      const pos3D = geoTo3D(location.coordinates);

      // Create marker
      const markerGroup = new THREE.Group();
      markerGroup.position.set(pos3D.x, pos3D.y + 2, pos3D.z);

      // Marker geometry (pillar of light)
      const pillarGeometry = new THREE.CylinderGeometry(0.5, 0.5, 15, 16);
      const pillarMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(location.color),
        transparent: true,
        opacity: 0.6,
      });

      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      pillar.position.y = 7.5;
      markerGroup.add(pillar);

      // Marker top (pulsing sphere)
      const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(location.color),
        emissive: new THREE.Color(location.color),
        emissiveIntensity: 0.8,
        roughness: 0.3,
        metalness: 0.7,
      });

      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.y = 15;
      markerGroup.add(sphere);

      // Glow effect
      const glowGeometry = new THREE.SphereGeometry(1.5, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(location.color),
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide,
      });

      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.y = 15;
      markerGroup.add(glow);

      // Add year label (using Sprite)
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 60px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(location.year.toString(), 128, 70);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });

      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.y = 18;
      sprite.scale.set(4, 2, 1);
      markerGroup.add(sprite);

      // Add to markers group
      markerGroup.userData = { location };
      this.markers.add(markerGroup);

      // Animate marker (pulsing)
      const animateMarker = () => {
        const time = Date.now() * 0.001;
        sphere.scale.setScalar(1 + Math.sin(time * 2) * 0.2);
        glow.scale.setScalar(1 + Math.sin(time * 2 + Math.PI) * 0.2);
        glow.material.opacity = 0.2 + Math.sin(time * 2) * 0.1;

        requestAnimationFrame(animateMarker);
      };
      animateMarker();
    });
  }

  /**
   * Add atmospheric effects
   */
  private addAtmosphere(): void {
    // Fog for depth
    this.scene.fog = new THREE.Fog(0x87ceeb, 50, 200);

    // Ambient particles (floating dust/atmosphere)
    const particleCount = 500;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200;
      positions[i + 1] = Math.random() * 100;
      positions[i + 2] = (Math.random() - 0.5) * 200;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.3,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(particles);

    // Animate particles
    const animateParticles = () => {
      particles.rotation.y += 0.0001;
      const positions = particlesGeometry.attributes.position.array as Float32Array;

      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.02;
        if (positions[i] < 0) {
          positions[i] = 100;
        }
      }

      particlesGeometry.attributes.position.needsUpdate = true;
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  /**
   * Get terrain height at position
   */
  public getTerrainHeightAt(x: number, z: number): number {
    if (!this.terrain) return 0;

    // Raycast down to find terrain height
    const raycaster = new THREE.Raycaster();
    raycaster.set(new THREE.Vector3(x, 100, z), new THREE.Vector3(0, -1, 0));

    const intersects = raycaster.intersectObject(this.terrain);
    if (intersects.length > 0) {
      return intersects[0].point.y;
    }

    return 0;
  }

  /**
   * Create all historical 3D scenes
   */
  private createHistoricalScenes(): void {
    // Scene 1: Điện Biên Phủ
    const dbpScene = modelManager.createDienBienPhuScene();
    const dbpPos = geoTo3D(historicalLocations[0].coordinates);
    dbpScene.position.set(dbpPos.x, dbpPos.y, dbpPos.z);
    dbpScene.visible = false;
    this.historicalScenes.set('dien-bien-phu', dbpScene);
    this.scene.add(dbpScene);

    // Scene 2: Ba Đình
    const bdScene = modelManager.createBaDinhScene();
    const bdPos = geoTo3D(historicalLocations[1].coordinates);
    bdScene.position.set(bdPos.x, bdPos.y, bdPos.z);
    bdScene.visible = false;
    this.historicalScenes.set('ba-dinh', bdScene);
    this.scene.add(bdScene);

    // Scene 3: Sài Gòn 1975
    const sgScene = modelManager.createSaigon1975Scene();
    const sgPos = geoTo3D(historicalLocations[2].coordinates);
    sgScene.position.set(sgPos.x, sgPos.y, sgPos.z);
    sgScene.visible = false;
    this.historicalScenes.set('saigon-1975', sgScene);
    this.scene.add(sgScene);

    console.log('✅ All historical 3D scenes created');
  }

  /**
   * Show specific historical scene
   */
  public showScene(locationId: string): void {
    // Hide current scene
    if (this.currentScene) {
      this.currentScene.visible = false;
    }

    // Show new scene
    const scene = this.historicalScenes.get(locationId);
    if (scene) {
      scene.visible = true;
      this.currentScene = scene;
      console.log(`👁️ Showing scene: ${locationId}`);
    }
  }

  /**
   * Hide all scenes
   */
  public hideAllScenes(): void {
    this.historicalScenes.forEach((scene) => {
      scene.visible = false;
    });
    this.currentScene = null;
  }

  /**
   * Get scene for location
   */
  public getScene(locationId: string): THREE.Group | undefined {
    return this.historicalScenes.get(locationId);
  }

  /**
   * Get markers group for raycasting
   */
  public getMarkers(): THREE.Group {
    return this.markers;
  }

  /**
   * Update method (called each frame)
   */
  public update(_deltaTime: number): void {
    // Any per-frame updates
  }
}
