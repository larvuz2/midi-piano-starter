import * as THREE from 'three';

export function createCamera(container: HTMLElement): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / Math.max(1, container.clientHeight), 0.1, 100);
  camera.position.set(0, 1.4, 5);
  return camera;
}
