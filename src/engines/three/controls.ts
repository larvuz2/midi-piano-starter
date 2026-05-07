import * as THREE from 'three';
import type { VisualState } from '../../state/visualState';
import { lerp } from '../../utils/math';

export function updateCameraFromState(camera: THREE.PerspectiveCamera, state: VisualState): void {
  const distance = state.scene.cameraDistance + state.controls.pitchBend;
  camera.position.z = lerp(camera.position.z, distance, 0.08);
  camera.position.x = Math.sin(state.scene.colorShift * Math.PI * 2) * 0.6;
  camera.lookAt(0, 0, 0);
}
