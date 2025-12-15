import * as THREE from "three";
import { GameConfig, GameManager } from "@repo/game-engine";
import { initializeMarioLevel } from "./level";

/**
 * Initialize and create Mario game
 */
export async function createMarioGame(container: HTMLElement): Promise<GameManager> {
  const config: GameConfig = {
    canvasContainer: container,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x87ceeb, // Sky blue
    targetFPS: 60,
  };

  const gameManager = new GameManager(config);

  // Initialize Mario level asynchronously
  await initializeMarioLevel(gameManager);

  return gameManager;
}

/**
 * Start the Mario game
 */
export async function startMarioGame(gameManager: GameManager): Promise<void> {
  await gameManager.init();
  gameManager.start();
}

/**
 * Cleanup Mario game
 */
export async function destroyMarioGame(gameManager: GameManager): Promise<void> {
  await gameManager.destroy();
}

