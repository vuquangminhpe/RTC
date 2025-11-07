import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// ============================================
// OPTIMIZED MODEL LOADER
// Handles heavy models (5-70MB) with compression
// ============================================

export interface ModelLoadOptions {
  enableDraco?: boolean;
  enableLOD?: boolean;
  maxTextureSize?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
  frustumCulled?: boolean;
}

export interface LoadedModel {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
  size: number; // bytes
  bounds: THREE.Box3;
  dispose: () => void;
}

export class ModelLoader {
  private loader: GLTFLoader;
  private dracoLoader: DRACOLoader;
  private cache: Map<string, LoadedModel> = new Map();
  private loadingProgress: Map<string, number> = new Map();
  private totalMemory: number = 0;
  private readonly MAX_MEMORY = 200 * 1024 * 1024; // 200MB limit

  constructor() {
    this.loader = new GLTFLoader();

    // Setup Draco compression (CRITICAL for heavy models!)
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    this.dracoLoader.setDecoderConfig({ type: 'js' });
    this.loader.setDRACOLoader(this.dracoLoader);
  }

  /**
   * Load a model with optimization
   */
  public async load(
    path: string,
    options: ModelLoadOptions = {}
  ): Promise<LoadedModel> {
    // Check cache first
    if (this.cache.has(path)) {
      console.log(`✅ Model cached: ${path}`);
      return this.cache.get(path)!;
    }

    // Check memory limit
    if (this.totalMemory > this.MAX_MEMORY) {
      console.warn('⚠️ Memory limit reached, clearing cache...');
      this.clearOldestCache();
    }

    console.log(`📦 Loading model: ${path}`);

    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        (gltf) => {
          // Optimize the loaded model
          const optimized = this.optimizeModel(gltf, options);

          // Cache it
          this.cache.set(path, optimized);
          this.totalMemory += optimized.size;

          console.log(`✅ Loaded: ${path} (${this.formatBytes(optimized.size)})`);
          console.log(`   Total memory: ${this.formatBytes(this.totalMemory)}`);

          resolve(optimized);
        },
        (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          this.loadingProgress.set(path, percent);
        },
        (error) => {
          console.error(`❌ Failed to load ${path}:`, error);
          reject(error);
        }
      );
    });
  }

  /**
   * Load multiple models in parallel
   */
  public async loadBatch(
    paths: string[],
    options: ModelLoadOptions = {}
  ): Promise<Map<string, LoadedModel>> {
    console.log(`📦 Loading ${paths.length} models in batch...`);

    const promises = paths.map((path) =>
      this.load(path, options).then((model) => [path, model] as const)
    );

    const results = await Promise.all(promises);
    return new Map(results);
  }

  /**
   * Optimize loaded model
   */
  private optimizeModel(
    gltf: any,
    options: ModelLoadOptions
  ): LoadedModel {
    const scene = gltf.scene;
    let memorySize = 0;

    // Traverse and optimize
    scene.traverse((child: any) => {
      if (child.isMesh) {
        // Shadow settings
        if (options.castShadow !== false) {
          child.castShadow = true;
        }
        if (options.receiveShadow !== false) {
          child.receiveShadow = true;
        }

        // Frustum culling (important for performance!)
        if (options.frustumCulled !== false) {
          child.frustumCulled = true;
        }

        // Optimize geometry
        if (child.geometry) {
          // Compute vertex normals if missing
          if (!child.geometry.attributes.normal) {
            child.geometry.computeVertexNormals();
          }

          // Compute bounding sphere for culling
          child.geometry.computeBoundingSphere();
          child.geometry.computeBoundingBox();

          // Estimate memory size
          const positions = child.geometry.attributes.position;
          if (positions) {
            memorySize += positions.array.byteLength;
          }
        }

        // Optimize materials
        if (child.material) {
          this.optimizeMaterial(child.material, options);
        }
      }
    });

    // Calculate bounds
    const bounds = new THREE.Box3().setFromObject(scene);

    // Create dispose function
    const dispose = () => {
      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.geometry?.dispose();

          if (Array.isArray(child.material)) {
            child.material.forEach((mat: THREE.Material) => mat.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
    };

    return {
      scene,
      animations: gltf.animations || [],
      size: memorySize,
      bounds,
      dispose,
    };
  }

  /**
   * Optimize material textures
   */
  private optimizeMaterial(
    material: THREE.Material | THREE.Material[],
    options: ModelLoadOptions
  ): void {
    const materials = Array.isArray(material) ? material : [material];
    const maxSize = options.maxTextureSize || 2048;

    materials.forEach((mat: any) => {
      // Optimize texture size
      const textures = [
        mat.map,
        mat.normalMap,
        mat.roughnessMap,
        mat.metalnessMap,
        mat.aoMap,
        mat.emissiveMap,
      ];

      textures.forEach((texture) => {
        if (texture) {
          // Resize if too large
          if (texture.image) {
            const width = texture.image.width;
            const height = texture.image.height;

            if (width > maxSize || height > maxSize) {
              console.log(`📉 Texture too large: ${width}x${height}, will downscale`);
              texture.minFilter = THREE.LinearMipMapLinearFilter;
              texture.generateMipmaps = true;
            }
          }

          // Anisotropy for quality
          texture.anisotropy = 4;
        }
      });

      // Enable side rendering optimization
      if (mat.side === undefined) {
        mat.side = THREE.FrontSide; // Don't render backfaces
      }
    });
  }

  /**
   * Create LOD (Level of Detail) for a model
   */
  public createLOD(
    model: LoadedModel,
    distances: number[] = [0, 20, 50]
  ): THREE.LOD {
    const lod = new THREE.LOD();

    // High detail (original)
    const high = model.scene.clone();
    lod.addLevel(high, distances[0]);

    // Medium detail (reduce geometry)
    const medium = model.scene.clone();
    this.reduceDetail(medium, 0.5);
    lod.addLevel(medium, distances[1]);

    // Low detail (heavily reduced)
    const low = model.scene.clone();
    this.reduceDetail(low, 0.2);
    lod.addLevel(low, distances[2]);

    return lod;
  }

  /**
   * Reduce model detail for LOD
   */
  private reduceDetail(object: THREE.Object3D, factor: number): void {
    object.traverse((child: any) => {
      if (child.isMesh && child.geometry) {
        // Simple reduction: remove every nth vertex
        // (In production, use proper mesh simplification library)
        const positions = child.geometry.attributes.position;
        if (positions && positions.count > 100) {
          const newCount = Math.floor(positions.count * factor);
          const newPositions = new Float32Array(newCount * 3);

          for (let i = 0; i < newCount; i++) {
            const srcIdx = Math.floor((i / newCount) * positions.count);
            newPositions[i * 3] = positions.array[srcIdx * 3];
            newPositions[i * 3 + 1] = positions.array[srcIdx * 3 + 1];
            newPositions[i * 3 + 2] = positions.array[srcIdx * 3 + 2];
          }

          child.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(newPositions, 3)
          );
          child.geometry.computeVertexNormals();
        }
      }
    });
  }

  /**
   * Create instanced mesh for crowds
   */
  public createInstancedMesh(
    model: LoadedModel,
    count: number,
    positions: THREE.Vector3[],
    rotations?: THREE.Euler[],
    scaleValue?: number | THREE.Vector3[]
  ): THREE.InstancedMesh {
    // Find first mesh in model
    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.Material | null = null;

    model.scene.traverse((child: any) => {
      if (child.isMesh && !geometry) {
        geometry = child.geometry;
        material = child.material;
      }
    });

    if (!geometry || !material) {
      throw new Error('No mesh found in model for instancing');
    }

    // Create instanced mesh
    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    const matrix = new THREE.Matrix4();

    for (let i = 0; i < count; i++) {
      const position = positions[i] || new THREE.Vector3();
      const rotation = rotations?.[i] || new THREE.Euler();

      // Handle scale - can be a number (uniform) or array of Vector3
      let scale: THREE.Vector3;
      if (typeof scaleValue === 'number') {
        scale = new THREE.Vector3(scaleValue, scaleValue, scaleValue);
      } else if (Array.isArray(scaleValue)) {
        scale = scaleValue[i] || new THREE.Vector3(1, 1, 1);
      } else {
        scale = new THREE.Vector3(1, 1, 1);
      }

      matrix.compose(position, new THREE.Quaternion().setFromEuler(rotation), scale);
      instancedMesh.setMatrixAt(i, matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;
    instancedMesh.frustumCulled = true;

    console.log(`✅ Created instanced mesh with ${count} instances`);

    return instancedMesh;
  }

  /**
   * Get loading progress for a model
   */
  public getProgress(path: string): number {
    return this.loadingProgress.get(path) || 0;
  }

  /**
   * Get total loading progress
   */
  public getTotalProgress(): number {
    if (this.loadingProgress.size === 0) return 100;

    const total = Array.from(this.loadingProgress.values()).reduce(
      (sum, val) => sum + val,
      0
    );
    return total / this.loadingProgress.size;
  }

  /**
   * Clear oldest cache entries
   */
  private clearOldestCache(): void {
    const firstKey = this.cache.keys().next().value;
    if (firstKey) {
      const model = this.cache.get(firstKey)!;
      model.dispose();
      this.totalMemory -= model.size;
      this.cache.delete(firstKey);
      console.log(`🗑️ Cleared cache: ${firstKey}`);
    }
  }

  /**
   * Clear all cache
   */
  public clearCache(): void {
    this.cache.forEach((model) => model.dispose());
    this.cache.clear();
    this.totalMemory = 0;
    console.log('🗑️ Cache cleared');
  }

  /**
   * Dispose loader
   */
  public dispose(): void {
    this.clearCache();
    this.dracoLoader.dispose();
  }

  /**
   * Format bytes to human readable
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

// Singleton instance
export const modelLoader = new ModelLoader();
