import { GameSystem, InputState } from "../types.js";

/**
 * Input system for handling keyboard, gamepad, and touch input
 */
export class InputSystem implements GameSystem {
  name = "InputSystem";
  priority = 100; // High priority - run first

  private inputState: InputState;

  constructor() {
    this.inputState = {
      keys: new Set(),
      gamepadButtons: new Map(),
      gamepadAxes: new Map(),
      mousePosition: { x: 0, y: 0 },
      touches: new Map(),
    };
  }

  async onInit(): Promise<void> {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("touchstart", this.handleTouchStart);
    document.addEventListener("touchmove", this.handleTouchMove);
    document.addEventListener("touchend", this.handleTouchEnd);
  }

  async onUpdate(deltaTime: number): Promise<void> {
    this.updateGamepadState();
  }

  async onDestroy(): Promise<void> {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("touchstart", this.handleTouchStart);
    document.removeEventListener("touchmove", this.handleTouchMove);
    document.removeEventListener("touchend", this.handleTouchEnd);
  }

  /**
   * Get current input state
   */
  getInputState(): InputState {
    return this.inputState;
  }

  /**
   * Check if a key is currently pressed
   */
  isKeyPressed(key: string): boolean {
    return this.inputState.keys.has(key);
  }

  /**
   * Check if a gamepad button is pressed
   */
  isGamepadButtonPressed(gamepadIndex: number, buttonIndex: number): boolean {
    const buttons = this.inputState.gamepadButtons.get(gamepadIndex);
    return buttons ? buttons.has(buttonIndex) : false;
  }

  /**
   * Get gamepad axis value (-1 to 1)
   */
  getGamepadAxisValue(gamepadIndex: number, axisIndex: number): number {
    const axes = this.inputState.gamepadAxes.get(gamepadIndex);
    return axes ? axes[axisIndex] ?? 0 : 0;
  }

  /**
   * Get mouse position
   */
  getMousePosition(): { x: number; y: number } {
    return { ...this.inputState.mousePosition };
  }

  /**
   * Get active touches
   */
  getTouches(): Map<number, { x: number; y: number }> {
    return new Map(this.inputState.touches);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    this.inputState.keys.add(event.key);
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    this.inputState.keys.delete(event.key);
  };

  private handleMouseMove = (event: MouseEvent) => {
    this.inputState.mousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  private handleTouchStart = (event: TouchEvent) => {
    for (let i = 0; i < event.touches.length; i++) {
      const touch = event.touches[i];
      if (touch) {
        this.inputState.touches.set(touch.identifier, {
          x: touch.clientX,
          y: touch.clientY,
        });
      }
    }
  };

  private handleTouchMove = (event: TouchEvent) => {
    for (let i = 0; i < event.touches.length; i++) {
      const touch = event.touches[i];
      if (touch) {
        this.inputState.touches.set(touch.identifier, {
          x: touch.clientX,
          y: touch.clientY,
        });
      }
    }
  };

  private handleTouchEnd = (event: TouchEvent) => {
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      if (touch) {
        this.inputState.touches.delete(touch.identifier);
      }
    }
  };

  private updateGamepadState(): void {
    const gamepads = navigator.getGamepads?.();
    if (!gamepads) return;

    const activeGamepadIndices = new Set<number>();

    for (let i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads[i];
      if (!gamepad) continue;

      activeGamepadIndices.add(i);

      // Update buttons
      const buttons = new Set<number>();
      for (let j = 0; j < gamepad.buttons.length; j++) {
        const button = gamepad.buttons[j];
        if (button && button.pressed) {
          buttons.add(j);
        }
      }
      this.inputState.gamepadButtons.set(i, buttons);

      // Update axes
      const axes = Array.from(gamepad.axes);
      if (axes) {
        this.inputState.gamepadAxes.set(i, axes);
      }
    }

    // Remove disconnected gamepads
    for (const [index] of this.inputState.gamepadButtons) {
      if (!activeGamepadIndices.has(index)) {
        this.inputState.gamepadButtons.delete(index);
        const axes = this.inputState.gamepadAxes.get(index);
        if (axes) {
          this.inputState.gamepadAxes.delete(index);
        }
      }
    }
  }
}

