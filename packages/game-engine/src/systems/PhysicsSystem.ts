import * as THREE from "three";
import { GameSystem, PhysicsBody, Collider, CollisionInfo } from "../types.js";
import { GameManager } from "../GameManager.js";
import { GameEntity } from "../Entity.js";

const GRAVITY = 20; // units per second squared

/**
 * Physics system for handling gravity, velocity, and collision detection
 */
export class PhysicsSystem implements GameSystem {
  name = "PhysicsSystem";
  priority = 50;

  private gameManager: GameManager;
  private collisions: CollisionInfo[] = [];

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  async onInit(): Promise<void> {
    // System initialized
  }

  async onUpdate(deltaTime: number): Promise<void> {
    this.collisions = [];

    const entities = this.gameManager.getEntities();

    // Apply gravity and velocity
    for (const entity of entities) {
      if (!entity.active) continue;

      const body = entity.getComponent<PhysicsBody>("PhysicsBody");
      if (!body) continue;

      // Apply gravity
      if (body.useGravity) {
        body.acceleration.y -= GRAVITY;
      }

      // Update velocity
      body.velocity.addScaledVector(body.acceleration, deltaTime);

      // Apply constraints
      if (body.constraints?.freezeX) body.velocity.x = 0;
      if (body.constraints?.freezeY) body.velocity.y = 0;
      if (body.constraints?.freezeZ) body.velocity.z = 0;

      // Reset acceleration
      body.acceleration.set(0, 0, 0);
    }

    // Detect collisions
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const entityA = entities[i];
        const entityB = entities[j];

        if (!entityA || !entityB || !entityA.active || !entityB.active) continue;

        const colliderA = entityA.getComponent<Collider>("Collider");
        const colliderB = entityB.getComponent<Collider>("Collider");

        if (!colliderA || !colliderB) continue;

        const collision = this.checkCollision(entityA, entityB, colliderA, colliderB);
        if (collision) {
          this.collisions.push(collision);

          // Emit collision event
          this.gameManager.getEventBus().emit({
            type: "collision",
            timestamp: Date.now(),
            data: {
              entityAId: collision.entityA,
              entityBId: collision.entityB,
              normal: collision.normal,
              penetration: collision.penetration,
            },
          });
        }
      }
    }

    // Apply velocities and resolve collisions
    for (const entity of entities) {
      if (!entity.active) continue;

      const body = entity.getComponent<PhysicsBody>("PhysicsBody");
      if (!body || body.isKinematic) continue;

      const transform = entity.getComponent<any>("Transform");
      if (!transform) continue;

      // Update position
      transform.position.addScaledVector(body.velocity, deltaTime);

      // Resolve collisions - push entity out of colliders (but not triggers)
      for (const collision of this.collisions) {
        // Get both entities and their colliders
        const otherEntityA = this.gameManager.getEntity(collision.entityA as string);
        const otherEntityB = this.gameManager.getEntity(collision.entityB as string);

        if (!otherEntityA || !otherEntityB) continue;

        const colliderA = otherEntityA.getComponent<Collider>("Collider");
        const colliderB = otherEntityB.getComponent<Collider>("Collider");

        if (!colliderA || !colliderB) continue;

        // Skip trigger collisions - they only emit events, don't resolve physics
        if (colliderA.isTrigger || colliderB.isTrigger) continue;

        if (collision.entityA === entity.id) {
          // Entity A collided with kinematic entity B (platform)
          const otherBody = otherEntityB.getComponent<PhysicsBody>("PhysicsBody");
          if (otherBody?.isKinematic) {
            // Push entity out of platform
            transform.position.addScaledVector(collision.normal, collision.penetration + 0.01);

            // Stop velocity in collision direction if moving into it
            const velocityIntoNormal = body.velocity.dot(collision.normal);
            if (velocityIntoNormal < 0) {
              body.velocity.addScaledVector(collision.normal, -velocityIntoNormal);
            }
          }
        } else if (collision.entityB === entity.id) {
          // Entity B collided with kinematic entity A (platform)
          const otherBody = otherEntityA.getComponent<PhysicsBody>("PhysicsBody");
          if (otherBody?.isKinematic) {
            // Push entity out of platform (opposite direction)
            transform.position.addScaledVector(collision.normal, -(collision.penetration + 0.01));

            // Stop velocity in collision direction if moving into it
            const velocityIntoNormal = body.velocity.dot(collision.normal);
            if (velocityIntoNormal > 0) {
              body.velocity.addScaledVector(collision.normal, -velocityIntoNormal);
            }
          }
        }
      }
    }
  }

  async onDestroy(): Promise<void> {
    // Cleanup
  }

  /**
   * Apply force to entity
   */
  applyForce(entity: GameEntity, force: THREE.Vector3): void {
    const body = entity.getComponent<PhysicsBody>("PhysicsBody");
    if (!body) return;

    body.acceleration.addScaledVector(force, 1 / body.mass);
  }

  /**
   * Set velocity
   */
  setVelocity(entity: GameEntity, velocity: THREE.Vector3): void {
    const body = entity.getComponent<PhysicsBody>("PhysicsBody");
    if (!body) return;

    body.velocity.copy(velocity);
  }

  /**
   * Get velocity
   */
  getVelocity(entity: GameEntity): THREE.Vector3 | null {
    const body = entity.getComponent<PhysicsBody>("PhysicsBody");
    return body ? body.velocity.clone() : null;
  }

  /**
   * Get recent collisions
   */
  getCollisions(): CollisionInfo[] {
    return [...this.collisions];
  }

  private checkCollision(
    entityA: GameEntity,
    entityB: GameEntity,
    colliderA: Collider,
    colliderB: Collider,
  ): CollisionInfo | null {
    const transformA = entityA.getComponent<any>("Transform");
    const transformB = entityB.getComponent<any>("Transform");

    if (!transformA || !transformB) return null;

    if (colliderA.type === "box" && colliderB.type === "box") {
      return this.checkBoxCollision(
        entityA.id,
        entityB.id,
        transformA.position,
        transformB.position,
        colliderA,
        colliderB,
      );
    }

    if (colliderA.type === "sphere" && colliderB.type === "sphere") {
      return this.checkSphereCollision(
        entityA.id,
        entityB.id,
        transformA.position,
        transformB.position,
        colliderA,
        colliderB,
      );
    }

    return this.checkMixedCollision(
      entityA.id,
      entityB.id,
      transformA.position,
      transformB.position,
      colliderA,
      colliderB,
    );
  }

  private checkBoxCollision(
    idA: any,
    idB: any,
    posA: THREE.Vector3,
    posB: THREE.Vector3,
    colliderA: Collider,
    colliderB: Collider,
  ): CollisionInfo | null {
    const aMin = posA.clone().add(colliderA.offset).sub(colliderA.size.clone().multiplyScalar(0.5));
    const aMax = posA.clone().add(colliderA.offset).add(colliderA.size.clone().multiplyScalar(0.5));

    const bMin = posB.clone().add(colliderB.offset).sub(colliderB.size.clone().multiplyScalar(0.5));
    const bMax = posB.clone().add(colliderB.offset).add(colliderB.size.clone().multiplyScalar(0.5));

    if (aMax.x < bMin.x || aMin.x > bMax.x) return null;
    if (aMax.y < bMin.y || aMin.y > bMax.y) return null;
    if (aMax.z < bMin.z || aMin.z > bMax.z) return null;

    // Calculate penetration
    const penetrationX = Math.min(aMax.x - bMin.x, bMax.x - aMin.x);
    const penetrationY = Math.min(aMax.y - bMin.y, bMax.y - aMin.y);
    const penetrationZ = Math.min(aMax.z - bMin.z, bMax.z - aMin.z);

    let penetration = Math.min(penetrationX, penetrationY, penetrationZ);
    let normal = new THREE.Vector3();

    if (penetration === penetrationX) {
      normal.x = posA.x < posB.x ? -1 : 1;
    } else if (penetration === penetrationY) {
      normal.y = posA.y < posB.y ? -1 : 1;
    } else {
      normal.z = posA.z < posB.z ? -1 : 1;
    }

    return {
      entityA: idA,
      entityB: idB,
      normal,
      penetration,
      contactPoint: new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5),
    };
  }

  private checkSphereCollision(
    idA: any,
    idB: any,
    posA: THREE.Vector3,
    posB: THREE.Vector3,
    colliderA: Collider,
    colliderB: Collider,
  ): CollisionInfo | null {
    const radiusA = colliderA.size.x * 0.5;
    const radiusB = colliderB.size.x * 0.5;

    const distance = posA.distanceTo(posB);
    const minDistance = radiusA + radiusB;

    if (distance >= minDistance) return null;

    const normal = posB.clone().sub(posA).normalize();

    return {
      entityA: idA,
      entityB: idB,
      normal,
      penetration: minDistance - distance,
      contactPoint: posA.clone().addScaledVector(normal, radiusA),
    };
  }

  private checkMixedCollision(
    idA: any,
    idB: any,
    posA: THREE.Vector3,
    posB: THREE.Vector3,
    colliderA: Collider,
    colliderB: Collider,
  ): CollisionInfo | null {
    // Simplified: treat as box collision
    return this.checkBoxCollision(idA, idB, posA, posB, colliderA, colliderB);
  }
}

