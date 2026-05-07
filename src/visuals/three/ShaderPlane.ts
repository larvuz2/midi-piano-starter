import * as THREE from 'three';
import type { ThreeVisualModule } from '../../engines/three/ThreeEngine';
import type { VisualState } from '../../state/visualState';

export class ShaderPlane implements ThreeVisualModule {
  private mesh: THREE.Mesh | null = null;
  private texture: THREE.CanvasTexture | null = null;
  private material: THREE.MeshBasicMaterial | null = null;
  private geometry: THREE.PlaneGeometry | null = null;

  constructor(private readonly sourceCanvas?: HTMLCanvasElement | null) {}

  init(scene: THREE.Scene): void {
    this.geometry = new THREE.PlaneGeometry(5.5, 3.2, 32, 32);
    this.texture = this.sourceCanvas ? new THREE.CanvasTexture(this.sourceCanvas) : null;
    this.material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: this.texture ?? undefined, transparent: true });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.z = -1.2;
    scene.add(this.mesh);
  }

  update(delta: number, state: VisualState): void {
    if (!this.mesh || !this.material) return;
    if (this.texture) this.texture.needsUpdate = true;
    this.mesh.rotation.z += delta * state.shader.distortion * 0.12;
    this.mesh.scale.setScalar(1 + state.scene.energy * 0.08);
    this.material.opacity = 0.72 + state.controls.knob3 * 0.28;
  }

  dispose(): void {
    this.mesh?.removeFromParent();
    this.texture?.dispose();
    this.material?.dispose();
    this.geometry?.dispose();
  }
}
