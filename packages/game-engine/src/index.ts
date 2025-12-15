// Core exports
export { GameManager } from "./GameManager.js";
export { GameEntity } from "./Entity.js";
export { EventBus } from "./EventBus.js";

// System exports
export { InputSystem, PhysicsSystem, RenderSystem } from "./systems/index.js";

// Type exports
export type {
  EntityId,
  SystemLifecycle,
  GameSystem,
  Component,
  Entity,
  GameEvent,
  EventListener,
  InputState,
  PhysicsBody,
  CollisionInfo,
  Transform,
  Collider,
  GameConfig,
  GameState,
} from "./types.js";

export { createEntityId } from "./types.js";

