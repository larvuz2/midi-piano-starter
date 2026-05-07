import * as THREE from 'three';
import type { ThreeVisualModule } from '../../engines/three/ThreeEngine';
import type { VisualState } from '../../state/visualState';

export class ParticleField implements ThreeVisualModule {
  private points: THREE.Points | null = null;
  private geometry: THREE.BufferGeometry | null = null;
  private material: THREE.PointsMaterial | null = null;
  private velocities: Float32Array = new Float32Array();

  init(scene: THREE.Scene): void {
    const count = 700;
    const positions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 7;
      positions[i + 1] = (Math.random() - 0.5) * 4;
      positions[i + 2] = (Math.random() - 0.5) * 7;
      this.velocities[i] = (Math.random() - 0.5) * 0.04;
      this.velocities[i + 1] = (Math.random() - 0.5) * 0.04;
      this.velocities[i + 2] = (Math.random() - 0.5) * 0.04;
    }
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.7, depthWrite: false });
    this.points = new THREE.Points(this.geometry, this.material);
    scene.add(this.points);
  }

  update(delta: number, state: VisualState): void {
    if (!this.geometry || !this.material || !this.points) return;
    const positions = this.geometry.getAttribute('position') as THREE.BufferAttribute;
    const spread = 2 + state.particles.spread * 8 + state.triggers.burst * 4;
    for (let i = 0; i < positions.count * 3; i += 3) {
      positions.array[i] += this.velocities[i] * delta * 60 * (0.5 + state.particles.speed * 2);
      positions.array[i + 1] += this.velocities[i + 1] * delta * 60;
      positions.array[i + 2] += this.velocities[i + 2] * delta * 60;
      if (Math.abs(positions.array[i]) > spread) positions.array[i] *= -0.6;
      if (Math.abs(positions.array[i + 1]) > spread) positions.array[i + 1] *= -0.6;
      if (Math.abs(positions.array[i + 2]) > spread) positions.array[i + 2] *= -0.6;
    }
    positions.needsUpdate = true;
    this.points.rotation.y += delta * (0.08 + state.controls.knob2);
    this.material.size = 0.025 + state.particles.size * 0.16 + state.triggers.velocity * 0.05;
    this.material.color.setHSL(state.scene.colorShift, 0.85, 0.62);
    this.material.opacity = 0.35 + state.scene.energy * 0.55;
  }

  dispose(): void {
    this.points?.removeFromParent();
    this.geometry?.dispose();
    this.material?.dispose();
  }
}
