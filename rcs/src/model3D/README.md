# 3D Models Directory

This directory should contain all the 3D models (.glb files) for the Vietnam History Timeline application.

## Required Models (12 total)

Place the following .glb files in this directory:

### Characters
- `BacHo.glb` - Ho Chi Minh character model
- `soldier-climbing.glb` - Soldier climbing/attacking
- `crowd-person.glb` - Person for crowd (will be instanced)

### Structures
- `de-castries-bunker.glb` - Dien Bien Phu bunker
- `dinhdoclap.glb` - Independence Palace (Saigon)
- `vietnam-flag-pole.glb` - Vietnamese flag on pole

### Military
- `Tank.glb` - Tank 390 (Saigon liberation)
- `sandbags.glb` - Military sandbags

### Environment
- `dien-bien-mountains.glb` - Mountain range for Dien Bien Phu
- `vietnam-mountain-pack.glb` - General mountain pack
- `cloud.glb` - Cloud models
- `caytre.glb` - Tree models

## Model Requirements

- **Format**: GLB (GLTF Binary)
- **Size**: Optimized (Draco compression supported)
- **Textures**: Embedded in GLB
- **Scale**: Real-world scale preferred (will be scaled in code)
- **Shadows**: Models should support shadow casting/receiving

## Performance Notes

The application implements:
- **Draco compression** for efficient loading
- **LOD (Level of Detail)** system
- **Instanced rendering** for crowds
- **Memory management** with 200MB cache limit
- **Frustum culling** for off-screen objects

Target: **60 FPS** with all models loaded

## Usage

Once models are placed here, run:
```bash
npm run dev
```

The application will:
1. Show animated loading screen with progress
2. Load all models with Draco compression
3. Create 3 historical scenes:
   - Dien Bien Phu (1954)
   - Ba Dinh Square (1945)
   - Saigon Liberation (1975)
4. Enable camera flying tour between locations

## Testing

After adding models:
1. Check browser console for loading progress
2. Verify all 12 models load successfully
3. Test camera flying between locations
4. Monitor FPS (press F12 → Performance tab)
5. Check memory usage (should stay under 200MB for models)
