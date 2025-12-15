import * as THREE from "three";
import { GameConfig, GameState, GameSystem } from "./types.js";
import { GameEntity } from "./Entity.js";
import { EventBus } from "./EventBus.js";

/**
 * Core game manager handling lifecycle, rendering, and system orchestration
 */
export class GameManager {
  private config: GameConfig;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private systems: Map<string, GameSystem>;
  private systemsArray: GameSystem[];
  private entities: Map<string, GameEntity>;
  private eventBus: EventBus;
  private gameState: GameState;
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private deltaTime: number = 0;
  private isInitialized: boolean = false;

  constructor(config: GameConfig) {
    this.config = {
      pixelRatio: window.devicePixelRatio || 1,
      targetFPS: 60,
      ...config,
    };

    this.systems = new Map();
    this.systemsArray = [];
    this.entities = new Map();
    this.eventBus = new EventBus();

    this.gameState = {
      isRunning: false,
      isPaused: false,
    };

    // Initialize Three.js
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(
      this.config.backgroundColor ?? 0x87ceeb,
    );

    // Use perspective camera for 3D look with 45-degree rotation
    const width = this.config.width;
    const height = this.config.height;
    const aspectRatio = width / height;

    // Perspective camera with 45-degree FOV
    this.camera = new THREE.PerspectiveCamera(
      45,
      aspectRatio,
      0.1,
      10000,
    );

    // Position camera at an angle - rotated 45 degrees around the Y axis
    // This creates an isometric-like view
    const cameraDistance = 35;
    const cameraHeight = 15;

    // Place camera at 45 degrees (rotated around level center)
    this.camera.position.x = cameraDistance * Math.sin(Math.PI / 4); // 45 degrees
    this.camera.position.y = cameraHeight;
    this.camera.position.z = cameraDistance * Math.cos(Math.PI / 4); // 45 degrees

    // Look at center of level
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    const pixelRatio = this.config.pixelRatio ?? (window.devicePixelRatio || 1);
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.config.canvasContainer.appendChild(this.renderer.domElement);

    // Setup basic lighting
    this.setupLighting();
    this.setupEventListeners();
  }

  /**
   * Initialize the game
   */
  async init(): Promise<void> {
    if (this.isInitialized) return;

    // Initialize all systems in priority order
    const sortedSystems = this.systemsArray.sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
    );

    for (const system of sortedSystems) {
      try {
        await system.onInit();
      } catch (error) {
        console.error(`Failed to initialize system ${system.name}:`, error);
      }
    }

    this.isInitialized = true;
    this.gameState.isRunning = true;
    this.lastFrameTime = performance.now();
    this.animate();
  }

  /**
   * Start the game loop
   */
  start(): void {
    this.gameState.isRunning = true;
    this.lastFrameTime = performance.now();
    this.animate();
  }

  /**
   * Pause the game
   */
  pause(): void {
    this.gameState.isPaused = true;
  }

  /**
   * Resume the game
   */
  resume(): void {
    this.gameState.isPaused = false;
  }

  /**
   * Stop the game
   */
  stop(): void {
    this.gameState.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Register a system
   */
  registerSystem(system: GameSystem): void {
    if (this.systems.has(system.name)) {
      console.warn(`System ${system.name} already registered`);
      return;
    }
    this.systems.set(system.name, system);
    this.systemsArray.push(system);
  }

  /**
   * Get system by name
   */
  getSystem<T extends GameSystem>(name: string): T | undefined {
    return this.systems.get(name) as T | undefined;
  }

  /**
   * Create and register entity
   */
  createEntity(name: string, id?: string): GameEntity {
    const entity = new GameEntity(name, id);
    this.entities.set(entity.id as string, entity);
    return entity;
  }

  /**
   * Get entity by id
   */
  getEntity(id: string): GameEntity | undefined {
    return this.entities.get(id);
  }

  /**
   * Get all entities
   */
  getEntities(): GameEntity[] {
    return Array.from(this.entities.values());
  }

  /**
   * Remove entity
   */
  removeEntity(id: string): void {
    this.entities.delete(id);
  }

  /**
   * Get the scene
   */
  getScene(): THREE.Scene {
    return this.scene;
  }

  /**
   * Get the camera
   */
  getCamera(): THREE.OrthographicCamera | THREE.PerspectiveCamera {
    return this.camera;
  }

  /**
   * Get the renderer
   */
  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  /**
   * Get event bus
   */
  getEventBus(): EventBus {
    return this.eventBus;
  }

  /**
   * Get game state
   */
  getGameState(): GameState {
    return this.gameState;
  }

  /**
   * Update game state
   */
  setGameState(state: Partial<GameState>): void {
    this.gameState = { ...this.gameState, ...state };
  }

  /**
   * Get delta time in seconds
   */
  getDeltaTime(): number {
    return this.deltaTime;
  }

  /**
   * Main animation loop
   */
  private animate = (): void => {
    if (!this.gameState.isRunning) {
      this.animationFrameId = null;
      return;
    }

    const currentTime = performance.now();
    this.deltaTime = Math.min((currentTime - this.lastFrameTime) / 1000, 0.016); // Cap at 60fps
    this.lastFrameTime = currentTime;

    // Update systems
    if (!this.gameState.isPaused) {
      for (const system of this.systemsArray) {
        try {
          system.onUpdate(this.deltaTime);
        } catch (error) {
          console.error(`System ${system.name} update error:`, error);
        }
      }
    }

    // Render
    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  /**
   * Setup basic lighting
   */
  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    // Directional light from the camera angle for better 3D effect
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(20, 30, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.camera.far = 200;
    this.scene.add(directionalLight);
  }

  /**
   * Setup window event listeners
   */
  private setupEventListeners(): void {
    const handleResize = () => {
      if (this.camera instanceof THREE.PerspectiveCamera) {
        const width = this.config.width;
        const height = this.config.height;
        const aspectRatio = width / height;

        this.camera.aspect = aspectRatio;
        this.camera.updateProjectionMatrix();
      }
      this.renderer.setSize(this.config.width, this.config.height);
    };

    window.addEventListener("resize", handleResize);
  }

  /**
   * Cleanup resources
   */
  async destroy(): Promise<void> {
    this.stop();

    // Destroy systems
    for (const system of this.systemsArray) {
      try {
        await system.onDestroy();
      } catch (error) {
        console.error(`Failed to destroy system ${system.name}:`, error);
      }
    }

    // Cleanup Three.js
    this.scene.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((m: THREE.Material) => m.dispose());
        } else {
          object.material.dispose();
        }
      }
    });

    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.eventBus.clear();
    this.entities.clear();
  }
}

