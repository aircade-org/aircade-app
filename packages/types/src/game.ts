/**
 * Game types and interfaces
 */

// Game event types
export type GameEventType =
  | "collision"
  | "levelComplete"
  | "gameOver"
  | "itemCollected"
  | "enemyDefeated"
  | "playerSpawned"
  | "playerDied";

// Player state
export interface PlayerGameState {
  isGrounded: boolean;
  isFacingRight: boolean;
  jumpForce: number;
  moveSpeed: number;
  maxJumps: number;
  jumpsRemaining: number;
  score: number;
  lives: number;
  wasJumping?: boolean;
}

// Enemy state
export interface EnemyGameState {
  type: "goomba" | "koopa" | "piranha";
  speed: number;
  direction: number;
  health: number;
  damage: number;
  isGrounded: boolean;
}

// Item state
export interface ItemGameState {
  type: "coin" | "powerup" | "star";
  value: number;
  collected: boolean;
}

// Goal state
export interface GoalGameState {
  reached: boolean;
}

// Game level config
export interface GameLevelConfig {
  id: string;
  name: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  timeLimit?: number;
  targetScore?: number;
  description?: string;
}

// Game session
export interface GameSession {
  id: string;
  gameId: string;
  startTime: number;
  endTime?: number;
  finalScore: number;
  levelId: string;
  playerCount: number;
}

