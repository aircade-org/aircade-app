import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const modelCache = new Map<string, THREE.Group>();

const ASSET_BASE = '/assets/ultimate-platformer-pack';

// Asset paths - using glTF format which includes all necessary files
const ASSETS = {
  player: `${ASSET_BASE}/Character/glTF/Character.gltf`,
  enemies: {
    enemy: `${ASSET_BASE}/Enemies/glTF/Enemy.gltf`,
    bee: `${ASSET_BASE}/Enemies/glTF/Bee.gltf`,
    crab: `${ASSET_BASE}/Enemies/glTF/Crab.gltf`,
    skull: `${ASSET_BASE}/Enemies/glTF/Skull.gltf`,
  },
  coin: `${ASSET_BASE}/Powerups and Pickups/glTF/Coin.gltf`,
  gem: `${ASSET_BASE}/Powerups and Pickups/glTF/Gem_Blue.gltf`,
  star: `${ASSET_BASE}/Powerups and Pickups/glTF/Star.gltf`,
  flag: `${ASSET_BASE}/Level and Mechanics/glTF/Goal_Flag.gltf`,
  platforms: {
    grass: `${ASSET_BASE}/Modular Platforms/Single Height/glTF/Cube_Grass_Center.gltf`,
    dirt: `${ASSET_BASE}/Modular Platforms/Single Height/glTF/Cube_Dirt_Center.gltf`,
    brick: `${ASSET_BASE}/Cubes/glTF/Cube_Bricks.gltf`,
  },
};

/**
 * Load a 3D model from GLTF file
 */
export async function loadModel(path: string): Promise<THREE.Group | null> {
  // Return cached model if available
  if (modelCache.has(path)) {
    const cached = modelCache.get(path)!;
    return cached.clone();
  }

  return new Promise((resolve) => {
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene as THREE.Group;
        // Cache the model for reuse
        modelCache.set(path, model);
        // Return a clone
        resolve(model.clone());
      },
      undefined,
      (error) => {
        console.warn('Failed to load model:', path, error);
        resolve(null); // Return null on error, will use fallback
      }
    );
  });
}

export async function loadPlayerModel(): Promise<THREE.Group | null> {
  return loadModel(ASSETS.player);
}

export async function loadEnemyModel(type: string = 'enemy'): Promise<THREE.Group | null> {
  const path = ASSETS.enemies[type as keyof typeof ASSETS.enemies] || ASSETS.enemies.enemy;
  return loadModel(path);
}

export async function loadCoinModel(): Promise<THREE.Group | null> {
  return loadModel(ASSETS.coin);
}

export async function loadFlagModel(): Promise<THREE.Group | null> {
  return loadModel(ASSETS.flag);
}

export async function loadPlatformModel(type: string = 'grass'): Promise<THREE.Group | null> {
  const path = ASSETS.platforms[type as keyof typeof ASSETS.platforms] || ASSETS.platforms.grass;
  return loadModel(path);
}



