import * as THREE from "three";
import { GameSystem } from "../types.js";
import { GameManager } from "../GameManager.js";
import { GameEntity } from "../Entity.js";

/**
 * Render system for Three.js mesh management and rendering
 */
export class RenderSystem implements GameSystem {
  name = "RenderSystem";
  priority = 10;

  private gameManager: GameManager;
  private meshMap: Map<string, THREE.Object3D> = new Map();

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  async onInit(): Promise<void> {
    // Initialize render system
  }

  async onUpdate(deltaTime: number): Promise<void> {
    const entities = this.gameManager.getEntities();

    for (const entity of entities) {
      if (!entity.active) continue;

      const transform = entity.getComponent<any>("Transform");
      if (!transform) continue;

      let mesh = this.meshMap.get(entity.id as string);

      // Create mesh if it doesn't exist
      if (!mesh) {
        const newMesh = this.createMeshForEntity(entity);
        if (newMesh) {
          mesh = newMesh;
          this.meshMap.set(entity.id as string, mesh);
          this.gameManager.getScene().add(mesh);
        }
      }

      // Update mesh position, rotation, and scale
      if (mesh && transform.isDirty !== false) {
        mesh.position.copy(transform.position);
        mesh.rotation.copy(transform.rotation);
        mesh.scale.copy(transform.scale);
      }
    }

    // Remove meshes for deleted entities
    const entityIds = new Set(entities.map((e) => e.id as string));
    for (const [entityId, mesh] of this.meshMap) {
      if (!entityIds.has(entityId)) {
        this.gameManager.getScene().remove(mesh);
        if (mesh instanceof THREE.Mesh) {
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m: THREE.Material) => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
        this.meshMap.delete(entityId);
      }
    }
  }

  async onDestroy(): Promise<void> {
    // Cleanup meshes
    for (const mesh of this.meshMap.values()) {
      this.gameManager.getScene().remove(mesh);
      if (mesh instanceof THREE.Mesh) {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m: THREE.Material) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    }
    this.meshMap.clear();
  }

  /**
   * Get mesh for entity
   */
  getMesh(entity: GameEntity): THREE.Object3D | undefined {
    return this.meshMap.get(entity.id as string);
  }

  /**
   * Create and add mesh to entity
   */
  setEntityMesh(entity: GameEntity, mesh: THREE.Object3D): void {
    const existing = this.meshMap.get(entity.id as string);
    if (existing) {
      this.gameManager.getScene().remove(existing);
    }

    this.meshMap.set(entity.id as string, mesh);
    this.gameManager.getScene().add(mesh);
  }

  private createMeshForEntity(entity: GameEntity): THREE.Object3D | null {
    // Check for explicit mesh component
    const meshComponent = entity.getComponent<any>("Mesh");
    if (meshComponent?.object3d) {
      return meshComponent.object3d;
    }

    // Create default geometry based on collider
    const collider = entity.getComponent<any>("Collider");
    if (!collider) return null;

    let geometry: THREE.BufferGeometry | null = null;

    if (collider.type === "box") {
      geometry = new THREE.BoxGeometry(
        collider.size.x,
        collider.size.y,
        collider.size.z,
      );
    } else if (collider.type === "sphere") {
      geometry = new THREE.SphereGeometry(collider.size.x * 0.5, 32, 32);
    }

    if (!geometry) return null;

    const material = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.3,
      roughness: 0.4,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }
}

