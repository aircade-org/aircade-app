import * as THREE from "three";

/**
 * Unique identifier for game entities
 */
export type EntityId = string & { readonly __brand: "EntityId" };

/**
 * Create a branded EntityId
 */
export function createEntityId(id: string): EntityId {
  return id as EntityId;
}

/**
 * Lifecycle events for systems
 */
export interface SystemLifecycle {
  onInit(): void | Promise<void>;
  onUpdate(deltaTime: number): void | Promise<void>;
  onDestroy(): void | Promise<void>;
}

/**
 * Base interface for game systems
 */
export interface GameSystem extends SystemLifecycle {
  name: string;
  priority?: number; // Higher priority runs first, default 0
}

/**
 * Component data attached to entities
 */
export interface Component {
  [key: string]: unknown;
}

/**
 * Game entity with components
 */
export interface Entity {
  id: EntityId;
  name: string;
  active: boolean;
  components: Map<string, Component>;
  getComponent<T extends Component>(componentType: string): T | undefined;
  addComponent<T extends Component>(componentType: string, data: T): void;
  removeComponent(componentType: string): void;
  hasComponent(componentType: string): boolean;
}

/**
 * Game event payload
 */
export interface GameEvent {
  type: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

/**
 * Event listener callback
 */
export type EventListener = (event: GameEvent) => void | Promise<void>;

/**
 * Input state
 */
export interface InputState {
  keys: Set<string>;
  gamepadButtons: Map<number, Set<number>>;
  gamepadAxes: Map<number, number[]>;
  mousePosition: { x: number; y: number };
  touches: Map<number, { x: number; y: number }>;
}

/**
 * Physics body component
 */
export interface PhysicsBody extends Component {
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  mass: number;
  useGravity: boolean;
  isKinematic: boolean;
  constraints?: {
    freezeX?: boolean;
    freezeY?: boolean;
    freezeZ?: boolean;
  };
}

/**
 * Collision info
 */
export interface CollisionInfo {
  entityA: EntityId;
  entityB: EntityId;
  normal: THREE.Vector3;
  penetration: number;
  contactPoint: THREE.Vector3;
}

/**
 * Transform component (position, rotation, scale)
 */
export interface Transform extends Component {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  isDirty?: boolean;
}

/**
 * Collider component (for collision detection)
 */
export interface Collider extends Component {
  type: "box" | "sphere" | "capsule";
  size: THREE.Vector3;
  offset: THREE.Vector3;
  isTrigger: boolean;
  layers: number;
}

/**
 * Game configuration
 */
export interface GameConfig {
  canvasContainer: HTMLElement;
  width: number;
  height: number;
  pixelRatio?: number;
  backgroundColor?: THREE.ColorRepresentation;
  targetFPS?: number;
}

/**
 * Game state
 */
export interface GameState {
  isRunning: boolean;
  isPaused: boolean;
  currentLevel?: number;
  score?: number;
  lives?: number;
}

