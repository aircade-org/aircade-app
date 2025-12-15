import { GameEvent, EventListener } from "./types.js";

/**
 * Event bus for game-wide event propagation
 */
export class EventBus {
  private listeners: Map<string, Set<EventListener>>;

  constructor() {
    this.listeners = new Map();
  }

  /**
   * Subscribe to an event type
   */
  on(eventType: string, listener: EventListener): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);
  }

  /**
   * Unsubscribe from an event type
   */
  off(eventType: string, listener: EventListener): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.listeners.delete(eventType);
      }
    }
  }

  /**
   * Subscribe to event only once
   */
  once(eventType: string, listener: EventListener): void {
    const wrappedListener = (event: GameEvent) => {
      listener(event);
      this.off(eventType, wrappedListener);
    };
    this.on(eventType, wrappedListener);
  }

  /**
   * Emit an event
   */
  async emit(event: GameEvent): Promise<void> {
    const listeners = this.listeners.get(event.type);
    if (!listeners) return;

    const promises = Array.from(listeners).map((listener) =>
      Promise.resolve(listener(event)),
    );
    await Promise.all(promises);
  }

  /**
   * Clear all listeners
   */
  clear(): void {
    this.listeners.clear();
  }

  /**
   * Get number of listeners for an event type
   */
  listenerCount(eventType: string): number {
    return this.listeners.get(eventType)?.size ?? 0;
  }
}

