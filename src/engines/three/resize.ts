import * as THREE from 'three';

export function resizeRenderer(container: HTMLElement, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void {
  const width = container.clientWidth;
  const height = Math.max(1, container.clientHeight);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
