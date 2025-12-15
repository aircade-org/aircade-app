import { GameSystem } from "@repo/game-engine";
import { GameManager } from "@repo/game-engine";
import { InputSystem } from "@repo/game-engine";
import { PhysicsSystem } from "@repo/game-engine";
import { GameEntity } from "@repo/game-engine";

const ACCELERATION = 30;
const MAX_SPEED = 8;
const JUMP_FORCE = 12;
const GROUND_CHECK_DISTANCE = 0.1;

/**
 * Player input and movement system for Mario
 */
export class MarioInputSystem implements GameSystem {
  name = "MarioInputSystem";
  priority = 75;

  private gameManager: GameManager;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  async onInit(): Promise<void> {}

  async onUpdate(deltaTime: number): Promise<void> {
    const inputSystem = this.gameManager.getSystem<InputSystem>("InputSystem");
    if (!inputSystem) return;

    const entities = this.gameManager.getEntities();
    const player = entities.find((e) => e.name === "Mario");
    if (!player) return;

    const body = player.getComponent<any>("PhysicsBody");
    const playerState = player.getComponent<any>("PlayerState");
    const transform = player.getComponent<any>("Transform");

    if (!body || !playerState || !transform) return;

    // Horizontal movement - check for both lowercase and case variations
    const moveRight =
      inputSystem.isKeyPressed("ArrowRight") ||
      inputSystem.isKeyPressed("d") ||
      inputSystem.isKeyPressed("D");

    const moveLeft =
      inputSystem.isKeyPressed("ArrowLeft") ||
      inputSystem.isKeyPressed("a") ||
      inputSystem.isKeyPressed("A");

    const inputX = (moveRight ? 1 : 0) - (moveLeft ? 1 : 0);

    if (inputX !== 0) {
      body.acceleration.x = inputX * ACCELERATION;
      playerState.isFacingRight = inputX > 0;
    } else {
      // Deceleration
      body.velocity.x *= 0.85;
    }

    // Clamp horizontal velocity
    body.velocity.x = Math.max(
      -MAX_SPEED,
      Math.min(MAX_SPEED, body.velocity.x),
    );

    // Check if grounded
    const isGrounded = this.isPlayerGrounded(player);
    playerState.isGrounded = isGrounded;

    if (isGrounded) {
      playerState.jumpsRemaining = playerState.maxJumps;
    }

    // Jumping - check for space, w, W, and arrow up
    const jumpPressed =
      inputSystem.isKeyPressed(" ") ||
      inputSystem.isKeyPressed("w") ||
      inputSystem.isKeyPressed("W") ||
      inputSystem.isKeyPressed("ArrowUp");

    if (jumpPressed && playerState.jumpsRemaining > 0 && !this.wasJumpingLastFrame(playerState)) {
      body.velocity.y = playerState.jumpForce;
      playerState.jumpsRemaining--;
      playerState.wasJumping = true;
    } else if (!jumpPressed) {
      playerState.wasJumping = false;
    }
  }

  async onDestroy(): Promise<void> {}

  private isPlayerGrounded(player: GameEntity): boolean {
    const physicsSystem = this.gameManager.getSystem<PhysicsSystem>(
      "PhysicsSystem",
    );
    if (!physicsSystem) return false;

    const transform = player.getComponent<any>("Transform");
    const collider = player.getComponent<any>("Collider");

    if (!transform || !collider) return false;

    const rayStart = transform.position.clone();
    rayStart.y -= collider.size.y / 2;

    const rayEnd = rayStart.clone();
    rayEnd.y -= GROUND_CHECK_DISTANCE;

    const entities = this.gameManager.getEntities();
    for (const entity of entities) {
      if (entity.id === player.id) continue;

      const otherTransform = entity.getComponent<any>("Transform");
      const otherCollider = entity.getComponent<any>("Collider");

      if (!otherTransform || !otherCollider) continue;

      if (
        rayStart.x >
          otherTransform.position.x - otherCollider.size.x / 2 &&
        rayStart.x <
          otherTransform.position.x + otherCollider.size.x / 2 &&
        rayEnd.y <
          otherTransform.position.y + otherCollider.size.y / 2 &&
        rayStart.y >
          otherTransform.position.y - otherCollider.size.y / 2
      ) {
        return true;
      }
    }

    return false;
  }

  private wasJumpingLastFrame(playerState: any): boolean {
    return playerState.wasJumping === true;
  }
}

/**
 * Enemy AI system
 */
export class EnemyAISystem implements GameSystem {
  name = "EnemyAISystem";
  priority = 60;

  private gameManager: GameManager;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  async onInit(): Promise<void> {}

  async onUpdate(deltaTime: number): Promise<void> {
    const entities = this.gameManager.getEntities();

    for (const entity of entities) {
      if (entity.name !== "Enemy") continue;

      const enemyState = entity.getComponent<any>("EnemyState");
      const body = entity.getComponent<any>("PhysicsBody");
      const transform = entity.getComponent<any>("Transform");

      if (!enemyState || !body || !transform) continue;

      // Simple patrol behavior
      body.velocity.x = enemyState.direction * enemyState.speed;

      // Check for boundaries and reverse direction
      if (transform.position.x < -15 || transform.position.x > 15) {
        enemyState.direction *= -1;
      }
    }
  }

