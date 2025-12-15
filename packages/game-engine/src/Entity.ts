import { EntityId, Component, createEntityId } from "./types.js";

/**
 * Base Entity class implementing ECS (Entity-Component-System) pattern
 */
export class GameEntity {
  readonly id: EntityId;
  name: string;
  active: boolean;
  readonly components: Map<string, Component>;

  constructor(name: string, id?: string) {
    this.id = createEntityId(id || `entity-${Date.now()}-${Math.random()}`);
    this.name = name;
    this.active = true;
    this.components = new Map();
  }

  /**
   * Get component by type
   */
  getComponent<T extends Component>(componentType: string): T | undefined {
    return this.components.get(componentType) as T | undefined;
  }

  /**
   * Add component to entity
   */
  addComponent<T extends Component>(componentType: string, data: T): void {
    if (this.components.has(componentType)) {
      console.warn(
        `Entity ${this.name} already has component ${componentType}`,
      );
      return;
    }
    this.components.set(componentType, data);
  }

  /**
   * Remove component from entity
   */
  removeComponent(componentType: string): void {
    this.components.delete(componentType);
  }

  /**
   * Check if entity has component
   */
  hasComponent(componentType: string): boolean {
    return this.components.has(componentType);
  }

  /**
   * Get all component types
   */
  getComponentTypes(): string[] {
    return Array.from(this.components.keys());
  }
}

