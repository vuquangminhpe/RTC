import * as THREE from 'three';
import { modelLoader } from './ModelLoader';
import type { LoadedModel } from './ModelLoader';

// ============================================
// MODEL MANAGER
// Centralized model loading and management
// ============================================

export interface ModelAssets {
  // Characters
  bacHo: LoadedModel;
  soldierClimbing: LoadedModel;
  crowdPerson: LoadedModel;

  // Structures
  bunker: LoadedModel;
  palace: LoadedModel;
  flagPole: LoadedModel;

  // Military
  tank: LoadedModel;
  sandbags: LoadedModel;

  // Environment
  mountains: LoadedModel;
  mountainPack: LoadedModel;
  cloud: LoadedModel;
  tree: LoadedModel;
}

export class ModelManager {
  private models: Partial<ModelAssets> = {};
  private isLoaded = false;
  private loadingCallbacks: Array<(progress: number) => void> = [];

  /**
   * Model paths configuration
   */
  private readonly MODEL_PATHS = {
    bacHo: '/src/model3D/BacHo.glb',
    soldierClimbing: '/src/model3D/soldier-climbing.glb',
    crowdPerson: '/src/model3D/crowd-person.glb',
    bunker: '/src/model3D/de-castries-bunker.glb',
    palace: '/src/model3D/dinhdoclap.glb',
    flagPole: '/src/model3D/vietnam-flag-pole.glb',
    tank: '/src/model3D/Tank.glb',
    sandbags: '/src/model3D/sandbags.glb',
    mountains: '/src/model3D/dien-bien-mountains.glb',
    mountainPack: '/src/model3D/vietnam-mountain-pack.glb',
    cloud: '/src/model3D/cloud.glb',
    tree: '/src/model3D/caytre.glb',
  };

  /**
   * Load all models
   */
  public async loadAll(
    onProgress?: (progress: number, current: string) => void
  ): Promise<ModelAssets> {
    console.log('🚀 Starting to load all models...');

    const entries = Object.entries(this.MODEL_PATHS);
    let loaded = 0;

    for (const [key, path] of entries) {
      try {
        console.log(`📦 Loading: ${key} (${loaded + 1}/${entries.length})`);

        const model = await modelLoader.load(path, {
          enableDraco: true,
          enableLOD: true,
          maxTextureSize: 2048,
          castShadow: true,
          receiveShadow: true,
          frustumCulled: true,
        });

        this.models[key as keyof ModelAssets] = model;
        loaded++;

        const progress = (loaded / entries.length) * 100;
        if (onProgress) {
          onProgress(progress, key);
        }

        this.notifyProgress(progress);
      } catch (error) {
        console.error(`❌ Failed to load ${key}:`, error);
        // Continue loading other models even if one fails
      }
    }

    this.isLoaded = true;
    console.log('✅ All models loaded!');

    return this.models as ModelAssets;
  }

  /**
   * Get specific model
   */
  public get<K extends keyof ModelAssets>(key: K): LoadedModel | undefined {
    return this.models[key];
  }

  /**
   * Get all loaded models
   */
  public getAll(): Partial<ModelAssets> {
    return this.models;
  }

  /**
   * Check if all models are loaded
   */
  public isReady(): boolean {
    return this.isLoaded;
  }

  /**
   * Subscribe to loading progress
   */
  public onProgress(callback: (progress: number) => void): void {
    this.loadingCallbacks.push(callback);
  }

  /**
   * Notify progress to all subscribers
   */
  private notifyProgress(progress: number): void {
    this.loadingCallbacks.forEach((callback) => callback(progress));
  }

  /**
   * Create scene-specific models
   */

  // ============================================
  // SCENE 1: ĐIỆN BIÊN PHỦ
  // ============================================
  public createDienBienPhuScene(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'DienBienPhu';

    // Add bunker
    if (this.models.bunker) {
      const bunker = this.models.bunker.scene.clone();
      bunker.position.set(0, 0, 0);
      bunker.scale.setScalar(1);
      group.add(bunker);
    }

    // Add mountains (background)
    if (this.models.mountains) {
      const mountains = this.models.mountains.scene.clone();
      mountains.position.set(0, -5, -30);
      mountains.scale.setScalar(2);
      group.add(mountains);
    }

    // Add sandbags (multiple)
    if (this.models.sandbags) {
      const positions = [
        { x: -3, z: 2 },
        { x: 3, z: 2 },
        { x: -4, z: -1 },
        { x: 4, z: -1 },
      ];

      positions.forEach((pos) => {
        const sandbag = this.models.sandbags!.scene.clone();
        sandbag.position.set(pos.x, 0, pos.z);
        sandbag.rotation.y = Math.random() * Math.PI;
        group.add(sandbag);
      });
    }

    // Add soldier (hero)
    if (this.models.soldierClimbing) {
      const soldier = this.models.soldierClimbing.scene.clone();
      soldier.position.set(-1, 2, 1);
      soldier.scale.setScalar(1);
      soldier.name = 'hero-soldier';
      group.add(soldier);
    }

    // Add flag pole
    if (this.models.flagPole) {
      const flag = this.models.flagPole.scene.clone();
      flag.position.set(0, 5, 0);
      flag.scale.setScalar(0.5);
      flag.name = 'victory-flag';
      group.add(flag);
    }

    // Add trees
    if (this.models.tree) {
      const treePositions = [
        { x: -8, z: 5 },
        { x: 8, z: 5 },
        { x: -10, z: -5 },
      ];

      treePositions.forEach((pos) => {
        const tree = this.models.tree!.scene.clone();
        tree.position.set(pos.x, 0, pos.z);
        tree.scale.setScalar(1 + Math.random() * 0.3);
        group.add(tree);
      });
    }

    console.log('✅ Điện Biên Phủ scene created');
    return group;
  }