  async onDestroy(): Promise<void> {}
}

/**
 * Respawn system - handles Mario falling into void
 */
export class RespawnSystem implements GameSystem {
  name = "RespawnSystem";
  priority = 45;

  private gameManager: GameManager;
  private voidThreshold = -15; // Y position below which Mario respawns
  private blinkDuration = 1.5; // Seconds to blink after respawn
  private blinkInterval = 0.1; // Seconds between blink toggles

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  async onInit(): Promise<void> {}

  async onUpdate(deltaTime: number): Promise<void> {
    const entities = this.gameManager.getEntities();
    const player = entities.find((e) => e.name === "Mario");
    if (!player) return;

    const transform = player.getComponent<any>("Transform");
    const playerState = player.getComponent<any>("PlayerState");
    const mesh = player.getComponent<any>("Mesh");

    if (!transform || !playerState || !mesh?.object3d) return;

    // Check if Mario fell into void
    if (transform.position.y < this.voidThreshold) {
      // Lose a life
      playerState.lives--;

      // Start blinking animation
      playerState.isRespawning = true;
      playerState.respawnBlinkTime = 0;

      // Reset position to start
      transform.position.set(0, -8, 0);

      // Reset velocity
      const body = player.getComponent<any>("PhysicsBody");
      if (body) {
        body.velocity.set(0, 0, 0);
      }

      // Emit respawn event
      this.gameManager.getEventBus().emit({
        type: "playerRespawn",
        timestamp: Date.now(),
        data: { lives: playerState.lives },
      });

      // Check if game over
      if (playerState.lives <= 0) {
        this.gameManager.getEventBus().emit({
          type: "gameOver",
          timestamp: Date.now(),
        });
      }
    }

    // Handle blinking animation
    if (playerState.isRespawning) {
      playerState.respawnBlinkTime += deltaTime;

      if (playerState.respawnBlinkTime < this.blinkDuration) {
        // Toggle visibility based on blink interval
        const blinkCycle = playerState.respawnBlinkTime % (this.blinkInterval * 2);
        mesh.object3d.visible = blinkCycle < this.blinkInterval;
      } else {
        // End blinking, make visible
        mesh.object3d.visible = true;
        playerState.isRespawning = false;
      }
    }
  }

  async onDestroy(): Promise<void> {}
}

/**
 * Collision/item pickup system
 */
export class CollisionSystem implements GameSystem {
  name = "CollisionSystem";
  priority = 40;

  private gameManager: GameManager;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  async onInit(): Promise<void> {
    this.gameManager
      .getEventBus()
      .on("collision", (event) => this.handleCollision(event));
  }

  async onUpdate(deltaTime: number): Promise<void> {}

  async onDestroy(): Promise<void> {}

  private handleCollision(event: any): void {
    const { entityAId, entityBId } = event.data;

    const entityA = this.gameManager.getEntity(entityAId as string);
    const entityB = this.gameManager.getEntity(entityBId as string);

    if (!entityA || !entityB) return;

    // Check for coin collection
    if (entityA.name === "Mario" && entityB.name === "Coin") {
      this.collectCoin(entityB);
    } else if (entityA.name === "Coin" && entityB.name === "Mario") {
      this.collectCoin(entityA);
    }

    // Check for goal reached
    if (entityA.name === "Mario" && entityB.name === "Flag") {
      this.reachGoal();
    } else if (entityA.name === "Flag" && entityB.name === "Mario") {
      this.reachGoal();
    }

    // Check for enemy collision with player
    if (entityA.name === "Mario" && entityB.name === "Enemy") {
      this.playerHitEnemy(entityA, entityB);
    } else if (entityA.name === "Enemy" && entityB.name === "Mario") {
      this.playerHitEnemy(entityB, entityA);
    }
  }

  private collectCoin(coin: GameEntity): void {
    const itemState = coin.getComponent<any>("ItemState");
    if (!itemState || itemState.collected) return;

    itemState.collected = true;

    const entities = this.gameManager.getEntities();
    const player = entities.find((e) => e.name === "Mario");
    if (player) {
      const playerState = player.getComponent<any>("PlayerState");
      if (playerState) {
        playerState.score += itemState.value;
      }
    }

    // Remove coin after a short delay
    setTimeout(() => {
      this.gameManager.removeEntity(coin.id as string);
    }, 100);
  }

  private reachGoal(): void {
    this.gameManager.getEventBus().emit({
      type: "levelComplete",
      timestamp: Date.now(),
    });
  }

  private playerHitEnemy(player: GameEntity, enemy: GameEntity): void {
    const playerState = player.getComponent<any>("PlayerState");
    if (!playerState) return;

    playerState.lives--;

    if (playerState.lives <= 0) {
      this.gameManager.getEventBus().emit({
        type: "gameOver",
        timestamp: Date.now(),
      });
    }
  }
}

