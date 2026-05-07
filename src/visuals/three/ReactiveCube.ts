import * as THREE from 'three';
import type { ThreeVisualModule } from '../../engines/three/ThreeEngine';
import type { VisualState } from '../../state/visualState';

export class ReactiveCube implements ThreeVisualModule {
  private mesh: THREE.Mesh | null = null;
  private material: THREE.MeshStandardMaterial | null = null;
  private geometry: THREE.BoxGeometry | null = null;

  init(scene: THREE.Scene): void {
    this.geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8, 12, 12, 12);
    this.material = new THREE.MeshStandardMaterial({ color: 0x66ccff, metalness: 0.25, roughness: 0.28 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    scene.add(this.mesh);
  }

  update(delta: number, state: VisualState): void {
    if (!this.mesh || !this.material) return;
    const speed = 0.5 + state.controls.knob1 * 4;
    this.mesh.rotation.x += delta * speed * 0.7;
    this.mesh.rotation.y += delta * speed;
    const pulse = 1 + state.scene.energy * 0.45 + state.triggers.burst * 0.7;
    this.mesh.scale.setScalar(pulse);
    this.material.color.setHSL((state.scene.colorShift + state.controls.modWheel) % 1, 0.78, 0.55);
    this.material.emissive.setHSL(state.scene.colorShift, 0.8, state.scene.energy * 0.25);
  }

  dispose(): void {
    this.mesh?.removeFromParent();
    this.geometry?.dispose();
    this.material?.dispose();
  }
}