  // ============================================
  // SCENE 2: BA ĐÌNH
  // ============================================
  public createBaDinhScene(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'BaDinh';

    // Add Bác Hồ (center stage)
    if (this.models.bacHo) {
      const bacHo = this.models.bacHo.scene.clone();
      bacHo.position.set(0, 1, 0);
      bacHo.scale.setScalar(1);
      bacHo.name = 'bac-ho';
      group.add(bacHo);
    }

    // Add crowd using instancing (75 people!)
    if (this.models.crowdPerson) {
      const positions: THREE.Vector3[] = [];
      const rotations: THREE.Euler[] = [];

      // Generate crowd positions (grid with randomness)
      const rows = 5;
      const cols = 15;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = (col - cols / 2) * 1.5 + (Math.random() - 0.5) * 0.5;
          const z = 5 + row * 1.2 + (Math.random() - 0.5) * 0.3;
          const y = 0;

          positions.push(new THREE.Vector3(x, y, z));
          rotations.push(new THREE.Euler(0, Math.random() * 0.4 - 0.2, 0));
        }
      }

      const crowdMesh = modelLoader.createInstancedMesh(
        this.models.crowdPerson,
        positions.length,
        positions,
        rotations
      );

      crowdMesh.name = 'crowd';
      group.add(crowdMesh);
    }

    // Add flag poles (4 corners)
    if (this.models.flagPole) {
      const flagPositions = [
        { x: -10, z: -2 },
        { x: 10, z: -2 },
        { x: -12, z: 8 },
        { x: 12, z: 8 },
      ];

      flagPositions.forEach((pos, i) => {
        const flag = this.models.flagPole!.scene.clone();
        flag.position.set(pos.x, 0, pos.z);
        flag.scale.setScalar(0.8);
        flag.name = `flag-${i}`;
        group.add(flag);
      });
    }

    // Add clouds
    if (this.models.cloud) {
      const cloudPositions = [
        { x: -15, y: 15, z: -10 },
        { x: 10, y: 12, z: -8 },
        { x: 0, y: 18, z: -12 },
      ];

      cloudPositions.forEach((pos) => {
        const cloud = this.models.cloud!.scene.clone();
        cloud.position.set(pos.x, pos.y, pos.z);
        cloud.scale.setScalar(2 + Math.random());
        group.add(cloud);
      });
    }

    console.log('✅ Ba Đình scene created');
    return group;
  }

  // ============================================
  // SCENE 3: SÀI GÒN 1975
  // ============================================
  public createSaigon1975Scene(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Saigon1975';

    // Add Independence Palace (background)
    if (this.models.palace) {
      const palace = this.models.palace.scene.clone();
      palace.position.set(0, 0, -15);
      palace.scale.setScalar(1.5);
      palace.name = 'palace';
      group.add(palace);
    }

    // Add Tank 390 (HERO!)
    if (this.models.tank) {
      const tank = this.models.tank.scene.clone();
      tank.position.set(-10, 0, 5);
      tank.rotation.y = Math.PI / 6; // Angle towards palace
      tank.scale.setScalar(1);
      tank.name = 'tank-390';
      group.add(tank);

      // Add flag on tank
      if (this.models.flagPole) {
        const flag = this.models.flagPole.scene.clone();
        flag.position.set(-10, 2, 5);
        flag.scale.setScalar(0.3);
        flag.name = 'tank-flag';
        group.add(flag);
      }
    }

    // Add soldiers following tank (instanced)
    if (this.models.soldierClimbing) {
      const positions: THREE.Vector3[] = [];
      const rotations: THREE.Euler[] = [];

      for (let i = 0; i < 8; i++) {
        const x = -12 - i * 1.5 + (Math.random() - 0.5);
        const z = 5 + (Math.random() - 0.5) * 3;
        positions.push(new THREE.Vector3(x, 0, z));
        rotations.push(new THREE.Euler(0, Math.PI / 6, 0));
      }

      const soldiersMesh = modelLoader.createInstancedMesh(
        this.models.soldierClimbing,
        positions.length,
        positions,
        rotations
      );

      soldiersMesh.name = 'soldiers-following';
      group.add(soldiersMesh);
    }

    // Add trees/vegetation
    if (this.models.tree) {
      const treePositions = [
        { x: -15, z: -5 },
        { x: 15, z: -5 },
        { x: -12, z: 10 },
        { x: 12, z: 10 },
      ];

      treePositions.forEach((pos) => {
        const tree = this.models.tree!.scene.clone();
        tree.position.set(pos.x, 0, pos.z);
        tree.scale.setScalar(1.2);
        group.add(tree);
      });
    }

    console.log('✅ Sài Gòn 1975 scene created');
    return group;
  }

  /**
   * Dispose all models
   */
  public dispose(): void {
    Object.values(this.models).forEach((model) => {
      if (model) {
        model.dispose();
      }
    });

    this.models = {};
    this.isLoaded = false;
    console.log('🗑️ All models disposed');
  }
}

// Singleton instance
export const modelManager = new ModelManager();
