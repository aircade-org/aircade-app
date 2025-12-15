import { GameManager } from "@repo/game-engine";
import { InputSystem, PhysicsSystem, RenderSystem } from "@repo/game-engine";
import {
  createMarioPlayer,
  createPlatform,
  createCoin,
  createEnemy,
  createFlag,
} from "./entities";
import {
  MarioInputSystem,
  EnemyAISystem,
  CollisionSystem,
  RespawnSystem,
} from "./systems";

/**
 * Initialize a Mario level
 */
export function initializeMarioLevel(gameManager: GameManager): void {
  // Register core systems
  gameManager.registerSystem(new InputSystem());
  gameManager.registerSystem(new PhysicsSystem(gameManager));
  gameManager.registerSystem(new RenderSystem(gameManager));

  // Register Mario-specific systems
  gameManager.registerSystem(new MarioInputSystem(gameManager));
  gameManager.registerSystem(new RespawnSystem(gameManager));
  gameManager.registerSystem(new EnemyAISystem(gameManager));
  gameManager.registerSystem(new CollisionSystem(gameManager));

  // Create level
  createLevel(gameManager);
}

/**
 * Create the game level
 */
function createLevel(gameManager: GameManager): void {
  // Create player
  const playerFactory = createMarioPlayer();
  const player = gameManager.createEntity("Mario");

  // Copy all components from factory entity to game manager entity
  playerFactory.getComponentTypes().forEach((componentType) => {
    const component = playerFactory.getComponent(componentType);
    if (component) {
      player.addComponent(componentType, component);
    }
  });

  // Add mesh to scene
  const playerMesh = player.getComponent<any>("Mesh");
  if (playerMesh?.object3d) {
    gameManager.getScene().add(playerMesh.object3d);
  }

  // Create platforms - EXTENDED LEVEL
  const platformsData = [
    // Ground level
    { x: 0, y: -10, w: 20, h: 0.5, color: 0x8b4513 },

    // First section - ascending
    { x: 8, y: -8, w: 3, h: 0.5, color: 0x8b4513 },
    { x: 14, y: -6, w: 3, h: 0.5, color: 0x8b4513 },
    { x: 19, y: -4, w: 4, h: 0.5, color: 0x8b4513 },
    { x: 24, y: -2, w: 3, h: 0.5, color: 0x8b4513 },
    { x: 28, y: 0, w: 4, h: 0.5, color: 0x8b4513 },

    // Upper section - left side
    { x: 24, y: 2, w: 3, h: 0.5, color: 0x8b4513 },
    { x: 19, y: 4, w: 4, h: 0.5, color: 0x8b4513 },
    { x: 13, y: 5, w: 3, h: 0.5, color: 0x8b4513 },
    { x: 7, y: 6, w: 3, h: 0.5, color: 0x8b4513 },

    // Middle section - descending left
    { x: 2, y: 4, w: 3, h: 0.5, color: 0x8b4513 },
    { x: -4, y: 2, w: 4, h: 0.5, color: 0x8b4513 },
    { x: -9, y: 0, w: 3, h: 0.5, color: 0x8b4513 },
    { x: -13, y: -2, w: 4, h: 0.5, color: 0x8b4513 },

    // Right side challenge - small jumps
    { x: 33, y: -0.5, w: 2, h: 0.5, color: 0xff6b6b },
    { x: 36, y: 0.5, w: 2, h: 0.5, color: 0xff6b6b },
    { x: 39, y: 1.5, w: 2, h: 0.5, color: 0xff6b6b },
    { x: 42, y: 2.5, w: 3, h: 0.5, color: 0xff6b6b },

    // Final platform to flag
    { x: 46, y: 3, w: 3, h: 0.5, color: 0xffd700 },
  ];

  platformsData.forEach((pData) => {
    const platform = createPlatform(pData.x, pData.y, pData.w, pData.h, pData.color);
    const entity = gameManager.createEntity("Platform");

    platform.getComponentTypes().forEach((componentType) => {
      const component = platform.getComponent(componentType);
      if (component) {
        entity.addComponent(componentType, component);
      }
    });

    const mesh = entity.getComponent<any>("Mesh");
    if (mesh?.object3d) {
      gameManager.getScene().add(mesh.object3d);
    }
  });

  // Create coins - SCATTERED THROUGHOUT LEVEL
  const coinsData = [
    // Lower section coins
    { x: 10, y: -7 },
    { x: 16, y: -5 },
    { x: 21, y: -3 },
    { x: 26, y: -1 },
    { x: 30, y: 1 },

    // Upper section coins
    { x: 26, y: 3 },
    { x: 21, y: 5 },
    { x: 15, y: 6 },
    { x: 9, y: 7 },
    { x: 5, y: 5 },

    // Left side coins
    { x: 0, y: 5 },
    { x: -5, y: 3 },
    { x: -10, y: 1 },
    { x: -14, y: -1 },

    // Challenge section coins
    { x: 34.5, y: 1.5 },
    { x: 37.5, y: 2.5 },
    { x: 40.5, y: 3.5 },
    { x: 43, y: 4 },
    { x: 47, y: 4.5 },
  ];

  coinsData.forEach((cData) => {
    const coin = createCoin(cData.x, cData.y);
    const entity = gameManager.createEntity("Coin");

    coin.getComponentTypes().forEach((componentType) => {
      const component = coin.getComponent(componentType);
      if (component) {
        entity.addComponent(componentType, component);
      }
    });

    const mesh = entity.getComponent<any>("Mesh");
    if (mesh?.object3d) {
      gameManager.getScene().add(mesh.object3d);
    }
  });

  // Create enemies - PATROL THROUGHOUT LEVEL
  const enemiesData = [
    { x: 5, y: -9 },
    { x: 17, y: -5 },
    { x: 23, y: -1 },
    { x: 15, y: 5 },
    { x: -7, y: 1 },
    { x: 35, y: 1 },
    { x: 41, y: 3 },
  ];

  enemiesData.forEach((eData) => {
    const enemy = createEnemy(eData.x, eData.y);
    const entity = gameManager.createEntity("Enemy");

    enemy.getComponentTypes().forEach((componentType) => {
      const component = enemy.getComponent(componentType);
      if (component) {
        entity.addComponent(componentType, component);
      }
    });

    const mesh = entity.getComponent<any>("Mesh");
    if (mesh?.object3d) {
      gameManager.getScene().add(mesh.object3d);
    }
  });

  // Create goal flag
  const flag = createFlag(48, 4);
  const flagEntity = gameManager.createEntity("Flag");

  flag.getComponentTypes().forEach((componentType) => {
    const component = flag.getComponent(componentType);
    if (component) {
      flagEntity.addComponent(componentType, component);
    }
  });

  const flagMesh = flagEntity.getComponent<any>("Mesh");
  if (flagMesh?.object3d) {
    gameManager.getScene().add(flagMesh.object3d);
  }
}

