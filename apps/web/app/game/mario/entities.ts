import * as THREE from "three";
import { GameEntity } from "@repo/game-engine";
import { Transform, PhysicsBody, Collider } from "@repo/game-engine";

/**
 * Create Mario player entity
 */
export function createMarioPlayer(): GameEntity {
  const player = new GameEntity("Mario");

  // Transform
  const transform: Transform = {
    position: new THREE.Vector3(0, 5, 0),
    rotation: new THREE.Euler(0, 0, 0),
    scale: new THREE.Vector3(1, 1, 1),
  };
  player.addComponent("Transform", transform);

  // Physics body
  const body: PhysicsBody = {
    velocity: new THREE.Vector3(0, 0, 0),
    acceleration: new THREE.Vector3(0, 0, 0),
    mass: 1,
    useGravity: true,
    isKinematic: false,
    constraints: {
      freezeZ: true,
    },
  };
  player.addComponent("PhysicsBody", body);

  // Collider
  const collider: Collider = {
    type: "box",
    size: new THREE.Vector3(0.8, 1.6, 0.5),
    offset: new THREE.Vector3(0, 0, 0),
    isTrigger: false,
    layers: 1,
  };
  player.addComponent("Collider", collider);

  // Player state
  player.addComponent("PlayerState", {
    isGrounded: false,
    isFacingRight: true,
    jumpForce: 12,
    moveSpeed: 8,
    maxJumps: 1,
    jumpsRemaining: 1,
    score: 0,
    lives: 3,
  });

  // Visual representation
  const geometry = new THREE.BoxGeometry(0.8, 1.6, 0.5);
  const material = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    metalness: 0.2,
    roughness: 0.8,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  player.addComponent("Mesh", {
    object3d: mesh,
  });

  return player;
}

/**
 * Create a platform entity
 */
export function createPlatform(
  x: number,
  y: number,
  width: number = 4,
  height: number = 0.5,
  color: number = 0x8b4513,
): GameEntity {
  const platform = new GameEntity("Platform");

  // Transform
  const transform: Transform = {
    position: new THREE.Vector3(x, y, 0),
    rotation: new THREE.Euler(0, 0, 0),
    scale: new THREE.Vector3(1, 1, 1),
  };
  platform.addComponent("Transform", transform);

  // Physics body - kinematic (doesn't move)
  const body: PhysicsBody = {
    velocity: new THREE.Vector3(0, 0, 0),
    acceleration: new THREE.Vector3(0, 0, 0),
    mass: 0,
    useGravity: false,
    isKinematic: true,
  };
  platform.addComponent("PhysicsBody", body);

  // Collider
  const collider: Collider = {
    type: "box",
    size: new THREE.Vector3(width, height, 1),
    offset: new THREE.Vector3(0, 0, 0),
    isTrigger: false,
    layers: 1,
  };
  platform.addComponent("Collider", collider);

  // Visual representation
  const geometry = new THREE.BoxGeometry(width, height, 1);
  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.1,
    roughness: 0.9,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  platform.addComponent("Mesh", {
    object3d: mesh,
  });

  return platform;
}

/**
 * Create a coin item entity
 */
export function createCoin(x: number, y: number): GameEntity {
  const coin = new GameEntity("Coin");

  // Transform
  const transform: Transform = {
    position: new THREE.Vector3(x, y, 0),
    rotation: new THREE.Euler(0, 0, 0),
    scale: new THREE.Vector3(1, 1, 1),
  };
  coin.addComponent("Transform", transform);

  // Physics body
  const body: PhysicsBody = {
    velocity: new THREE.Vector3(0, 0, 0),
    acceleration: new THREE.Vector3(0, 0, 0),
    mass: 0,
    useGravity: false,
    isKinematic: true,
  };
  coin.addComponent("PhysicsBody", body);

  // Collider (trigger)
  const collider: Collider = {
    type: "sphere",
    size: new THREE.Vector3(0.4, 0.4, 0.4),
    offset: new THREE.Vector3(0, 0, 0),
    isTrigger: true,
    layers: 1,
  };
  coin.addComponent("Collider", collider);

  // Item state
  coin.addComponent("ItemState", {
    type: "coin",
    value: 10,
    collected: false,
  });

  // Visual representation
  const geometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.8,
    roughness: 0.2,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  coin.addComponent("Mesh", {
    object3d: mesh,
  });

  return coin;
}

/**
 * Create a simple enemy (Goomba)
 */
export function createEnemy(x: number, y: number): GameEntity {
  const enemy = new GameEntity("Enemy");

  // Transform
  const transform: Transform = {
    position: new THREE.Vector3(x, y, 0),
    rotation: new THREE.Euler(0, 0, 0),
    scale: new THREE.Vector3(1, 1, 1),
  };
  enemy.addComponent("Transform", transform);

  // Physics body
  const body: PhysicsBody = {
    velocity: new THREE.Vector3(0, 0, 0),
    acceleration: new THREE.Vector3(0, 0, 0),
    mass: 0.5,
    useGravity: true,
    isKinematic: false,
    constraints: {
      freezeZ: true,
    },
  };
  enemy.addComponent("PhysicsBody", body);

  // Collider
  const collider: Collider = {
    type: "box",
    size: new THREE.Vector3(0.6, 0.6, 0.5),
    offset: new THREE.Vector3(0, 0, 0),
    isTrigger: false,
    layers: 1,
  };
  enemy.addComponent("Collider", collider);

  // Enemy state
  enemy.addComponent("EnemyState", {
    type: "goomba",
    speed: 3,
    direction: 1,
    health: 1,
    damage: 1,
    isGrounded: false,
  });

  // Visual representation
  const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.5);
  const material = new THREE.MeshStandardMaterial({
    color: 0x8b0000,
    metalness: 0.3,
    roughness: 0.7,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  enemy.addComponent("Mesh", {
    object3d: mesh,
  });

  return enemy;
}

/**
 * Create goal/flag entity
 */
export function createFlag(x: number, y: number): GameEntity {
  const flag = new GameEntity("Flag");

  // Transform
  const transform: Transform = {
    position: new THREE.Vector3(x, y, 0),
    rotation: new THREE.Euler(0, 0, 0),
    scale: new THREE.Vector3(1, 1, 1),
  };
  flag.addComponent("Transform", transform);

  // Physics body
  const body: PhysicsBody = {
    velocity: new THREE.Vector3(0, 0, 0),
    acceleration: new THREE.Vector3(0, 0, 0),
    mass: 0,
    useGravity: false,
    isKinematic: true,
  };
  flag.addComponent("PhysicsBody", body);

  // Collider (trigger)
  const collider: Collider = {
    type: "box",
    size: new THREE.Vector3(0.5, 3, 0.5),
    offset: new THREE.Vector3(0, 1, 0),
    isTrigger: true,
    layers: 1,
  };
  flag.addComponent("Collider", collider);

  // Goal state
  flag.addComponent("GoalState", {
    reached: false,
  });

  // Visual representation - simple pole and flag
  const group = new THREE.Group();

  const poleGeometry = new THREE.BoxGeometry(0.1, 3, 0.1);
  const poleMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
  });
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.y = 1.5;
  pole.castShadow = true;
  group.add(pole);

  const flagGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.1);
  const flagMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
  });
  const flagMesh = new THREE.Mesh(flagGeometry, flagMaterial);
  flagMesh.position.set(0.4, 2.75, 0);
  flagMesh.castShadow = true;
  group.add(flagMesh);

  flag.addComponent("Mesh", {
    object3d: group,
  });

  return flag;
}

