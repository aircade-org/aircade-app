import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const modelCache = new Map<string, THREE.Group>();

const ASSET_BASE = '/assets/ultimate-platformer-pack';

// Asset paths
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
  decorations: {
    tree: `${ASSET_BASE}/Nature/glTF/Tree.gltf`,
    bush: `${ASSET_BASE}/Nature/glTF/Bush.gltf`,
    cloud1: `${ASSET_BASE}/Nature/glTF/Cloud_1.gltf`,
    cloud2: `${ASSET_BASE}/Nature/glTF/Cloud_2.gltf`,
    rock: `${ASSET_BASE}/Nature/glTF/Rock_1.gltf`,
  },
};

/**
 * Load a 3D model from GLTF file
 */
export async function loadModel(path: string): Promise<THREE.Group> {
  // Return cached model if available
  if (modelCache.has(path)) {
    const cached = modelCache.get(path)!;
    return cached.clone();
  }

  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        // Cache the model for reuse
        modelCache.set(path, model);
        // Return a clone
        resolve(model.clone());
      },
      undefined,
      (error) => {
        console.error('Error loading model:', path, error);
        reject(error);
      }
    );
  });
}

/**
 * Get asset path by key
 */
export function getAssetPath(key: string): string {
  const keys = key.split('.');
  let current: any = ASSETS;
  for (const k of keys) {
    current = current[k];
  }
  return current;
}

/**
 * Load player model
 */
export async function loadPlayerModel(): Promise<THREE.Group> {
  return loadModel(ASSETS.player);
}

/**
 * Load enemy model
 */
export async function loadEnemyModel(type: string = 'enemy'): Promise<THREE.Group> {
  const path = ASSETS.enemies[type as keyof typeof ASSETS.enemies] || ASSETS.enemies.enemy;
  return loadModel(path);
}

/**
 * Load coin model
 */
export async function loadCoinModel(): Promise<THREE.Group> {
  return loadModel(ASSETS.coin);
}

/**
 * Load flag model
 */
export async function loadFlagModel(): Promise<THREE.Group> {
  return loadModel(ASSETS.flag);
}

/**
 * Load platform model
 */
export async function loadPlatformModel(type: string = 'grass'): Promise<THREE.Group> {
  const path = ASSETS.platforms[type as keyof typeof ASSETS.platforms] || ASSETS.platforms.grass;
  return loadModel(path);
}

/**
 * Load decoration model
 */
export async function loadDecorationModel(type: string): Promise<THREE.Group> {
  const path = ASSETS.decorations[type as keyof typeof ASSETS.decorations];
  if (!path) throw new Error(`Unknown decoration type: ${type}`);
  return loadModel(path);
}

