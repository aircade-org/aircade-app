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
export async function initializeMarioLevel(gameManager: GameManager): Promise<void> {
  gameManager.registerSystem(new InputSystem());
  gameManager.registerSystem(new PhysicsSystem(gameManager));
  gameManager.registerSystem(new RenderSystem(gameManager));

  gameManager.registerSystem(new MarioInputSystem(gameManager));
  gameManager.registerSystem(new RespawnSystem(gameManager));
  gameManager.registerSystem(new EnemyAISystem(gameManager));
  gameManager.registerSystem(new CollisionSystem(gameManager));

  await createLevel(gameManager);
}

/**
 * Create the game level
 */
async function createLevel(gameManager: GameManager): Promise<void> {
  // Create player
  const playerFactory = await createMarioPlayer();
  const player = gameManager.createEntity("Mario");

  playerFactory.getComponentTypes().forEach((componentType) => {
    const component = playerFactory.getComponent(componentType);
    if (component) {
      player.addComponent(componentType, component);
    }
  });

  const playerMesh = player.getComponent<any>("Mesh");
  if (playerMesh?.object3d) {
    gameManager.getScene().add(playerMesh.object3d);
  }

  // Create platforms
  const platformsData = [
    { x: 0, y: -10, w: 20, h: 0.5, type: "grass" },
    { x: 8, y: -8, w: 3, h: 0.5, type: "grass" },
    { x: 14, y: -6, w: 3, h: 0.5, type: "grass" },
    { x: 19, y: -4, w: 4, h: 0.5, type: "grass" },
    { x: 24, y: -2, w: 3, h: 0.5, type: "grass" },
    { x: 28, y: 0, w: 4, h: 0.5, type: "grass" },
    { x: 24, y: 2, w: 3, h: 0.5, type: "dirt" },
    { x: 19, y: 4, w: 4, h: 0.5, type: "dirt" },
    { x: 13, y: 5, w: 3, h: 0.5, type: "grass" },
    { x: 7, y: 6, w: 3, h: 0.5, type: "grass" },
    { x: 2, y: 4, w: 3, h: 0.5, type: "dirt" },
    { x: -4, y: 2, w: 4, h: 0.5, type: "dirt" },
    { x: -9, y: 0, w: 3, h: 0.5, type: "grass" },
    { x: -13, y: -2, w: 4, h: 0.5, type: "grass" },
    { x: 33, y: -0.5, w: 2, h: 0.5, type: "brick" },
    { x: 36, y: 0.5, w: 2, h: 0.5, type: "brick" },
    { x: 39, y: 1.5, w: 2, h: 0.5, type: "brick" },
    { x: 42, y: 2.5, w: 3, h: 0.5, type: "brick" },
    { x: 46, y: 3, w: 3, h: 0.5, type: "grass" },
  ];

  for (const pData of platformsData) {
    const platform = await createPlatform(pData.x, pData.y, pData.w, pData.h, pData.type);
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
  }

  // Create coins
  const coinsData = [
    { x: 10, y: -7 },
    { x: 16, y: -5 },
    { x: 21, y: -3 },
    { x: 26, y: -1 },
    { x: 30, y: 1 },
    { x: 26, y: 3 },
    { x: 21, y: 5 },
    { x: 15, y: 6 },
    { x: 9, y: 7 },
    { x: 5, y: 5 },
    { x: 0, y: 5 },
    { x: -5, y: 3 },
    { x: -10, y: 1 },
    { x: -14, y: -1 },
    { x: 34.5, y: 1.5 },
    { x: 37.5, y: 2.5 },
    { x: 40.5, y: 3.5 },
    { x: 43, y: 4 },
    { x: 47, y: 4.5 },
  ];

  for (const cData of coinsData) {
    const coin = await createCoin(cData.x, cData.y);
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
  }

  // Create enemies
  const enemiesData = [
    { x: 5, y: -9 },
    { x: 17, y: -5 },
    { x: 23, y: -1 },
    { x: 15, y: 5 },
    { x: -7, y: 1 },
    { x: 35, y: 1 },
    { x: 41, y: 3 },
  ];

  for (const eData of enemiesData) {
    const enemy = await createEnemy(eData.x, eData.y);
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
  }

  // Create goal flag
  const flag = await createFlag(48, 4);
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

